import executeScript from './executeScript.js';
import loadFile from './loadFile.js';
import promiseFactory from './promiseFactory.js';

export const executeFile = (script, context, resolver) => {
  return promiseFactory(async (resolve, reject) => {
    try {
      const code = await loadFile(script),
        module = await executeScript(code, context, resolver, script)
      ;

      resolve(module);
    }
    catch (e) {
      reject(e);
    }
  });
};

export default executeFile;