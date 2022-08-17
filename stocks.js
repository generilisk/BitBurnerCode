/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		ns.disableLog("ALL");
		const moneyReserve = .05;
		const probabilityCutoff = 0.06;
		const requiredReturn = 0.02;
		/*
		const moneyReserve = args[0];  a decimal percentage of your total money you want saved
		const probabilityCutoff = args[1]; a factor of probability confidence required to buy, .1 is ++ .2 is +++ and >.0 is +
		const requiredReturn = 0.02;   the required decimal percentage of return expected to buy
		*/
		let numCycles = 2;
		let stocks = [];
		let myStocks = [];
		let targetStocks = [];
		for (let i = 0; i < ns.stock.getSymbols().length; i++) {
			stocks.push({
				sym: ns.stock.getSymbols()[i]
			});
		}
		let corpus = ns.getServerMoneyAvailable("home");
		//get current stock prices, volatility
		for (let i = 0; i < stocks.length; i++) {
			let sym = stocks[i].sym;
			stocks[i].price = ns.stock.getPrice(sym);
			stocks[i].shares = ns.stock.getPosition(sym)[0];
			stocks[i].buyPrice = ns.stock.getPosition(sym)[1];
			stocks[i].vol = ns.stock.getVolatility(sym);
			stocks[i].prob = ns.stock.getForecast(sym) - 0.5;
			stocks[i].maxShares = ns.stock.getMaxShares(sym);
			corpus += stocks[i].price * stocks[i].shares;
			if (stocks[i].shares > 0) myStocks.push(stocks[i]);
		}
		//check for target stocks
		for (let i = 0; i < stocks.length; i++) {
			if (stocks[i].prob > probabilityCutoff) {
				targetStocks.push(stocks[i]);
				targetStocks.sort((a, b) => b.vol - a.vol);
			}
		}
		//sell if not in target stocks
		for (let i = 0; i < myStocks.length; i++) {
			if (!targetStocks.includes(myStocks[i])) {
				ns.stock.sellStock(myStocks[i].sym, myStocks[i].shares);
				ns.print(`Sold ${myStocks[i].shares} of ${myStocks[i].sym}`);
			}
		}
		//buy as much as can if in target
		for (let i = 0; i < targetStocks.length; i++) {
			//get money in hand and set money available
			var moneyAvailable = ns.getServerMoneyAvailable("home") - ((ns.getServerMoneyAvailable("home") + corpus) * moneyReserve);
			let sharesAvailable = targetStocks[i].maxShares - targetStocks[i].shares;
			let sharesAbletoBuy = Math.min(Math.floor(moneyAvailable / targetStocks[i].price), sharesAvailable);
			if (((targetStocks[i].price * sharesAbletoBuy) * (1 + requiredReturn)) - (targetStocks[i].price * sharesAbletoBuy) > 200000) {
				ns.stock.buyStock(targetStocks[i].sym, sharesAbletoBuy);
				ns.print(`Bought ${sharesAbletoBuy} of ${targetStocks[i].sym}`);
			}
		}
		await ns.sleep(numCycles * 6 * 1000);
	}
}