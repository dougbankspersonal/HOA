--[[----------------------------------------------

  Globals/constants

  ------------------------------------------------]]
local gTilingDeckTag = "tilingDeck"
local gTilingCardTag = "tilingCard"

-- Normally cards will "group": put them close togehter and they align to form a deck.
-- For a tableau building game this blows.
-- So we do this:
-- 1. Install a UI.  When button is clicked, it toggles whether grouping is allowed.
-- 2. Tag the deck a tilingDeck.
-- 3. When a card leaves a tilingDeck it is marked a tilingCard.
-- 4. If we want to group a tilingCard, and grouping is disallowed, don't group.
local gGroupingAllowed = false

local gFirstCardInJointedClusterByPlayer = {}

-- For now: reg ex to match anything.
local gDebugTagsRE = ".*"

local gPickedUpCardRotationByGuid = {}

local gNameIndex = 0

--[[----------------------------------------------

  Local helper functions

  ------------------------------------------------]]
function debugLog(tag, message)
  if not string.match(tag, gDebugTagsRE) then
    return
  end
  print("DEBUG[" .. tag .. "]: " .. message)
end

function getNextTilingCardName()
  gNameIndex = gNameIndex + 1
  return "TilingCard" .. gNameIndex
end

-- General utility: is this a "tilingCard"?
function isTilingCard(object)
  return object.hasTag(gTilingCardTag) and object.tag == "Card"
end

-- Change the UI button to show whether grouping is allowed or not.
function updateGroupingButtonText()
  if gGroupingAllowed then
    UI.setAttribute("groupingAllowedButton", "text", "Grouping Allowed")
  else
    UI.setAttribute("groupingAllowedButton", "text", "Grouping Disallowed")
  end
end

-- Called from UI xml file: user clicked the bottom to toggle grouping allowed.
function toggleGroupingAllowed(player)
  gGroupingAllowed = not gGroupingAllowed
  debugLog("toggleGroupingAllowed", "Grouping allowed: " .. tostring(gGroupingAllowed))
  updateGroupingButtonText()
end

-- Add a draggable panel with a button to toggle whether tiling cards can group.
function setupUI()
  local xmlTemplate = [[
  <Defaults>
  <Panel class="ButtonPanelClass" height ="70" width = "170" color="#555555" outline="#111111" outlineSize="2 -2" returnToOriginalPositionWhenReleased="false" allowDragging="true" showAnimation="FadeIn" hideAnimation="FadeOut" />
  <Button class="StandardButton" height="50" width="150" color="#aaaaaa"/>
  </Defaults>
  <Panel class="ButtonPanelClass" id="mainPanel" rectAlignment="MiddleCenter" position="-600 400" >
  <Button class="StandardButton" id="groupingAllowedButton" rectAlignment="MiddleCenter"  onClick="toggleGroupingAllowed" text="%f" position="0 0"/>
  </Panel>    ]]

  if gGroupingAllowed then
    xmlTemplate = string.gsub(xmlTemplate, "text=\"%%f\"", "text=\"Grouping Allowed\"")
  else
    xmlTemplate = string.gsub(xmlTemplate, "text=\"%%f\"", "text=\"Grouping Disallowed\"")
  end

  UI.setXml(xmlTemplate)
end

--[[----------------------------------------------

  Called fromm other objects.

  ------------------------------------------------]]
function onTilingCardPickedUp(card)
  debugLog("onTilingCardPickedUp", "called")
  debugLog("onTilingCardPickedUp", "card.getName() = " .. card.getName())
  local rot = card.getRotation()
  debugLog("onTilingCardPickedUp", string.format("card rotation = {%.1f, %.1f, %.1f}", rot.x, rot.y, rot.z))
  -- Remember the card's rotation
  gPickedUpCardRotationByGuid[card.guid] = card.getRotation()
end

function onTilingCardDropped(card)
  debugLog("onTilingCardDropped", "called")
  -- wait a second for them to fall and settle, then clean up the array.
  Wait.time(function()
    debugLog("onTilingCardDropped", "in Wait")
    -- un-remember the card's rotation
    gPickedUpCardRotationByGuid[card.guid] = nil
  end, 1)
end

--[[----------------------------------------------

  API events.

  ------------------------------------------------]]
-- Problems we are trying to fix:
-- 1) When 2 cards get near each other they will "try to enter container": try to group into deck.
-- 2) when you multiselet a group of cards, pickup, and drop,
-- sometimes one or two random cards will wiggle as it is dropped.
--
-- Solution for 1:
-- When card is pulled from deck with tag, add tag to card.
-- When card with tag tries to enter collection, say no.
-- We throw in a global variable and a toggle so we can turn this off to rebuild deck after game.
--
-- Solution for 2:
-- Complications:
-- When you multiselect a group of cards, onObjectPickup is fired on each card ONLY ONCE
-- YOU RELEASE ALL THE CARDS (!?!?!?).
--
-- Strategy:
-- When a tilingCard is created, attach it to a script.
-- That script has "onPickUp", which DOES fire when a group of cards is picked up.
-- Immediately remember object's rotation.
-- As long as it's floating around, keep forcing the rotation.
-- Droppped, start a timer: when timer expires, stop forcing.

-- When a card leaves the tiling deck, mark it as a tiling card.
local gTilingCardScript = [[
  function onPickUp()
    print("onPickup: self = " .. self.guid)
    Global.call("onTilingCardPickedUp", self)
  end

  function onDrop()
    Global.call("onTilingCardDropped", self)
  end
  ]]

function onObjectLeaveContainer(container, object)
  if container.hasTag(gTilingDeckTag) then
    -- This card should not snap.
    debugLog("onObjectLeaveContainer", "Card drawn: " .. object.getName())
    debugLog("onObjectLeaveContainer", "From deck: " .. container.getName())
    object.addTag(gTilingCardTag)

    -- Name it too.
    object.setName(getNextTilingCardName())

    debugLog("onObjectLeaveContainer", "waiting to reload")
    Wait.time(function()
      debugLog("onObjectLeaveContainer", "inside Wait")
      -- Set the object to have a script that runs when object is picked up.
      -- Set the object to have a script that runs when object is picked up.
      object.setLuaScript(gTilingCardScript)
      object.reload()
      debugLog("onObjectLeaveContainer", "reloaded")
    end, 0.5)
  end
end

-- If gGroupingAllowed is false, don't let tiling cards group.
function tryObjectEnterContainer(container, object)
  debugLog("tryObjectEnterContainer", "object trying to enter container")
  debugLog("tryObjectEnterContainer", "container.getName() = " .. container.getName())
  debugLog("tryObjectEnterContainer", "object.getName() = " .. object.getName())
  if gGroupingAllowed then
    return true
  end

  -- Tiling cards can never rejoin a deck.
  if isTilingCard(object) then
    debugLog("tryObjectEnterContainer", "Tiling card can't enter deck")
    return false
  end

  return true
end

-- Make sure any picked up cards still have the right rotation.
function onUpdate()
  for guid, rot in pairs(gPickedUpCardRotationByGuid) do
    local obj = getObjectFromGUID(guid)
    if obj then
      obj.setRotation(rot)
    end
  end
end

-- Create and update the UI.
function onLoad()
  setupUI()
  updateGroupingButtonText()
end
