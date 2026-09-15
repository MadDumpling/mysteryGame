"use strict"

// Shared case state keeps each ending tied to visible player choices.
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
  talkto:"Holmes folds his hands. \"We have three days, Watson, and one photograph to find.\"",
  canTalk:true,
  askOptions:[
    {name:"deduction", msg:"\"You see, but you do not observe,\" Holmes says dryly."},
    {name:"case", msg:"\"It is a capital mistake to theorize before one has data.\""},
    {name:"photograph", msg:function() { return game.photoFound ? "\"The photograph is secured. A rare victory for preparation.\"" : "\"Cabinet size, Watson. Too large for a lady's dress; too important to entrust to a banker.\"" }},
  ],
  tellOptions:[
    {name:"observed schedule", test:function() { return game.observed }, msg:"Holmes nods. \"Observation gives us the hour; deduction gives us the place.\""},
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
    return "Holmes deduces: " + deductions[item.name]
  },
  reactions:[{trigger:function() { return player.isHere() }, script:function() { msg("Holmes glances at you with a quick, subtle appraisal.") }}],
  movingMsg:function(exit) { msg("Holmes strides " + exit.dir + ", hands clasped behind him.") },
  agenda:["caseClock:10:0", "msg:Holmes taps the pink note. \"The King will come shortly.\"", "wait:1", "msg:Holmes paces swiftly, head sunk upon his chest.", "wait:2", "caseClock:17:0", "msg:Holmes checks the street. \"Seven o'clock will be our hour.\""],
})

createItem("irene", NPC(true), {
  loc:"BrionyLodge", alias:"Irene Adler", properName:true,
  examine:"Irene Adler has the face of the most beautiful of women and the mind of the most resolute of men.",
  talkto:function() { game.suspicion++; return "Irene smiles without warmth. \"You are a friend of Mr. Holmes, I presume?\"" },
  askOptions:[
    {name:"schedule", msg:"Irene's eyes sharpen. \"A woman may drive when she pleases, Doctor.\"", script:function() { game.suspicion++ }},
    {name:"norton", msg:"\"Mr. Norton is a gentleman and my counsel.\" Her hand closes over a small key."},
  ],
  reactions:[{trigger:function() { return game.suspicion >= 3 }, script:function() { msg("Irene has begun to suspect that Baker Street is watching her."); return {name:"irene_suspicious"} }}],
  agenda:["caseClock:17:0", "moveTo:SerpentineAvenue", "msg:Irene leaves Briony Lodge for her five o'clock drive.", "caseClock:19:0", "moveTo:BrionyLodge", "msg:Irene returns at seven, alert and composed."],
})
createItem("king", NPC(false), {
  loc:"Bakerstreet", alias:"King of Bohemia", properName:true,
  examine:"A giant of a man in a blue cloak, carrying himself with the anxious dignity of a king in disguise.",
  talkto:function() { game.kingMet = true; return "\"I would give a province to recover that photograph, Mr. Holmes. You have carte blanche.\"" },
  askOptions:[
    {name:"mission", msg:"\"Irene Adler threatens to send a photograph to my betrothed. Recover it before Monday.\""},
    {name:"money", msg:"The King produces a heavy chamois bag. \"Three hundred pounds in gold and seven hundred in notes.\""},
  ],
  agenda:["caseClock:10:15", "msg:The masked visitor removes his disguise. \"I am the King. Why conceal it?\"", "wait:1", "msg:The King explains the photograph, Irene's threat, and the approaching betrothal."],
})
createItem("godfrey", NPC(false), {
  loc:"TheTemple", alias:"Godfrey Norton", properName:true,
  examine:"A dark, handsome lawyer with an aquiline nose and the air of a man always late.",
  talkto:function() { return game.followedNorton ? "Norton grips your hand. \"You witnessed the wedding; you understand why we must leave.\"" : "Norton glances at his watch. \"I have no time to spare.\"" },
  agenda:["caseClock:11:30", "moveTo:BrionyLodge", "msg:Godfrey Norton arrives at Briony Lodge in a hansom cab.", "wait:1", "caseClock:11:45", "moveTo:StMonicasChurch", "msg:Norton shouts for a cab to St. Monica's Church."],
})
createItem("ostler", NPC(false), {loc:"TheMews", alias:"ostler", talkto:"The ostler accepts a coin. \"Miss Adler drives out at five and returns sharp at seven. The lawyer calls daily.\""})
createItem("clergyman", NPC(false), {loc:"StMonicasChurch", alias:"clergyman", talkto:"The clergyman sighs. \"A marriage licence had some informality. We still require a witness.\""})
createItem("cabman", NPC(false), {loc:"SerpentineAvenue", alias:"cabman", talkto:"The cabman grins. \"A half-sovereign gets a man to the church in twenty minutes.\""})

createItem("pink_note", TAKEABLE(), {loc:"Bakerstreet", alias:"pink-tinted note", examine:"Bohemian paper carries a German maker's mark. The writer promises a masked visitor at a quarter to eight."})
createItem("boot_marks", TAKEABLE(), {loc:"Bakerstreet", alias:"muddy boot marks", examine:"Parallel cuts around the sole suggest scraped London mud. A medical man has been out in vile weather."})
createItem("mews_gossip", TAKEABLE(), {loc:"TheMews", alias:"mews gossip", examine:"Irene drives at five, returns at seven, and Norton calls once or twice daily."})
createItem("wedding_token", TAKEABLE(), {loc:"StMonicasChurch", alias:"wedding token", examine:"A discarded ribbon confirms Irene Adler and Godfrey Norton were married today."})
createItem("cabinet_frame", TAKEABLE(), {loc:"Bakerstreet", alias:"cabinet frame", examine:"A cabinet-sized frame. Holmes says the missing photograph is exactly this size."})
createItem("photograph", TAKEABLE(), {loc:"BrionyLodge", alias:"compromising photograph", examine:"A photograph of Irene Adler and the King of Bohemia. It could ruin a royal marriage.", hidden:true})

new Cmd('ShowHolmes', {
  regex:/^(?:show|give) (.+) to holmes$/,
  objects:[{scope:parser.isHeld}],
  script:function(objects) { const item = objects[0][0]; msg("You present " + item.alias + " to Holmes."); msg(w.holmes.deduce(item)); return world.SUCCESS },
})
new Cmd('ObserveIrene', {
  regex:/^(observe|watch) (irene|adler|the lodge|briony lodge)$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue" && player.loc !== "TheMews") return failedmsg("You need a discreet vantage near Briony Lodge.")
    game.observed = true; game.suspicion = Math.max(0, game.suspicion - 1)
    msg("You observe rather than intrude: Irene leaves at five, returns at seven, and keeps the sitting-room close at hand.")
    return world.SUCCESS
  },
})
new Cmd('FollowNorton', {
  regex:/^follow norton$/,
  script:function() {
    if (!w.godfrey.isHere()) return failedmsg("Norton is not here to follow.")
    game.followedNorton = true; moveStoryNpc(w.godfrey, "StMonicasChurch", "south"); player.loc = "StMonicasChurch"; game.weddingWitnessed = true
    msg("You follow Norton to St. Monica's, arriving just in time to serve as witness.")
    return world.SUCCESS
  },
})
new Cmd('FollowIrene', {
  regex:/^follow irene$/,
  script:function() {
    if (!game.observed || !w.irene.isHere()) return failedmsg("You have not established Irene's route, or she is not here.")
    game.followedIrene = true; game.suspicion++; msg("You follow Irene too closely. She notices the interest and changes her plans."); return world.SUCCESS
  },
})
new Cmd('StartFire', {
  regex:/^(start|raise) fire$/,
  script:function() {
    if (player.loc !== "SerpentineAvenue" || game.fireStarted) return failedmsg("The timing or position is wrong.")
    game.fireStarted = true
    if (game.suspicion >= 3) { msg("Your cry comes too early. Irene has secured the photograph and fled."); game.ending = "compromised" }
    else if (game.followedIrene) { msg("Irene expected the ruse. She leaves the photograph behind as a challenge and disappears."); game.photoFound = true; game.ending = "alliance" }
    else msg("At Holmes's signal you cry \"Fire!\" Smoke floods the sitting-room. Irene reaches for the hidden photograph, revealing the recess above the bell-pull.")
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
    msg("You recover the photograph before Irene can flee. The King's crisis is over."); return world.SUCCESS
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

