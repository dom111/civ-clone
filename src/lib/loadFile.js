import {promises as fs} from 'fs';
import promiseFactory from './promiseFactory.js';

export default (file) => {
  return promiseFactory(async (resolve, reject) => {
    try {
      await fs.access(file);
      const content = await fs.readFile(file, {
        encoding: 'utf8'
      });

      resolve(content);
    }
    catch (e) {
      reject(e);
    }
  });
};