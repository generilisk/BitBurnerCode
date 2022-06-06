/** @param {NS} ns **/
import { nestingScan, rootAccessList } from './tools.js';
export async function main(ns) {
	ns.disableLog("ALL")
	ns.print("Hello there")
	let targetList = rootAccessList(ns)
	let homeThreadCount = Math.floor((ns.getServerMaxRam("home") / (ns.getScriptRam("loopingSecCheck.js", "home") + ns.getScriptRam("loopingGrow.js", "home") + ns.getScriptRam("loopingHack.js", "home"))) / targetList.length)
	let targetThreadCount = 0
	let targetRAM = 0
	let targetCost = 0
	let hackLoops = ["loopingSecCheck.js","loopingGrow.js","loopingHack.js"]
	ns.print("Hacking " + targetList + " with " + homeThreadCount + " threads each")
	for (let targetServer of targetList) {

		targetRAM = ns.getServerMaxRam(targetServer)
		await ns.scp(hackLoops,"home",targetServer)

		ns.print(targetServer + " is current target. It has " + targetRAM + "GB of RAM.")
		ns.print(targetServer + " gets " + homeThreadCount + " threads on home.")
		ns.exec("loopingSecCheck.js", "home", homeThreadCount, targetServer)
		ns.exec("loopingGrow.js", "home", homeThreadCount, targetServer)
		ns.exec("loopingHack.js", "home", homeThreadCount, targetServer)
		targetCost = (ns.getScriptRam("loopingSecCheck.js", targetServer) + ns.getScriptRam("loopingGrow.js", targetServer) + ns.getScriptRam("loopingHack.js", targetServer))
		ns.print("Each thread takes " + targetCost + "GB of RAM.")
		if (targetRAM > 0) {
			targetThreadCount = Math.floor(targetRAM / targetCost)
			ns.killall(targetServer,true)
			if (targetThreadCount < 1) { targetThreadCount = 1 };
			ns.exec("loopingSecCheck.js", targetServer, targetThreadCount, targetServer)
			ns.exec("loopingGrow.js", targetServer, targetThreadCount, targetServer)
			ns.exec("loopingHack.js", targetServer, targetThreadCount, targetServer)
		}
	}
}
