/** @param {NS} ns **/

// Returns a full list of servers on the network
export function nestingScan(ns) {
	let serList = ["home"];
	let serCount = serList.length;
	let curList = [];
	let curCount = 0;
	let c = 0
	for (let s = 0; s < serCount; s++) {
		curList = ns.scan(serList[s])
		curCount = curList.length;
		for (c = 0; c < curCount; c++) {
			if (!serList.includes(curList[c])) {
				serList.push(curList[c])
			};
		};
		c = 0
		serCount = serList.length
	};
	return serList;
}

// Returns a list of servers with root access to run scripts against
export function rootAccessList(ns) {
	let rootAcesssList = []
	let fullServerList = nestingScan(ns)
	for (let s of fullServerList) {
		if (ns.hasRootAccess(s) && s != "home" && ns.getServerMaxMoney(s) > 0) {
			rootAcesssList.push(s)
		}
	}
	ns.print(rootAcesssList)
	return rootAcesssList;
}