
const fs = require('fs');
fs.readFile('sample.txt', 'utf8', (err, data) => {
    console.log(data);
} );