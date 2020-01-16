import Plugin from '../Plugin.js';
import {promises as fs} from 'fs';
import loadJSON from '../lib/loadJSON.js';
import path from 'path';
import promiseFactory from '../lib/promiseFactory.js';
import vm from 'vm';

export class Manager {
  #context;
  #engine;
  #plugins = {};

  constructor(engine) {
    this.#engine = engine;
    this.#context = vm.createContext({
      console: ['log', 'warn', 'error'].reduce((obj, key) => ({
        ...obj,
        [key]: (...args) => console[key](...args),
      }), {}),
      promiseFactory,
      engine,
    });
  }

  // TODO: this is big, break it down into re-usable chunks
  get(pluginName) {
    const debug = global.debug || false;

    if (! (pluginName in this.#plugins)) {
      debug && console.log(`loading ${pluginName}`);

      this.#plugins[pluginName] = promiseFactory(async (resolve, reject) => {
        try {
          const pluginPath = path.join(
              this.#engine.path('enabledPlugins'),
              pluginName
            ),
            pluginJSONPath = path.join(pluginPath, 'plugin.json')
          ;

          await fs.access(pluginJSONPath);

          debug && console.log(`loading ${pluginName}'s dependencies`);

          const pluginData = await loadJSON(pluginJSONPath),
            plugin = new Plugin({
              ...pluginData,
              path: pluginPath,
            }),
            cyclicDependencies = (plugin.dependencies || []).filter((dependency) => (dependency.dependencies || []).includes(pluginName))
          ;

          if (cyclicDependencies.length > 0) {
            return reject(
              new TypeError(
                `Cyclic dependencies exist: ${
                  cyclicDependencies.map((dependency) => `${pluginName} => ${dependency.name} => ${pluginName}`)
                    .join(', ')
                }.`
              )
            );
          }

          const dependencies = await Promise.all(plugin.dependencies.map((dependency) => this.get(dependency)));

          debug && console.log(`loading ${pluginName}'s components`);

          await Promise.all(
            plugin.components.map((component) => promiseFactory(async (resolve, reject) => {
              try {
                await component.run(this.#context, (specifier) => {
                  debug && console.log(`resolving ${specifier}`);

                  return promiseFactory(async (resolve, reject) => {
                    try {
                      const fullPath = path.dirname(path.join(component.path, component.file)),
                        calculatedPath = path.resolve(fullPath, specifier),
                        relativePath = path.relative(this.#engine.path('enabledPlugins'), calculatedPath),
                        [dependencyName, ...componentPaths] = relativePath.split(/\//),
                        componentName = path.join(...componentPaths),
                        [dependency] = [...dependencies, plugin].filter((dependency) => dependency.name === dependencyName)
                      ;

                      if (! dependency) {
                        return reject(new TypeError(`${pluginName}: Unable to find plugin '${dependencyName}'.`));
                      }

                      const [module] = dependency.components.filter((component) => component.file === componentName);

                      if (! module) {
                        return reject(new TypeError(`${pluginName}: Unable to find component '${componentName}' in '${dependencyName}'.`));
                      }

                      if (! module.result) {
                        return reject(new TypeError(`${pluginName}: Result of '${componentName}' in '${dependencyName}' is '${typeof module.result}'. Aborting.`));
                      }

                      const result = await module.result;

                      if (! (result instanceof vm.Module)) {
                        return reject(new TypeError(`${pluginName}: '${componentName}' in '${dependencyName}' is '${typeof module}'. Aborting.`));
                      }

                      debug && console.log(`resolved ${specifier}`);

                      resolve(result);
                    }
                    catch (e) {
                      debug && console.log(`rejected ${specifier}`);

                      reject(e);
                    }
                  });
                });
                debug && console.log(`resolved ${plugin.name}/${component.file}`);

                resolve(component.result);
              }
              catch (e) {
                debug && console.log(`rejected ${plugin.name}/${component.file}`);

                reject(e);
              }
            }))
          );

          debug && console.log(`loading ${pluginName} complete`);

          resolve(plugin);
        }
        catch (e) {
          debug && console.log(`rejected ${pluginName}`);
          reject(e);
        }
      });
    }

    return this.#plugins[pluginName];
  }

  load() {
    const debug = global.debug || false;

    return promiseFactory(async (resolve, reject) => {
      try {
        const enabledPlugins = await fs.readdir(this.#engine.path('enabledPlugins')),
          pluginPromises = Promise.all(enabledPlugins.map((pluginName) => this.get(pluginName))),
          timeoutId = debug && setTimeout(() => {
            console.log(enabledPlugins.map((pluginName) => [pluginName, this.get(pluginName)]));
          }, 500),
          loadedPlugins = await pluginPromises
        ;

        // This will show which plugins aren't loading.
        debug && clearTimeout(timeoutId);

        debug && console.log(loadedPlugins.map((plugin) => [plugin.name, plugin]));

        resolve(loadedPlugins);
      }
      catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }
}

export default Manager;