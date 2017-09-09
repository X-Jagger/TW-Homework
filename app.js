//new Date('2017-03-32').toString() "Invalid Date"

var result = {};
var incomeSum = 0;

function bookAndCancel(str, result) {
	var re = /^(\w+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:00)~(\d{2}:00)\s+(([ABCD]\s*$)|([ABCD]\sC\s*$))/;
	if (!re.test(str)) {
		console.log("Error: the booking is invalid!")
		return false;
	} else {
		var matchArr = str.match(re).slice(1, 6);
		console.log(matchArr)
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
			} else {
				console.log("Error: the booking conflicts with existing bookings!")
				return false;
			}
		} else { //取消
			var cancelStr = info.slice(0, -1); //去掉C
			if (cancelStr in result) delete result[cancelStr];
			else {
				console.log('Error: the booking being cancelled does not exist!')
				return false;
			}
		}
		console.log("Success: the booking is accepted!")
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
		leftIncome = income / 2;
		incomeArr.concat(income, leftIncome);
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
		leftIncome = income / 4;
		incomeArr.concat(income, leftIncome);
	}
	return incomeArr;

}
module.exports = {
	bookAndCancel,
	result,
};