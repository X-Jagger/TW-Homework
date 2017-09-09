//new Date('2017-03-32').toString() "Invalid Date"

var result = {
	incomeSum: 0,
	incomeA: 0,
	incomeB: 0,
	incomeC: 0,
	incomeD: 0,
};
var reducedIncome;

function bookAndCancel(str, result) {
	//程序输出收入汇总

	if (/^\s$/.test(str)) {
		var str = `收入汇总\n---
		场地：A${result.incomeA}\n小计：${result.incomeA}\n
		场地：B${result.incomeB}\n小计：${result.incomeB}\n
		场地：C${result.incomeC}\n小计：${result.incomeC}\n
		场地：D${result.incomeD}\n小计：${result.incomeD}\n
		---
		总计：${result.incomeSum}`;
		console.log(str);
		return true;
	}
	var re = /^(\w+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:00)~(\d{2}:00)\s+(([ABCD]\s*$)|([ABCD]\sC\s*$))/;
	if (!re.test(str)) {
		console.log("Error: the booking is invalid!")
		return false;
	} else {
		var matchArr = str.match(re).slice(1, 6);
		//console.log(matchArr)
		var id = matchArr[0];
		var date = matchArr[1];
		var startTime = matchArr[2].substr(0, 2); //小时数
		var endTime = matchArr[3].substr(0, 2);
		var status = matchArr[4];
		var isDate = new Date(date).toString() !== "Invalid Date" ? true : false;
		var isTime = (endTime > startTime) && (endTime <= 22 && startTime >= 9) ? true : false;
		if (!isDate || !isTime) {
			console.log("Error: the booking is invalid!");
			return false;
		}
		var weekday = new Date(date).getDay();
		var incomeArr = computedIncome(weekday, startTime, endTime)

		//预定
		var info = matchArr.join("").replace(/\s+/, '');
		if (status.indexOf('C') < 1) {
			var bookedStr = info; //去除多余空格
			if (!(bookedStr in result)) {
				result[bookedStr] = incomeArr;
				result.incomeSum += incomeArr[0];
			} else {
				console.log("Error: the booking conflicts with existing bookings!")
				return false;
			}
		} else { //取消
			var cancelStr = info.slice(0, -1); //去掉C
			if (cancelStr in result) {
				delete result[cancelStr];
				result.incomeSum -= incomeArr[1];
			} else {
				console.log('Error: the booking being cancelled does not exist!')
				return false;
			}
		}
		console.log("Success: the booking is accepted!")
		console.log(result)
		return true;
	}
}

function computedIncome(weekday, a, b) {
	var income = 0;
	var leftIncome = 0; //留下来的钱
	var incomeArr = [];
	if (weekday < 6) { //周一到周五
		if (a < 12) {
			if (b <= 12) income = (b - a) * 30;
			else if (12 < b && b <= 18) income = 90 + (b - 12) * 50;
			else if (18 < b && b <= 20) income = 390 + (b - 18) * 80;
			else if (20 < b && b <= 22) income = 550 + (b - 20) * 60;
		} else if (12 <= a && a < 18) {
			if (b <= 18) income = (b - a) * 50;
			else if (18 < b && b <= 20) income = 300 + (b - 18) * 80;
			else if (20 < b && b <= 22) income = 460 + (b - 20) * 60;
		} else if (18 <= a && a < 20) {
			if (b <= 20) income = (b - a) * 80;
			else if (20 < b && b <= 22) income = 160 + (b - 20) * 60;
		} else if (20 <= a && a < 22) {
			if (b <= 22) income = (b - a) * 60;
		}
		reducedIncome = income / 2;
		incomeArr = incomeArr.concat(income, reducedIncome);
	} else { //周六周日
		if (a < 12) {
			if (b <= 12) income = (b - a) * 40;
			else if (12 < b && b <= 18) income = 120 + (b - 12) * 50;
			else if (18 < b && b <= 22) income = 390 + (b - 18) * 80;

		} else if (12 <= a && a < 18) {
			if (b <= 18) income = (b - a) * 50;
			else if (18 < b && b <= 22) income = 300 + (b - 18) * 60;
		} else if (18 <= a && a < 22) {
			if (b <= 22) income = (b - a) * 60;
		}
		reducedIncome = income / 4 * 3;
		incomeArr = incomeArr.concat(income, reducedIncome);
	}
	return incomeArr;

}
module.exports = {
	bookAndCancel,
	result,
	computedIncome,
};