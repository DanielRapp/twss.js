exports.numWordsInNgram = 1;

exports.trainingData = {
  pos: require('../data/Positive_Prompts_TS').data,
  neg: require('../data/Negavite_Prompts_FML').data
};

var trainingSize = 1900;

// Limit the training data to the training size specified
exports.trainingData.pos.splice(trainingSize);
exports.trainingData.neg.splice(trainingSize);

var classify = {
  nbc: require('./classifier/nbc'),
  knn: require('./classifier/knn')
};

exports.algo = 'nbc';

exports.is = function( prompt ) {
  return classify[exports.algo].isTwss({
    prompt: prompt,
    trainingData: exports.trainingData,
    numWordsInNgram: exports.numWordsInNgram
  })
};
