/*
Functions for putting together card configs.

See candConfigUtils for description of a cardConfig.
*/

define([
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "dojo/domReady!",
], function (cards, debugLogModule) {
  var debugLog = debugLogModule.debugLog;

  const gTwoOptionCardConfigs = [
    {
      title: "Children's Safety",
      options: [
        {
          subtitle: "A: Protect their bodies!",
          text: "A mower adjacent to any Play Equipment: +1 infraction.",
        },
        {
          subtitle: "B: Protect their minds!",
          text: "A player has more Play Equipment than either his left or right neighbor: +2 infractions.",
        },
      ],
    },
    {
      title: "Sprinkler Management",
      options: [
        {
          subtitle: "A: Sprinklers are Ugly!",
          text: "Each sprinkler with no Item on its sector: +1 infraction.",
        },
        {
          subtitle: "B: Sprinkler Efficiency!",
          text: "Each sprinkler adjacent to non-Grass terrain: +1 infraction.",
        },
      ],
    },
    {
      title: "Pool Rules",
      options: [
        {
          subtitle: "A: Insurance!",
          text: "Each Water sector adjacent to the edge of the tableau: +1 infraction.",
        },
        {
          subtitle: "B: Shapely Pools!",
          text: "Each concave Water Installment: +1 infraction.",
        },
      ],
    },
    {
      title: "Building Rules",
      options: [
        {
          subtitle: "A: Fire Code!",
          text: "2 Building installments touch at a corner: +1 infraction.",
        },
        {
          subtitle: "B: Beautification!",
          text: "Each Building installment without at least 3 adjacent flowers or hedges: +1 infraction.",
        },
      ],
    },
    {
      title: "Lawn Care",
      options: [
        {
          subtitle: "A: Put your Mowers Away!",
          text: "Each Grass sector with more than one Mower: +2 infractions.",
        },
        {
          subtitle: "B: Hoarders!",
          text: "Play Equipment on more than one Grass Installment: +2 infractions.",
        },
      ],
    },
    {
      title: "Neighborhood Watch",
      options: [
        {
          subtitle: "A: Beware Peeping Toms!",
          text: "Any Building sector adjacent to the edge of the tableau: +1 infraction.",
        },
        {
          subtitle: "B: Beware Occult Weirdos!",
          text: "The player(s) with the most Illuminati symbols: +3 infractions.",
        },
      ],
    },
  ];

  function getCardConfigs() {
    return gTwoOptionCardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    getCardConfigs: getCardConfigs,
  };
});
