/** @param {NS} ns **/
import {
	rootAccessList
} from './tools.js';
export async function main(ns) {
	//ns.disableLog("ALL")
	ns.exec("nukeAllAvailable.js", ns.getHostname())
	let targetList = rootAccessList(ns)
	let homeRAM = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
	let homeWeakenRAM = ns.getScriptRam("loopWeaken.js", "home")
	let homeGrowRAM = ns.getScriptRam("loopGrow.js", "home")
	let homeHackRAM = ns.getScriptRam("loopHack.js", "home")
	let homeLoopTotalRAM = homeWeakenRAM + homeGrowRAM + homeHackRAM
	ns.tprintf(`Weaken RAM: ${homeWeakenRAM}`)
	ns.tprintf(`Grow RAM: ${homeGrowRAM}`)
	ns.tprintf(`Hack RAM: ${homeHackRAM}`)
	let homeTotalThreadCount = Math.floor(homeRAM / homeLoopTotalRAM)
	let homeMoneyAvailableTotal = 0
	ns.tprintf(`Home has ${homeRAM.toFixed(3)}GB of RAM, a full set of loops uses ${homeLoopTotalRAM.toFixed(3)}GB of RAM, for a total of ${homeTotalThreadCount} threads, shared between ${targetList.length} servers.`)
	for (let targetServer of targetList) {
		homeMoneyAvailableTotal += ns.getServerMaxMoney(targetServer)
	}
	let targetThreadCount = 0
	let hackLoops = ["loopWeaken.js", "loopGrow.js", "loopHack.js"]
	for (let targetServer of targetList) {
		//set up hacking on home
		let targetMaxMoney = 0
		let targetMinSecuritylevel = 0
		targetMaxMoney = ns.getServerMaxMoney(targetServer)
		targetMinSecuritylevel = ns.getServerMinSecurityLevel(targetServer)
		let homeThreadPercent = ns.getServerMaxMoney(targetServer) / homeMoneyAvailableTotal
		let homeThreadCount = Math.floor(homeTotalThreadCount * homeThreadPercent)
		if (homeThreadCount > 0) {
			ns.exec("loopWeaken.js", "home", homeThreadCount, targetServer, targetMaxMoney, targetMinSecuritylevel)
			ns.exec("loopGrow.js", "home", homeThreadCount, targetServer, targetMaxMoney, targetMinSecuritylevel)
			ns.exec("loopHack.js", "home", homeThreadCount, targetServer, targetMaxMoney, targetMinSecuritylevel)
			ns.printf("Looping " + homeThreadCount + " threads on home to hack " + targetServer)
		} else {
			ns.printf(targetServer + " has insufficient money to justify a thread.")
		}
		//set up self-weaken, self-grow
		let targetRAM = ns.getServerMaxRam(targetServer)
		await ns.scp(hackLoops, targetServer, "home")
		let targetWeakenRAM = ns.getScriptRam("loopWeaken.js", targetServer)
		let targetGrowRAM = ns.getScriptRam("loopGrow.js", targetServer)
		let targetCost = (targetWeakenRAM + targetGrowRAM)
		if (targetRAM >= targetCost) {
			targetThreadCount = Math.floor(targetRAM / targetCost)
			ns.killall(targetServer, true)
			if (targetThreadCount > 0) {
				ns.print(`Self-weakening and growing ${targetServer} with ${targetThreadCount} threads.`)
				ns.exec("loopWeaken.js", targetServer, targetThreadCount, targetServer, targetMaxMoney, targetMinSecuritylevel)
				ns.exec("loopGrow.js", targetServer, targetThreadCount, targetServer, targetMaxMoney, targetMinSecuritylevel)
			} else {
				ns.print(`${targetServer} has insufficient RAM to loop itself.`)
			}
		} else {
			ns.print(`${targetServer} has no accessible RAM`)
		}
	}
}