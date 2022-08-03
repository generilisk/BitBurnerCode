/** @param {NS} ns */
import {
	rootAccessList
}
from './tools.js';
export async function main(ns) {
	//set up actual servers
	let serverList = ["dedicatedGrower", "dedicatedWeakener"]
	let serverRAM = ns.getPurchasedServerMaxRam()
	serverList.forEach((serverName) => {
		if (!ns.getPurchasedServers().includes(serverName)) {
			ns.purchaseServer(serverName, serverRAM)
			ns.tprintf(`Purchased ${serverName} with ${serverRAM}GB of RAM for \$${ns.getPurchasedServerCost(serverRAM)}`)
		} else {
			ns.tprintf(`A server named ${serverName} already exists.`)
		}
	})
	await ns.scp("noWeakenOnlyGrow.js", "dedicatedGrower")
	await ns.scp("noGrowOnlyWeaken.js", "dedicatedWeakener")
	let targetList = rootAccessList(ns)
	let dedicatedWeakenRAMCost = ns.getScriptRam("noGrowOnlyWeaken.js", "dedicatedWeakener")
	let dedicatedGrowRAMCost = ns.getScriptRam("noWeakenOnlyGrow.js", "dedicatedGrower")
	ns.tprintf("Weaken RAM: " + dedicatedWeakenRAMCost)
	ns.tprintf("Grow RAM: " + dedicatedGrowRAMCost)
	let dedicatedWeakenRAM = ns.getServerMaxRam("dedicatedWeakener") - ns.getServerUsedRam("dedicatedWeakener")
	let weakenTotalThreadCount = Math.floor(dedicatedWeakenRAM / dedicatedWeakenRAMCost)
	let dedicatedGrowRAM = ns.getServerMaxRam("dedicatedGrower") - ns.getServerUsedRam("dedicatedGrower")
	let growTotalThreadCount = Math.floor(dedicatedGrowRAM / dedicatedGrowRAMCost)
	let moneyAvailableTotal = 0
	for (let targetServer of targetList) {
		moneyAvailableTotal += ns.getServerMaxMoney(targetServer)
	}
	for (let targetServer of targetList) {
		//set up dedicated Weaken & Grow variables
		let threadPercent = ns.getServerMaxMoney(targetServer) / moneyAvailableTotal
		let weakenThreadCount = Math.floor(weakenTotalThreadCount * threadPercent)
		let growThreadCount = Math.floor(growTotalThreadCount * threadPercent)
		let targetMaxMoney = ns.getServerMaxMoney(targetServer)
		let targetMinSecuritylevel = ns.getServerMinSecurityLevel(targetServer)
		if (weakenThreadCount > 0) {
			ns.exec("noGrowOnlyWeaken.js", "dedicatedWeakener", weakenThreadCount, targetServer, targetMinSecuritylevel)
			ns.printf(`Looping ${weakenThreadCount} threads to weaken ${targetServer}`)
		} else {
			ns.printf(`${targetServer} has insufficient money to justify a thread.`)
		}
		if (growThreadCount > 0) {
			ns.exec("noWeakenOnlyGrow.js", "dedicatedGrower", growThreadCount, targetServer, targetMaxMoney)
			ns.printf(`Looping ${growThreadCount} threads to grow ${targetServer}`)
		} else {
			ns.printf(`${targetServer} has insufficient money to justify a thread.`)
		}
	}
}