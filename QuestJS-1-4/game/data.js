<<<<<<< HEAD
"use strict"

// Shared case state keeps each ending tied to visible player choices.
game.story = {
  act: 1,
  time: 19 * 60,
  holmesTrust: 50,
  adlerRespect: 0,
  kingFavor: 50,
  cluesFound: 0,
  photoLocationKnown: false,
  suspicion: 0,
  rocketThrown: false,
  rocketThrownEarly: false,
  warnedAdler: false,
  fightInterference: false,
  missedSignal: false,
  objective: "Speak with Holmes and examine the mysterious note.",
  noteExamined: false,
  visitorArrived: false,
  kingRevealed: false,
  caseAccepted: false,
  planExplained: false,
  planAccepted: false,
}

game.suspicion = 0
game.observed = false
game.followedNorton = false
game.followedIrene = false
game.weddingWitnessed = false
game.fireStarted = false
game.photoFound = false
game.ending = false

function moveStoryNpc(npc, destination, direction) {
  npc.moveChar(new Exit(destination, {origin:w[npc.loc], dir:direction || "teleport"}))
}

createItem("me", PLAYER(), {
  loc:"Bakerstreet",
  synonyms:['me','myself','watson','doctor'],
  examine:"You are Dr. Watson, recently returned to Baker Street.",
})

createRoom("Bakerstreet", {
  alias:"Baker Street",
  desc:"Holmes' rooms are brilliantly lit. His armchair, cigar case, gasogene and pink-tinted note wait beside the fire.",
  north:new Exit("SerpentineAvenue"), east:new Exit("TheTemple"),
  scenery:[
    {alias:"fire", examine:"The fire burns low. Holmes prefers a room that encourages thought, not comfort."},
    {alias:"bookshelves", examine:"A Continental Gazetteer and Holmes' formidable index occupy pride of place."},
  ],
  bg:"assets/images/bakerstreet.jpg"
})
createRoom("SerpentineAvenue", {
  alias:"Serpentine Avenue",
  desc:"A quiet avenue fronts Briony Lodge. A busy mews runs along one wall, and every passer-by knows Irene Adler's name.",
  south:new Exit("Bakerstreet"), east:new Exit("BrionyLodge"), north:new Exit("TheMews"),
  scenery:[
    {alias:"street lamps", examine:"The lamps are being lit. Their glow will make a good distraction later."},
    {alias:"garden wall", examine:"The wall separates the lodge from the mews. A coach-house roof almost reaches a side window."},
  ],
})
createRoom("BrionyLodge", {
  alias:"Briony Lodge",
  desc:"Irene Adler's bijou villa is neat, guarded, and deceptively ordinary. The sitting-room windows reach almost to the floor.",
  west:new Exit("SerpentineAvenue"),
  scenery:[
    {alias:"bell-pull", examine:"The bell-pull hangs beside a sliding panel. The recess above it is just large enough for a cabinet photograph."},
    {alias:"sitting-room windows", examine:"A child could open the old-fashioned fasteners. Holmes has noticed that already."},
    {alias:"coach-house", examine:"From its roof the passage window might be reached, though climbing it would be conspicuous."},
  ],
})
createRoom("TheMews", {
  alias:"The Mews",
  desc:"Horse boxes, harness, and gossip fill the mews. The ostlers know every carriage from the avenue.",
  south:new Exit("SerpentineAvenue"),
  scenery:[
    {alias:"horses", examine:"Fine animals, restless before the evening drive."},
    {alias:"harness", examine:"Several sets are warm from use. One carriage has been prepared in unusual haste."},
    {alias:"mews gate", examine:"It opens onto the avenue and gives a clear view of Briony Lodge."},
  ],
})
createRoom("StMonicasChurch", {
  alias:"St. Monica's Church",
  desc:"St. Monica's is empty except for a surpliced clergyman and hurried footsteps near the altar.",
  west:new Exit("TheTemple"),
  scenery:[
    {alias:"altar", examine:"A wedding can be performed here quickly, provided a witness is found."},
    {alias:"vestry", examine:"The vestry door stands ajar. Someone has been searching for a marriage licence."},
    {alias:"church bell", examine:"It has not yet sounded noon."},
  ],
})
createRoom("TheTemple", {
  alias:"The Temple",
  desc:"The Temple's chambers are busy with clerks and legal business. Godfrey Norton's chambers are somewhere within the maze.",
  west:new Exit("Bakerstreet"), south:new Exit("StMonicasChurch"),
  scenery:[
    {alias:"law books", examine:"Cases on marriage, privacy and defamation crowd the shelves."},
    {alias:"brass plates", examine:"Norton, G. is engraved on one of them."},
    {alias:"courtyard", examine:"A convenient shortcut toward the church."},
  ],
})

createItem("holmes", NPC(false), {
  loc:"Bakerstreet", alias:"Sherlock Holmes", properName:true,
  examine:"Holmes stands before the fire, looking you over in his singular introspective fashion.",
  talkto:function() {
    if (!game.story.noteExamined) {
      msg("Holmes turns toward the pink-tinted note. \"Read it aloud, Watson.\"")
    }
    else if (!game.story.visitorArrived) {
      msg("Holmes glances toward the stairs. \"He is due at a quarter to eight. Sit down and give us your best attention.\"")
    }
    else if (!game.story.caseAccepted) {
      msg("Holmes closes his eyes. \"You may say before this gentleman anything which you may say to me. You may also say simply: ACCEPT CASE.\"")
    }
    else if (!game.story.planExplained) {
      msg("Holmes has changed into a groom. \"The photograph is cabinet size. It must be in Miss Adler's house, where she can lay her hands upon it.\"")
    }
    else {
      msg("Holmes folds his hands. \"We must be at Briony Lodge by seven. You are to remain neutral, watch me, and throw the smoke-rocket on my signal.\"")
    }
    return world.SUCCESS
  },
  canTalk:true,
  askOptions:[
    {name:"case", msg:"\"It is a capital mistake to theorize before one has data. After you hear the King, type ACCEPT CASE to begin the investigation.\""},
    {name:"deduction", msg:"\"You see, but you do not observe. Your left shoe is scored by the mud you scraped away, and iodoform tells me you are in practice again.\""},
    {name:"letter", test:function() { return game.story.noteExamined }, msg:"\"The writer is German, Bohemian, and wealthy. The words are peculiar; the masked visitor will resolve our doubts.\""},
    {name:"king", test:function() { return game.story.kingRevealed }, msg:"\"Your Majesty had not spoken before I knew whom I addressed. Wilhelm Gottsreich Sigismond von Ormstein, hereditary King of Bohemia.\""},
    {name:"photograph", test:function() { return game.story.caseAccepted }, msg:function() { return game.photoFound ? "\"The photograph is secured. A rare victory for preparation.\"" : "\"It is cabinet size, Watson. Too large for a dress, too important to entrust to a third party. It must be in Miss Adler's own house.\"" }},
    {name:"plan", test:function() { return game.story.planExplained }, msg:"\"You are to station yourself near the sitting-room window. Watch me, and when I raise my hand, throw the rocket and cry 'Fire!'\""},
  ],
  tellOptions:[
    {name:"deduction", test:function() { return game.story.noteExamined }, msg:"Holmes nods. \"A Continental deduction: Bohemian paper, a German sentence, and a visitor who conceals his face.\""},
    {name:"observed schedule", test:function() { return game.observed }, msg:"Holmes nods. \"Miss Adler drives at five and returns at seven. Observation gives us the hour; deduction gives us the place.\""},
    {name:"wedding", test:function() { return game.weddingWitnessed }, msg:"\"Norton is now her husband. That changes the photograph from a weapon into insurance.\""},
  ],
  deduce:function(item) {
    const deductions = {
      pink_note:"Bohemian paper, German phrasing, and a visitor who prefers a mask. Our client is wealthy and frightened.",
      boot_marks:"London mud, a careless servant, and a medical man who has recently been out in vile weather.",
      mews_gossip:"Irene drives at five and returns at seven. Norton visits once or twice each day.",
      wedding_token:"Norton and Adler married at noon. Their sudden alliance may be a shield against royal pressure.",
      cabinet_frame:"A cabinet photograph cannot be carried discreetly. It must be hidden where Irene can reach it instantly.",
    }
    if (!deductions[item.name]) return "Holmes turns the object over. \"Interesting, but not yet a lead.\""
    game.deductions = (game.deductions || 0) + 1
    game.story.cluesFound++
    if (item.name === "cabinet_frame") game.story.photoLocationKnown = true
    supportHolmes(5)
    return "Holmes deduces: " + deductions[item.name]
  },
  movingMsg:function(exit) { msg("Holmes strides " + exit.dir + ", hands clasped behind him.") },
  agenda:["caseClock:20:0", "msg:There is the sharp sound of horses' hoofs in the street.", "caseClock:20:15", "msg:Holmes opens the door. \"I am lost without my Boswell. Sit down and give us your best attention.\""]
})

createItem("irene", NPC(true), {
  loc:"BrionyLodge", alias:"Irene Adler", properName:true,
  examine:"Irene Adler has the face of the most beautiful of women and the mind of the most resolute of men.",
  talkto:function() { addSuspicion(1); msg("Irene smiles without warmth. \"You are a friend of Mr. Holmes, I presume?\""); return world.SUCCESS },
  askOptions:[
    {name:"schedule", msg:"Irene's eyes sharpen. \"A woman may drive when she pleases, Doctor.\"", script:function() { addSuspicion(1) }},
    {name:"norton", msg:"\"Mr. Norton is a gentleman and my counsel.\" Her hand closes over a small key."},
  ],
  tellOptions:[
    {name:"holmes", msg:"Irene becomes watchful. \"Mr. Holmes is very clever, but he has met his match in me.\"", script:function() { addSuspicion(5) }},
  ],
  reactions:[{trigger:function() { return game.suspicion >= 3 }, script:function() { msg("Irene has begun to suspect that Baker Street is watching her."); return {name:"irene_suspicious"} }}],
  agenda:["caseClock:17:0", "moveTo:SerpentineAvenue", "msg:Irene leaves Briony Lodge for her five o'clock drive.", "caseClock:19:0", "moveTo:BrionyLodge", "msg:Irene returns at seven, alert and composed."],
})
createItem("king", NPC(false), {
  loc:"Bakerstreet", alias:"King of Bohemia", properName:true,
  examine:"A giant of a man in a blue cloak, carrying himself with the anxious dignity of a king in disguise.",
  talkto:function() {
    game.kingMet = true
    game.story.visitorArrived = true
    game.story.kingRevealed = true
    game.story.cluesFound++
    game.story.objective = "Accept the mission: use ACCEPT CASE or decline it with DECLINE CASE."
    msg("The masked visitor tears off his disguise. \"I am the King. Why should I attempt to conceal it? Five years ago I met Irene Adler. She possesses a compromising photograph. Accept the case, Watson.\"")
    return world.SUCCESS
  },
  askOptions:[
    {name:"identity", msg:"\"Wilhelm Gottsreich Sigismond von Ormstein, Grand Duke of Cassel-Felstein, and hereditary King of Bohemia.\""},
    {name:"adler", script:function() { game.story.kingRevealed = true; game.story.cluesFound++; supportKing(5); game.story.objective = "Accept the mission or decline it by speaking to Holmes." }, msg:"The King explains: \"Some five years ago, I made the acquaintance of Irene Adler. She possesses a photograph that could ruin my approaching marriage.\""},
    {name:"photograph", msg:"\"It is a cabinet photograph. We have tried to buy it, steal it, and search for it. She will not sell.\""},
    {name:"mission", script:function() { game.story.kingFavor += 5 }, msg:"\"Recover the photograph before Monday. Your Majesty shall pay anything.\""},
    {name:"money", msg:"The King produces a chamois bag. \"There are three hundred pounds in gold and seven hundred in notes.\""},
  ],
  tellOptions:[
    {name:"adler", msg:"The King grips his cloak. \"Miss Adler is both the victim and keeper of a dangerous secret.\""},
  ],
  agenda:["caseClock:20:0", "msg:The masked visitor removes his disguise. \"I am the King. Why conceal it?\""]
})
createItem("godfrey", NPC(false), {
  loc:"TheTemple", alias:"Godfrey Norton", properName:true,
  examine:"A dark, handsome lawyer with an aquiline nose and the air of a man always late.",
  talkto:function() {
    if (game.followedNorton) msg("Norton grips your hand. \"You witnessed the wedding; you understand why we must leave.\"")
    else msg("Norton glances at his watch. \"I have no time to spare.\"")
    return world.SUCCESS
  },
  askOptions:[
    {name:"wedding", msg:"\"Drive to St. Monica's Church!\" Norton checks his watch. \"Only three minutes remain before the licence becomes useless.\""},
  ],
  tellOptions:[
    {name:"photograph", test:function() { return game.photoFound }, msg:"Norton nods grimly. \"We have safeguarded what matters most.\""},
  ],
})
createItem("ostler", NPC(false), {
  loc:"TheMews", alias:"ostler", properName:true,
  examine:"The ostler knows every carriage, horse, and gossip of the Serpentine mews.",
  talkto:"The ostler accepts a coin. \"Miss Adler drives out at five and returns sharp at seven. The lawyer calls daily.\"",
  askOptions:[
    {name:"adler", msg:"\"Miss Adler has all the young men turning their heads. She drives at five and returns at seven.\""},
    {name:"norton", msg:"\"Mr. Godfrey Norton visits the Temple, but he calls on Miss Adler once or twice each day.\""},
  ],
  tellOptions:[
    {name:"briony lodge", msg:"The ostler points toward the garden wall. \"The coach-house and the sitting-room window are only across the lane.\""},
  ],
})
createItem("clergyman", NPC(false), {
  loc:"StMonicasChurch", alias:"clergyman", properName:true,
  examine:"The surpliced clergyman looks flustered by a complication in the marriage licence.",
  talkto:"The clergyman sighs. \"A marriage licence had some informality. We still require a witness.\"",
  askOptions:[
    {name:"wedding", msg:"\"The ceremony requires a witness. It must be done at once, or it will not be legal.\""},
  ],
  tellOptions:[
    {name:"godfrey norton", msg:"The clergyman nods toward the waiting bridegroom. \"Mr. Norton has been in great haste.\""},
  ],
})
createItem("cabman", NPC(false), {
  loc:"SerpentineAvenue", alias:"cabman", properName:true,
  examine:"The cabman watches the street and has likely driven most of the people involved in the case.",
  talkto:"The cabman grins. \"A half-sovereign gets a man to the church in twenty minutes.\"",
  askOptions:[
    {name:"norton", msg:"\"Godfrey Norton? Fastest fare I ever had: first to Regent Street, then St. Monica's.\""},
    {name:"adler", msg:"\"A neat landau brought Miss Adler to Briony Lodge each evening.\""},
  ],
  tellOptions:[
    {name:"church", msg:"The cabman points west. \"St. Monica's is twenty minutes away at a decent pace.\""},
  ],
})

createItem("pink_note", TAKEABLE(), {
  loc:"Bakerstreet", alias:"pink-tinted note",
  examine:function() {
    if (!game.story.noteExamined) {
      game.story.noteExamined = true
      game.story.cluesFound++
      game.story.visitorArrived = getCaseMinutes() >= 19 * 60 + 45
      game.story.objective = "Ask Holmes about the letter, then wait for the masked visitor."
      msg("You read: 'There will call upon you to-night, at a quarter to eight o'clock, a gentleman who desires to consult you upon a matter of the very deepest moment.' The paper bears 'Egria' and a German maker's mark. Holmes says, 'It is in a German-speaking country—in Bohemia.'")
    }
    else {
      msg("Bohemian paper carries a German maker's mark. The visitor is due at a quarter to eight.")
    }
    return world.SUCCESS
  },
})

new Cmd('AcceptCase', {
  regex:/^(accept|take) (the )?(case|mission)$/,
  script:function() {
    if (!game.story.kingRevealed) return failedmsg("Ask the King about Adler and the photograph before accepting the mission.")
    game.story.caseAccepted = true
    game.story.planExplained = true
    game.story.kingFavor += 10
    supportHolmes(10)
    game.story.act = 2
    game.story.objective = "Investigate: go north to The Mews and speak with the ostler, then OBSERVE BRIONY LODGE."
    msg("Holmes accepts the commission. 'We have three days, Watson, and one photograph to find.'")
    msg("He explains the plan: \"Visit the mews, discover the habits of Miss Adler and Mr. Norton, then observe Briony Lodge.\"")
    completeAct1Objective()
    advanceTime(780)
    return world.SUCCESS
  },
})

new Cmd('DeclineCase', {
  regex:/^(decline|refuse) (the )?(case|mission)$/,
  script:function() {
    if (!game.story.kingRevealed) return failedmsg("You do not yet know enough to refuse the mission.")
    game.story.caseAccepted = false
    game.story.act = 1
    game.story.kingFavor -= 20
    supportHolmes(-15)
    game.story.objective = "The case remains unresolved. Speak to Holmes to reconsider."
    msg("The timeline settles into an uneasy alternate route: Watson declines active interference, Holmes expresses disappointment, and nothing further is arranged.")
    return world.SUCCESS
  },
})

new Cmd('StoryObjective', {
  regex:/^(objective|current objective|what now|what should i do)(\?)?$/,
  script:function() {
    msg("CURRENT OBJECTIVE: " + game.story.objective)
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})
new Cmd('ShowHolmes', {
  regex:/^(?:show|give) (.+) to holmes$/,
  objects:[{scope:parser.isHeld}],
  script:function(objects) { const item = objects[0][0]; msg("You present " + item.alias + " to Holmes."); msg(w.holmes.deduce(item)); return world.SUCCESS },
})
new Cmd('ObserveIrene', {
  regex:/^(observe|watch) (irene|adler|the lodge|briony lodge)$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue" && player.loc !== "TheMews") return failedmsg("You need a discreet vantage near Briony Lodge.")
    game.observed = true
    game.story.cluesFound++
    addSuspicion(-1)
    advanceTime(10)
    game.story.act = getCaseMinutes() >= 12 * 60 ? 3 : 2
    msg("You observe rather than intrude: " + getCasePeriod() + " at " + formatCaseTime() + "; Irene leaves at five, returns at seven, and keeps the sitting-room close at hand.")
    return world.SUCCESS
  },
})
new Cmd('FollowNorton', {
  regex:/^follow norton$/,
  script:function() {
    if (!w.godfrey.isHere()) return failedmsg("Norton is not here to follow.")
    game.followedNorton = true
    advanceTime(15)
    moveStoryNpc(w.godfrey, "StMonicasChurch", "south")
    player.loc = "StMonicasChurch"
    game.weddingWitnessed = true
    game.story.cluesFound++
    supportHolmes(10)
    msg("At " + formatCaseTime() + ", you follow Norton to St. Monica's, arriving just in time to serve as witness.")
    return world.SUCCESS
  },
})
new Cmd('FollowIrene', {
  regex:/^follow irene$/,
  script:function() {
    if (!game.observed || !w.irene.isHere()) return failedmsg("You have not established Irene's route, or she is not here.")
    game.followedIrene = true
    game.story.missedSignal = true
    addSuspicion(10)
    advanceTime(5)
    msg("You follow Irene too closely. She notices the interest and changes her plans.")
    return world.SUCCESS
  },
})
new Cmd('StartFire', {
  regex:/^(start|raise) fire$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue" || game.fireStarted) return failedmsg("The timing or position is wrong.")

    game.fireStarted = true
    game.story.rocketThrown = true
    advanceTime(5)

    const outcome = determineFireSceneOutcome()

    if (outcome === "ADLER_ESCAPES") {
      msg("At " + formatCaseTime() + " Irene is already gone. Watson's warning has given her time to escape.")
      game.ending = "betrayal"
    }
    else if (outcome === "BURGLARY_ROUTE") {
      addSuspicion(10)
      msg("At " + formatCaseTime() + " Holmes is alone at the signal. The lost window of opportunity begins a burglary route.")
      game.ending = "burglary"
    }
    else if (outcome === "COUNTER_SURVEILLANCE") {
      addSuspicion(25)
      msg("The rocket is raised too soon. Irene notices the discrepancy and summons counter-surveillance.")
      game.ending = "counter_surveillance"
    }
    else if (outcome === "POLICE_ROUTE") {
      addSuspicion(15)
      msg("The struggle draws a crowd and then the police. Holmes loses control of the scene.")
      game.ending = "police"
    }
    else {
      if (game.story.suspicion >= 50) {
        addSuspicion(10)
        msg("Your cry comes too early: Irene has become suspicious and secured the photograph.")
        game.ending = "compromised"
      }
      else if (game.followedIrene) {
        msg("Irene expected the ruse. She leaves the photograph behind as a challenge and disappears.")
        game.photoFound = true
        game.ending = "alliance"
      }
      else {
        msg("At " + formatCaseTime() + " and Holmes's signal, you cry \"Fire!\" Smoke floods the sitting-room. Irene reaches for the hidden photograph, revealing the recess above the bell-pull.")
        game.story.photoLocationKnown = true
        game.story.holmesTrust = Math.min(100, game.story.holmesTrust + 15)
      }
    }
    return world.SUCCESS
  },
})
new Cmd('TakePhotograph', {
  regex:/^(take|get|retrieve) (the )?(photograph|photo)$/,
  objects:[{item:'photograph'}],
  script:function(objects) {
    if (!game.fireStarted || game.ending === "compromised") return failedmsg("You have not yet forced the hiding place into view.")
    const photograph = objects[0][0]
    photograph.hidden = false; photograph.moveToFrom({char:player, item:photograph}, player); game.photoFound = true; game.ending = "success"
    msg("You recover the photograph before Irene can flee. The King's crisis is over"); return world.SUCCESS
  },
})

const originalEnterRoom = world.enterRoom;

world.enterRoom = function(exit) {
  const room = w[player.loc];

  if (room.bg) {
    document.body.style.backgroundImage = `url('${room.bg}')`;
  }

  originalEnterRoom.call(world, exit);
};

=======
"use strict"

// Shared case state keeps each ending tied to visible player choices.
game.story = {
  act: 1,
  day: 1,
  time: 19 * 60,
  holmesTrust: 50,
  adlerRespect: 0,
  kingFavor: 50,
  cluesFound: 0,
  photoLocationKnown: false,
  suspicion: 0,
  rocketThrown: false,
  rocketThrownEarly: false,
  warnedAdler: false,
  fightInterference: false,
  missedSignal: false,
  operationStarted: false,
  holmesSignal: false,
  objective: "Speak with Holmes and examine the mysterious note.",
  noteExamined: false,
  visitorArrived: false,
  kingRevealed: false,
  caseAccepted: false,
  planExplained: false,
  planAccepted: false,
}

game.observed = false
game.followedNorton = false
game.followedIrene = false
game.weddingWitnessed = false
game.fireStarted = false
game.ending = false

function moveStoryNpc(npc, destination, direction) {
  npc.moveChar(new Exit(destination, {origin:w[npc.loc], dir:direction || "teleport"}))
}

createItem("me", PLAYER(), {
  loc:"Bakerstreet",
  synonyms:['me','myself','watson','doctor'],
  examine:"You are Dr. Watson, recently returned to Baker Street.",
})

createRoom("Bakerstreet", {
  alias:"Baker Street",
  desc:"Holmes' rooms are brilliantly lit. His armchair, cigar case, gasogene and pink-tinted note wait beside the fire.",
  north:new Exit("SerpentineAvenue"), east:new Exit("TheTemple"),
  scenery:[
    {alias:"fire", examine:"The fire burns low. Holmes prefers a room that encourages thought, not comfort."},
    {alias:"bookshelves", examine:"A Continental Gazetteer and Holmes' formidable index occupy pride of place."},
  ],
  bg:"assets/images/bakerstreet.jpg"
})
createRoom("SerpentineAvenue", {
  alias:"Serpentine Avenue",
  desc:"A quiet avenue fronts Briony Lodge. A busy mews runs along one wall, and every passer-by knows Irene Adler's name.",
  south:new Exit("Bakerstreet"), east:new Exit("BrionyLodge"), north:new Exit("TheMews"),
  scenery:[
    {alias:"street lamps", examine:"The lamps are being lit. Their glow will make a good distraction later."},
    {alias:"garden wall", examine:"The wall separates the lodge from the mews. A coach-house roof almost reaches a side window."},
  ],
})
createRoom("BrionyLodge", {
  alias:"Briony Lodge",
  desc:"Irene Adler's bijou villa is neat, guarded, and deceptively ordinary. The sitting-room windows reach almost to the floor.",
  west:new Exit("SerpentineAvenue"),
  scenery:[
    {alias:"bell-pull", examine:"The bell-pull hangs beside a sliding panel. The recess above it is just large enough for a cabinet photograph."},
    {alias:"sitting-room windows", examine:"A child could open the old-fashioned fasteners. Holmes has noticed that already."},
    {alias:"coach-house", examine:"From its roof the passage window might be reached, though climbing it would be conspicuous."},
  ],
})
createRoom("TheMews", {
  alias:"The Mews",
  desc:"Horse boxes, harness, and gossip fill the mews. The ostlers know every carriage from the avenue.",
  south:new Exit("SerpentineAvenue"),
  scenery:[
    {alias:"horses", examine:"Fine animals, restless before the evening drive."},
    {alias:"harness", examine:"Several sets are warm from use. One carriage has been prepared in unusual haste."},
    {alias:"mews gate", examine:"It opens onto the avenue and gives a clear view of Briony Lodge."},
  ],
})
createRoom("StMonicasChurch", {
  alias:"St. Monica's Church",
  desc:"St. Monica's is empty except for a surpliced clergyman and hurried footsteps near the altar.",
  west:new Exit("TheTemple"),
  scenery:[
    {alias:"altar", examine:"A wedding can be performed here quickly, provided a witness is found."},
    {alias:"vestry", examine:"The vestry door stands ajar. Someone has been searching for a marriage licence."},
    {alias:"church bell", examine:"It has not yet sounded noon."},
  ],
})
createRoom("TheTemple", {
  alias:"The Temple",
  desc:"The Temple's chambers are busy with clerks and legal business. Godfrey Norton's chambers are somewhere within the maze.",
  west:new Exit("Bakerstreet"), south:new Exit("StMonicasChurch"),
  scenery:[
    {alias:"law books", examine:"Cases on marriage, privacy and defamation crowd the shelves."},
    {alias:"brass plates", examine:"Norton, G. is engraved on one of them."},
    {alias:"courtyard", examine:"A convenient shortcut toward the church."},
  ],
})

createItem("holmes", NPC(false), {
  loc:"Bakerstreet", alias:"Sherlock Holmes", properName:true,
  examine:"Holmes stands before the fire, looking you over in his singular introspective fashion.",
  talkto:function() {
    if (!game.story.noteExamined) {
      msg("Holmes turns toward the pink-tinted note. \"Read it aloud, Watson.\"")
    }
    else if (!game.story.visitorArrived) {
      msg("Holmes glances toward the stairs. \"He is due at a quarter to eight. Sit down and give us your best attention.\"")
    }
    else if (!game.story.caseAccepted) {
      msg("Holmes closes his eyes. \"You may say before this gentleman anything which you may say to me.\"")
    }
    else if (!game.story.planExplained) {
      msg("Holmes has changed into a groom. \"The photograph is cabinet size. It must be in Miss Adler's house, where she can lay her hands upon it.\"")
    }
    else {
      msg("Holmes folds his hands. \"We must be at Briony Lodge by seven. You are to remain near the sitting-room window and throw the smoke-rocket on my signal.\"")
    }
    return world.SUCCESS
  },
  canTalk:true,
  askOptions:[
    {name:"case", regex:/^case$/i, msg:"\"It is a capital mistake to theorize before one has data. First, tell me what you observe.\""},
    {name:"deduction", regex:/^deduction$/i, msg:"\"You see, but you do not observe. Your left shoe is scored by the mud you scraped away, and iodoform tells me you are in practice again.\""},
    {name:"letter", regex:/^letter$/i, test:function() { return game.story.noteExamined }, msg:"\"The writer is German, Bohemian, and wealthy. The words are peculiar; the masked visitor will resolve our doubts.\""},
    {name:"king", regex:/^king$/i, test:function() { return game.story.kingRevealed }, msg:"\"Your Majesty had not spoken before I knew whom I addressed. Wilhelm Gottsreich Sigismond von Ormstein, hereditary King of Bohemia.\""},
    {name:"photograph", regex:/^photograph$/i, test:function() { return game.story.caseAccepted }, msg:function() { return game.story.photoLocationKnown ? "\"The photograph's hiding place is known. A rare victory for preparation.\"" : "\"It is cabinet size, Watson. Too large for a dress, too important to entrust to a third party. It must be in Miss Adler's own house.\"" }},
    {name:"plan", regex:/^plan$/i, test:function() { return game.story.planExplained }, msg:"\"You are to station yourself near the sitting-room window. Watch me, and when I raise my hand, throw the rocket and cry 'Fire!'\""},
  ],
  tellOptions:[
    {name:"deduction", regex:/^deduction$/i, test:function() { return game.story.noteExamined }, msg:"Holmes nods. \"A Continental deduction: Bohemian paper, a German sentence, and a visitor who conceals his face.\""},
    {name:"observed schedule", regex:/^observed schedule$/i, test:function() { return game.observed }, msg:"Holmes nods. \"Miss Adler drives at five and returns at seven. Observation gives us the hour; deduction gives us the place.\""},
    {name:"wedding", regex:/^wedding$/i, test:function() { return game.weddingWitnessed }, msg:"\"Norton is now her husband. That changes the photograph from a weapon into insurance.\""},
  ],
  deduce:function(item) {
    const deductions = {
      pink_note:"Bohemian paper, German phrasing, and a visitor who prefers a mask. Our client is wealthy and frightened.",
      boot_marks:"London mud, a careless servant, and a medical man who has recently been out in vile weather.",
      mews_gossip:"Irene drives at five and returns at seven. Norton visits once or twice each day.",
      wedding_token:"Norton and Adler married at noon. Their sudden alliance may be a shield against royal pressure.",
      cabinet_frame:"A cabinet photograph cannot be carried discreetly. It must be hidden where Irene can reach it instantly.",
    }
    if (!deductions[item.name]) return "Holmes turns the object over. \"Interesting, but not yet a lead.\""
    game.deductions = (game.deductions || 0) + 1
    game.story.cluesFound++
    if (item.name === "cabinet_frame") game.story.photoLocationKnown = true
    supportHolmes(5)
    return "Holmes deduces: " + deductions[item.name]
  },
  movingMsg:function(exit) { msg("Holmes strides " + exit.dir + ", hands clasped behind him.") },
  agenda:["caseClock:20:0", "msg:There is the sharp sound of horses' hoofs in the street.", "caseClock:20:15", "msg:Holmes opens the door. \"I am lost without my Boswell. Sit down and give us your best attention.\""]
})

createItem("irene", NPC(true), {
  loc:"BrionyLodge", alias:"Irene Adler", properName:true,
  examine:"Irene Adler has the face of the most beautiful of women and the mind of the most resolute of men.",
  talkto:function() { addSuspicion(1); msg("Irene smiles without warmth. \"You are a friend of Mr. Holmes, I presume?\""); return world.SUCCESS },
  askOptions:[
    {name:"schedule", regex:/^schedule$/i, msg:"Irene's eyes sharpen. \"A woman may drive when she pleases, Doctor.\"", script:function() { addSuspicion(1) }},
    {name:"norton", regex:/^norton$/i, msg:"\"Mr. Norton is a gentleman and my counsel.\" Her hand closes over a small key."},
  ],
  reactions:[{trigger:function() { return game.story.suspicion >= 3 }, script:function() { msg("Irene has begun to suspect that Baker Street is watching her."); return {name:"irene_suspicious"} }}],
  agenda:["caseClock:17:0", "moveTo:SerpentineAvenue", "msg:Irene leaves Briony Lodge for her five o'clock drive.", "caseClock:19:0", "moveTo:BrionyLodge", "msg:Irene returns at seven, alert and composed."],
})
createItem("king", NPC(false), {
  loc:"Bakerstreet", alias:"King of Bohemia", properName:true,
  examine:"A giant of a man in a blue cloak, carrying himself with the anxious dignity of a king in disguise.",
  talkto:function() {
    game.kingMet = true
    game.story.visitorArrived = true
    game.story.objective = "Ask the King about Irene Adler and accept the case."
    msg("The masked visitor tears off his disguise. \"I am the King. Why should I attempt to conceal it?\"")
    return world.SUCCESS
  },
  askOptions:[
    {name:"identity", regex:/^identity$/i, msg:"\"Wilhelm Gottsreich Sigismond von Ormstein, Grand Duke of Cassel-Felstein, and hereditary King of Bohemia.\""},
    {name:"adler", regex:/^(adler|irene)$/i, script:function() { game.story.kingRevealed = true; game.story.cluesFound++; supportKing(5); game.story.objective = "Accept the mission or decline it by speaking to Holmes." }, msg:"The King explains: \"Some five years ago, I made the acquaintance of Irene Adler. She possesses a photograph that could ruin my approaching marriage.\""},
    {name:"photograph", regex:/^(photograph|photo)$/i, msg:"\"It is a cabinet photograph. We have tried to buy it, steal it, and search for it. She will not sell.\""},
    {name:"mission", regex:/^mission$/i, script:function() { game.story.kingFavor += 5 }, msg:"\"Recover the photograph before Monday. Your Majesty shall pay anything.\""},
    {name:"money", regex:/^money$/i, msg:"The King produces a chamois bag. \"There are three hundred pounds in gold and seven hundred in notes.\""},
  ],
  agenda:["caseClock:20:0", "msg:The masked visitor removes his disguise. \"I am the King. Why conceal it?\""]
})
createItem("godfrey", NPC(false), {
  loc:"TheTemple", alias:"Godfrey Norton", properName:true,
  examine:"A dark, handsome lawyer with an aquiline nose and the air of a man always late.",
  talkto:function() {
    if (game.followedNorton) {
      msg("Norton grips your hand. \"You witnessed the wedding; you understand why we must leave.\"")
    }
    else {
      msg("Norton glances at his watch. \"I have no time to spare.\"")
    }
    return world.SUCCESS
  },
  agenda:["caseClock:11:30", "jumpTo:BrionyLodge", "msg:Godfrey Norton arrives at Briony Lodge in a hansom cab.", "wait:1", "caseClock:11:45", "jumpTo:StMonicasChurch", "msg:Norton shouts for a cab to St. Monica's Church."],
})
createItem("ostler", NPC(false), {loc:"TheMews", alias:"ostler", talkto:"The ostler accepts a coin. \"Miss Adler drives out at five and returns sharp at seven. The lawyer calls daily.\""})
createItem("clergyman", NPC(false), {loc:"StMonicasChurch", alias:"clergyman", talkto:"The clergyman sighs. \"A marriage licence had some informality. We still require a witness.\""})
createItem("cabman", NPC(false), {loc:"SerpentineAvenue", alias:"cabman", talkto:"The cabman grins. \"A half-sovereign gets a man to the church in twenty minutes.\""})

createItem("pink_note", TAKEABLE(), {
  loc:"Bakerstreet", alias:"pink-tinted note",
  examine:function() {
    if (!game.story.noteExamined) {
      game.story.noteExamined = true
      game.story.cluesFound++
      game.story.visitorArrived = getCaseMinutes() >= 19 * 60 + 45
      game.story.objective = "Ask Holmes about the letter, then wait for the masked visitor."
      return "You read: 'There will call upon you to-night, at a quarter to eight o'clock, a gentleman who desires to consult you upon a matter of the very deepest moment.' The paper bears 'Egria' and a German maker's mark. Holmes says, 'It is in a German-speaking country—in Bohemia.'"
    }
    return "Bohemian paper carries a German maker's mark. The visitor is due at a quarter to eight."
  },
})

new Cmd('AcceptCase', {
  regex:/^(?:accept|take) (?:the )?(?:case|mission)$/,
  script:function() {
    if (!game.story.kingRevealed) return failedmsg("Ask the King about Adler and the photograph before accepting the mission.")
    game.story.caseAccepted = true
    game.story.kingFavor += 10
    supportHolmes(10)
    game.story.act = 2
    advanceToNextDay(8, 0)
    game.story.objective = "Investigate the mews, observe Briony Lodge, and follow Norton or Irene."
    msg("Holmes accepts the commission. 'Call at three o'clock if you need me; we begin now.' The case advances to Day " + game.story.day + " at " + formatCaseTime() + ".")
    completeAct1Objective()
    return world.SUCCESS
  },
})

new Cmd('AcceptPlan', {
  regex:/^(?:accept|take|follow) (?:holmes'?s |the )?(?:plan|instructions)$/,
  script:function() {
    if (!game.story.caseAccepted) return failedmsg("You cannot accept an operation that has not been arranged.")
    game.story.planExplained = true
    game.story.planAccepted = true
    supportHolmes(10)
    game.story.operationStarted = true
    game.story.holmesSignal = false
    game.story.objective = "Wait near the sitting-room window at Briony Lodge and obey Holmes's signal."
    advanceTime(10)
    msg("You accept Holmes's plan. 'Then remain near the sitting-room window,' he says. 'I will give the signal.'")
    return world.SUCCESS
  },
})

new Cmd('RefusePlan', {
  regex:/^(?:refuse|reject|ignore) (?:holmes'?s |the )?(?:plan|instructions)$/,
  script:function() {
    if (!game.story.caseAccepted) return failedmsg("There is no plan to refuse yet.")
    game.story.planExplained = true
    game.story.planAccepted = false
    game.story.operationStarted = false
    game.story.holmesSignal = false
    supportHolmes(-10)
    addSuspicion(10)
    game.story.objective = "Improvise near Briony Lodge without Holmes's smoke-rocket plan."
    msg("You refuse the deception. Holmes is disappointed, but agrees to let you improvise.")
    return world.SUCCESS
  },
})

new Cmd('SupportHolmes', {
  regex:/^(?:support|side with) holmes$/,
  script:function() { supportHolmes(10); msg("You stand firmly behind Holmes's methods."); return world.SUCCESS },
})

new Cmd('SupportAdler', {
  regex:/^(?:defend|support|side with) (?:irene )?adler$/,
  script:function() { supportAdler(10); msg("You suggest that Irene Adler may deserve more mercy than the King grants her."); return world.SUCCESS },
})

new Cmd('WarnAdler', {
  regex:/^warn (?:irene )?adler$/,
  script:function() {
    if (!game.observed && !game.followedIrene) return failedmsg("You have not learned enough to warn Irene credibly.")
    if (game.story.adlerRespect < 10) return failedmsg("Your loyalty to Holmes has not yet brought you to the point of warning Irene.")
    game.story.warnedAdler = true
    supportAdler(20)
    supportHolmes(-15)
    addSuspicion(15)
    game.story.objective = "Irene knows about Holmes's plan. Decide how to proceed."
    msg("You send Irene a discreet warning. The smoke-rocket plan may no longer work.")
    return world.SUCCESS
  },
})

new Cmd('DeclineCase', {
  regex:/^(?:decline|refuse) (?:the )?(?:case|mission)$/,
  script:function() {
    if (!game.story.kingRevealed) return failedmsg("You do not yet know enough to refuse the mission.")
    game.story.caseAccepted = false
    game.story.act = 1
    game.story.kingFavor -= 20
    supportHolmes(-15)
    game.story.objective = "The case remains unresolved. Speak to Holmes to reconsider."
    msg("The timeline settles into an alternate route: Watson declines active interference, Holmes expresses disappointment, and nothing further is arranged.")
    return world.SUCCESS
  },
})

new Cmd('StoryObjective', {
  regex:/^(?:objective|current objective|what now|what should i do)(?:\?)?$/,
  script:function() {
    msg("CURRENT OBJECTIVE: " + game.story.objective)
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})
new Cmd('ShowHolmes', {
  regex:/^(?:show|give) (.+) to holmes$/,
  objects:[{scope:parser.isHeld}],
  script:function(objects) { const item = objects[0][0]; msg("You present " + item.alias + " to Holmes."); msg(w.holmes.deduce(item)); return world.SUCCESS },
})
new Cmd('ObserveIrene', {
  regex:/^(?:observe|watch) (?:irene|adler|the lodge|briony lodge)$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue" && player.loc !== "TheMews") return failedmsg("You need a discreet vantage near Briony Lodge.")
    game.observed = true
    game.story.cluesFound++
    addSuspicion(-1)
    advanceTime(10)
    game.story.act = getCaseMinutes() >= 12 * 60 ? 3 : 2
    msg("You observe rather than intrude: " + getCasePeriod() + " at " + formatCaseTime() + "; Irene leaves at five, returns at seven, and keeps the sitting-room close at hand.")
    return world.SUCCESS
  },
})
new Cmd('FollowNorton', {
  regex:/^follow norton$/,
  script:function() {
    const now = getCaseMinutes()
    if (game.story.day < 2) return failedmsg("Norton is not yet part of the investigation.")
    if (now < 11 * 60 + 30) return failedmsg("Norton has not yet begun his hurried errand.")
    if (now > 12 * 60 + 15) {
      addSuspicion(10)
      game.story.missedSignal = true
      msg("You arrive after the wedding. Norton and Irene are already married.")
      advanceTime(15)
      return world.SUCCESS
    }
    if (game.followedNorton) return failedmsg("You have already followed Norton to the church.")

    game.followedNorton = true
    game.weddingWitnessed = true
    game.story.cluesFound++
    supportHolmes(10)
    advanceTime(15)
    moveStoryNpc(w.godfrey, "StMonicasChurch", "south")
    player.loc = "StMonicasChurch"
    game.story.objective = "You witnessed the sudden wedding. Return to Holmes and accept or refuse the smoke-rocket plan."
    msg("At " + formatCaseTime() + ", you follow Norton to St. Monica's and arrive just in time to serve as witness.")
    return world.SUCCESS
  },
})
new Cmd('FollowIrene', {
  regex:/^follow irene$/,
  script:function() {
    if (!game.observed || player.loc !== "SerpentineAvenue" && player.loc !== "TheMews") return failedmsg("You have not established Irene's route or found a discreet vantage.")
    game.followedIrene = true
    game.story.missedSignal = true
    addSuspicion(10)
    advanceTime(5)
    msg("You follow Irene too closely. She notices the interest and changes her plans.")
    return world.SUCCESS
  },
})
new Cmd('InterfereFight', {
  regex:/^(?:join|interfere in|attack in) (?:the )?(?:fight|struggle)$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue") return failedmsg("There is no staged fight here.")
    if (!game.story.operationStarted) return failedmsg("The operation has not begun.")
    game.story.fightInterference = true
    addSuspicion(15)
    supportHolmes(-10)
    msg("You charge into Holmes's staged struggle. The crowd panics and a genuine police presence follows.")
    return world.SUCCESS
  },
})

createItem("photograph", TAKEABLE(), {
  loc:"BrionyLodge",
  alias:"cabinet photograph",
  examine:"The compromising photograph of the King and Irene Adler.",
  hidden:true,
})

new Cmd('SignalHolmes', {
  regex:/^signal holmes$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue") return failedmsg("Holmes cannot see you from here.")
    if (!game.story.planAccepted) return failedmsg("You have no accepted operation to execute.")
    if (!game.story.operationStarted) return failedmsg("The operation has not begun.")
    if (getCaseMinutes() < 18 * 60 + 50 || getCaseMinutes() > 19 * 60 + 15) return failedmsg("It is not time for Holmes's signal.")

    game.story.holmesSignal = true
    game.story.operationStarted = true
    msg("Holmes raises his hand. Now is the moment for the smoke-rocket.")
    return world.SUCCESS
  },
})

new Cmd('StartFire', {
  regex:/^(?:start|raise|throw) (?:a )?(?:smoke )?rocket$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue") return failedmsg("The smoke-rocket must be thrown beside Briony Lodge.")
    if (game.fireStarted) return failedmsg("The fire has already been raised.")
    if (!game.story.planAccepted) return failedmsg("You have no accepted operation to execute.")
    if (!game.story.operationStarted) return failedmsg("The operation has not begun.")
    if (!game.story.holmesSignal) return failedmsg("Wait for Holmes to give the signal.")

    const now = getCaseMinutes()
    if (now < 18 * 60 + 50) {
      game.story.rocketThrownEarly = true
      game.fireStarted = true
      game.story.rocketThrown = true
      addSuspicion(25)
      msg("You panic and throw the rocket early. Holmes is still outside, Irene notices, and counter-surveillance begins.")
      game.ending = "counter_surveillance"
      return world.SUCCESS
    }
    if (now > 19 * 60 + 15) {
      game.story.missedSignal = true
      addSuspicion(10)
      msg("The opportunity has passed. Holmes's signal comes and goes without the rocket.")
      game.ending = "missed"
      return world.SUCCESS
    }

    game.story.operationStarted = true
    game.fireStarted = true
    game.story.rocketThrown = true

    const outcome = determineFireSceneOutcome()

    if (outcome === "ADLER_ESCAPES") {
      msg("Irene is already gone. Watson's warning has given her time to escape.")
      game.ending = "betrayal"
    }
    else if (outcome === "BURGLARY_ROUTE") {
      addSuspicion(10)
      msg("Holmes is alone at the lost signal. The operation becomes a burglary mission.")
      game.ending = "burglary"
    }
    else if (outcome === "COUNTER_SURVEILLANCE") {
      addSuspicion(25)
      msg("The rocket is raised inconsistently. Irene summons counter-surveillance.")
      game.ending = "counter_surveillance"
    }
    else if (outcome === "POLICE_ROUTE") {
      addSuspicion(15)
      msg("The struggle draws a crowd and then the police. Holmes loses control of the scene.")
      game.ending = "police"
    }
    else if (game.story.suspicion >= 50) {
      addSuspicion(10)
      msg("Irene has become too suspicious. She secures the photograph and watches the ruse closely.")
      game.ending = "compromised"
    }
    else {
      game.story.photoLocationKnown = true
      game.story.cluesFound = Math.max(game.story.cluesFound, 5)
      game.story.holmesTrust = Math.min(100, game.story.holmesTrust + 15)
      w.photograph.hidden = false
      msg("At Holmes's signal, smoke floods the sitting-room. Irene reveals the recess above the bell-pull, exposing the photograph.")
      game.ending = "photo_revealed"
    }
    return world.SUCCESS
  },
})

new Cmd('TakePhotograph', {
  regex:/^(?:take|get|retrieve) (?:the )?(?:photograph|photo)$/,
  script:function() {
    if (!game.story.photoLocationKnown || w.photograph.hidden) return failedmsg("You have not revealed the photograph's hiding place.")
    w.photograph.moveToFrom(player, player)
    game.story.photoLocationKnown = true
    game.ending = "success"
    supportHolmes(10)
    game.story.objective = "Resolve the case. The photograph is in Watson's possession."
    msg("You recover the cabinet photograph before Irene can flee.")
    return world.SUCCESS
  },
})

new Cmd('ResolveEnding', {
  regex:/^(?:resolve|finish) (?:the )?(?:case|ending)$/,
  script:function() {
    const ending = determineEnding()
    game.ending = ending

    if (ending === "WATSON_BETRAYAL_ENDING") {
      msg("Watson's loyalty to Irene prevails: she escapes, Holmes discovers the warning, and their friendship is left bitterly altered.")
    }
    else if (ending === "ADLER_TOTAL_VICTORY") {
      msg("Adler escapes with the scandal intact. The King is vulnerable, and Holmes must acknowledge a rival who has beaten him.")
    }
    else if (ending === "GOLDEN_ROUTE") {
      msg("THE WOMAN: Adler outsmarts Holmes, but Watson has kept faith with both rival and king. The photograph is safe, Adler is free, and Holmes respects the woman who defeated him.")
    }
    else if (ending === "CANON_ENDING") {
      msg("Irene escapes, leaving a photograph of herself and a letter for Holmes. The King is satisfied, but Holmes has found his equal.")
    }
    else {
      msg("The hiding place remains unknown and the investigation fails to resolve the King's crisis.")
    }
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})

const originalEnterRoom = world.enterRoom;

world.enterRoom = function(exit) {
  const room = w[player.loc];

  if (room.bg) {
    document.body.style.backgroundImage = `url('${room.bg}')`;
  }

  originalEnterRoom.call(world, exit);
};

>>>>>>> 32a97f2 (revamp)
