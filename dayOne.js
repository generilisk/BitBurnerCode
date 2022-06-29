/** @param {NS} ns */
export async function main(ns) {
	const costToRun = ns.getScriptRam("BitBurnerHacknetMgr.js") + ns.getScriptRam("startLoopsAll.js")
	let serverRAM = 0
	let serverName = "dayOne"
	ns.exec("infiltrate.js", ns.getHostname())
	if (!ns.getPurchasedServers().includes(serverName)) {
		for (let power = 1; serverRAM < costToRun; power++) {
			serverRAM = 2 ** power
		}
		ns.purchaseServer(serverName, serverRAM)
		ns.tprintf("Purchased dayOne with " + serverRAM + "GB of RAM for $" + ns.getPurchasedServerCost(serverRAM))
		await ns.scp("BitBurnerHacknetMgr.js", "home", serverName)
		await ns.scp("startLoopsAll.js", "home", serverName)
		await ns.scp("tools.js", "home", serverName)
		await ns.scp("nukeAllAvailable.js", "home", serverName)
	}
	if (ns.getPurchasedServers().includes(serverName)) {
		if (!ns.isRunning("BitBurnerHacknetMgr.js", serverName)) {
			ns.exec("BitBurnerHacknetMgr.js", serverName)
		}
		if (!ns.isRunning("nukeAllAvailable.js", serverName)) {
			ns.exec("nukeAllAvailable.js", serverName)
		}
		if (!ns.isRunning("startLoopsAll.js", serverName)) {
			ns.exec("startLoopsAll.js", serverName)
		}
	}
}