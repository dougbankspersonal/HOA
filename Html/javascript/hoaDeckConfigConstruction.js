// In this file we describe one or more deck configs: some shorthand for the params of a deck.
// This will be consumed to become a list of card configs, which are then turned into cards.
// We can have multiple deck configs, for different games or different modes of a game.
//
// A deck config contains the following fields:
//
// classes: classes applied to every card.
// cardTerrainDescriptors: list of structs:
//   count: how many card configs use this terrainTypeBySectorIndex.
//   terrainTypeBySectorIndex: array mapping sector index to terrain type.
// itemAppearanceHistogramsByTerrainType: map from item type to a histogram if item types to relative frequency of item.
//   sector: item of this type, or nothing.  Just for readable and simple code, looks like [Empty, Empty, Empty, ItemX, ItemX, ItemY]
// waterPipeOdds: zero to 1.  Roll a random 0 to 1, if under amount a card has a pipe.

define([
  "sharedJavascript/debugLog",
  "javascript/hoaCardConstants",
  "dojo/domReady!",
], function (debugLogModule, hoaCardConstants) {
  var debugLog = debugLogModule.debugLog;
  //-------------------------------------------------
  //
  // Functions
  //
  //-------------------------------------------------

  function getDeckConfig() {
    var gBasicHOADeckConfig = {
      classes: ["hoa"],
      waterPipeOdds: 0.7,
      itemAppearanceHistogramsByTerrainType: {
        [hoaCardConstants.terrainTypes.Building]:
          hoaCardConstants.otherTerrainItemApperanceHistogram,
        [hoaCardConstants.terrainTypes.Concrete]:
          hoaCardConstants.otherTerrainItemApperanceHistogram,
        [hoaCardConstants.terrainTypes.Water]:
          hoaCardConstants.otherTerrainItemApperanceHistogram,
        [hoaCardConstants.terrainTypes.Grass]:
          hoaCardConstants.grassTerrainItemApperanceHistogram,
      },

      startTilesTerrainTypeBySectorIndices: [
        [
          hoaCardConstants.terrainTypes.Building,
          hoaCardConstants.terrainTypes.Building,
          hoaCardConstants.terrainTypes.Building,
          hoaCardConstants.terrainTypes.Grass,
        ],
        [
          hoaCardConstants.terrainTypes.Building,
          hoaCardConstants.terrainTypes.Building,
          hoaCardConstants.terrainTypes.Building,
          hoaCardConstants.terrainTypes.Concrete,
        ],
      ],
      cardTerrainDescriptors: [
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
          ],
          count: 8,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Building,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Concrete,
            hoaCardConstants.terrainTypes.Grass,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Building,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Water,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Water,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Concrete,
            hoaCardConstants.terrainTypes.Building,
            hoaCardConstants.terrainTypes.Building,
            hoaCardConstants.terrainTypes.Grass,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Building,
            hoaCardConstants.terrainTypes.Concrete,
            hoaCardConstants.terrainTypes.Grass,
            hoaCardConstants.terrainTypes.Grass,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Concrete,
          ],
          count: 3,
        },
        {
          terrainTypeBySectorIndex: [
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Water,
            hoaCardConstants.terrainTypes.Concrete,
            hoaCardConstants.terrainTypes.Concrete,
          ],
          count: 3,
        },
      ],
    };

    return gBasicHOADeckConfig;
  }

  // This returned object becomes the defined value of this module
  return {
    getDeckConfig: getDeckConfig,
  };
});
