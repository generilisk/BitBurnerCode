/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL")
	const targetServer = ns.args[0];
	while (true) {
		let targetMoneyAvailable = ns.getServerMoneyAvailable(targetServer)
		let targetMaxMoney = ns.getServerMaxMoney(targetServer)
		let targetMinSecurityLevel = ns.getServerMinSecurityLevel(targetServer)
		let targetSecurityLevel = ns.getServerSecurityLevel(targetServer)

		if (targetMoneyAvailable < targetMaxMoney) {
			ns.print(
				targetServer +
				" has " +
				targetMoneyAvailable.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) +
				" out of " +
				targetMaxMoney.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) +
				" available. Growing now..."
			)
			await ns.grow(targetServer);
		} else if (targetMinSecurityLevel < targetSecurityLevel) {
			ns.print(
				targetServer +
				" is at security level " +
				targetSecurityLevel.toFixed(3) +
				" with a minimum of " +
				targetMinSecurityLevel +
				". Weakening now..."
			)
			await ns.weaken(targetServer)
		} else {
			await ns.asleep(10000);
		}
	}
}