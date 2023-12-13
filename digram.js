const { log } = require('console');
const fs = require("fs");
const lineReader = require('line-reader');
let countMap = {};
let wordCount = 0

lineReader.eachLine('./ods6.txt', function (line, last) {
    wordCount++
    if (wordCount % 100 === 0) {
        log(wordCount)
    }
    // console.log(`Line from file: ${line}`);
    var split = line.split("");
    // log(line)
    for (var i = 0; i < split.length - 1; i++) {
        var key = split[i] + split[i + 1]
        if (countMap[key] === undefined) {
            countMap[key] = 1;
            log(key)
        } else {
            countMap[key]++;
        }
    }



    if (last) {
        console.log('Last line printed.');
        fs.writeFileSync("digram.txt", JSON.stringify(countMap));

        // Log the count for each element
        for (let key in countMap) {
            console.log(`Element ${key} occurs ${countMap[key]} times`);
        }
    }
});