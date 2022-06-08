/** @param {NS} ns **/
import { nestingScan, rootAccessList } from './tools.js';
export async function main(ns) {
	ns.disableLog("ALL")
	ns.print("Hello there")
	let targetList = rootAccessList(ns)
	let homeRAM = ns.getServerMaxRam("home")
	let homeWeakenRAM = ns.getScriptRam("loopWeaken.js", "home")
	let homeGrowRAM = ns.getScriptRam("loopGrow.js", "home")
	let homeHackRAM = ns.getScriptRam("loopHack.js", "home")
	let homeLoopTotalRAM = homeWeakenRAM + homeGrowRAM + homeHackRAM
	ns.print("Weaken RAM: " + homeWeakenRAM)
	ns.print("Grow RAM: " + homeGrowRAM)
	ns.print("Hack RAM: " + homeHackRAM)
	ns.print("Home RAM is " + homeRAM + ", a full set of loops uses " + homeLoopTotalRAM + " of RAM, split across " + targetList.length + " servers being hacked.")
	let homeThreadCount = Math.floor((homeRAM / homeLoopTotalRAM) / targetList.length) - 1
	let targetThreadCount = 0
	let targetRAM = 0
	let targetCost = 0
	let hackLoops = ["loopWeaken.js", "loopGrow.js", "loopHack.js"]
	ns.print("Hacking " + targetList + " with " + homeThreadCount + " threads each")
	for (let targetServer of targetList) {

		targetRAM = ns.getServerMaxRam(targetServer)
		await ns.scp(hackLoops, "home", targetServer)

		ns.print(targetServer + " is current target. It has " + targetRAM + "GB of RAM.")
		ns.print(targetServer + " gets " + homeThreadCount + " threads on home.")

		ns.exec("loopWeaken.js", "home", homeThreadCount, targetServer)
		ns.exec("loopGrow.js", "home", homeThreadCount, targetServer)
		ns.exec("loopHack.js", "home", homeThreadCount, targetServer)
		targetCost = (ns.getScriptRam("loopWeaken.js", targetServer) + ns.getScriptRam("loopGrow.js", targetServer) + ns.getScriptRam("loopHack.js", targetServer))
		ns.print("Each thread takes " + targetCost + "GB of RAM.")
		if (targetRAM > 0) {
			targetThreadCount = Math.floor(targetRAM / targetCost)
			ns.killall(targetServer, true)
			if (targetThreadCount > 0) {
				ns.exec("loopWeaken.js", targetServer, targetThreadCount, targetServer)
				ns.exec("loopGrow.js", targetServer, targetThreadCount, targetServer)
				ns.exec("loopHack.js", targetServer, targetThreadCount, targetServer)
			};
		}
	}
}
