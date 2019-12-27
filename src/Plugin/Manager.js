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
        [key]: (...args) => console[key](...args)
      }), {}),
      engine
    });
  }

  // TODO: this is big, break it down into re-usable chunks
  get(pluginName) {
    if (! (pluginName in this.#plugins)) {
      this.#plugins[pluginName] = promiseFactory(async (resolve, reject) => {
        try {
          const pluginPath = path.join(
              this.#engine.path('enabledPlugins'),
              pluginName
            ),
            pluginJSONPath = path.join(pluginPath, 'plugin.json')
          ;

          await fs.access(pluginJSONPath);

          const pluginData = await loadJSON(pluginJSONPath),
            plugin = new Plugin({
              ...pluginData,
              path: pluginPath
            }),
            dependencies = await Promise.all(plugin.dependencies.map((dependency) => this.get(dependency)))
          ;

          await Promise.all(
            plugin.components.map((component) => promiseFactory(async (resolve, reject) => {
              try {
                await component.run(this.#context, (specifier) => {
                  return promiseFactory(async (resolve, reject) => {
                    const [dependencyName, componentName] = specifier.replace(/^\.\//, `${plugin.name}/`).split(/\//),
                      [dependency] = [...dependencies, plugin].filter((dependency) => dependency.name === dependencyName)
                    ;

                    if (! dependency) {
                      throw new TypeError(`${pluginName}: Unable to find plugin '${dependencyName}'.`);
                    }

                    const [component] = dependency.components.filter((component) => component.file === componentName)                    ;

                    if (! component) {
                      throw new TypeError(`${pluginName}: Unable to find component '${componentName}' in '${dependencyName}'.`);
                    }

                    if (! component.result) {
                      throw new TypeError(`${pluginName}: Result of '${componentName}' in '${dependencyName}' is '${typeof component.result}'. Aborting.`);
                    }

                    try {
                      const result = await component.result;

                      if (! (result instanceof vm.Module)) {
                        return reject(new TypeError(`${pluginName}: '${componentName}' in '${dependencyName}' is '${typeof component}'. Aborting.`));
                      }

                      resolve(result);
                    }
                    catch (e) {
                      reject(e);
                    }
                  });
                });

                resolve(component.result);
              }
              catch (e) {
                reject(e);
              }
            }))
          );

          resolve(plugin);
        }
        catch (e) {
          reject(e);
        }
      });
    }

    return this.#plugins[pluginName];
  }

  load() {
    return promiseFactory(async (resolve, reject) => {
      try {
        const enabledPlugins = await fs.readdir(this.#engine.path('enabledPlugins')),
          loadedPlugins = await Promise.all(enabledPlugins.map((pluginName) => this.get(pluginName)))
        ;

        resolve(loadedPlugins);
      }
      catch (e) {
        reject(e);
      }
    });
  }
}

export default Manager;