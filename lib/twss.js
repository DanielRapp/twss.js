exports.numWordsInNgram = 1;
exports.numNeighbours = 3;
exports.threshold = 0.5;

exports.trainingData = {
  pos: require('../data/Positive_Prompts_TS').data,
  neg: require('../data/Negative_Prompts_FML').data
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
  var params = {
    prompt: prompt,
    trainingData: exports.trainingData,
    numWordsInNgram: exports.numWordsInNgram
  };

  if (exports.algo == 'nbc') {
    params['threshold'] = exports.threshold;
  }
  else if (exports.algo == 'knn') {
    params['numNeighbours'] = exports.numNeighbours;
  }

  return classify[exports.algo].isTwss( params );
};
