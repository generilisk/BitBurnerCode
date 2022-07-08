/** @param {NS} ns */
import {
	nestingScan
} from './tools.js';
export async function main(ns) {
	const fullList = nestingScan(ns)
	for (var s = 0; s < fullList.length; s++) {
		let currentServer = fullList[s]
		let currentServerContracts = ns.ls(currentServer, ".cct")
		if (currentServerContracts.length > 0) {
			ns.tprintf("     " +
				currentServerContracts.length +
				" contracts on " +
				currentServer +
				":"
			)
			for (var contractNumber = 0; contractNumber < currentServerContracts.length; contractNumber++) {
				ns.tprintf("		" +
					currentServerContracts[contractNumber] +
					": " +
					ns.codingcontract.getContractType(currentServerContracts[contractNumber], currentServer)
				)
			}
		} else {
			ns.print("No contracts on " +
				currentServer
			)
		}
	}
}