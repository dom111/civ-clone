import loadFile from './loadFile.js';
import promiseFactory from './promiseFactory.js';

export default (file) => {
  return promiseFactory(async (resolve, reject) => {
    try {
      const content = await loadFile(file),
        data = JSON.parse(content)
      ;

      resolve(data);
    }
    catch (e) {
      reject(e);
    }
  });
};