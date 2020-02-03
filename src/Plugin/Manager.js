import Plugin from '../Plugin.js';
import {promises as fs} from 'fs';
import loadJSON from '../lib/loadJSON.js';
import path from 'path';
import promiseFactory from '../lib/promiseFactory.js';
import vm from 'vm';

export class Manager {
  #context;
  #engine;
  #engineModule;
  #pluginManifests = {};
  #plugins = {};
  #promiseFactoryModule;

  constructor(engine) {
    this.#engine = engine;

    const context = {
      console: ['log', 'warn', 'error'].reduce((obj, key) => ({
        ...obj,
        [key]: (...args) => console[key](...args),
      }), {}),
    };

    Object.defineProperty(context, 'engine', {
      writable: false,
      enumerable: true,
      configurable: false,
      value: [
        'emit',
        'on',
        'option',
        'setOption',
      ]
        .reduce((object, key) => {
          Object.defineProperty(object, key, {
            writable: false,
            enumerable: true,
            configurable: false,
            value: (...args) => engine[key](...args),
          });

          return object;
        }, {})
      ,
    });

    Object.defineProperty(context, 'promiseFactory', {
      writable: false,
      enumerable: true,
      configurable: false,
      value: promiseFactory,
    });

    this.#context = vm.createContext(context);
    this.#engineModule = new vm.SourceTextModule('export default engine;', {
      context: this.#context,
    });
    this.#promiseFactoryModule = new vm.SourceTextModule('export default promiseFactory;', {
      context: this.#context,
    });
  }

  // TODO: this is big, break it down into re-usable chunks
  get(pluginName) {
    if (! (pluginName in this.#plugins)) {
      this.#engine.option('debug') && console.log(`loading ${pluginName}`);

      this.#plugins[pluginName] = promiseFactory(async (resolve, reject) => {
        try {
          const pluginPath = path.join(
            this.#engine.path('plugins'),
            pluginName
          )
          ;

          this.#engine.option('debug') && console.log(`loading ${pluginName}'s dependencies`);

          const pluginData = await this.loadManifest(pluginName),
            plugin = new Plugin({
              ...pluginData,
              path: pluginPath,
            }),
            cyclicDependencies = (await Promise.all(
              (plugin.dependencies || [])
                .map(async (pluginName) => await this.loadManifest(pluginName))
            ))
              .filter((dependency) => (dependency.dependencies || []).includes(pluginName))
          ;

          if (cyclicDependencies.length > 0) {
            return reject(
              new ReferenceError(
                `Cyclic dependencies exist: ${
                  cyclicDependencies.map((dependency) => `${pluginName} => ${dependency.name} => ${pluginName}`)
                    .join(', ')
                }.`
              )
            );
          }

          const dependencies = await Promise.all(plugin.dependencies.map((dependency) => this.get(dependency)));

          this.#engine.option('debug') && console.log(`loading ${pluginName}'s components`);

          await Promise.all(
            plugin.components.map((component) => promiseFactory(async (resolve, reject) => {
              try {
                await component.run(this.#context, (specifier) => {
                  this.#engine.option('debug') && console.log(`resolving ${specifier}`);

                  return promiseFactory(async (resolve, reject) => {
                    if (specifier === 'engine') {
                      return resolve(this.#engineModule);
                    }

                    if (specifier === 'promiseFactory') {
                      return resolve(this.#promiseFactoryModule);
                    }

                    try {
                      const fullPath = path.dirname(path.join(component.path, component.file)),
                        filePath = path.relative(this.#engine.path('plugins'), path.join(component.path, component.file)),
                        calculatedPath = path.resolve(fullPath, specifier),
                        relativePath = path.relative(this.#engine.path('plugins'), calculatedPath),
                        [dependencyName, ...componentPaths] = relativePath.split(/\//),
                        componentName = path.join(...componentPaths),
                        [dependency] = [...dependencies, plugin].filter((dependency) => dependency.name === dependencyName)
                      ;

                      if (! dependency) {
                        return reject(new TypeError(`${filePath}: Unable to find plugin '${dependencyName}'.`));
                      }

                      const [module] = dependency.components.filter((component) => component.file === componentName);

                      if (! module) {
                        return reject(new TypeError(`${filePath}: Unable to find component '${componentName}' in '${dependencyName}'.`));
                      }

                      if (! module.result) {
                        return reject(new TypeError(`${filePath}: Result of '${componentName}' in '${dependencyName}' is '${typeof module.result}'. Aborting.`));
                      }

                      const result = await module.result;

                      if (! (result instanceof vm.Module)) {
                        return reject(new TypeError(`${filePath}: '${componentName}' in '${dependencyName}' is '${typeof module}'. Aborting.`));
                      }

                      this.#engine.option('debug') && console.log(`resolved ${specifier}`);

                      resolve(result);
                    }
                    catch (e) {
                      this.#engine.option('debug') && console.log(`rejected ${specifier}`);

                      reject(e);
                    }
                  });
                });
                this.#engine.option('debug') && console.log(`resolved ${plugin.name}/${component.file}`);

                resolve(component.result);
              }
              catch (e) {
                this.#engine.option('debug') && console.log(`rejected ${plugin.name}/${component.file}`);

                reject(e);
              }
            }))
          );

          this.#engine.option('debug') && console.log(`loading ${pluginName} complete`);

          resolve(plugin);
        }
        catch (e) {
          this.#engine.option('debug') && console.log(`rejected ${pluginName}`);
          reject(e);
        }
      });
    }

    return this.#plugins[pluginName];
  }

  load() {
    return promiseFactory(async (resolve, reject) => {
      try {
        const plugins = await fs.readdir(this.#engine.path('plugins')),
          pluginPromises = Promise.all(plugins.map((pluginName) => this.get(pluginName))),
          timeoutId = this.#engine.option('debug') && setTimeout(() => {
            console.log(plugins.map((pluginName) => [pluginName, this.get(pluginName)]));
          }, 500),
          loadedPlugins = await pluginPromises
        ;

        // This will show which plugins aren't loading.
        this.#engine.option('debug') && clearTimeout(timeoutId);

        this.#engine.option('debug') && console.log(loadedPlugins.map((plugin) => [plugin.name, plugin]));

        resolve(loadedPlugins);
      }
      catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  async loadManifest(pluginName) {
    const pluginJSONPath = path.join(this.#engine.path('plugins'), pluginName, this.#engine.option('manifestName'));

    await fs.access(pluginJSONPath);

    if (! (pluginName in this.#pluginManifests)) {
      this.#pluginManifests[pluginName] = await loadJSON(pluginJSONPath);
    }

    return this.#pluginManifests[pluginName];
  }
}

export default Manager;
