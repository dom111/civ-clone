import {promises as fs} from 'fs';
import promiseFactory from './promiseFactory.js';

export default (file, data, spaces = null, replacer = null) => promiseFactory(async (resolve, reject) => {
  try {
    await fs.writeFile(file, JSON.stringify(data, replacer, spaces), {
      encoding: 'utf8',
    });

    resolve();
  }
  catch (e) {
    reject(e);
  }
});