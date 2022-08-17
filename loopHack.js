/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL")
	const targetServer = ns.args[0]
	const targetMaxMoney = ns.args[1]
	const targetMinSecuritylevel = ns.args[2]
	while (true) {
		let targetMoneyAvailable = ns.getServerMoneyAvailable(targetServer)
		let targetSecurityLevel = ns.getServerSecurityLevel(targetServer)
		if (targetMinSecuritylevel / .9 > targetSecurityLevel && targetMoneyAvailable > .9 * targetMaxMoney) {
			ns.print(targetServer + " is at " + targetSecurityLevel.toFixed(3) + ", with " + targetMoneyAvailable.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			}) + " available. Hacking...")
			await ns.hack(targetServer);
		} else {
			ns.print(`${targetServer} Security (cur/req):	${targetSecurityLevel.toFixed(3)}/${(targetMinSecuritylevel / .9).toFixed(3)}	Money (cur/req):	${targetMoneyAvailable.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/${(.9 * targetMaxMoney).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`)
			await ns.asleep(1000);
		}
	}
}