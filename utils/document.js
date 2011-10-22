var cleanDocument = exports.cleanDocument = function(document) {
  // TODO: Concat all regex and change punctuationRegex to including instead of excluding characters

  var punctuationRegex = /\=|\@|\#|\||\+|\-|\,|\.|\!|\?|\"\'|\:|\;|\(|\)|\[|\]|\{|\}|\/|\\/g;

  document = document.replace(punctuationRegex, "");
  document = document.toLowerCase();

  // Trim document
  document = document.replace(/^\s+|\s+$/g, "");
  // Change all whitespace multiples to single spaces
  // e.g. convert '   ' into ' '
  document = document.replace(/\s{2,}/g, " ");

  return document;
};

var getNgrams = exports.getNgrams = function(document, numWordsInNgram) {
  var words = document.split(" ")
    , ngrams = [];

  // We only want to create whole ngrams
  for (var w = 0; w+numWordsInNgram <= words.length; w++) {
    // Create ngram
    var ngram = "";
    for (var n = 0; n < numWordsInNgram; n++) {
      ngram += words[w+n];

      // Add a space between words, unless we're at the last index
      if (n+1 < numWordsInNgram) ngram += ' ';
    }

    ngrams.push(ngram);
  }

  // There may have been less words than numWordsInNgram
  // or the document may have contained only spaces
  return (ngrams.length < 1) ? false : ngrams;
};

var getNgramFrequencies = exports.getNgramFrequencies =
 function(documents, numWordsInNgram, countNgramOncePerDoc) {
  var ngramFrequencies = {}
    , totalNgrams      = 0;

  if (countNgramOncePerDoc === undefined)
    countNgramOncePerDoc = false;

  for (var d = 0; d < documents.length; d++) {
    documents[d] = cleanDocument(documents[d]);

    var ngrams = getNgrams(documents[d], numWordsInNgram);

    // numWordsInNgram may been larger than the number of words
    if (!ngrams) continue;

    if (countNgramOncePerDoc) var countedNgrams = [];
    for (var n = 0; n < ngrams.length; n++) {
      totalNgrams++;

      // If we have been instructed to only count ngrams once per document
      if (countNgramOncePerDoc) {
        // Just continue to the next ngram without counting it (again)
        if (countedNgrams[ngrams[n]]) continue;
        else countedNgrams[ngrams[n]] = true;
      }

      if (ngramFrequencies[ngrams[n]]) ngramFrequencies[ngrams[n]]++;
      else ngramFrequencies[ngrams[n]] = 1;
    }
  }

  return {
    "ngramFrequencies": ngramFrequencies,
    "totalNgrams": totalNgrams
  };
};

exports.getNgramBayesianProbabilities = function(documents, numWordsInNgram) {
  var probabilities         = {}
    , posNgramFrequencyData = getNgramFrequencies(documents.pos, numWordsInNgram)
    , negNgramFrequencyData = getNgramFrequencies(documents.neg, numWordsInNgram)
    , posNgramFrequencies   = posNgramFrequencyData.ngramFrequencies
    , negNgramFrequencies   = negNgramFrequencyData.ngramFrequencies;

  for (var ngram in posNgramFrequencies) {
    // Don't calculate the probability if we don't have frequency data for negative ngrams
    if (!negNgramFrequencies[ngram])
      continue;

    // This assumes the number of positive documents are the same as the number of negative documents
    // Pr(S|W) = Pr(W|S) / ( Pr(W|S) + Pr(W|H) )
    probabilities[ngram] = posNgramFrequencies[ngram] /
                           ( posNgramFrequencies[ngram] +
                             negNgramFrequencies[ngram] );
  }

  return probabilities;
};

exports.getNgramProbabilities = function(documents, numWordsInNgram) {
  var probabilities      = {}
    , ngramFrequencyData = getNgramFrequencies(documents, numWordsInNgram)
    , ngramFrequencies   = ngramFrequencyData.ngramFrequencies
    , totalNgrams        = ngramFrequencyData.totalNgrams;

  for (var ngram in ngramFrequencies) {
    probabilities[ngram] = ngramFrequencies[ngram] / totalNgrams;
  }

  return probabilities;
};
