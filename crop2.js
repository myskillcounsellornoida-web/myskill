const sharp = require('sharp');
sharp('public/images/shah_times_article.jpg')
  .extract({ left: 0, top: 1200, width: 1131, height: 350 })
  .toFile('public/images/shah_times_article_cropped.jpg')
  .then(() => console.log('Cropped perfectly!'))
  .catch(err => console.error(err));
