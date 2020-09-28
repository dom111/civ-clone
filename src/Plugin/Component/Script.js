import {Component} from '../Components.js';
import executeFile from '../../lib/executeFile.js';

export class Script extends Component {
  /**
   * @param path {string}
   * @param context {{}}
   * @param resolver {function}
   * @returns {Promise<vm.Module>}
   */
  process(path, context, resolver) {
    return executeFile(path, context, resolver);
  }
}