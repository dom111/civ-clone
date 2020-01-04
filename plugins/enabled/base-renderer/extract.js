const data = require('./extract-data.json');
const Canvas = require('canvas');
const Image = Canvas.Image;
const fs = require('fs');

// utility
const loadImages = (callback) => {
  Promise.all(
    ['SP257.png', 'TER257.png'].map(Canvas.loadImage)
  )
    .then((images) => {
      callback(images.map((image) => ({
        element: image,
        file: image.src.split(/\//).pop()
      })));
    })
  ;
};

const run = (images) => {
  let canvas = Canvas.createCanvas(),
    context = canvas.getContext('2d');

  images.forEach((image) => {
    Object.keys(data.files[image.file]).forEach((path) => {
      let definitions = data.files[image.file][path];

      definitions.forEach((definition) => {
        definition.contents.forEach((content) => {
          let object = {
              ...data.defaults,
              ...definition,
              ...content
            },
            filename = './assets/' + path + object.name + '.png',
            dirname = filename.replace(/\/[^\/]+$/, '/');

          canvas.width = object.width;
          canvas.height = object.height;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image.element, -object.x, -object.y);

          for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
              let imageData = context.getImageData(x, y, 1, 1).data;

              if (imageData[0] == object.clear.r && imageData[1] == object.clear.g && imageData[2] == object.clear.b) {
                context.clearRect(x, y, 1, 1);
              }
            }
          }

          // ensure assets directory exists
          try {
            fs.accessSync('./assets/', fs.F_OK);
          }
          catch (e) {
            fs.mkdirSync('./assets/');
          }

          try {
            fs.accessSync(dirname, fs.F_OK);
          }
          catch (e) {
            fs.mkdirSync(dirname);
          }

          let buffer = Buffer.from(canvas.toDataURL('image/png').split(/,/)[1], 'base64');

          fs.writeFileSync(filename, buffer);
        });
      });
    });
  });
};

loadImages(run);
