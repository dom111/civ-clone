import {promises as fs} from 'fs';

/**
 * @param file {string}
 * @param data {string}
 * @param spaces {null|number}
 * @param replacer {null|function}
 * @returns {Promise<void>}
 */
export default (file, data, spaces = null, replacer = null) => fs.writeFile(file, JSON.stringify(data, replacer, spaces), {
  encoding: 'utf8',
});
