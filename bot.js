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

var ngramProbabilities =
  docUtils.getNgramBayesianProbabilities(trainingData, config.numWordsInNgram);

twit.addListener("tweet", function(tweet) {
  var twssProbability = classify.nbc.getTwssProbability({
    "promt":              tweet.text,
    "ngramProbabilities": ngramProbabilities,
    "numWordsInNgram":    config.numWordsInNgram
  });

  //console.log(twssProbability, tweet.text);
  if (classify.nbc.isTwss({ "twssProbability": twssProbability }))
    console.log(twssProbability + ': ' + tweet.text + '\n');
}).stream();
