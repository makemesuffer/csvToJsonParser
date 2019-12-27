const fs = require('fs');
const {Transform} = require('stream');

const cvsPath = __dirname + '/csv';
const jsonPath = __dirname + '/json';

const var1 = fs.createReadStream(cvsPath + '/test2.csv');

const var2 = new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        const string = chunk.toString();
        const arr = [];
        const stringNation = (str) => {
            let newLine;
            if (str.match('\n') !== null) {
                newLine = str.match('\n').index;
            } else {
                arr.push(str);
                return;
            }
            let newString = str.slice(0, newLine);
            arr.push(newString);
            return stringNation(str.slice(newLine + 1));
        };
        stringNation(string);
        this.push(arr);
        callback();
    }
});


const var3 = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        const obj = {};
        const testArr = [];
        const header = chunk[0].split(',');
        header.pop();
        const rest = chunk.slice(1, chunk.length);
        rest.forEach((elem) => {
            const newArr = elem.split(',');
            newArr.forEach((elem, index) => {
                testArr[index] === undefined ? testArr[index] = elem : testArr[index] += ' ' + elem;
            })
        });
        header.forEach((item, index) => {
            obj[item] = testArr[index].split(' ');
        });
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

const var5 = fs.createWriteStream(jsonPath + '/test2.json');

var1.on("error", function (e) {
    console.log(e);
})
    .pipe(var2).on("error", function (e) {
    console.log(e);
})
    .pipe(var3).on("error", function (e) {
    console.log(e);
})
    .pipe(var4).on("error", function (e) {
    console.log(e);
})
    .pipe(var5).on("error", function (e) {
    console.log(e);
});