(function() {
	var result = {}; //存订单信息
	var income = { //收入信息
		incomeSum: 0,
		A: [],
		B: [],
		C: [],
		D: [],
	};
	var place = 'ABCD'; //四个场地
	//测试信息
	var testStr = `
可供测试1
abcdefghijklmnopqrst1234567890
U001 2016-06-02 22:00~22:00 A
U002 2017-08-01 19:00~22:00 A
U003 2017-08-02 13:00~17:00 B
U004 2017-08-03 15:00~16:00 C
U005 2017-08-05 09:00~11:00 D
可供测试2
U002 2017-08-01 19:00~22:00 C
U003 2017-08-01 18:00~20:00 A
U002 2017-08-01 19:00~22:00 A C
U002 2017-08-01 19:00~22:00 A C
U003 2017-08-01 18:00~20:00 A
U003 2017-08-02 13:00~17:00 C
请复制粘贴食用 :)`;


	//主函数，处理输入
	function bookAndCancel(str) {
		var re = new RegExp('^(\\w+)\\s+(\\d{4}-\\d{2}-\\d{2})\\s+(\\d{2}:00)~(\\d{2}:00)\\s+(([' + place + ']\\s*$)|([' + place + ']\\sC\\s*$))');
		//var re = /^(\w+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:00)~(\d{2}:00)\s+(([ABCD]\s*$)|([ABCD]\sC\s*$))/;

		//基本格式正则判断
		if (!re.test(str)) {
			textarea.innerHTML = ("Error: the booking is invalid!");
			return false;
		} else {
			//str==["U001 2016-06-02 22:00~22:00 A C", "U001", "2016-06-02", "22:00", "22:00", "A C",..]
			var matchArr = str.match(re).slice(1, 6);
			var date = matchArr[1];
			var startTime = matchArr[2].substr(0, 2); //小时数
			var endTime = matchArr[3].substr(0, 2);
			var status = matchArr[4].slice(0, 1); // ABCD
			var isDate = (new Date(date).toString().split(' ')[2] == date.slice(-2)) ? true : false;
			var isTime = (endTime > startTime) && (endTime <= 22 && startTime >= 9) ? true : false;
			if (!isDate || !isTime) {
				textarea.innerHTML = ("Error: the booking is invalid!");
				return false;
			}
			var weekday = new Date(date).getDay(); //1/2/3..
			var incomeArr = computedIncome(weekday, startTime, endTime);
			var order = {
					user: matchArr[0],
					date: date,
					startTime: startTime,
					endTime: endTime,
					status: status,
					weekday: weekday,
				}
				//预定和取消
				//首先去除多余空格：U0012016-06-0222:00~22:00AC
			console.log(order);
			var allInfo = matchArr.join("").replace(/\s+/g, '');

			//如果是预定
			var isbook = !new RegExp('^[' + place + ']C$').test(allInfo.slice(-2));
			//var isbook = !/^[ABCD]C$/.test(allInfo.slice(-2));
			if (isbook) {
				var bookedStr = allInfo;
				if (notConflict(date, startTime, endTime, status)) {
					result[bookedStr] = incomeArr;
					addIncome(order, bookedStr, incomeArr, income);
				} else {
					textarea.innerHTML = ("Error:! the booking conflicts with existing bookings!");
					return false;
				}
				//取消
			} else {
				var cancelStr = allInfo.slice(0, -1); //去掉C
				if (cancelStr in result) {
					delete result[cancelStr];
					cancelIncome(order, cancelStr, incomeArr, income);

				} else {
					textarea.innerHTML = ('Error: the booking being cancelled does not exist!');
					return false;
				}
			}
			textarea.innerHTML = ("Success: the booking is accepted!");
			return true;
		}
	}

	//判断是否日期时间场地冲突
	function notConflict(date, startTime, endTime, status) {
		var _re = /(\d{4}-\d{2}-\d{2})(\d{2}:00)(\d{2}:00)(\w)/;
		var resultArr = Object.keys(result);
		var isconflict = true;
		for (var i = 0; i < resultArr.length; i++) {
			var v = resultArr[i];
			var _arr = v.match(_re).slice(1, 5);
			var _date = _arr[0];
			var _startTime = _arr[1].slice(0, 2);
			var _endTime = _arr[2].slice(0, 2);
			var _status = _arr[3];
			if (_date == date && _status == status && !(_startTime >= endTime || _endTime <= startTime)) {
				isconflict = false;
				break;
			}
		}
		return isconflict;
	}


	//计算收入，返回包含预定收入和毁约收入的数组
	function computedIncome(weekday, a, b) {
		var income = 0;
		var incomeArr = [];
		var reducedIncome;
		if (weekday < 6) { //周一到周五
			if (a < 12) {
				if (b <= 12) income = (b - a) * 30;
				else if (12 < b && b <= 18) income = (12 - a) * 30 + (b - 12) * 50;
				else if (18 < b && b <= 20) income = (12 - a) * 30 + 300 + (b - 18) * 80;
				else if (20 < b && b <= 22) income = (12 - a) * 30 + 460 + (b - 20) * 60;
			} else if (12 <= a && a < 18) {
				if (b <= 18) income = (b - a) * 50;
				else if (18 < b && b <= 20) income = (18 - a) * 50 + (b - 18) * 80;
				else if (20 < b && b <= 22) income = (18 - a) * 50 + 160 + (b - 20) * 60;
			} else if (18 <= a && a < 20) {
				if (b <= 20) income = (b - a) * 80;
				else if (20 < b && b <= 22) income = (20 - a) * 80 + (b - 20) * 60;
			} else if (20 <= a && a < 22) {
				if (b <= 22) income = (b - a) * 60;
			}
			reducedIncome = income / 2;
			incomeArr = incomeArr.concat(income, reducedIncome);
		} else { //周六周日
			if (a < 12) {
				if (b <= 12) income = (b - a) * 40;
				else if (12 < b && b <= 18) income = (12 - a) * 40 + (b - 12) * 50;
				else if (18 < b && b <= 22) income = (12 - a) * 40 + 300 + (b - 18) * 80;

			} else if (12 <= a && a < 18) {
				if (b <= 18) income = (b - a) * 50;
				else if (18 < b && b <= 22) income = (18 - a) * 50 + (b - 18) * 60;
			} else if (18 <= a && a < 22) {
				if (b <= 22) income = (b - a) * 60;
			}
			reducedIncome = income / 4;
			incomeArr = incomeArr.concat(income, reducedIncome);
		}
		return incomeArr;

	}
	//预定，账单
	function addIncome(order, bookedStr, incomeArr, income) {
		var status = bookedStr.slice(-1); //哪一组
		order[bookedStr] = incomeArr[0];
		income[status].push(order);
		income.incomeSum += incomeArr[0];
		console.log(income)
	}

	//取消，账单
	function cancelIncome(order, cancelStr, incomeArr, income) {
		var status = cancelStr.slice(-1); // A/B/C/D
		deleteIncome(status, cancelStr, income); //删除预定时的原账单
		order[cancelStr] = "违约金" + " " + incomeArr[1];
		income[status].push(order);
		income.incomeSum -= incomeArr[0];
		income.incomeSum += incomeArr[1];
	}

	//删除取消的订单
	function deleteIncome(status, cancelStr, income) {
		var arr = income[status];
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			if (cancelStr in arr[i]) {
				if ((typeof arr[i][cancelStr]) === "number") {
					arr.splice(i, 1);
					break;
				}
			}
		}
	}

	//单个场地收入输出
	function printedIncome(place) {
		var printedResult = [];
		var re = /(\d{4}-\d{2}-\d{2})(\d{2}:00)(\d{2}:00)/;
		printedResult.income = 0;
		place.forEach((v) => {
			var keys = Object.keys(v);
			var len = keys.length;
			var info = Object.keys(v)[len - 1];
			var payInfo = v[info];
			var money = ("" + payInfo).match(/\d+/)[0];
			printedResult.income += +money;
			var arr = info.match(re).slice(1, 4);
			var str = `${arr[0]} ${arr[1]}~${arr[2]} ${payInfo}元\n`;
			printedResult.push(str)
		});
		var str = '小计：' + printedResult.income + "元\n";
		printedResult.push(str);
		return printedResult.join('');
	}

	function clickEvent() {
		var textarea = document.getElementById('textarea');
		textarea.innerHTML = testStr;
		var submit = document.getElementById("submit");
		var input = document.getElementById("input");
		var print = document.getElementById("print");
		print.onclick = function(e) {
			e.preventDefault();
			//discount(income);
			var resultText1 = `
收入汇总
---
`
			var resultText3 = `---
总计：${income.incomeSum}元`;
			var resultText2 = ``;
			for (var i = 0; i < place.length; i++) {
				var v = place[i];
				resultText2 += `场地: ${v}\n`;
				if (i == place.length - 1) resultText2 += `${printedIncome(income[v])}`;
				else resultText2 += `${printedIncome(income[v])}\n`;
			}
			var resultText = resultText1 + resultText2 + resultText3;
			textarea.innerHTML = resultText;
			input.value = "";
		}
		submit.onclick = function(e) {
			e.preventDefault();
			var value = input.value;
			bookAndCancel(value);
			input.value = "";
		}
		input.onfocus = function(e) {
			textarea.innerHTML = testStr;
		}
	}
	clickEvent();


	//如果要打折：比如八月一日当天打5折
	// function discount(income) {
	// 	console.log('hello');
	// 	var keys = Object.keys(income);
	// 	income.incomeSum = 0;
	// 	for (var i = 1; i < keys.length; i++) {
	// 		var place = income[keys[i]];
	// 		var l = place.length;
	// 		for (var j = 0; j < l; j++) {
	// 			var money;
	// 			var isViolation = true;
	// 			var k = Object.keys(place[j]);
	// 			var kl = k.length;
	// 			money = place[j][k[kl - 1]];
	// 			console.log('money is ', money)
	// 			if (typeof money === 'number') isViolation = false;
	// 			if (place[j].date.slice(5) === '08-01') {
	// 				money = !isViolation ? money / 2 : (money.slice(0, 4) + money.slice(4) / 2);
	// 				place[j][k[kl - 1]] = money;
	// 			}
	// 			income.incomeSum += !isViolation ? money : money.slice(4);
	// 		}
	// 	}
	// }

}())