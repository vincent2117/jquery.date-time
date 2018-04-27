;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory); // requireJs在当前目录引入jquery
    } else if (typeof exports === 'object') {
        // Node/CommonJS.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
    // 两个自调用函数
}(function ($, window, document, undefined) {
    if (!$ || !$.fn || !$.fn.jquery) {
        alert('在引用jquery.datetime.js之前，先引用jQuery，否则无法使用 dateTime');
        return;
    }
    var _win = window, _doc = document, $win = $(_win), pluginName = "datetime",_this = DateTime.prototype,
        defaults = {
            target:'input',
            color:'',
            backgroundColor: 'rgba(0,0,0,.7)',
        }

    function DateTime(element, options) {
        this.ele = element;
        this.$ele = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.version = 'v1.0.1';
        this.init();
    }

    DateTime.prototype = {
        constructor:DateTime,
        init: function () {
            //disable on touch devices
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return;
            }
            console.log(_this);
            this.ele.innerHTML = "<div>loading...</div>";
        },

    };

    $.fn[pluginName] = function(options) {

        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                // 传进去的this 是each 出来的原生js对象
                $.data(this, "plugin_" + pluginName, new DateTime(this, options));
            }
        });

        // chain jQuery functions , this 是jquery 对象
        return this;
    };



}));

