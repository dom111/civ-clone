import vm from 'vm';

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
