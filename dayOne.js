/** @param {NS} ns */
export async function main(ns) {
	const costToRun = ns.getScriptRam("BitBurnerHacknetMgr.js") + ns.getScriptRam("nukeAllAvailable.js") + ns.getScriptRam("startLoopsAll.js")
	let serverRAM = 0
	let serverName = "dayOne"
	ns.exec("infiltrate.js", ns.getHostname())
	if (!ns.getPurchasedServers().includes(serverName)) {
		for (let power = 1; serverRAM < costToRun; power++) {
			serverRAM = 2 ** power
		}
		ns.purchaseServer(serverName, serverRAM)
		ns.tprintf(`Purchased dayOne with ${serverRAM}GB of RAM for \$${ns.getPurchasedServerCost(serverRAM)}`)
	}
	if (ns.getPurchasedServers().includes(serverName)) {
		await ns.scp("tools.js", serverName)
		await ns.scp("BitBurnerHacknetMgr.js", serverName)
		await ns.scp("nukeAllAvailable.js", serverName)
		await ns.scp("startLoopsAll.js", serverName)
		await ns.scp("stocks.js", serverName)
		await ns.scp("find-and-solve.js", serverName)
		await ns.scp("solvers.js", serverName)
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