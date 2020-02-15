import loadJSON from '../src/lib/loadJSON.js';
import saveJSON from '../src/lib/saveJSON.js';

const [, , manifestPath, ...components] = process.argv;

loadJSON(manifestPath)
  .then((contents) => {
    let changed = false;

    contents.components = contents.components || [];

    if (! components
      .every((component) =>
        contents.components.some((contentComponent) => contentComponent.file === component)
      )
    ) {
      components
        .filter((component) => ! contents.components
          .some((contentComponent) => contentComponent.file === component)
        )
        .forEach((component) => {
          console.log(`\x1b[31m${manifestPath} is missing component '${component}'.\x1b[0m`);
          contents.components
            .push({
              type: 'script',
              file: component,
            })
          ;
          changed = true;
        })
      ;
    }

    if (! contents.components
      .every((component) => components.includes(component.file))
    ) {
      contents.components
        .filter((component) => !components.includes(component.file))
        .forEach((component, index) => {
          console.log(`\x1b[33m${manifestPath} has unused component '${component.file}'.\x1b[0m`);
          contents.components
            .splice(index, 1)
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
