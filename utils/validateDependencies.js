import loadJSON from '../src/lib/loadJSON.js';
import saveJSON from '../src/lib/saveJSON.js';

const [, , manifestPath, ...dependencies] = process.argv;

loadJSON(manifestPath)
  .then((contents) => {
    let changed = false;

    contents.dependencies = contents.dependencies || [];

    if (! dependencies.every((dependency) => contents.dependencies
      .includes(dependency)
    )) {
      dependencies
        .filter((dependency) => ! contents.dependencies
          .includes(dependency)
        )
        .forEach((dependency) => {
          console.log(`\x1b[31m${manifestPath} is missing dependency '${dependency}'.\x1b[0m`);
          contents.dependencies
            .push(dependency)
          ;
          changed = true;
        })
      ;
    }

    if (! contents.dependencies
      .every((dependency) => dependencies.includes(dependency))
    ) {
      contents.dependencies
        .filter((dependency) => !dependencies.includes(dependency))
        .forEach((dependency) => {
          console.log(`\x1b[33m${manifestPath} has unused dependency '${dependency}'.\x1b[0m`);
          contents.dependencies
            .splice(
              contents.dependencies
                .indexOf(dependency),
              1
            )
          ;

          changed = true;
        })
      ;
    }

    if (changed) {
      saveJSON(manifestPath, contents, 2);
    }
  })
;
