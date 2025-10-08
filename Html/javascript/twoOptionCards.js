define([
  "dojo/dom-class",
  "dojo/dom-style",
  "sharedJavascript/cards",
  "sharedJavascript/debugLog",
  "sharedJavascript/htmlUtils",
  "sharedJavascript/triangleCardUtils",
  "dojo/domReady!",
], function (
  domClass,
  domStyle,
  cards,
  debugLogModule,
  htmlUtils,
  triangleCardUtils
) {
  var debugLog = debugLogModule.debugLog;
  var gCardConfigs = null;

  //-----------------------------------
  //
  // Constants
  //
  //-----------------------------------

  //-----------------------------------
  //
  // Functions
  //
  //-----------------------------------
  function addOptionNode(parentNode, option) {
    var optionNode = htmlUtils.addDiv(parentNode, ["option"], "option");

    if (option.subtitle) {
      var subtitleNode = htmlUtils.addDiv(
        optionNode,
        ["subtitle"],
        "subtitle",
        option.subtitle
      );
    }
    if (option.text) {
      var textNode = htmlUtils.addDiv(
        optionNode,
        ["text"],
        "text",
        option.text
      );
    }

    return optionNode;
  }

  function addCardFront(parentNode, index, classes) {
    debugLog("addCardFront", "index = ", JSON.stringify(index));
    var cardConfig = cards.getCardConfigAtIndex(gCardConfigs, index);
    debugLog("addCardFront", "cardConfig = ", JSON.stringify(cardConfig));

    var finalClasses = classes ? classes.slice() : [];
    finalClasses.push("two-option");

    var cardFrontNode = cards.addCardFront(
      parentNode,
      finalClasses,
      "two-option-" + index
    );

    var frontWrapperNode = htmlUtils.addDiv(
      cardFrontNode,
      ["front-wrapper"],
      "front-wrapper-" + index
    );

    domClass.add(cardFrontNode);

    if (cardConfig.title) {
      var titleNode = htmlUtils.addDiv(
        frontWrapperNode,
        ["title"],
        "title",
        cardConfig.title
      );
    }

    var options = cardConfig.options || [];
    for (var i = 0; i < options.length; i++) {
      addOptionNode(frontWrapperNode, options[i]);
    }

    return cardFrontNode;
  }

  function addCardBack(parent, index, classes) {
    var cardConfig = cards.getCardConfigAtIndex(gCardConfigs, index);

    var finalClasses = classes ? classes.slice() : [];
    finalClasses.push("two-option");

    var cardBackNode = cards.addCardBack(parent, index, {
      classes: finalClasses,
    });

    var cardBackIconNode = htmlUtils.addImage(
      cardBackNode,
      ["two-option-icon"],
      "two-option-icon"
    );

    var cardBackTitleNode = htmlUtils.addDiv(
      cardBackNode,
      ["title"],
      "title",
      "CC&R<br>Proposition"
    );

    return cardBackNode;
  }

  function setCardConfigs(cardConfigs) {
    console.assert(gCardConfigs === null, "setCardConfigs called twice");
    gCardConfigs = cardConfigs;
  }

  // This returned object becomes the defined value of this module
  return {
    addCardFront: addCardFront,
    addCardBack: addCardBack,
    setCardConfigs: setCardConfigs,
  };
});
