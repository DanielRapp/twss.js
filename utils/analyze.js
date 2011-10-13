var shuffleArray = function(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
};

var getClassificationStats = exports.getClassificationStats =
 function(isClass, trainingData, validationData) {
  var classifications = {
    // True positive
    "tp": 0,
    // False positive
    "fp": 0,
    // False negative
    "fn": 0,
    // True negative
    "tn": 0
  };

  for (var validationType in validationData) {
    for (var i = 0; i < validationData[validationType].length; i++) {
      var iC = isClass({
        "promt": validationData[validationType][i],
        "trainingData": trainingData
      });

      if (validationType == 'pos') {
        if (iC) classifications.tp++;
        else    classifications.fn++;
      }
      else if (validationType == 'neg') {
        if (iC) classifications.fp++;
        else    classifications.tn++;
      }
    }
  }

  return classifications;
};

var getNumCorrectClassifications = exports.getNumCorrectClassifications =
 function(isClass, trainingData, validationData) {
  var stats = getClassificationStats(isClass, trainingData, validationData);
  return stats.tp + stats.tn;
};

var getNumIncorrectClassifications = getNumIncorrectClassifications =
 function(isClass, trainingData, validationData) {
  var stats = getClassificationStats(isClass, trainingData, validationData);
  return stats.fp + stats.fn;
};

exports.kFoldCrossValidation = function(isClass, sampleData, numFolds) {
  var numFolds                    = numFolds || 10
    // We assume there is an equal number of positive and negative sample points
    , sampleDataSize              = sampleData.pos.length
    , foldSize                    = Math.floor( sampleDataSize / numFolds )
    , numIncorrectClassifications = 0;

  sampleData.pos = shuffleArray( sampleData.pos );
  sampleData.neg = shuffleArray( sampleData.neg );

  var hasBeenUsedAsTrainingData = { "pos": [], "neg": [] }
    , hasNotBeenUsedAsTrainingData = sampleData;

  for (var i = 0; i <= sampleDataSize; i+=foldSize) {
    var trainingGroup = {
        /* There is a slight mathematical issue with this.
        * In true KFCV the training group is selected at random from the sample,
        * that means there's not nessasarily going to be an equal number of positive
        * and negative training points. Due to the law of large numbers, however,
        * this shouldn't be an issue with a large enough sample pool.
        */
        // Use the first fold from data that hasn't been used as training data
        "pos": hasNotBeenUsedAsTrainingData.pos.splice( 0, foldSize ),
        "neg": hasNotBeenUsedAsTrainingData.neg.splice( 0, foldSize )
      }
      // Use everything except the current training data as validation data
      , validationGroup = {
        "pos": hasBeenUsedAsTrainingData.pos.concat(hasNotBeenUsedAsTrainingData.pos),
        "neg": hasBeenUsedAsTrainingData.neg.concat(hasNotBeenUsedAsTrainingData.neg)
      };

    numIncorrectClassifications +=
      getNumIncorrectClassifications(isClass, trainingGroup, validationGroup);

    hasBeenUsedAsTrainingData = {
      "pos": hasBeenUsedAsTrainingData.pos.concat(trainingGroup.pos),
      "neg": hasBeenUsedAsTrainingData.neg.concat(trainingGroup.neg)
    };
  }

  // incorrect classifications / total classifications
  return numIncorrectClassifications / ( 2 * sampleDataSize * numFolds );
};

exports.getPrecisionRecall = function(isClass, trainingData, validationData) {
  var stats = getClassificationStats(isClass, trainingData, validationData);
  return {
    "precision": stats.tp / ( stats.tp + stats.fp ),
    "recall": stats.tp / ( stats.tp + stats.fn )
  };
};
