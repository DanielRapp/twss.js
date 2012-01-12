#!/usr/bin/env node

var twss = require('../index.js');
var colors = require('colors');

var argv = require('optimist')
           .usage('$0 classifies if a sentence can be replied with "that\'s what she said".')
           .wrap(50)
           .describe({
             a: 'sets the algorithm to use. `nbc` for naive bayes classifier and `knn` for k-nearest neighbor',
             t: 'threshold. default is 0.5. values from 0 to 1',
             p: 'pretty print. Prints input in green if it can be answered with "that\'s what she said". Always exits with 0',
             h: "you're staring at it"
           })
           .boolean('p')
           .alias('a', 'algo')
           .alias('t', 'threshold')
           .alias('p', 'pretty-print')
           .alias('h', 'help')
           .check(checkArguments)
           .argv

function checkArguments (argv) {
    if(argv.threshold) {
        if('number' !== typeof argv.threshold) {
            throw new TypeError('threshold must be a number');
        }
        else if(argv.threshold < 0 || argv.threshold > 1) {
            throw new RangeError('threshold must be between 0 and 1');
        }
    }
    if(argv.algo) {
        switch(argv.algo) {
            case 'knn':
            case 'nbc':
                break;
            default:
                throw new SyntaxError('algo must be one of: knn, nbc')
                break;
        }
    }
}

if(argv.help) {
    require('optimist').showHelp();
    process.exit();
}

var sentences = argv._;

if(argv.threshold) twss.threshold = argv.threshold;
if(argv.algo) twss.algo = argv.algo;
var pretty = argv.p || false;

if(pretty) {
    for (var i = 0; i < sentences.length; ++i) {
        answer = sentences[i].bold;
        answer = twss.is(sentences[i]) ? answer.green : answer.red
        console.log(answer);
    }
}
else {
    var res = true;
    for (var i = 0; i < sentences.length; ++i) {
        res = res && twss.is(sentences[i]);
    }
    process.exit(res ? 0 : 1);
}
