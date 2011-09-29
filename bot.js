// TODO: http://en.wikipedia.org/wiki/Bayesian_spam_filtering

var config = {
      "numWordsInNgram": 1,
      "trainingSize":    process.argv[2] || 1000
    },
    trainingData = {
      "pos": require("./data/Positive_Promts_TS").data,
      "neg": require('./data/Negavite_Promts_T').data
    },
    classify = {
      "nbc": require("./classifier/nbc"),
      "kss": require("./classifier/kss")
    },
    twitterUserInfo = require("./twitterUserInfo"),
    twit = new (require("twitter-node").TwitterNode)(twitterUserInfo);
    docUtils = require("./utils/document");

twit.action = "sample";
// Limit training data to the training size specified
trainingData.pos.splice(config.trainingSize);
trainingData.neg.splice(config.trainingSize);

var ngramProbabilities = {
  "pos": docUtils.getNgramProbabilities(trainingData.pos, config.numWordsInNgram),
  "neg": docUtils.getNgramProbabilities(trainingData.neg, config.numWordsInNgram)
};

twit.addListener("tweet", function(tweet) {
  var twssScore = classify.nbc.getTwssScore({
    "promt":              tweet.text,
    "ngramProbabilities": ngramProbabilities,
    "numWordsInNgram":    config.numWordsInNgram
  });

  if (classify.nbc.isTwss({ "twssScore": twssScore }))
    console.log(twssScore + ': ' + tweet.text + '\n');
}).stream();

// Debugging
// require("repl").start();
