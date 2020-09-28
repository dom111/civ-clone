import {default as ts} from 'typescript';
import executeScript from './executeScript.js';
import loadFile from './loadFile.js';

/**
 * @param script {string}
 * @param context {{}}
 * @param resolver {function}
 * @returns {Promise<vm.Module>}
 */
export const executeFile = (script, context, resolver) => loadFile(script)
  .then((code) => {
    if (script.endsWith('.ts')) {
      const module = ts.transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.ES2020,
          target: 'ES2020',
        },
      });

      code = module.outputText;
    }

    return executeScript(code, context, resolver, script);
  })
;

export default executeFile;
