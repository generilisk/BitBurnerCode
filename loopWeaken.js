/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL")
	const targetServer = ns.args[0]
	const targetMaxMoney = ns.args[1]
	const targetMinSecuritylevel = ns.args[2]
	while (true) {
		let targetMoneyAvailable = ns.getServerMoneyAvailable(targetServer)
		let targetSecurityLevel = ns.getServerSecurityLevel(targetServer)
		if (targetMinSecuritylevel < targetSecurityLevel) {
			ns.print(`Security level ${targetSecurityLevel.toFixed(3)} with a minimum of ${targetMinSecuritylevel}. Weakening now...`)
			await ns.weaken(targetServer)
		} else if (targetMoneyAvailable < targetMaxMoney) {
			ns.print(targetMoneyAvailable.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			}) + " out of " + targetMaxMoney.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			}) + " available. Growing now...")
			await ns.grow(targetServer)
		} else {
			await ns.asleep(1000)
		}
	}
}