/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	const targetServer = ns.args[0]
	const targetMaxMoney = ns.args[1]
	while (true) {
		let targetMoneyAvailable = ns.getServerMoneyAvailable(targetServer)
		if (targetMoneyAvailable < targetMaxMoney) {
			ns.print(`${targetServer} has ${targetMoneyAvailable.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD'
				})} out of ${targetMaxMoney.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD'
				})} available. Growing now...`)
			await ns.grow(targetServer);
		} else {
			ns.print(`${targetServer} is already at \$${targetMoneyAvailable.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD'
				})}`)
			await ns.asleep(10000);
		}
	}
}