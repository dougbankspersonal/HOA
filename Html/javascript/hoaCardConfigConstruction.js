/*
Tightly bound with hoaDeckConfigConstruction.js

hoaDeckConfigConstruction describes a deck of cards in "HOA" specific terms.
This translates into an array of card configs using generic "triangle cards" terms, these can
be passed off to triangleCards shared code to generate actual cards.
*/
define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "sharedJavascript/triangleCardConstants",
  "javascript/hoaCardConstants",
  "dojo/domReady!",
], function (
  debugLogModule,
  genericUtils,
  triangleCardConstants,
  hoaCardConstants
) {
  var debugLog = debugLogModule.debugLog;
  //-----------------------------------
  //
  // Global state.
  //
  //-----------------------------------
  var gCardConfigs = null;

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function generateSectorDescriptorsForTerrainsBySector(
    terrainTypeBySectorIndex
  ) {
    debugLog(
      "generateCardConfig",
      "terrainTypeBySectorIndex = ",
      JSON.stringify(terrainTypeBySectorIndex)
    );

    var sectorDescriptors = [];
    for (
      var sectorIndex = 0;
      sectorIndex < terrainTypeBySectorIndex.length;
      sectorIndex++
    ) {
      var terrainType = terrainTypeBySectorIndex[sectorIndex];
      var sectorDescriptor = {
        classes: [terrainType],
      };
      sectorDescriptors.push(sectorDescriptor);
    }

    debugLog(
      "generateSectorDescriptorsForTerrainCombo",
      "sectorDescriptors = ",
      JSON.stringify(sectorDescriptors)
    );

    return sectorDescriptors;
  }

  // Can this sector have a half-pipe through it?
  function canHaveHalfPipes(sectorDescriptor) {
    // If the sector is not grass, it can't have a half-pipe.
    if (
      !sectorDescriptor.classes.includes(hoaCardConstants.terrainTypes.Grass)
    ) {
      return false;
    }

    return true;
  }

  function getPipeContinuationClassOptions(
    sectorDescriptor,
    sectorIndex,
    entryTriangleSide
  ) {
    // A pipe has entered the given sector on the given side.  What are the possible ways it could continue?
    var retVal = [];

    // if the pipe can handle ending here, add that option.
    if (canHaveHalfPipes(sectorDescriptor)) {
      for (var i = 0; i < hoaCardConstants.pipeEndMultiplier; i++)
        retVal.push(hoaCardConstants.pipeOptions.PipeHalf);
    }

    // If we are in sector 0, we want to prefer the turn that gets us down into sector 2.
    if (sectorIndex == 0) {
      var turnInto2 =
        entryTriangleSide == hoaCardConstants.triangleSides.Left
          ? hoaCardConstants.pipeOptions.PipeFullRight
          : hoaCardConstants.pipeOptions.PipeFullLeft;
      var turnOut =
        entryTriangleSide == hoaCardConstants.triangleSides.Left
          ? hoaCardConstants.pipeOptions.PipeFullLeft
          : hoaCardConstants.pipeOptions.PipeFullRight;

      for (var i = 0; i < hoaCardConstants.preferredTurnMultiplier; i++) {
        retVal.push(turnInto2);
      }
      for (var i = 0; i < hoaCardConstants.unpreferredTurnMultiplier; i++) {
        retVal.push(turnOut);
      }
    } else {
      // Equal chances right and left.
      // Prefer this a bit over ending.
      for (var i = 0; i < hoaCardConstants.preferredTurnMultiplier; i++) {
        retVal.push(hoaCardConstants.pipeOptions.PipeFullRight);
        retVal.push(hoaCardConstants.pipeOptions.PipeFullLeft);
      }
    }
    return retVal;
  }

  // Is there a next sector?
  function getNextSectorIndex(sectorIndex, entryTriangleSide, pipeClass) {
    // Half pipe: no next sector.
    if (pipeClass == hoaCardConstants.pipeOptions.PipeHalf) {
      return null;
    }

    // sector 0: enter 1 turn right or enter 2 turn left goes into sector 2.
    if (sectorIndex == 0) {
      if (
        (entryTriangleSide == hoaCardConstants.triangleSides.Left &&
          pipeClass == hoaCardConstants.pipeOptions.PipeFullRight) ||
        (entryTriangleSide == hoaCardConstants.triangleSides.Right &&
          pipeClass == hoaCardConstants.pipeOptions.PipeFullLeft)
      ) {
        return 2;
      } else {
        // went out.
        return null;
      }
    }
    // Sector 2: entry side can be ignored.
    // Turns right into 1 or left into 3.
    if (sectorIndex == 2) {
      if (pipeClass == hoaCardConstants.pipeOptions.PipeFullRight) {
        return 1;
      } else {
        return 3;
      }
    }
    // Anything else: no next sector.
    return null;
  }

  // cardConfig: description of the card we are adding pipes to.
  // sectorIndex: which sector are we talking about.
  // entryTriangleSide: which side of the sector is the pipe entering from.
  function tryAddPipeRecursive(cardConfig, sectorIndex, entryTriangleSide) {
    debugLog(
      "tryAddPipeRecursive",
      "tryAddPipeRecursive: cardConfig = ",
      JSON.stringify(cardConfig)
    );
    debugLog("tryAddPipeRecursive", "sectorIndex = " + sectorIndex);
    debugLog("tryAddPipeRecursive", "entryTriangleSide = " + entryTriangleSide);

    // Get the sector in question.
    var sectorDescriptor = cardConfig.sectorDescriptors[sectorIndex];
    debugLog(
      "tryAddPipeRecursive",
      "sectorDescriptor = " + JSON.stringify(sectorDescriptor)
    );

    // How will we advance the pipe in this sector?
    // Get the options.
    var pipeContinuationClasssOptions = getPipeContinuationClassOptions(
      sectorDescriptor,
      sectorIndex,
      entryTriangleSide
    );
    debugLog(
      "tryAddPipeRecursive",
      "pipeContinuationClasssOptions = " +
        JSON.stringify(pipeContinuationClasssOptions)
    );

    // Find the continuation option.
    var pipeClass = genericUtils.getRandomArrayElement(
      pipeContinuationClasssOptions,
      hoaCardConstants.getRandomZeroToOne
    );

    debugLog("tryAddPipeRecursive", "pipeClass = " + pipeClass);

    // This is now a "pipes" flavored overlay on this sector.
    // "pipes" holds 3 items, 3 different orientations: depends on side we entered from.
    sectorDescriptor.overlaysByType = sectorDescriptor.overlaysByType || {};
    sectorDescriptor.overlaysByType["pipes"] =
      sectorDescriptor.overlaysByType["pipes"] || [];
    // Fill in all rotation options, only will be valid.
    for (var side = 0; side <= 3; side++) {
      sectorDescriptor.overlaysByType["pipes"].push(
        side == entryTriangleSide ? pipeClass : null
      );
    }

    // Is there a next sector?
    var nextSectorIndex = getNextSectorIndex(
      sectorIndex,
      entryTriangleSide,
      pipeClass
    );
    if (nextSectorIndex === null) {
      // Done.
      return;
    }

    // Next entry side: always enter through bottom.
    var nextEntryTriangleSide = 0;

    tryAddPipeRecursive(cardConfig, nextSectorIndex, nextEntryTriangleSide);
  }

  function maybeAddPipesToCardConfig(cardConfig, oddsOfPipe) {
    debugLog(
      "maybeAddPipesToCardConfig",
      "cardConfig = ",
      JSON.stringify(cardConfig)
    );

    debugLog(
      "maybeAddPipesToCardConfig",
      "oddsOfPipe = ",
      JSON.stringify(oddsOfPipe)
    );

    // Then we roll a die: what percent of eligible sector 0's have a pipe?
    var zeroToOneValue = hoaCardConstants.getRandomZeroToOne();
    debugLog("maybeAddPipesToCardConfig", "zeroToOneValue = ", zeroToOneValue);
    if (zeroToOneValue > oddsOfPipe) {
      debugLog("maybeAddPipesToCardConfig", "failed odds");
      return false;
    }

    // Where do we enter?  Either sides 1 or 2.
    var entryTriangleSide = genericUtils.getRandomArrayElement(
      [
        hoaCardConstants.triangleSides.Left,
        hoaCardConstants.triangleSides.Right,
      ],
      hoaCardConstants.getRandomZeroToOne
    );
    debugLog(
      "maybeAddPipesToCardConfig",
      "entryTriangleSide = " + entryTriangleSide
    );
    tryAddPipeRecursive(cardConfig, 0, entryTriangleSide);
  }

  function addItemsToCardConfig(
    cardConfig,
    itemAppearanceHistogramsByTerrainType
  ) {
    for (
      var sectorIndex = 0;
      sectorIndex < cardConfig.sectorDescriptors.length;
      sectorIndex++
    ) {
      var sectorDescriptor = cardConfig.sectorDescriptors[sectorIndex];
      var terrainType = sectorDescriptor.classes[0];
      var itemAppearanceHistogram =
        itemAppearanceHistogramsByTerrainType[terrainType] || [];
      debugLog("addItemsToCardConfig", "terrainType = " + terrainType);
      debugLog(
        "addItemsToCardConfig",
        "itemAppearanceHistogram = " + JSON.stringify(itemAppearanceHistogram)
      );
      console.assert(itemAppearanceHistogram, "no itemAppearanceHistogram");
      console.assert(
        Object.keys(itemAppearanceHistogram).length > 0,
        "no contents in itemAppearanceHistogram"
      );
      var itemClass = genericUtils.getRandomKeyFromHistogram(
        itemAppearanceHistogram,
        hoaCardConstants.getRandomZeroToOne
      );

      if (itemClass != hoaCardConstants.itemTypes.NoItem) {
        sectorDescriptor.overlaysByType = sectorDescriptor.overlaysByType || {};
        sectorDescriptor.overlaysByType["items"] =
          sectorDescriptor.overlaysByType["items"] || [];
        sectorDescriptor.overlaysByType["items"].push(itemClass);
      }
    }
  }

  function generateCardConfigs(deckConfig) {
    debugLog(
      "generateCardConfigs",
      "called generateCardConfigs with deckConfig = ",
      JSON.stringify(deckConfig)
    );

    // Only call once.
    console.assert(gCardConfigs === null, "generateCardConfigs called twice");

    gCardConfigs = [];

    // First the start tiles.
    debugLog(
      "generateCardConfigs",
      "deckConfig.startTilesTerrainTypeBySectorIndices = ",
      JSON.stringify(deckConfig.startTilesTerrainTypeBySectorIndices)
    );

    for (
      var playerIndex = 0;
      playerIndex < hoaCardConstants.numPlayers;
      playerIndex++
    ) {
      debugLog(
        "generateCardConfigs",
        "playerIndex = " + playerIndex,
        JSON.stringify(deckConfig.startTilesTerrainTypeBySectorIndices)
      );
      for (
        var cardIndex = 0;
        cardIndex < deckConfig.startTilesTerrainTypeBySectorIndices.length;
        cardIndex++
      ) {
        debugLog(
          "generateCardConfigs",
          "  cardIndex = " + cardIndex,
          JSON.stringify(deckConfig.startTilesTerrainTypeBySectorIndices)
        );
        var terrainTypeBySectorIndex =
          deckConfig.startTilesTerrainTypeBySectorIndices[cardIndex];
        var cardConfig = {};
        cardConfig.sectorDescriptors =
          generateSectorDescriptorsForTerrainsBySector(
            terrainTypeBySectorIndex
          );
        gCardConfigs.push(cardConfig);
        cardConfig.classes = ["start"].concat(deckConfig.classes);
      }
    }

    debugLog(
      "generateCardConfigs",
      "deckConfig.cardTerrainDescriptors = ",
      JSON.stringify(deckConfig.cardTerrainDescriptors)
    );

    var totalCardIndex = 0;
    for (
      var cardTerrainDescriptorIndex = 0;
      cardTerrainDescriptorIndex < deckConfig.cardTerrainDescriptors.length;
      cardTerrainDescriptorIndex++
    ) {
      var cardTerrainDescriptor =
        deckConfig.cardTerrainDescriptors[cardTerrainDescriptorIndex];
      for (
        var cardIndex = 0;
        cardIndex < cardTerrainDescriptor.count;
        cardIndex++
      ) {
        var cardConfig = {};
        totalCardIndex++;
        cardConfig.cardIndex = totalCardIndex;

        cardConfig.sectorDescriptors =
          generateSectorDescriptorsForTerrainsBySector(
            cardTerrainDescriptor.terrainTypeBySectorIndex
          );
        cardConfig.classes = deckConfig.classes;
        // Decorate the sector configs with items.
        addItemsToCardConfig(
          cardConfig,
          deckConfig.itemAppearanceHistogramsByTerrainType
        );
        // Decorate the card with water pipes.
        maybeAddPipesToCardConfig(cardConfig, deckConfig.waterPipeOdds);

        gCardConfigs.push(cardConfig);
      }
    }

    return gCardConfigs;
  }

  function getCardConfigs() {
    debugLog("getCardConfigs: gCardConfigs.length = ", gCardConfigs.length);
    return gCardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    generateCardConfigs: generateCardConfigs,
    getCardConfigs: getCardConfigs,
  };
});
