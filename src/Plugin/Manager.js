import Plugin from '../Plugin.js';
import {promises as fs} from 'fs';
import loadJSON from '../lib/loadJSON.js';
import path from 'path';
import vm from 'vm';

export class Manager {
  #context;
  #engine;
  #linker = (plugin, component) => (specifier) => {
    const fullPath = path.dirname(path.join(component.path, component.file)),
      filePath = path.relative(this.#engine.path('plugins'), path.join(component.path, component.file)),
      calculatedPath = path.resolve(fullPath, specifier),
      relativePath = path.relative(this.#engine.path('plugins'), calculatedPath),
      [dependencyName, ...componentPaths] = relativePath.split(/\//),
      componentName = path.join(...componentPaths),
      [dependency] = [...plugin.dependencies, plugin].filter((dependency) => dependency.name === dependencyName)
    ;

    if (! dependency) {
      throw new TypeError(`${filePath}: Unable to find plugin '${dependencyName}'.`);
    }

    const [module] = dependency.components.filter((component) => component.file === componentName);

    if (! module) {
      throw new TypeError(`${filePath}: Unable to find component '${componentName}' in '${dependencyName}'.`);
    }

    if (! module.result) {
      throw new TypeError(`${filePath}: Result of '${componentName}' in '${dependencyName}' is '${typeof module.result}'. Aborting.`);
    }

    return module.result
      .then((result) => {
        if (! (result instanceof vm.Module)) {
          throw new TypeError(`${filePath}: '${componentName}' in '${dependencyName}' is '${typeof module}'. Aborting.`);
        }

        return result;
      })
    ;
  };
  #pluginManifests = {};
  #plugins = {};

  constructor(engine) {
    this.#engine = engine;

    const context = {},
      consoleWrapper = {}
    ;

    ['log', 'warn', 'error']
      .forEach((key) => Object.defineProperty(consoleWrapper, key, {
        writable: false,
        enumerable: true,
        configurable: false,
        value: (...args) => console[key](...args),
      }))
    ;

    Object.defineProperty(context, 'console', {
      writable: false,
      enumerable: true,
      configurable: false,
      value: consoleWrapper,
    });

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

    this.#context = vm.createContext(context);
  }

  // TODO: this is big, break it down into re-usable chunks
  get(pluginName) {
    if (! (pluginName in this.#plugins)) {
      this.#plugins[pluginName] = this.loadManifest(pluginName)
        .then((pluginData) => new Plugin({
          ...pluginData,
          path: path.join(
            this.#engine.path('plugins'),
            pluginName
          ),
        }))
        // Check for cyclic dependencies and break out early
        .then((plugin) => Promise.all(
          (plugin.dependencies || [])
            .map((pluginName) => this.loadManifest(pluginName))
        )
          .then((dependencyManifests) => dependencyManifests
            .filter((dependency) => (dependency.dependencies || []).includes(plugin.name))
          )
          .then((cyclicDependencies) => {
            if (cyclicDependencies.length > 0) {
              throw new ReferenceError(
                `Cyclic dependencies exist: ${cyclicDependencies
                  .map((dependency) => `${plugin.name} => ${dependency.name} => ${plugin.name}`)
                  .join(', ')}.`
              );
            }
          })
          // returning the plugin object otherwise
          .then(() => plugin)
        )
        // Load all the dependencies
        .then((plugin) => Promise.all(plugin.dependencies.map((dependency) => this.get(dependency)))
          .then((dependencies) => {
            plugin.dependencies = dependencies;

            return plugin;
          })
        )
        .then((plugin) => Promise.all(plugin.components
          .map((component) => {
            const result = component.run(this.#context, this.#linker(plugin, component)),
              promiseProperties = {
                value: null,
                exception: null,
                isPending: true,
                isResolved: false,
                isRejected: false,
              }
            ;

            result.then(() => promiseProperties.isResolved = true)
              .catch(() => promiseProperties.isRejected = true)
              .finally(() => promiseProperties.isPending = false)
            ;

            setTimeout(() => {
              if (promiseProperties.isResolved || promiseProperties.isRejected) {
                return;
              }

              console.error(`Manager#get: Failed to load plugin component: '${plugin.name}/${component.file}'.`);
            }, 1000);

            return result;
          })
        )
          .then(() => plugin)
        )
      ;
    }

    return this.#plugins[pluginName];
  }

  load() {
    return fs.readdir(this.#engine.path('plugins'))
      .then((plugins) => Promise.all(plugins.map((pluginName) => this.get(pluginName))))
    ;
  }

  loadManifest(pluginName) {
    const pluginJSONPath = path.join(this.#engine.path('plugins'), pluginName, this.#engine.option('manifestName'));

    return fs.access(pluginJSONPath)
      .then(() => {
        if (! (pluginName in this.#pluginManifests)) {
          this.#pluginManifests[pluginName] = loadJSON(pluginJSONPath);
        }

        return this.#pluginManifests[pluginName];
      })
    ;
  }
}

export default Manager;
