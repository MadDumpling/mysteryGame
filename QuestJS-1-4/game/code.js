"use strict"

// Agenda targets are clock times within the current case day.
agenda.caseClock = function(npc, arr) {
	const hour = parseInt(arr.shift(), 10)
	const minute = parseInt(arr.shift() || "0", 10)
	const target = hour * 60 + minute
	const now = getCaseMinutes()

	if (now < target) return false
	if (npc.caseEvent) npc.caseEvent()
	return true
}

// Watson returns on Day 1, and the investigation begins on Day 2 at 8:00 AM.
function getCaseMinutes() {
	return game.story && game.story.time !== undefined ? game.story.time : 19 * 60
}

function getCasePeriod(minutes) {
	minutes = minutes === undefined ? getCaseMinutes() : minutes
	const hour = Math.floor(minutes / 60) % 24
	if (hour >= 5 && hour < 12) return "Morning"
	if (hour >= 12 && hour < 17) return "Afternoon"
	if (hour >= 17 && hour < 21) return "Evening"
	return "Night"
}

function formatCaseTime(minutes) {
	minutes = minutes === undefined ? getCaseMinutes() : minutes
	const hour24 = Math.floor(minutes / 60) % 24
	const minute = minutes % 60
	const suffix = hour24 >= 12 ? "PM" : "AM"
	const hour12 = hour24 % 12 || 12
	return hour12 + ":" + (minute < 10 ? "0" : "") + minute + " " + suffix
}

function getCaseTimeline() {
	return "Day " + (game.story.day || 1) + " - " + getCasePeriod() + " - " + formatCaseTime()
}

function advanceTime(minutes) {
	const amount = Math.max(0, parseInt(minutes, 10) || 0)
	game.story.time += amount
	world.update()
}

function advanceToNextDay(hour, minute) {
	game.story.day = (game.story.day || 1) + 1
	game.story.time = (hour === undefined ? 8 : hour) * 60 + (minute || 0)
	game.elapsedTime = 0
	world.update()
}

function addSuspicion(amount) {
	game.story.suspicion = Math.max(0, (game.story.suspicion || 0) + amount)
}

function supportHolmes(amount) {
	game.story.holmesTrust = Math.min(100, Math.max(0, game.story.holmesTrust + (amount || 5)))
}

function supportAdler(amount) {
	game.story.adlerRespect = Math.min(100, Math.max(0, game.story.adlerRespect + (amount || 10)))
	game.story.holmesTrust = Math.max(0, game.story.holmesTrust - (amount || 10))
}

function supportKing(amount) {
	game.story.kingFavor = Math.min(100, Math.max(0, game.story.kingFavor + (amount || 5)))
}

function determineFireSceneOutcome() {
	if (game.story.warnedAdler) return "ADLER_ESCAPES"
	if (game.story.missedSignal) return "BURGLARY_ROUTE"
	if (game.story.rocketThrownEarly) return "COUNTER_SURVEILLANCE"
	if (game.story.fightInterference) return "POLICE_ROUTE"
	return "CANON"
}

function determineEnding() {
	if (game.story.warnedAdler) return "WATSON_BETRAYAL_ENDING"
	if (game.story.suspicion >= 75) return "ADLER_TOTAL_VICTORY"
	if (game.story.photoLocationKnown && game.story.holmesTrust >= 70 && game.story.cluesFound >= 5) return "GOLDEN_ROUTE"
	if (game.story.photoLocationKnown) return "CANON_ENDING"
	return "FAILURE_ENDING"
}

function completeAct1Objective() {
	if (game.story.noteExamined && game.story.visitorArrived && game.story.kingRevealed && game.story.caseAccepted) {
		game.story.act = 2
		game.story.objective = "Investigate the mews, then follow Norton to St. Monica's Church."
	}
}
