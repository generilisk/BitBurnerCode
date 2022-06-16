/** @param {NS} ns */
export async function main(ns) {
	const costToRun = ns.getScriptRam("BitBurnerHacknetMgr.js") + ns.getScriptRam("QTest.js")
	let serverRAM = 0
	let serverName = "dayOne"
	if (!ns.getPurchasedServers().includes(serverName)) {
		for (let power = 1; serverRAM < costToRun; power++) {
			serverRAM = 2 ** power
		}
		ns.purchaseServer(serverName, serverRAM)
		ns.tprintf("Purchased dayOne with " + serverRAM + "GB of RAM for $" + ns.getPurchasedServerCost(serverRAM))
		await ns.scp("BitBurnerHacknetMgr.js", "home", serverName)
		await ns.scp("QTest.js", "home", serverName)
	}
	if (ns.getPurchasedServers().includes(serverName)){
		if(!ns.isRunning(BitBurnerHacknetMgr.js,serverName)){
			ns.exec("BitBurnerHacknetMgr.js",serverName)
		}		
	}
}