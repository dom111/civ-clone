import {Component} from '../Components.js';
import executeScript from '../../lib/executeScript.js';
import loadFile from '../../lib/loadFile.js';

export class Data extends Component {
  /**
   * @param path {string}
   * @param context {{}}
   * @param resolver {function}
   * @returns {Promise<vm.Module>}
   */
  process(path, context, resolver) {
    return loadFile(path)
      .then((script) => executeScript(`export const data = ${script}; export default data;`, context, resolver))
    ;
  }
}