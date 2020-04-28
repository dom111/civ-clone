import vm from 'vm';

/**
 * @param code {string}
 * @param context {{}}
 * @param resolver {function}
 * @param script {string}
 * @returns {Promise<vm.SourceTextModule>}
 */
export const executeScript = (code, context, resolver, script) => {
  const module = new vm.SourceTextModule(code, {
    identifier: script,
    context,
  });

  return module.link(resolver)
    .then(() => module.evaluate())
    .then(() => {
      if (module.status === 'errored') {
        throw module.error;
      }

      return module;
    })
  ;
};

export default executeScript;
