// TODO: Provide errors handling for converting process and incorrect command line arguments

const fs = require('fs');
const { Transform } = require('stream');

const cvsPath = __dirname + '/csv';
const jsonPath = __dirname + '/json';

const var1 = fs.createReadStream(cvsPath + '/test1.txt');

const var2 = new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        this.push(chunk.toString().split(','));
        callback();
    }
});

const var3 = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        const obj = {};
        for(let i=0; i < chunk.length; i+=2) {
            obj[chunk[i]] = chunk[i+1];
        }
        this.push(obj);
        callback();
    }
});

const var4 = new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        this.push(JSON.stringify(chunk) + '\n');
        callback();
    }
});

const var5 = fs.createWriteStream(jsonPath + '/test1.json');

var1
    .pipe(var2)
    .pipe(var3)
    .pipe(var4)
    .pipe(var5);