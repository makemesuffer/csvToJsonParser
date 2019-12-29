#!/usr/bin/env node

const fs = require('fs');
const {Transform} = require('stream');

const minimist = require('minimist');


let args = minimist(process.argv.slice(2),{
    string: ['sourceFile', 'resultFile','separator'],
    alias: {'sourceFile': 'sf', 'resultFile': 'rf','separator': 's'},
    default: {'separator': ','},
});



const readStream = fs.createReadStream(args.sourceFile+'.csv');

const bufferToString = new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        const string = chunk.toString();
        const newLineArr = [];
        const stringNation = (str) => {
            let newLine;
            if (str.match('\n') !== null) {
                newLine = str.match('\n').index;
            } else {
                newLineArr.push(str);
                return;
            }
            let newString = str.slice(0, newLine);
            newLineArr.push(newString);
            return stringNation(str.slice(newLine + 1));
        };
        stringNation(string);
        this.push(newLineArr);
        callback();
    }
});


const stringToObj = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        const obj = {};
        const paramArr = [];
        const topLine = chunk[0].split(',');
        topLine.pop();
        const restLines = chunk.slice(1, chunk.length);
        restLines.forEach((elem) => {
            const newArr = elem.split(',');
            newArr.forEach((elem, index) => {
                paramArr[index] === undefined ? paramArr[index] = elem : paramArr[index] += ' ' + elem;
            })
        });
        topLine.forEach((item, index) => {
            obj[item] = paramArr[index].split(' ');
        });
        this.push(obj);
        callback();
    }
});

const objToJson = new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        this.push(JSON.stringify(chunk) + '\n');
        callback();
    }
});

const writeStream = fs.createWriteStream(args.resultFile+'.json');

readStream.on("error", function (e) {
    console.log(e);
})
    .pipe(bufferToString).on("error", function (e) {
    console.log(e);
})
    .pipe(stringToObj).on("error", function (e) {
    console.log(e);
})
    .pipe(objToJson).on("error", function (e) {
    console.log(e);
})
    .pipe(writeStream).on("error", function (e) {
    console.log(e);
});