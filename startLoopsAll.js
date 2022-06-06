/** @param {NS} ns **/
import { nestingScan, rootAccessList } from './tools.js';
export async function main(ns) {
	ns.disableLog("ALL")
	ns.print("Hello there")
	let targetList = rootAccessList(ns)
	let homeThreadCount = Math.floor((ns.getServerMaxRam("home") / (ns.getScriptRam("loopWeaken.js", "home") + ns.getScriptRam("loopGrow.js", "home") + ns.getScriptRam("loopHack.js", "home"))) / targetList.length)
	let targetThreadCount = 0
	let targetRAM = 0
	let targetCost = 0
	let hackLoops = ["loopWeaken.js","loopGrow.js","loopHack.js"]
	ns.print("Hacking " + targetList + " with " + homeThreadCount + " threads each")
	for (let targetServer of targetList) {

		targetRAM = ns.getServerMaxRam(targetServer)
		await ns.scp(hackLoops,"home",targetServer)

		ns.print(targetServer + " is current target. It has " + targetRAM + "GB of RAM.")
		ns.print(targetServer + " gets " + homeThreadCount + " threads on home.")
		ns.exec("loopWeaken.js", "home", homeThreadCount, targetServer)
		ns.exec("loopGrow.js", "home", homeThreadCount, targetServer)
		ns.exec("loopHack.js", "home", homeThreadCount, targetServer)
		targetCost = (ns.getScriptRam("loopWeaken.js", targetServer) + ns.getScriptRam("loopGrow.js", targetServer) + ns.getScriptRam("loopHack.js", targetServer))
		ns.print("Each thread takes " + targetCost + "GB of RAM.")
		if (targetRAM > 0) {
			targetThreadCount = Math.floor(targetRAM / targetCost)
			ns.killall(targetServer,true)
			if (targetThreadCount < 1) { targetThreadCount = 1 };
			ns.exec("loopWeaken.js", targetServer, targetThreadCount, targetServer)
			ns.exec("loopGrow.js", targetServer, targetThreadCount, targetServer)
			ns.exec("loopHack.js", targetServer, targetThreadCount, targetServer)
		}
	}
}
