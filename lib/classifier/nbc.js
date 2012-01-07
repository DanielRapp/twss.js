var docUtils = require("../document")
  , crypto   = require("crypto")
  // Stores ngram probabilities based on the sha1 value of stringified trainingData object.
  // This is probably an awful way to cache calculations.
  , probabilities = {};

var getTwssProbability = exports.getTwssProbability = function(options) {
  var prompt            = docUtils.cleanDocument(options.prompt)
    , numWordsInNgram  = options.numWordsInNgram || 1
    , trainingData     = options.trainingData    || {}
    , ngrams           = docUtils.getNgrams(prompt, numWordsInNgram)
    , trainingDataHash = crypto.createHash('sha1').update(JSON.stringify(trainingData)).digest('hex');

  if (!probabilities[trainingDataHash])
    probabilities[trainingDataHash] =
      docUtils.getNgramBayesianProbabilities(trainingData, numWordsInNgram);

  var probs = probabilities[trainingDataHash];

  // Due to floating-point underflow, p is going to be computed in the log domain.
  // An explanation of the equations used can be found here:
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
  var threshold = options.threshold || 0.5
    , twssProbability = options.hasOwnProperty('twssProbability') ?
                            options.twssProbability :
                            getTwssProbability(options);

  return twssProbability > threshold;
};
