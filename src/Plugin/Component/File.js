import {Component} from '../Components.js';
import loadFile from '../../lib/loadFile.js';

export class File extends Component {
  process(path) {
    return loadFile(path);
  }
}