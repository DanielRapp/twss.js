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
  var prompt          = docUtils.cleanDocument(options.prompt)
    , trainingData    = options.trainingData  || {}
    , numNeighbours   = options.numNeighbours || 5
    , numWordsInNgram = options.numWordsInNgram || 1
    , prompts         = [];

  // TODO: Optimize by creating the neighbourhood as the distances are calculated
  for (var trainingType in trainingData) {
    var data = trainingData[trainingType];

    for (var i = 0; i < data.length; i++) {
      var trainingPrompt = data[i];

      prompts.push({
        "distance": getDistance( prompt, trainingPrompt, numWordsInNgram ),
        "type":     trainingType,
        "prompt":   trainingPrompt
      });
    }
  }

  // Sort after distance (asc)
  prompts.sort(function(a, b) {
    return a.distance - b.distance;
  });

  var numPosPrompts = 0;
  for (var neighbour = 0; neighbour < numNeighbours; neighbour++) {
    if ( prompts[neighbour].type == 'pos' ) numPosPrompts++;
  }

  // If the majority of prompts are positive, it is a twss prompt
  if ( numPosPrompts < (numNeighbours >> 1) ) return false;

  return true;
};
