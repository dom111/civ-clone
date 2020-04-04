import Registry from '../core-registry/Registry.js';
import Rule from '../core-rules/Rule.js';

export class RulesRegistry extends Registry {
  #cache = {};
  #invalidateCache = (rule = null) => {
    if (this.accepts(rule)) {
      Object.keys(this.#cache)
        .forEach((key) => {
          if (rule.name().startsWith(key)) {
            delete this.#cache[key];
          }
        })
      ;

      return;
    }

    this.#cache = {};
  };

  constructor() {
    super(Rule);
  }

  entries() {
    return super.entries()
      .sort((a, b) => a.priority() - b.priority())
    ;
  }

  filter(iterator) {
    return super.filter(iterator)
      .sort((a, b) => a.priority() - b.priority())
    ;
  }

  get(ruleName) {
    if (! this.#cache[ruleName]) {
      this.#cache[ruleName] = this.filter((rule) => rule.name().startsWith(`${ruleName}:`) ||
        rule.name() === ruleName
      );
    }

    return this.#cache[ruleName];
  }

  process(ruleName, ...args) {
    return this.get(ruleName)
      .filter((rule) => rule.validate(...args))
      .map((rule) => rule.process(...args))
    ;
  }

  register(...rules) {
    super.register(...rules);

    rules.forEach((rule) => this.#invalidateCache(rule));
  }

  unregister(...rules) {
    super.unregister(...rules);

    rules.forEach((rule) => this.#invalidateCache(rule));
  }
}

export default RulesRegistry;