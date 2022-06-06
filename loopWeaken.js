/** @param {NS} ns **/
export async function main(ns) {
	const targetServer = ns.args[0];
	while(true){
		if(ns.getServerMinSecurityLevel(targetServer)<ns.getServerSecurityLevel(targetServer)){
			await ns.weaken(targetServer);
		} else {
			await ns.asleep(10000);
		}
	}
}
