var config = {
      "numWordsInNgram": 1,
      "trainingSize":    process.argv[2] || 1000
    },
    trainingData = {
      "pos": require("./data/Positive_Promts_TS").data,
      "neg": require('./data/Negavite_Promts_FML').data
    },
    classify = {
      "nbc": require("./classifier/nbc"),
      "kss": require("./classifier/kss")
    },
    twitterUserInfo = require("./twitterUserInfo"),
    twit = new (require("./node-twitter"))(twitterUserInfo);
    docUtils = require("./utils/document");

twit.action = "sample";
// Limit training data to the training size specified
trainingData.pos.splice(config.trainingSize);
trainingData.neg.splice(config.trainingSize);

twit.stream('statuses/sample', function(stream) {
  stream.on('data', function (tweet) {
    // For some reason some tweets don't contain a tweet. Should probably investigate.
    if (tweet.text === undefined) return;

    var twssProbability = classify.nbc.getTwssProbability({
      "promt":           tweet.text,
      "trainingData":    trainingData,
      "numWordsInNgram": config.numWordsInNgram
    });

    if (classify.nbc.isTwss({ "twssProbability": twssProbability, "threshold": 0.99 }))
      console.log(twssProbability + '\n' + tweet.text + '\n');
  });
});
