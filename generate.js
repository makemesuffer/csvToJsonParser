#!/usr/bin/env node

const fs = require('fs');
const util = require('util');

const minimist = require('minimist');


let args = minimist(process.argv.slice(2), {
    string: ['separator'],
    alias: {'resultFile': 'rf', 'separator': 's'},
    default: {'separator': ','},
});

if (args.resultFile === undefined) {
    throw new Error('vvedi pojaluista directoriu bro');
}

const readdir = util.promisify(fs.readdir);

const handleDetect = async () => {
    let fileArr;
    try {
        fileArr = await readdir(args.resultFile);
        let fileName;
        if (fileArr.length === 0) return args.resultFile + '/' + `test${0}.csv`;
        fileArr.forEach(function (elem, index) {
            if (fileArr[index + 1] !== `test${index + 1}.csv`) fileName = `test${index + 1}.csv`
        });
        return args.resultFile + '/' + fileName;
    } catch (e) {
        console.log(e);
    }
};


const randomCsvGen = (length, separator, path) => {
    const writeFile = fs.createWriteStream(path);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let commaCount = 0;
    let rowCount = 0;
    writeFile.on('drain', () => {
        write();
    });
    writeFile.on('end', () => {
        process.exit();
    });
    write();

    function write() {
        for (let i = 1; length >= i; i++) {
            commaCount++;
            if (!writeFile.write(characters.charAt(Math.floor(Math.random() * charactersLength)))) {
                return;
            }
            if (commaCount > Math.floor(Math.random() * 50)) {
                if (!writeFile.write(separator)) {
                    return;
                }
                commaCount = 0;
                rowCount++;
            }
            if (rowCount > 50) {
                if (!writeFile.write('\n')) {
                    return;
                }
                rowCount = 0;
            }
        }
        writeFile.end();
    }

};

handleDetect().then(r => {
        randomCsvGen(2500, args.separator, r);
    }
);


