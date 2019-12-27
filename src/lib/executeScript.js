import promiseFactory from './promiseFactory.js';
import vm from 'vm';

export const executeScript = (code, context, resolver, script) => {
  return promiseFactory(async (resolve, reject) => {
    try {
      const module = new vm.SourceTextModule(code, {
        identifier: script,
        context
      });

      await module.link(resolver);
      await module.evaluate();

      resolve(module);
    }
    catch (e) {
      reject(e);
    }
  });
};

export default executeScript;