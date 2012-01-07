var docUtils = require("../document")
  , analyze  = require("../analyze");

var getDistance = function(doc1, doc2, numWordsInNgram) {
  if (!numWordsInNgram) numWordsInNgram = 1;

  var tfidf = analyze.getTfidf( [doc1, doc2], numWordsInNgram )
    , distance = 0;

  for (var ngram in tfidf[0]) {
    var neighbourTfidf = tfidf[1][ngram];

    if (neighbourTfidf === undefined) neighbourTfidf = 0;

    distance += Math.abs( tfidf[0][ngram] - neighbourTfidf );
  }

  return distance;
};

exports.isTwss = function(options) {
  var promt           = docUtils.cleanDocument(options.promt)
    , trainingData    = options.trainingData  || {}
    , numNeighbours   = options.numNeighbours || 10
    , numWordsInNgram = options.numWordsInNgram || 1
    , promts          = [];

  // TODO: Optimize by creating the neighbourhood as the distances are calculated
  for (var trainingType in trainingData) {
    var data = trainingData[trainingType];

    for (var i = 0; i < data.length; i++) {
      var trainingPromt = data[i];

      promts.push({
        "distance": getDistance( promt, trainingPromt, numWordsInNgram ),
        "type":     trainingType,
        "promt":    trainingPromt
      });
    }
  }

  // Sort after distance (asc)
  promts.sort(function(a, b) {
    return a.distance - b.distance;
  });

  var numPosPromts = 0;
  for (var neighbour = 0; neighbour < numNeighbours; neighbour++) {
    if ( promts[neighbour].type == 'pos' ) numPosPromts++;
  }

  // If the majority of promts are positive, it is a twss promt
  if ( numPosPromts < (numNeighbours >> 1) ) return false;

  return true;
};
