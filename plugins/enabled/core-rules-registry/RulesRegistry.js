import Registry from '../core-registry/Registry.js';
import Rule from '../core-rules/Rule.js';

/**
 * @callback rulesRegistryIterator
 * @param {Rule} rule
 * @return {Rule[]}
 */

export class RulesRegistry extends Registry {
  /**
   * @type {Object}
   */
  #cache = {};
  /**
   * @param rule {Rule}
   */
  #invalidateCache = (rule = null) => {
    if (this.accepts(rule)) {
      rule.name()
        .split(/:/)
        .reduce((array, part) => [...array, `${array[array.length - 1] || ''}:${part}`], [])
        .forEach((key) => delete this.#cache[key])
      ;

      return;
    }

    this.#cache = {};
  };

  constructor() {
    super(Rule);
  }

  /**
   * @returns {Rule[]}
   */
  entries() {
    return super.entries()
      .sort((a, b) => a.priority() - b.priority())
    ;
  }

  /**
   * @param iterator {rulesRegistryIterator}
   * @returns {Rule[]}
   */
  filter(iterator) {
    return super.filter(iterator)
      .sort((a, b) => a.priority() - b.priority())
    ;
  }

  /**
   * @param ruleName {string}
   * @returns {Rule[]}
   */
  get(ruleName) {
    if (! this.#cache[ruleName]) {
      this.#cache[ruleName] = this.filter((rule) => rule.name()
        .startsWith(`${ruleName}:`) ||
        rule.name() === ruleName
      );
    }

    return this.#cache[ruleName];
  }

  /**
   * @param ruleName {string}
   * @param args
   */
  process(ruleName, ...args) {
    return this.get(ruleName)
      .filter((rule) => rule.validate(...args))
      .map((rule) => rule.process(...args))
    ;
  }

  /**
   * @param rules {...Rule}
   */
  register(...rules) {
    super.register(...rules);

    rules.forEach((rule) => this.#invalidateCache(rule));
  }

  /**
   * @param rules {...Rule}
   */
  unregister(...rules) {
    super.unregister(...rules);

    rules.forEach((rule) => this.#invalidateCache(rule));
  }
}

export default RulesRegistry;