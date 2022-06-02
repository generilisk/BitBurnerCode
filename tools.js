/** @param {NS} ns **/

// Returns a full list of servers on the network
export function nestingScan(ns) {
	var serList = ["home"];
	var serCount = serList.length;
	var curList = [];
	var curCount = 0;
	var c = 0
	for (var s = 0; s < serCount; s++) {
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
