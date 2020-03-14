import {promises as fs} from 'fs';

export default (file, data, spaces = null, replacer = null) => fs.writeFile(file, JSON.stringify(data, replacer, spaces), {
  encoding: 'utf8',
});
