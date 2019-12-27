import {Component} from '../Components.js';
import executeScript from '../../lib/executeScript.js';
import loadFile from '../../lib/loadFile.js';
import promiseFactory from '../../lib/promiseFactory.js';

export class Data extends Component {
  process(path, context, resolver) {
    return promiseFactory(async (resolve, reject) => {
      try {
        const script = await loadFile(path),
          result = executeScript(`export const data = ${script}; export default data;`, context, resolver)
        ;

        resolve(result);
      }
      catch (e) {
        reject(e);
      }
    });
  }
}