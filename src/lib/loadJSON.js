import loadFile from './loadFile.js';

export default (file) => loadFile(file)
  .then((content) => JSON.parse(content))
;
