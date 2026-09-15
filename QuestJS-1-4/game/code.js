"use strict"

// Story-specific agenda action used by the investigation NPCs.
agenda.caseClock = function(npc, arr) {
	const hour = parseInt(arr.shift(), 10)
	const minute = parseInt(arr.shift() || "0", 10)
	const target = hour * 60 + minute
	const now = 9 * 60 + 43 + game.turnCount

	if (now < target) return false
	if (npc.caseEvent) npc.caseEvent()
	return true
}

