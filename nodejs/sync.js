const fs = require('fs');

// readFileSync
// console.log('a');
// const result = fs.readFileSync('nodejs/sample.txt', 'utf8');
// console.log(result);
// console.log('C');


// readFile
console.log('a');
fs.readFile('nodejs/sample.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('C');
// callback은 인자가 다 받아지면 그때 실행하라고 하는 것임