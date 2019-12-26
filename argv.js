const path = require('path');

let args = process.argv.slice(2);

//
console.log(path.extname('test0.csv'));
console.log(path.dirname('/csv/test0.csv'));
console.log(args);

