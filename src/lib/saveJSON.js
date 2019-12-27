import {promises as fs} from 'fs';
import promiseFactory from './promiseFactory.js';

export default (file, data) => promiseFactory(async (resolve, reject) => {
  try {
    await fs.writeFile(file, JSON.stringify(data), {
      encoding: 'utf8'
    });

    resolve();
  }
  catch (e) {
    reject(e);
  }
});