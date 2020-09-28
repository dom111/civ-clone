import PathFinder from './PathFinder.js';
import Registry from '../core-registry/Registry.js';

export class PathFinderRegistry extends Registry {
  constructor() {
    super(PathFinder);
  }
}

export default PathFinderRegistry;
