const fs = require('fs');
const util = require('util');

const cvsPath = __dirname + '/csv';

const readdir = util.promisify(fs.readdir);

const handleDetect = async () => {
    let fileArr;
    try {
        fileArr = await readdir(cvsPath);
        let res;
        if (fileArr.length === 0) return cvsPath + '/' + `test${0}.csv`;
        fileArr.forEach(function (elem, index) {
            if (fileArr[index + 1] !== `test${index + 1}.csv`) res = `test${index + 1}.csv`
        });
        return cvsPath + '/' + res;
    } catch (e) {
        console.log(e);
    }
};


// TODO:  detect the separator that is used for parsing
const randomCsvGen = (length, separator = ',', path) => {
    const writeFile = fs.createWriteStream(path);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let commaCount = 0;
    let rowCount = 0;
    writeFile.on('drain', () => {
        write();
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
            if (rowCount > 100) {
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
        randomCsvGen(10000000, ',', r);
    }
);


