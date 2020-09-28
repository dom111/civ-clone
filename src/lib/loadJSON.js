import loadFile from './loadFile.js';

/**
 * @param file {string}
 * @returns {Promise<{}>}
 */
export default (file) => loadFile(file)
  .then((content) => JSON.parse(content))
;
