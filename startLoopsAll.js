/** @param {NS} ns **/
import { nestingScan, rootAccessList } from './tools.js';
export async function main(ns) {
	ns.disableLog("ALL")
	let targetList = rootAccessList(ns)
	let homeRAM = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
	let homeWeakenRAM = ns.getScriptRam("loopWeaken.js", "home")
	let homeGrowRAM = ns.getScriptRam("loopGrow.js", "home")
	let homeHackRAM = ns.getScriptRam("loopHack.js", "home")
	let homeLoopTotalRAM = homeWeakenRAM + homeGrowRAM + homeHackRAM
	ns.tprintf("Weaken RAM: " + homeWeakenRAM)
	ns.tprintf("Grow RAM: " + homeGrowRAM)
	ns.tprintf("Hack RAM: " + homeHackRAM)
	let homeTotalThreadCount = Math.floor(homeRAM / homeLoopTotalRAM)
	let homeMoneyAvailableTotal = 0
	ns.tprintf("Home RAM is " + homeRAM + ", a full set of loops uses " + homeLoopTotalRAM + " of RAM, for a total of " + homeTotalThreadCount + " threads, shared between " + targetList.length + " servers.")
	for (let targetServer of targetList) {
		homeMoneyAvailableTotal += ns.getServerMaxMoney(targetServer)
	};
	let targetThreadCount = 0
	let targetRAM = 0
	let targetCost = 0
	let hackLoops = ["loopWeaken.js", "loopGrow.js", "loopHack.js"]
	for (let targetServer of targetList) {
		let homeThreadPercent = ns.getServerMaxMoney(targetServer) / homeMoneyAvailableTotal
		let homeThreadCount = Math.floor(homeTotalThreadCount * homeThreadPercent)
		if (homeThreadCount > 0) {
			targetRAM = ns.getServerMaxRam(targetServer)
			await ns.scp(hackLoops, "home", targetServer)
			ns.exec("loopWeaken.js", "home", homeThreadCount, targetServer)
			ns.exec("loopGrow.js", "home", homeThreadCount, targetServer)
			ns.exec("loopHack.js", "home", homeThreadCount, targetServer)
			targetCost = (ns.getScriptRam("loopWeaken.js", targetServer) + ns.getScriptRam("loopGrow.js", targetServer) + ns.getScriptRam("loopHack.js", targetServer))
			if (targetRAM > 0) {
				targetThreadCount = Math.floor(targetRAM / targetCost)
				ns.killall(targetServer, true)
				if (targetThreadCount > 0) {
					ns.exec("loopWeaken.js", targetServer, targetThreadCount, targetServer)
					ns.exec("loopGrow.js", targetServer, targetThreadCount, targetServer)
					ns.exec("loopHack.js", targetServer, targetThreadCount, targetServer)
				} else {
					ns.print(targetServer + " has insufficient RAM to loop itself.")
				}
			} else {
				ns.print(targetServer + " has no accessable RAM")
			}
			ns.printf("Looping " + homeThreadCount + " threads on home to hack " + targetServer)
		} else {
			ns.printf(targetServer + " has insufficient money to justify a thread.")
		}
	}
}
