const fs = require('fs');
const path = require('path');

const source = path.join('src', 'index.html');
const destination = path.join('dist', 'index.html');

let html = fs.readFileSync(source, 'utf8');

html = html
  .replace(/css\/styles\.css/g, 'css/styles.min.css')
  .replace(/js\/script\.js/g, 'js/script.min.js');

fs.writeFileSync(destination, html);
