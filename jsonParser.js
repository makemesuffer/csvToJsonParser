// TODO: Provide errors handling for converting process and incorrect command line arguments with pipe

const fs = require('fs');
const { Transform } = require('stream');

const cvsPath = __dirname + '/csv';
const jsonPath = __dirname + '/json';

const var1 = fs.createReadStream(cvsPath + '/test0.csv');

const var2 = new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        let string = chunk.toString();
        const arr = [];
        stringNation(string);
        function stringNation(str){
            let newLine;
            if(str.match('\n') !== null){
                newLine = str.match('\n').index;
            } else{
                arr.push(str);
                return;
            }
            let newString = str.slice(0,newLine);
            arr.push(newString);
            let chego = str.slice(newLine+1);
            return stringNation(chego);
        }
        console.log(arr);
        // TODO: Send this arr to next transform and split the elements there, use forEach and if index = 0 write it as an obj prop otherwise as a value in an array!!!!

        this.push(chunk.toString().split(','));
        callback();
    }
});


//name: [andrew,kolya]

const var3 = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        const obj = {};
        for(let i=0; i < chunk.length; i++) {
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

const var5 = fs.createWriteStream(jsonPath + '/test0.json');

var1
    .pipe(var2)
    .pipe(var3)
    .pipe(var4)
    .pipe(var5);