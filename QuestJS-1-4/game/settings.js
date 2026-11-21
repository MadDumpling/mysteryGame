"use strict"

settings.title = "Mystery Game"
settings.author = "Devon Chow"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"
settings.noTalkTo = false
settings.noAskTell = false

settings.intro = [
  "CHAPTER I",
  "You are Dr. John Watson. It is night in Baker Street, and Sherlock Holmes is pacing the room, hot upon the scent of a new problem.",
  "Holmes has received a mysterious letter from a masked visitor.",
  "CURRENT OBJECTIVE: Talk to Holmes and examine the pink-tinted note. Try: TALK TO HOLMES, EXAMINE NOTE, or TOPICS.",
]

settings.compassPane = false
settings.inventoryPane = [
  {name:'Evidence Held', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return player.name }},
  {name:'Evidence Here', alt:'itemsHere', test:settings.isHere, getLoc:function() { return player.loc }},
]

settings.status = [
  function() { return "<td>Objective:</td><td>" + (game.story && game.story.objective ? game.story.objective : "Explore Baker Street") + "</td>" },
  function() { return "<td>Time:</td><td>" + getCaseTimeline() + "</td>" },
  function() { return "<td>Act:</td><td>" + (game.story.act || 1) + "</td>" },
  function() { return "<td>Holmes trust:</td><td>" + game.story.holmesTrust + "</td>" },
  function() { return "<td>Adler respect:</td><td>" + game.story.adlerRespect + "</td>" },
  function() { return "<td>King favor:</td><td>" + game.story.kingFavor + "</td>" },
  function() { return "<td>Suspicion:</td><td>" + game.story.suspicion + "</td>" },
  function() { return "<td>Clues:</td><td>" + game.story.cluesFound + "</td>" },
]

settings.statusPane = "Case Status"

