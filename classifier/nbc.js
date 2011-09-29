var docUtils = require("../utils/document");

var getTwssScore = exports.getTwssScore = function(options) {
  var promt           = docUtils.cleanDocument(options.promt)
    , smoothing       = options.smoothing                || 0.001
    , numWordsInNgram = options.numWordsInNgram          || 1
    , posProbs        = options.ngramProbabilities.pos   || {}
    , negProbs        = options.ngramProbabilities.neg   || {}
    , ngrams          = docUtils.getNgrams(promt, numWordsInNgram)
    , probabilityOfBeingTwssPromt = 0;

  for (var i = 0; i < ngrams.length; i++) {
    var ngram = ngrams[i]
      , probabilityOfBeingTwssNgram    = posProbs[ngram] ? posProbs[ngram] : 0
      , probabilityOfNotBeingTwssNgram = negProbs[ngram] ? negProbs[ngram] : 0

    // Since the probability that the ngram isn't part of a twss promt
    // may equal 0, we have to add smoothing
    probabilityOfBeingTwssPromt +=
      Math.log(
        (probabilityOfBeingTwssNgram + smoothing) /
        (probabilityOfNotBeingTwssNgram + smoothing)
      );
  }

  return probabilityOfBeingTwssPromt;
};

exports.isTwss = function(options) {
  if (options.hasOwnProperty('twssScore')) return 0 < options.twssScore;
  else                                     return 0 < getTwssScore(options);
};
