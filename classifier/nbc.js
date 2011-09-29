var docUtils = require("../utils/document");

var getTwssProbability = exports.getTwssProbability = function(options) {
  var promt           = docUtils.cleanDocument(options.promt)
    , numWordsInNgram = options.numWordsInNgram          || 1
    , probs           = options.ngramProbabilities       || {}
    , ngrams          = docUtils.getNgrams(promt, numWordsInNgram);

  // Due to floating-point underflow, p is going to be computed in the log domain
  // A great mathematics explanation can be found here:
  // http://en.wikipedia.org/wiki/Bayesian_spam_filtering
  var n = 0;
  for (var i = 0; i < ngrams.length; i++) {
    var ngram = ngrams[i];
    if (!probs[ngram]) continue;
    n += Math.log(1 - probs[ngram]) - Math.log(probs[ngram]);
  }

  return 1 / (1 + Math.exp(n));
};

exports.isTwss = function(options) {
  var threshold = 0.99
    , twssProbability = options.hasOwnProperty('twssProbability') ?
                            options.twssProbability :
                            getTwssProbability(options);

  return twssProbability >= threshold;
};
