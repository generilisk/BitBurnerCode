/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("ALL")
	const targetServer = ns.args[0]
	const targetMinSecuritylevel = ns.args[1]
	while (true) {
		let targetSecurityLevel = ns.getServerSecurityLevel(targetServer)
		if (targetMinSecuritylevel < targetSecurityLevel) {
			ns.print(`${targetServer} is at security level ${targetSecurityLevel.toFixed(3)} with a minimum of ${targetMinSecuritylevel}. Weakening now...`)
			await ns.weaken(targetServer)
		} else {
			ns.print(`${targetServer} is already at security level ${targetSecurityLevel}`)
			await ns.asleep(10000)
		}
	}
}