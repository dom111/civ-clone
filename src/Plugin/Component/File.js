import {Component} from '../Components.js';
import loadFile from '../../lib/loadFile.js';

export class File extends Component {
  /**
   * @param path {string}
   * @returns {Promise<string>}
   */
  process(path) {
    return loadFile(path);
  }
}