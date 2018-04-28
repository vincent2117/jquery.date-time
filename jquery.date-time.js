/**
 基本思路:
 1  一个月份最多有31天，需要一个7X6的表格去装载
 2  蔡勒公式: 可以得出某个月份1号是星期几，这个月份有多少天，然后循环出该月的日历
 3  蔡勒公式：var week = y + parseInt(y/4) + parseInt(c/4) - 2*c + parseInt(26*(m+1)/10) + d - 1;

 # c是年份的前两位，y是年份的后两份（2016年，c是20，y就是16）,m是月份,d是日期，把week%7后得出的结果就是星期几
 # 但是1,2月要当成上一年的13,14月进行计算，比如2016.2.3，就要换算成2015.14.3来使用蔡勒公式
 # week是正数和负数时求模是不一样的，负数时要 (week%7+7)%7，正数时直接求模 week%7，
 # 还有得知道这个月份有多少天，1、3、5、7、8、10、12月是31天，4、6、9、11月是30天，
 # 2月分闰年和平年，平年是28天，闰年是29天，闰年是能被4整除但不能被100整除的，好了有了些前提下，还是能很快写出JS的

 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory(root)); // requireJs在当前目录引入jquery
    } else if (typeof exports === 'object') {
        // Node/CommonJS.
        module.exports = factory(root);
    } else {
        // 浏览器(Browser globals)
        factory(root);
    }
    // 匿名函数 (function 作为参数) , root 是根对象: JS 是window , nodeJS 是 global
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
    // 验证是否引用jquery
    if (typeof $ === 'undefined' || typeof $.fn === 'undefined' || typeof $.fn.jquery === 'undefined') {
        console.log('在引用jquery.date-time.js之前，先引用jQuery，否则无法使用 dateTime');
        return;
    }
    //disable on touch devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return;
    }

    var doc = root.document, pluginName = "dateTime";

    const DEFAULTS = {
        language: {
            name: "cn",
            month: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            weeks: ["日", "一", "二", "三", "四", "五", "六"],
            times: ["小时", "分钟", "秒数"],
            titText: "请选择日期时间",
            clear: "清空",
            today: "现在",
            yes: "确定",
            close: "关闭"
        },
        range: false,
        trigger: "click",
        format: "YYYY-MM-DD hh:mm:ss", //日期格式
        minDate: "1900-01-01 00:00:00", //最小日期
        maxDate: "2099-12-31 23:59:59" //最大日期
    }

    function DateTime(ele, options) {
        this.name = 'date-titme';
        this.version = 'v1.0.1';
        this.ele = ele; // dom 对象
        this._defaults = DEFAULTS;
        this.settings = $.extend({}, DEFAULTS, options);
        this.init();
    }

    DateTime.prototype = {
        constructor: DateTime,
        init: function () {
            this.createTable();
            this.clickEvent();
        },
        createTable: function () {
            var table = $(
                '<div id="dateTimeTable">' +
                '<div class="month">' +
                '<span class="littleYear">&lt&lt</span>' +
                '<span class="littleMonth">&lt</span>' +
                '<a><span class="textYear">2018年</span><span class="textMonth">5月</span></a>' +
                '<span class="bigYear">&gt</span>' +
                '<span class="bigMonth">&gt&gt</span>' +
                '</div>' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<th class="sun">日</th>' +
                '<th>一</th>' +
                '<th>二</th>' +
                '<th>三</th>' +
                '<th>四</th>' +
                '<th>五</th>' +
                '<th class="sta">六</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
                '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
                '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
                '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
                '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>' +
                '</tbody>' +
                '</table>' +
                '<div class="dateFooter">' +
                '<div class="footerCenter">' +
                    '<span>时间选择</span>'+
                    '<span>' +
                    '<span class="empty">清空</span>' +
                    '<button class="confirm">确定</button>' +
                    '</span>'+
                '</div>'+

                '</div>'+
                '</div>'
            );
            this.$table = table;
            this.$td = this.$table.find('td');
        },
        clickEvent: function () {
            var _this = this;
            // 输入框点击事件
            this.ele.on('click', function (e) {
                _this.$table.css({
                    position: 'absolute',
                    top: _this.ele.offset().top + _this.ele.height() + 5,
                    left: _this.ele.offset().left,
                    width: '220px',
                    display:"none",
                });

                $("body").append(_this.$table);
                _this.$table.slideDown(50);

                _this.dateCount(); // 计算日期
                e.stopPropagation();
            });
            // 日期点击事件
            this.$td.on('click', function () {
                _this.$td.removeClass('tdActive');
                console.log(this);
                $(this).addClass('tdActive');
            });


            _this.$table.on('click', function (e) {

                e.stopPropagation();
            });

            $(doc).on('click', function () {
                _this.$table && _this.$table.css('display', 'none');
            });
        },
        dateCount: function () {
            var date = new Date(),
                yy = date.getFullYear(),
                mm = date.getMonth() + 1,
                dd = date.getDate(), days;

            if (mm == 2 && yy % 4 == 0 && yy % 100 !== 0) {
                days = 28;
            } else if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
                days = 31;
            } else if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
                days = 30;
            } else {
                days = 29;
            }

            var m = mm < 3 ? (mm == 1 ? 13 : 14) : mm;
            yy = m > 12 ? yy - 1 : yy;
            var c = Number(yy.toString().substring(0, 2)),
                y = Number(yy.toString().substring(2, 4)),
                d = 1;
            //蔡勒公式
            var week = y + parseInt(y / 4) + parseInt(c / 4) - 2 * c + parseInt(26 * (m + 1) / 10) + d - 1;

            week = week < 0 ? (week % 7 + 7) % 7 : week % 7;

            for (var i = 0; i < 42; i++) {
                this.$td.eq(i).text('');　　　　//清空原来的text文本
            }

            for (var i = 0; i < days; i++) {
                this.$td.eq(week % 7 + i).text(i + 1);
            }
        },
    };

    $.fn[pluginName] = function (options) {
        var _this = this;
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                // 传进去的this 是each 出来的原生js对象
                $.data(this, "plugin_" + pluginName, new DateTime($(this), options));
            }
        });

        // this 是jquery 对象
        return this;
    };


});

