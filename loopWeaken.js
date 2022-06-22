/** @param {NS} ns **/
export async function main(ns) {
	const targetServer = ns.args[0]
	ns.disableLog("ALL")
	while (true) {
		let targetMoneyAvailable = ns.getServerMoneyAvailable(targetServer)
		let targetMaxMoney = ns.getServerMaxMoney(targetServer)
		let targetMinSecuritylevel = ns.getServerMinSecurityLevel(targetServer)
		let targetSecurityLevel = ns.getServerSecurityLevel(targetServer)

		if (targetMinSecuritylevel < targetSecurityLevel) {
			ns.print(
				targetServer +
				" is at security level " +
				targetSecurityLevel +
				" with a minimum of " +
				targetMinSecuritylevel +
				". Hacking now..."
			)
			await ns.weaken(targetServer)
		} else if (targetMoneyAvailable < targetMaxMoney) {
			ns.print(
				targetServer +
				" has " +
				targetMoneyAvailable.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) +
				" out of " +
				targetMaxMoney.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) +
				" available. Growing now...")
			await ns.grow(targetServer)
		} else {
			await ns.asleep(10000)
		}
	}
}