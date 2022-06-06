/** @param {NS} ns **/
export async function main(ns) {
	const targetServer = ns.args[0];
	while (true) {
		if (ns.getServerMinSecurityLevel(targetServer) / .9 > ns.getServerSecurityLevel(targetServer) && ns.getServerMoneyAvailable(targetServer) > .9 * ns.getServerMaxMoney(targetServer)) {
			await ns.hack(targetServer);
		} else {
			await ns.asleep(10000);
		}
	}
}
