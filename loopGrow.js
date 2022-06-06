/** @param {NS} ns **/
export async function main(ns) {
	const targetServer = ns.args[0];
	while(true){
		if(ns.getServerMoneyAvailable(targetServer)<ns.getServerMaxMoney(targetServer)){
			await ns.grow(targetServer);
		} else {
			await ns.asleep(10000);
		}
	}
}
