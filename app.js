//new Date('2017-03-32').toString() "Invalid Date"

var result = {}; //保存存在的预定
var reducedIncome;
var income = {
	incomeSum: 0,
	A: [],
	B: [],
	C: [],
	D: [],
}; //账单


//时间排序
//格式输出
//处理一个场地的情况
function printedIncome(place) {
	var printedResult = [];
	var re = /(\d{4}-\d{2}-\d{2})(\d{2}:00)(\d{2}:00)/;
	printedResult.income = 0;
	place.forEach((v) => {
			var info = Object.keys(v)[0];
			var payInfo = v[info];
			//console.log(info, payInfo)
			var money = ("" + payInfo).match(/\d+/)[0];
			printedResult.income += +money;
			var arr = info.match(re).slice(1, 4);
			var str = `${arr[0]} ${arr[1]}~${arr[2]} ${payInfo}元\n`;
			//console.log(str);
			printedResult.push(str)
		})
		// var x = 'U1232016-06-0320:0022:00A'.match(re).slice(1, 4)
		// 	//["2016-06-03", "20:00", "22:00"]
	var str = '小计：' + printedResult.income + "元\n";
	printedResult.push(str);
	return printedResult.sort().join('');
}


function bookAndCancel(str) {
	//程status序输出收入汇总

	if (/^\s$/.test(str)) {
		var str = `
收入汇总
---
场地：A
${printedIncome(income.A)}
场地：B
${printedIncome(income.B)}
场地：C
${printedIncome(income.C)}
场地：D
${printedIncome(income.D)}---
总计：${income.incomeSum}`;


		console.log(str);
		// console.log(income);
		// console.log(result);
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
		var allInfo = matchArr.join("").replace(/\s+/, '');
		var incomeInfo = matchArr
		if (status.indexOf('C') < 1) {
			var bookedStr = allInfo; //去除多余空格
			if (!(bookedStr in result)) {
				result[bookedStr] = incomeArr;
				addIncome(bookedStr, incomeArr, income);

			} else {
				console.log("Error: the booking conflicts with existing bookings!")
				return false;
			}
		} else { //取消
			var cancelStr = allInfo.slice(0, -1); //去掉C
			if (cancelStr in result) {
				delete result[cancelStr];
				cancelIncome(cancelStr, incomeArr, income)

			} else {
				console.log('Error: the booking being cancelled does not exist!')
				return false;
			}
		}
		console.log("Success: the booking is accepted!")
			//console.log(result)
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
		reducedIncome = income / 4;
		incomeArr = incomeArr.concat(income, reducedIncome);
	}
	return incomeArr;

}

//预定时记录账单
function addIncome(bookedStr, incomeArr, income) {
	var status = bookedStr.slice(-1); //哪一组
	var incomeInfo = bookedStr.slice()
	switch (status) {
		case 'A':
			var obj = {};
			obj[bookedStr] = incomeArr[0];
			income.A.push(obj)
			break;
		case 'B':
			var obj = {};
			obj[bookedStr] = incomeArr[0];
			income.B.push(obj)
			break;
		case 'C':
			var obj = {};
			obj[bookedStr] = incomeArr[0];
			income.C.push(obj)
			break;
		case 'D':
			var obj = {};
			obj[bookedStr] = incomeArr[0];
			income.D.push(obj)
			break;
	}
	income.incomeSum += incomeArr[0];
}

//取消预定后的账单
function cancelIncome(cancelStr, incomeArr, income) {
	var status = cancelStr.slice(-1); //哪一组
	deleteIncome(status, cancelStr, income); //删除预定时的原账单
	switch (status) {
		case 'A':
			var obj = {};
			obj[cancelStr] = "违约金" + " " + incomeArr[1];
			income.A.push(obj)
			break;
		case 'B':
			var obj = {};
			obj[cancelStr] = "违约金" + " " + incomeArr[1];
			income.B.push(obj)
			break;
		case 'C':
			var obj = {};
			obj[cancelStr] = "违约金" + " " + incomeArr[1];
			income.C.push(obj)
			break;
		case 'D':
			var obj = {};
			obj[cancelStr] = "违约金" + " " + incomeArr[1];
			income.D.push(obj)
			break;
	}
	income.incomeSum -= incomeArr[0];
	income.incomeSum += incomeArr[1];
}

function deleteIncome(status, cancelStr, income) {
	var arr = income[status];
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		if (cancelStr in arr[i]) {
			arr.splice(i, 1);
			break;
		}
	}
}
module.exports = {
	bookAndCancel,
	result,
	income,
	computedIncome,
	deleteIncome
};