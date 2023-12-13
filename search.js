const { log } = require('console');
const lineReader = require('line-reader');

// async function main() {

//     var result = await search("^audit.i.e$")
//     log(result)
// }
// main()


module.exports = (async function(word){ 
    return new Promise((resolve, reject) => {
        // var input = "^audit.i.e$"
        // .replaceAll('.', "[qzertyuioadfhjkmwxcvb]")
        // log(input)

        const regex = new RegExp(word, 'i');
        result = []

        lineReader.eachLine('./ods6.txt', function (line, last) {

            if (line.match(regex)) {
                // log(line)
                result.push(line)
            }


            if (last) {
                resolve(result)
                // console.log('Last line printed.');
            }
        });
    });
})
