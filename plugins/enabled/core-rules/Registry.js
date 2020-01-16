import BaseRegistry from '../core-registry/Registry.js';

export class Registry extends BaseRegistry {
  #cache = {};
  #invalidateCache = (rule = null) => {
    if (this.accepts(rule)) {
      Object.keys(this.#cache)
        .forEach((key) => {
          if (rule.name.startsWith(key)) {
            delete this.#cache[key];
          }
        })
      ;

      return;
    }

    this.#cache = {};
  };

  get(ruleName) {
    if (! this.#cache[ruleName]) {
      this.#cache[ruleName] = this.filter((rule) => rule.name.startsWith(`${ruleName}:`));
    }

    return this.#cache[ruleName];
  }

  register(entity) {
    super.register(entity);

    this.#invalidateCache(entity);
  }

  unregister(entity) {
    super.unregister(entity);

    this.#invalidateCache(entity);
  }
}

export default Registry;