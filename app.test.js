import {
	expect
} from 'chai';
import {
	bookAndCancel,
} from './app-for-test.js';

describe('正则匹配的初步检查', function() {
	// it('U123 2016-06-02 20:00~22:00 A C 应该通过', function() {
	// 	expect(bookAndCancel('U123 2016-06-02 20:00~22:00 A C')).to.be.true;
	// });
	it('U123 2016-06-01 20:00~22:00 A 应该通过', function() {
		expect(bookAndCancel('U123 2016-06-01 20:00~22:00 A')).to.be.true;
	});
	it('U123 2016-06-02 20:00~22:00 不应该通过', function() {
		expect(bookAndCancel('U123 2016-06-02 20:00~22:00')).to.be.false;
	});
	it('U123 2016-12-02 20:00~22:00 A B不应该通过', function() {
		expect(bookAndCancel('U123 2016-12-02 20:00~22:00 A B')).to.be.false;
	});
	it('U123 2016-12-02 20:00~22:00 B 应该通过', function() {
		expect(bookAndCancel('U123 2016-12-02 20:00~22:00 B')).to.be.true;
	});
	it(' 2016-12-02 20:00~22:00 B 不应该通过', function() {
		expect(bookAndCancel(' 2016-12-02 20:00~22:00 B')).to.be.false;
	});

});

describe("日期的合法化检查", function() {
	it('U123 2016-13-02 20:00~22:00 A 月份不对', function() {
		expect(bookAndCancel('U123 2016-13-02 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-06-2 20:00~22:00 A 日子不对', function() {
		expect(bookAndCancel('U123 2016-06-2 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-00-02 20:00~22:00 A 月份不对', function() {
		expect(bookAndCancel('U123 2016-00-02 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-2-31 20:00~22:00 A 日子超了不对', function() {
		expect(bookAndCancel('U123 2016-2-31 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-2-2 20:00~22:00 A 月份日子不对', function() {
		expect(bookAndCancel('U123 2016-2-2 20:00~22:00 A')).to.be.false;
	});
	/*下面对特殊月份进行检查：
		new Date('2015-02-28')
		Sat Feb 28 2015 08:00:00 GMT+0800 (马来西亚半岛标准时间)
		new Date('2015-02-29')
		Sun Mar 01 2015 08:00:00 GMT+0800 (马来西亚半岛标准时间)
		new Date('2015-02-30')
		Mon Mar 02 2015 08:00:00 GMT+0800 (马来西亚半岛标准时间)
		new Date('2015-02-31')
		Tue Mar 03 2015 08:00:00 GMT+0800 (马来西亚半岛标准时间)
		new Date('2015-02-32')
		Invalid Date
	*/
	// it('U123 2015-02-29 20:00~22:00 A 2月天数超了', function() {
	// 	expect(bookAndCancel('U123 2015-02-29 20:00~22:00 A')).to.be.false;
	// });
	// it('U123 2015-02-30 20:00~22:00 A 2月天数超了', function() {
	// 	expect(bookAndCancel('U123 2015-02-30 20:00~22:00 A')).to.be.false;
	// });
	// it('U123 2015-02-31 20:00~22:00 A 2月天数超了', function() {
	// 	expect(bookAndCancel('U123 2015-02-31 20:00~22:00 A')).to.be.false;
	// });
	// it('U123 2012-02-29 20:00~22:00 A 瑞年2月天数没超', function() {
	// 	expect(bookAndCancel('U123 2012-02-29 20:00~22:00 A')).to.be.true;
	// });
	// it('U123 2012-02-30 20:00~22:00 A 瑞年2月天数超了', function() {
	// 	expect(bookAndCancel('U123 2012-02-30 20:00~22:00 A')).to.be.false;
	// });

})

describe("时间的合法化检查", function() {
	it('U123 2016-13-02 20:00~22:00 A 月份不对', function() {
		expect(bookAndCancel('U123 2016-13-02 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-06-2 20:00~22:00 A 日子不对', function() {
		expect(bookAndCancel('U123 2016-06-2 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-00-02 20:00~22:00 A 月份不对', function() {
		expect(bookAndCancel('U123 2016-00-02 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-2-31 20:00~22:00 A 日子超了不对', function() {
		expect(bookAndCancel('U123 2016-2-31 20:00~22:00 A')).to.be.false;
	});
	it('U123 2016-2-2 20:00~22:00 A 月份日子不对', function() {
		expect(bookAndCancel('U123 2016-2-2 20:00~22:00 A')).to.be.false;
	});
})

describe("预定和取消功能检测", function() {
	it('U123 2016-06-03 20:00~22:00 A 预定成功', function() {
		expect(bookAndCancel('U123 2016-06-03 20:00~22:00 A')).to.be.true;
	});
	it('U123 2016-06-03 20:00~22:00 A C 取消成功', function() {
		expect(bookAndCancel('U123 2016-06-03 20:00~22:00 A C')).to.be.true;
	});
	it('U123 2016-06-03 20:00~22:00 A 再次预定成功', function() {
		expect(bookAndCancel('U123 2016-06-03 20:00~22:00 A')).to.be.true;
	});
	it('U123 2016-06-03 20:00~22:00 A C 再次取消成功', function() {
		expect(bookAndCancel('U123 2016-06-03 20:00~22:00 A C')).to.be.true;
	});
	it('U123 2016-06-03 20:00~22:00 A 3rd次预定成功', function() {
		expect(bookAndCancel('U123 2016-06-03 20:00~22:00 A')).to.be.true;
	});
	it('U123 2016-06-03 20:00~22:00 A C 3rd次取消成功', function() {
		expect(bookAndCancel('U123 2016-06-03 20:00~22:00 A C')).to.be.true;
	});
	it('U123 2016-06-02 22:00~22:00 时间错误预定失败', function() {
		expect(bookAndCancel('U123 2016-06-02 22:00~22:00')).to.be.false;
	});
	it('U123 2016-12-01 20:00~22:00 B 预定成功', function() {
		expect(bookAndCancel('U123 2016-12-01 20:00~22:00 B')).to.be.true;
	});
	it('U123 2016-12-02 20:00~22:00 A C 没有预定取消失败', function() {
		expect(bookAndCancel('U123 2016-12-02 20:00~22:00 A C')).to.be.false;
	});
	it('U123 2016-12-01 20:00~22:00 B 已经被预定预定失败', function() {
		expect(bookAndCancel('U123 2016-12-01 20:00~22:00 B')).to.be.false;
	});
})

describe("收入汇总测试", function() {
	it('收入汇总测试，输入一个空格 ', function() { //一个空格
		expect(bookAndCancel(' ')).to.be.true;
	});

})