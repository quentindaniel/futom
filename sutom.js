const search = require('./search');

var all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
var target
var targetLenght
var start
var played = []

var lastPicks

main()
async function main() {
    target = await selectWord()
    do {
        var g = await guess()
        play(g)
    }
    while (checkWin())
}

// select word for the current game
async function selectWord() {
    var words = await search("^.{13}$")
    // var words = await search("^PUBLIQUE$")
    var word = selectOneRng(words)
    // var word = "PUBLIQUE"
    console.log(word);
    targetLenght = word.split("").length
    start = word.split("")[0]
    return word
}

function checkWin() {
    var length = played.length
    if (length >= 6) {
        return false
    }

    var last = played[length - 1].r.split("")
    if (last.every(x => x === "R")) {
        return false
    }
    return true
}

// make a guess for next play
async function guess() {

    var stats = computeStat()
    var toRemove = stats.filter(x => x.status == "B").map(x => x.lettre)
    var global = all.filter(x => !toRemove.includes(x)).join("")

    // make regex based on previous picks
    var rules = `^${start}`
    for (let i = 1; i < targetLenght; i++) {

        var perfect = stats.filter(x => x.pos == i && x.status == "R")
        if (perfect.length > 0) {
            rules += perfect[0].lettre
        }
        else {
            var local = stats.filter(x => x.pos == i).map(x => x.lettre)
            var avilable = global.split("").filter(x => !local.includes(x)).join("")
            rules += `[${avilable}]`
        }
    }
    rules += "$"

    if(!lastPicks){
        lastPicks = await search(rules)
    }
    else{
        const regex = new RegExp(rules, 'i');
        lastPicks = lastPicks.filter(x => x.match(regex))
    }
    var pick = SelectOneBest(lastPicks)
    return pick.toLocaleUpperCase()
}

// actualy play the next guess in the current game
function play(word) {

    // check lenght
    if (word.length != target.length) {
        console.log("error size");
    }

    var index = played.length
    var splitWord = word.split('')
    var splitTarget = target.split('')

    var result = ''

    for (let i = 0; i < splitTarget.length; i++) {
        var w = splitWord[i]
        var t = splitTarget[i]
        if (w === t) {
            result = result + "R"
        }
        else if (splitTarget.includes(w)) {
            result = result + "Y"
        }
        else {
            result = result + "B"
        }
    }
    console.log(`${index+1}: ${word} ${addColor(result)}`);
    played.push({ w: word, r: result })
}

function computeStat() {
    var result = []
    for (let i = 0; i < played.length; i++) {
        var line = played[i]
        var split = line.w.split("")
        var status = line.r.split("")
        for (let j = 0; j < split.length; j++) {
            result.push({ word: line.w, lettre: split[j], status: status[j], try: i, pos: j })
        }
    }
    return result;
}

function addColor(input) {
    return input.split("").map(l => {
        if (l === "R")
            return "🟥"
        if (l === "Y")
            return "🟨"
        if (l === "B")
            return "🟦"
    }).join("")
}

function SelectOneBest(items) {
    var res = items.reduce((agg, val)=>{
        var count = {}
        val.split("").forEach(l=>{
            if(!count.hasOwnProperty(l)){
                count[l] = 0
            }
            count[l] ++ 
        })
        var numLettre = Object.keys(count).length
        if(!agg.hasOwnProperty(numLettre)){
            agg[numLettre] = []
        }
        agg[numLettre].push(val)

        return agg
    }, {})

    var count = Object.keys(res).map(x=> parseInt(x))
    var max = Math.max(...count)
    var maxed = res[`${max}`]

    return maxed[Math.floor(Math.random() * maxed.length)];
}

function selectOneRng(items) {
    return items[Math.floor(Math.random() * items.length)];
}

