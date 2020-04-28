import {promises as fs} from 'fs';

/**
 * @param file {string}
 * @returns {Promise<string>}
 */
export default (file) => fs.access(file)
  .then(() => fs.readFile(file, {
    encoding: 'utf8',
  }))
;
