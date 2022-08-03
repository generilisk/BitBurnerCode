/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL")
	const targetServer = ns.args[0];
	while (true) {
		let targetMoneyAvailable = ns.getServerMoneyAvailable(targetServer)
		let targetMaxMoney = ns.getServerMaxMoney(targetServer)
		let targetMinSecuritylevel = ns.getServerMinSecurityLevel(targetServer)
		let targetSecurityLevel = ns.getServerSecurityLevel(targetServer)
		if (targetMinSecuritylevel / .9 > targetSecurityLevel && targetMoneyAvailable > .9 * targetMaxMoney) {
			ns.print(targetServer + " is at " + targetSecurityLevel.toFixed(3) + ", with " + targetMoneyAvailable.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			}) + " available. Hacking...")
			await ns.hack(targetServer);
		} else {
			ns.print(targetServer + " is at " + targetSecurityLevel.toFixed(3) + ", with " + targetMoneyAvailable.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			}) + " available.")
			ns.print(targetServer + " needs a security level no higher than " + (targetMinSecuritylevel / .9).toFixed(3) + " and must have at least " + (.9 * targetMaxMoney).toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			}) + " available.")
			await ns.asleep(10000);
		}
	}
}