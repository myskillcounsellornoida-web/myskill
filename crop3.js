const sharp = require('sharp');
sharp('public/images/shah_times_article.jpg')
  .extract({ left: 190, top: 1190, width: 630, height: 350 })
  .toFile('public/images/shah_times_article_cropped.jpg')
  .then(() => console.log('Cropped precisely to the article bounds!'))
  .catch(err => console.error(err));
