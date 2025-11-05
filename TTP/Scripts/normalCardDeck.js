const { refObject } = require("@tabletop-playground/api");

console.log("This is normalCardDeck.js");

function recursivePrintJsObject(indent, jsObject) {
  console.log('recursivePrintJsObject: indent = "' + indent + '"');
  console.log("recursivePrintJsObject: indent length = " + indent.length);
  for (const key in jsObject) {
    if (jsObject[key] !== undefined) {
      const value = jsObject[key];
      if (typeof value === "object" && value !== null) {
        console.log(`${indent}Key: ${key} (Object)`);
        var newIndent = indent + "..";
        recursivePrintJsObject(newIndent, value);
      } else {
        console.log(`${indent}Key: ${key}, Value: ${value}`);
      }
    }
  }
}

var debugOnGrab = function (object, player) {
  // This thing have snap points?
  var snapPoints = object.getSnapPoints();
  
};

refObject.onGrab.add(debugOnGrab);
