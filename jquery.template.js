;(function (root,factory) {
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
    var  doc = document, $root = $(root), pluginName = "dateTime",_this = DateTime.prototype;
    const DEFAULTS = {
        target: 'input',
        color: '',
        backgroundColor: 'rgba(0,0,0,.7)',
    }

    function DateTime(element, options) {
        this.ele = element;
        this.$ele = $(element);
        this.settings = $.extend({}, DEFAULTS, options);
        this._defaults = DEFAULTS;
        this._name = pluginName;
        this.version = 'v1.0.1';
        this.init();
    }

    DateTime.prototype = {
        constructor: DateTime,
        init: function () {
            //disable on touch devices
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return;
            }

            this.ele.innerHTML = "<div>loading...</div>";
        },

    };

    $.fn[pluginName] = function (options) {

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

