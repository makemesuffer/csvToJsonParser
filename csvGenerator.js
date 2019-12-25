const fs = require('fs');
const util = require('util');

 const cvsPath = __dirname + '/csv';

const readdir = util.promisify(fs.readdir);

const witcher = async () => {
    let attemp;
    try {
        attemp = await readdir(cvsPath);
        let res;
        if (attemp.length === 0) return cvsPath + '/' + `test${0}.txt`;
        attemp.forEach(function (elem, index) {
            if (attemp[index + 1] !== `test${index + 1}.txt`) res = `test${index + 1}.txt`
        });
        return cvsPath + '/' + res;
    } catch (e) {
        console.log(e);
    }
};

const randomChar = (length,separator = ',') =>{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let count=0;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        count++;
        if(count > Math.floor(Math.random() * 50)){
            result += separator;
            count = 0;
        }
    }
    return result;
};

let result = witcher().then(r => {
        const file = fs.createWriteStream(r);
        file.write( randomChar(1000000,','));
        file.end();
    }
);


