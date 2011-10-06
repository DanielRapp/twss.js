var docUtils = require("../utils/document")
  , probabilities = false;

var getTwssProbability = exports.getTwssProbability = function(options) {
  var promt           = docUtils.cleanDocument(options.promt)
    , numWordsInNgram = options.numWordsInNgram || 1
    , trainingData    = options.trainingData    || {}
    , ngrams          = docUtils.getNgrams(promt, numWordsInNgram);

  if (!probabilities)
    probabilities = docUtils.getNgramBayesianProbabilities(trainingData, numWordsInNgram);

  // Due to floating-point underflow, p is going to be computed in the log domain
  // A great mathematics explanation can be found here:
  // http://en.wikipedia.org/wiki/Bayesian_spam_filtering
  var n = 0;
  for (var i = 0; i < ngrams.length; i++) {
    var ngram = ngrams[i];
    if (!probabilities[ngram]) continue;
    n += Math.log(1 - probabilities[ngram]) - Math.log(probabilities[ngram]);
  }

  return 1 / (1 + Math.exp(n));
};

exports.isTwss = function(options) {
  var threshold = 0.999
    , twssProbability = options.hasOwnProperty('twssProbability') ?
                            options.twssProbability :
                            getTwssProbability(options);

  return twssProbability >= threshold;
};
