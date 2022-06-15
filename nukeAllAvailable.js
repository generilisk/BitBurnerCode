/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	var serList = ns.scan("home");
	ns.print(serList);
	var portOpeners = 0
	var errMoney = 0
	var errHackLevel = 0
	var errPorts = 0
	var errAccessExists = 0
	var errTotal = 0
	var curMoney = 0
	var reqPorts = 0
	var serCount = serList.length;
	var curList = [];
	var curCount = 0;
	var c = 0

	serList = ns.scan("home");
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
	ns.print(serList);


	if (ns.fileExists("BruteSSH.exe", "home")) { ++portOpeners };
	if (ns.fileExists("FTPCrack.exe", "home")) { ++portOpeners };
	if (ns.fileExists("relaySMTP.exe", "home")) { ++portOpeners };
	if (ns.fileExists("HTTPWorm.exe", "home")) { ++portOpeners };
	if (ns.fileExists("SQLInject.exe", "home")) { ++portOpeners };

	for (var s = 0; s < serList.length; s++) {
		var curServer = serList[s]
		reqPorts = ns.getServerNumPortsRequired(curServer)
		curMoney = ns.getServerMaxMoney(curServer)
		ns.print(curServer);
		if (curMoney = 0) {
			errMoney = 1
			ns.print(curServer + " has " + ns.getServerMaxMoney(curServer) + " available.")
		} else {
			errMoney = 0
		};
		if (ns.getServerRequiredHackingLevel(curServer) > ns.getHackingLevel()) {
			errHackLevel = 1
		} else {
			errHackLevel = 0
		};
		if (reqPorts > portOpeners) {
			errPorts = 1
		} else {
			errPorts = 0
		};
		if (ns.hasRootAccess(curServer)) {
			errAccessExists = 1
		} else {
			errAccessExists = 0
		};
		errTotal = errMoney + errHackLevel + errPorts + errAccessExists;
		if (errTotal > 0) {
			ns.print("	Issues encountered:");
			if (errMoney > 0) { ns.print("		Server does not host money") };
			if (errHackLevel > 0) { ns.print("		Server requires hacking level " + ns.getServerRequiredHackingLevel(curServer) + " but ours is only " + ns.getHackingLevel()) };
			if (errPorts > 0) { ns.print("		Server requires " + reqPorts + " ports; we can currently open " + portOpeners) };
			if (errAccessExists) { ns.print("		Access already exists.") };
		} else {
			if (reqPorts > 0 && ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(curServer) };
			if (reqPorts > 1 && ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(curServer) };
			if (reqPorts > 2 && ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(curServer) };
			if (reqPorts > 3 && ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(curServer) };
			if (reqPorts > 4 && ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(curServer) };
			if (portOpeners >= reqPorts) { ns.nuke(curServer) };
		};
	};
}
