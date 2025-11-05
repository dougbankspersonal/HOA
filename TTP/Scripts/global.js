//----------------------------------------------------------
//
// Imports
//
//----------------------------------------------------------
const tabletopPlaygroundApi = require("@tabletop-playground/api");

//----------------------------------------------------------
//
// Global declarations.
//
//----------------------------------------------------------
var gWorld = tabletopPlaygroundApi.world;
var gNormalCardDeckObjectId = "";
var gHomemadeSnapPoints = [];

//----------------------------------------------------------
//
// Functions.
//
//----------------------------------------------------------
function initHomemadeSnapPoints() {
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      var homemakeSnapPoint = {};
      homemakeSnapPoint.x = -10 + i * 20;
      homemakeSnapPoint.y = -10 + j * 20;
      gHomemadeSnapPoints.push(homemakeSnapPoint);
    }
  }
}

function setupGrabLogic() {}

//----------------------------------------------------------
//
// Actually doing stuff.
//
//----------------------------------------------------------
console.log("global.js hello world!");

initHomemadeSnapPoints();

setupGrabLogic();

/*
const zoneIds = ["myq", "swk", "xhl", "qrj", "pe9"];

var gBidsVisible = false;

// A button that toggles visibility of objects in the given zones.
var gToggleTokenVisibilityButton = new Button().setText("Pending...");

const gButtonRelativeXPos = 0.1;
const gButtonRelativeYPos = 0.1;
const gButtonWidthPx = 100;
const gButtonHeightPx = 30;

var screenUIElement = new ScreenUIElement();
screenUIElement.relativePositionX = true;
screenUIElement.relativePositionY = true;
screenUIElement.relativeWidth = false;
screenUIElement.relativeHeight = false;

screenUIElement.positionX = gButtonRelativeXPos;
screenUIElement.positionY = gButtonRelativeYPos;
screenUIElement.width = gButtonWidthPx;
screenUIElement.height = gButtonHeightPx;
screenUIElement.widget = gToggleTokenVisibilityButton;

console.log("button isEnabled:", gToggleTokenVisibilityButton.isEnabled());
console.log("button isVisible:", gToggleTokenVisibilityButton.isVisible());
console.log("button text:", gToggleTokenVisibilityButton.getText());

world.addScreenUI(screenUIElement);
console.log("Added screenUIElement");

function updateButtonText() {
  console.log("updateButtonText");
  if (gBidsVisible) {
    gToggleTokenVisibilityButton.setText("Hide Bids");
  } else {
    gToggleTokenVisibilityButton.setText("Show Bids");
  }
}

function updateTokenVisibility() {
  console.log("updateTokenVisibility");
  for (var i = 0; i < zoneIds.length; i++) {
    var zone = world.getZoneById(zoneIds[i]);
    if (zone) {
      // Toggle zone property of who can see stuff in zone.
      zone.setObjectVisibility(
        gBidsVisible
          ? tabletopPlaygroundApi.ZonePermission.Everyone
          : tabletopPlaygroundApi.ZonePermission.OwnersOnly
      );
      // Toggle zone property of who can see stuff in zone.
      zone.setObjectInteraction(
        gBidsVisible
          ? tabletopPlaygroundApi.ZonePermission.Everyone
          : tabletopPlaygroundApi.ZonePermission.OwnersOnly
      );
    }
  }
}

gToggleTokenVisibilityButton.onClicked.add((button, player) => {
  console.log("onClicked");
  console.log(player.getName(), "pressed the button to toggle show bids!");
  gBidsVisible = !gBidsVisible;
  updateButtonText();
  updateTokenVisibility();
});

// Are bids visible when we first load?  Check the state of the first zone.
var firstZone = world.getZoneById(zoneIds[0]);
if (firstZone) {
  console.log("Got first zone");
  var objectVisibility = firstZone.getObjectVisibility();
  console.log("objectVisibility =", objectVisibility);
  console.log(
    "tabletopPlaygroundApi.ZonePermission.Everyone =",
    tabletopPlaygroundApi.ZonePermission.Everyone
  );

  console.log(
    "tabletopPlaygroundApi.ZonePermission = ",
    JSON.stringify(tabletopPlaygroundApi.ZonePermission)
  );
  gBidsVisible =
    objectVisibility == tabletopPlaygroundApi.ZonePermission.Everyone;
  console.log("gBidsVisible =", gBidsVisible);
}
updateButtonText();
*/
