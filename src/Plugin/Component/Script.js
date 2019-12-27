import {Component} from '../Components.js';
import executeFile from '../../lib/executeFile.js';

export class Script extends Component {
  process(path, context, resolver) {
    return executeFile(path, context, resolver);
  }
}