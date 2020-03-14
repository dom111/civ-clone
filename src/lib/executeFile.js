import executeScript from './executeScript.js';
import loadFile from './loadFile.js';

export const executeFile = (script, context, resolver) => loadFile(script)
  .then((code) => executeScript(code, context, resolver, script))
;

export default executeFile;
