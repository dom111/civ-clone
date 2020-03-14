import {promises as fs} from 'fs';

export default (file) => fs.access(file)
  .then(() => fs.readFile(file, {
    encoding: 'utf8',
  }))
;
