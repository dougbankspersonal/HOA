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
      textSections: [
        {
          subsections: [
            '"A grove of statues brings a daring Grecian air to any well-tended garden."',
            "+1 point for each shared border between two statue sectors.",
          ],
        },
        {
          subsections: [
            '"Statues in a cluster are the height of shameless ostentation."',
            "-1 point for each shared border between two statue sectors.",
          ],
        },
      ],
    },
    {
      textSections: [
        {
          subsections: [
            '"Sunflowers by a park space brighten any picnic."',
            "+1 point for each scoring sunflower adjacent to a green.",
          ],
        },
        {
          subsections: [
            '"Park access to sunflowers encourages loutish behavior."',
            "+1 point for each scoring sunflower adjacent to a green.",
          ],
        },
      ],
    },
    {
      textSections: [
        {
          subsections: [
            '"The thoughtful gardener has walkways by her marigolds."',
            "+2 points for each scoring marigold with a scoring path through it.",
          ],
        },
        {
          subsections: [
            '"Paths through your marigolds can only lead to tears."',
            "-1 point for each scoring marigold with a scoring path through it.",
          ],
        },
      ],
    },
    {
      textSections: [
        {
          subsections: [
            '"A roses and iris pairs offer an elegant accent."',
            "Non-scoring rose next to non-scoring iris: no penalty for either sector, +3 points.",
          ],
        },
        {
          subsections: [
            '"Well-mannered gardeners would not waste a single rose or iris."',
            "Double penalty for non-scoring roses and irises.",
          ],
        },
      ],
    },
    {
      textSections: [
        {
          subsections: [
            '"Paths into the wilderness invite dauntless exploration."',
            "Double points for scoring paths with at least one end going off the edge of the tableau.",
          ],
        },
        {
          subsections: [
            '"Paths into the wilderness risk our babies being snatched by wolves."',
            "Double points for scoring paths with terminals on both ends.",
          ],
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
