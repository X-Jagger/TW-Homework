//new Date('2017-03-32').toString() "Invalid Date"

function bookAndCancel(str) {
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
		if ()

			console.log("Success: the booking is accepted!")
		return true;
	}

}
module.exports = bookAndCancel;