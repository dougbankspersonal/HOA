// In this file we describe one or more deck configs: some shorthand for the params of a deck.
// This will be consumed to become a list of card configs, which are then turned into cards.
// We can have multiple deck configs, for different games or different modes of a game.
//
// A deck config contains the following fields:
//
// classes: classes applied to every card.
// numPlayers: number of players in the game.
// cardTerrainDescriptors: list of structs:
//   count: how many card configs use this terrainTypeBySectorIndex.
//   terrainTypeBySectorIndex: array mapping sector index to terrain type.
// itemAppearanceHistogramsByTerrainType: map from item type to a histogram if item types to relative frequency of item.
//   sector: item of this type, or nothing.  Just for readable and simple code, looks like [Empty, Empty, Empty, ItemX, ItemX, ItemY]
// waterPipeOdds: zero to 1.  Roll a random 0 to 1, if under amount a card has a pipe.

define([
  "sharedJavascript/debugLog",
  "sharedJavascript/genericUtils",
  "dojo/domReady!",
], function (debugLogModule, genericUtils) {
  var debugLog = debugLogModule.debugLog;

  // No idea how many players this actually supports.
  // But TTS wants at least 12 cards in any card set, 2 cards per player: just say 6.
  const gNumPlayers = 6;

  const gTerrainTypeBuilding = "building";
  const gTerrainTypeGrass = "grass";
  const gTerrainTypeWater = "water";
  const gTerrainTypeConcrete = "concrete";

  const gTerrainTypes = {
    Building: gTerrainTypeBuilding,
    Grass: gTerrainTypeGrass,
    Water: gTerrainTypeWater,
    Concrete: gTerrainTypeConcrete,
  };

  const gItemTypeSymbol = "symbol";
  const gItemTypeMower = "mower";
  const gItemTypeHedge = "hedge";
  const gItemTypeFlower = "flower";
  const gItemTypePlayEquipment01 = "playEquipment01";
  const gItemTypePlayEquipment02 = "playEquipment02";
  const gItemTypePlayEquipment03 = "playEquipment03";
  const gItemTypePlayEquipment04 = "playEquipment04";
  const gItemTypeNoItem = "noItem";

  const gItemTypes = {
    Symbol: gItemTypeSymbol,
    Mower: gItemTypeMower,
    Hedge: gItemTypeHedge,
    Flower: gItemTypeFlower,
    PlayEquipment01: gItemTypePlayEquipment01,
    PlayEquipment02: gItemTypePlayEquipment02,
    PlayEquipment03: gItemTypePlayEquipment03,
    PlayEquipment04: gItemTypePlayEquipment04,
    NoItem: gItemTypeNoItem,
  };

  const gOtherTerrainItemApperanceHistogram = {
    [gItemTypes.Symbol]: 3,
    [gItemTypes.NoItem]: 21,
  };

  const gGrassTerrainItemApperanceHistogram = {
    [gItemTypes.Symbol]: 2,
    [gItemTypes.Mower]: 2,
    [gItemTypes.Flower]: 4,
    [gItemTypes.Hedge]: 4,
    [gItemTypes.PlayEquipment01]: 1,
    [gItemTypes.PlayEquipment02]: 1,
    [gItemTypes.PlayEquipment03]: 1,
    [gItemTypes.PlayEquipment04]: 1,
    [gItemTypes.NoItem]: 16,
  };

  // Some concepts:
  // Sectors are numbered
  //     0
  //     2
  //   1   3
  // For a right side up sector, sides are numbered:
  //
  //      /\
  //     1  2
  //    /    \
  //   /___0__\
  const gTriangleSideBottom = 0;
  const gTriangleSideLeft = 1;
  const gTriangleSideRight = 2;

  const gTriangleSides = {
    Bottom: gTriangleSideBottom,
    Left: gTriangleSideLeft,
    Right: gTriangleSideRight,
  };

  // Pipe images:
  // pipe-full-left:
  //      /\
  //     1  2
  //    /   /\
  //   /___0__\
  // pipe-full-right:
  //      /\
  //     1  2
  //    / \  \
  //   /___0__\
  // pipe-half:
  //      /\
  //     1  2
  //    /  i \
  //   /___0__\
  // i = pipe end
  const gPipeHalf = "pipe-half";
  const gPipeFullRight = "pipe-full-right";
  const gPipeFullLeft = "pipe-full-left";

  const gPipeOptions = {
    PipeHalf: gPipeHalf,
    PipeFullRight: gPipeFullRight,
    PipeFullLeft: gPipeFullLeft,
  };

  const gPipeUnpreferredTurnMultiplier = 1;
  const gPipePreferredTurnMultiplier = 3;
  const gPipeEndMultiplier = 2;

  var getRandomZeroToOne =
    genericUtils.createSeededGetZeroToOneRandomFunction(788857700);

  return {
    numPlayers: gNumPlayers,
    terrainTypes: gTerrainTypes,
    itemTypes: gItemTypes,

    otherTerrainItemApperanceHistogram: gOtherTerrainItemApperanceHistogram,
    grassTerrainItemApperanceHistogram: gGrassTerrainItemApperanceHistogram,

    triangleSides: gTriangleSides,
    pipeOptions: gPipeOptions,

    pipeUnpreferredTurnMultiplier: gPipeUnpreferredTurnMultiplier,
    pipePreferredTurnMultiplier: gPipePreferredTurnMultiplier,
    pipeEndMultiplier: gPipeEndMultiplier,

    getRandomZeroToOne: getRandomZeroToOne,
  };
});
