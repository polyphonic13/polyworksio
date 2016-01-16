(function(){(typeof console === 'undefined' || typeof console.log === 'undefined')?console={log:function(){}}:console.log('----- farkle created: 2015-03-21T09:56:23')})();
// LOGGING
function trace(message) {
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = { log:function(){} };
	} else {
		PWG.Utils.each(arguments,
			function(a) {
				console.log(a);
			},
			this
		);
	}
}


var PWG = PWG || {};
PWG.Utils = function() {
	var module = {};

	module.each = function(list, callback, context) {
		if(Array.isArray(list)) {
			for(var i = 0, length = list.length; i < length; i++) {
				callback.call(context, list[i], i, list);
			}
		} else {
			for(var key in list) {
				callback.call(context, list[key], key, list);
			}
		}
	};
	
	module.clone = function(original) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == original || "object" != typeof original) return original;

	    // Handle Date
	    if (original instanceof Date) {
	        var copy = new Date();
	        copy.setTime(original.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (original instanceof Array) {
			var copy = original.slice(0);
	        // var copy = [];
	        // for (var i = 0, len = original.length; i < len; i++) {
	        //     copy[i] = PWG.Utils.clone(original[i]);
	        // }
	        return copy;
	    }

	    // Handle Object
	    if (original instanceof Object) {
	        var copy = {};
	        for (var attr in original) {
	            if (original.hasOwnProperty(attr)) copy[attr] = PWG.Utils.clone(original[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy original! Its type isn't supported.");	
	};

	module.extend = function(a, b) {
		for(var key in b) {
			if(b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		} 
		return a;
	};

	module.extract = function(obj, prop) {
		var a = obj[prop];
		if(obj !== window) { delete obj[prop]; }
		return a;
	};

	module.has = function(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	};
	
	module.contains = function(list, value) {
		var contains = false;
		if(Array.isArray(list)) {
			if(list.indexOf(value) > -1) {
				contains = true;
			}
		} else {
			for(var key in list) {
				if(list.hasOwnProperty(key) && list[key] === value) {
					contains = true;
				}
			}
		}
		return contains;
	};

	module.find = function(list, match) {
		var element = null;
		if(Array.isArray(list)) {
			for(var i = 0, length = list.length; i < length; i++) {
				if(list[i] === match) {
					element = list[i];
					break;
				}
			}
		} else {
			for(var key in list) {
				if(list[key] === match) {
					element = list[key];
					break;
				}
			}
		}
		return element;
	},
	// module.find = function(list, condition, context) {
	// 	var ctx = context || window;
	// 	var value = null;
	// 	if(Array.isArray(list)) {
	// 
	// 		for(var i = 0, length = list.length; i < length; i++) {
	// 			if(condition.call(ctx, list[i], i, list)) {
	// 				value = list[i];
	// 				break;
	// 			}
	// 		}
	// 	} else {
	// 		for(var key in list) {
	// 			if(condition.call(ctx, list[key], key, list)) {
	// 				value = list[key];
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return value;
	// };
	
	module.arraysEqual = function(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.
		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	};
	
	module.elementCount = function(list) {
		counts = {};

		if(Array.isArray(list)) {

			for (i = 0, length = list.length; i < length; i++) {
				if(!counts[list[i]]) {
					counts[list[i]] = 0;
				}
				counts[list[i]]++;
			}
		} else {
			return null;
		}
		return counts;
	};
	
	module.objLength = function(obj) {
		var length = 0;
		for(var key in obj) {
			// if(obj.hasOwnProperty(key)) { length++; }
			if(PWG.Utils.has(obj, key)) { length++; }
		}
		return length;
	};

	module.randomProperty = function(obj) {
	    var keys = Object.keys(obj);
	    return obj[keys[keys.length * Math.random() << 0]];
	};
	
	module.randomKey = function(obj) {
		var keys = Object.keys(obj);
		return [keys[keys.length * Math.random() << 0]];
	};
	
	module.mixin = function(c, p) {
	    for(var k in p) if(p[k]) c[k] = p[k];
	};

	module.bind = function(o, f) {
	    return function() { return f.apply(o, arguments); };
	};

	module.inherit = function(c, p) {
	    this.mixin(c, p);
	    function f() { this.constructor = c; };
	    f.prototype = c._super = p.prototype;
	    c.prototype = new f();
	};

	module.isInView = function(pos) {
		if(pos.x > 0 && pos.x < stageConfig.width && pos.y > 0 && pos.y < stageConfig.height) {
			return true;
		} else {
			return false;
		}
	};
	
	module.parseMarkup = function(str, reference, encodeMarkup) {
		var parsedString = str;
		// trace('Utils/parseMarkup, str = ' + str + ', reference = ', reference);

		if(str.indexOf('~{') > -1) {
			var pattern = /~\{[A-Z]*\}~/gi;
			var patternMatch = str.match(pattern);
			if(patternMatch) {
				for(var matchNum in patternMatch) {
					var match = String(patternMatch[matchNum]);

					var matchLength = match.length;
					var matchKey = match.substring(2, matchLength - 2);
					var output = reference[matchKey];
					if(encodeMarkup) {
						output = encodeURIComponent(output);
					}
					// trace('output = ' + output);
					if(output === undefined || output === null) {
						output = match;
					} else {
						output = output.toString();
					}
					parsedString = parsedString.replace(match, output);
				}
				//// trace(parsedString);
			} else {
				parsedString = null;
			}
		}

		return parsedString;
	};
	
	module.loadScript = function(url, evt) {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');

        if(scriptTag.readyState) {
            scriptTag.onreadystatechange = function() {
                if(scriptTag.readyState == 'loaded' || scriptTag.readyState == 'complete') {
                    // callback.call(evt);
					PWG.EventCenter.trigger(evt);
                }
            };
        } else {
            scriptTag.onload = function() {
                // callback.call(evt);
				PWG.EventCenter.trigger(evt);
            };
        }
        scriptTag.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
	};

	module.shuffle = function(array) {
		var m = array.length, t, i;

		// http://bost.ocks.org/mike/shuffle/
		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	};
	
	module.diceRoll = function(sides) {
		var s = sides || 6;
		return Math.floor(Math.random() * s) + 1;
	};

	module.coinToss = function() {
		return Math.random() < 0.5 ? true : false;
	};
	
	module.formatMoney = function(n, c, d, t){
		var c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "." : d, 
		t = t == undefined ? "," : t, 
		s = n < 0 ? "-" : "", 
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	 };
	
	//=== onDomReady function from https://github.com/cms/domready ===
	module.onDomReady = function() {

	    var w3c = !!document.addEventListener,
	        loaded = document.readyState === "complete",
	        toplevel = false,
	        fns = [];

	    if (w3c) {
	        document.addEventListener("DOMContentLoaded", contentLoaded, true);
	        window.addEventListener("load", ready, false);
	    } else {
	        document.attachEvent("onreadystatechange", contentLoaded);
	        window.attachEvent("onload", ready);

	        try {
	            toplevel = window.frameElement === null;
	        } catch(e) {}

	        if ( document.documentElement.doScroll && toplevel ) {
	            scrollCheck();
	        }
	    }

	    function contentLoaded() {
	        (w3c)?
	            document.removeEventListener("DOMContentLoaded", contentLoaded, true) :
	            document.readyState === "complete" && 
	            document.detachEvent("onreadystatechange", contentLoaded);
	        ready();
	    }

	    // If IE is used, use the trick by Diego Perini
	    // http://javascript.nwbox.com/IEContentLoaded/
	    function scrollCheck() {
	        if (loaded) {
	            return;
	        }

	        try {
	            document.documentElement.doScroll("left");
	        } catch(e) {
	            window.setTimeout(arguments.callee, 15);
	            return;
	        }
	        ready();
	    }

	    function ready() {
	        if (loaded) {
	            return;
	        }
	        loaded = true;

	        var len = fns.length,
	            i = 0;

	        for( ; i < len; i++) {
	            fns[i].call(document);
	        }
	    }

	    return function(fn) {
	        // if the DOM is already ready,
	        // execute the function
	        return (loaded)? 
	            fn.call(document):      
	            fns.push(fn);
	    };
	}();

	return module;
}();


PWG.DeviceUtils = function() {
	var ua = navigator.userAgent.toLowerCase();
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	var _isFullScreen = false;
	var _fullScreenExitCallbacks = [];
	
	if (document.addEventListener) {
	    document.addEventListener('webkitfullscreenchange', exitHandler, false);
	    document.addEventListener('mozfullscreenchange', exitHandler, false);
	    document.addEventListener('fullscreenchange', exitHandler, false);
	    document.addEventListener('MSFullscreenChange', exitHandler, false);
	}

	var module = {};
	
	module.browsers = {
		IPHONE: 'Iphone',
		ANDROID: 'Android',
		CHROME: 'Chrome',
		SAFARI: 'Safari',
		FIREFOX: 'Firefox',
		OPERA: 'Opera',
		IE: 'IE'
	};

	module.isMobile = function() {
		return ua.match(/iphone|ipad|android/);
	};

	module.isIphone = function() {
		return ua.match(/iphone/);
	};

	module.isAndroid = function() {
		return ua.match(/android/);
	};

	module.isChrome = function() {
		return !!window.chrome && !module.isOpera(); // Chrome 1+
		// return ua.match(/chrome/);
	};

	module.isSafari = function() {
		return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	    // At least Safari 3+: "[object HTMLElementConstructor]"
		// return ua.match(/safari/);
	};

	module.isFirefox = function() {
		return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	};

	module.isOpera = function() {
		return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	};

	module.isIE = function() {
		return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	};

	module.getType = function(type) {
		var method = 'is' + type;
		return module[method]();
	};

	module.getBrowser = function() {
		var browser = '';
		var browsers = module.browsers; 

		for(var key in browsers) {
			if(module.getType(browsers[key])) {
				browser = browsers[key];
				break;
			}
		}
		return browser;
	};

	module.getHasTransform = function() {
		var features;
		(function(s, features) {
		    features.transitions = 'transition' in s || 'webkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s;
		})(document.createElement('div').style, features || (features = {}));

		return features.transitions;
	};
	
	module.toggleFullScreen = function() {
		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			module.enterFullScreen();
		}
		else {
			module.exitFullScreen();
		}
	};

	module.enterFullScreen = function() {
		// trace('requesting fullscreen');
		if(!module._isFullScreen) {
			module._isFullScreen = true;
			requestFullScreen.call(docEl);
			// trace('device utils _isFullScreen = ' + module._isFullScreen);
		}
	};

	module.exitFullScreen = function() {
		if(module._isFullScreen) {
			module._isFullScreen = false;
			cancelFullScreen.call(doc);
		}
	};

	module.getIsFullScreen = function() {
		return _isFullScreen;
	};

	module.addFullScreenExitCallback = function(callback, context, params) {
		var ctx = context || window;
		var p = params || {};
		_fullScreenExitCallbacks.push({
			callback: callback,
			context: ctx,
			params: p
		});
	};

	function exitHandler() {
	    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
			// trace('exit fullscreen handler');
			module._isFullScreen = false;
			if(_fullScreenExitCallbacks.length > 0) {
				PWG.Utils.each(
					_fullScreenExitCallbacks,
					function(exitCb) {
						exitCb.callback.call(exitCb.context, exitCb.params);
					},
					module
				);
			}
	    }
	}

	return module;
}();
/*
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
        tilt([event.beta, event.gamma]);
    }; true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
    }; true);
} else {
    window.addEventListener("MozOrientation", function () {
        tilt([orientation.x * 50, orientation.y * 50]);
    }; true);
}
*/

// compass: 
// http://stackoverflow.com/questions/16317599/android-compass-that-can-compensate-for-tilt-and-pitch

PWG.Storage = function() {
	var _listeners = [];
	
	var module = {};
	
	module.get = function(key) {
		if(_available) {
			if(!localStorage[key]) return;
			return JSON.parse(localStorage[key]);
		}
	};
	
	module.set = function(params) {
		if(_available) {
			// trace('Storage, about to set saved data with: ', params);
			for(var key in params) {
				if(params[key] instanceof Object || params[key] instanceof Array) {
					params[key] = JSON.stringify(params[key]);
				}
				// trace('Storage, about to set ' + key + ', to value ' + params[key]);
				localStorage[key] = params[key];
			}
		}
	};
	
	module.remove = function(prop) {
		if(_available) {
			localStorage.removeItem(prop);
		}
	};
	
	module.destroy = function() {
		// trace('Storage/destroy');
		localStorage.clear();
	};
	
	module.addListener = function(listener) {
		if(_available) {
			var attachNotAdd = false;
			if(window.addEventListener) {
				window.addEventListener('module', listener, false);
			} else {
				window.attachEvent('onmodule', listener);
				attachNotAdd = true;
			}
			_listeners.push(listener);
		}
	};
	
	module.removeListener = function(listener) {
		if(_available) {
			var length = _listeners.length;
			for(var i = 0; i < length; i++) {
				if(_listeners[i].listener === listener) {
					if(window.removeEventListener) {
						window.removeEventListener('module', listener, false);
					} else {
						window.detachEvent('onmodule', listener);
					}
					_listeners = _listeners.splice(i, 1);
					break;
				}
			}
		}
	};
	
	module.shutdown = function() {
		var length = _listeners.length;
		for(var i = 0; i < length; i++) {
			if(window.removeEventListener) {
				window.removeEventListener('module', listener, false);
			} else {
				window.detachEvent('onmodule', listener);
			}
		}
	};
	
	function _supportsLocalStorage() {
		try {
			// trace('STORAGE AVAILABLE');
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch(e) {
			// trace('STORAGE NOT AVAILABLE');
			return false;
		}
	}
	var _available = _supportsLocalStorage();
	
	return module;
}();


var PWG = PWG || {};
PWG.Timer = function() {
	
	var module = {};
	var _instances = {};
	var _currentId = 0;
	
	function Controller(id) {
		this.id = id;
		this.timeout = null;
		this.interval = null;
	}
	
	Controller.prototype.start = function(delay, method, args, ctx) {
		var params = args || {};
		var context = ctx || window;
		var _this = this;
		this.timeout = setTimeout(function() {
			method.call(context, _this, params);
		},
		delay);
	};
	
	Controller.prototype.loop = function(delay, method, args, ctx) {
		var params = args || {};
		var context = ctx || window;
		var _this = this;
		this.interval = setInterval(function() {
			method.call(context, _this, params);
		},
		delay);
	};
	
	Controller.prototype.stop = function() {
		// trace('Timer.Controller['+this.id+']/stop, this.timeout = ' + this.timeout + ', this.interval = ' + this.interval);
		if(this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		} else if(this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	};
	
	module.Controller = Controller; 
	
	module.create = function(id) {
		var key = id || _currentId;
		var instance = new Controller(key);
		_instances[key] = instance;
		_currentId++;
		return instance;
	};
	
	module.get = function(id) {
		if(!_instances.hasOwnProperty(id)) {
			return;
		}
		return _instances[id];
	};
	
	module.stopAll = function() {
		PWG.Utils.each(
			_instances,
			function(instance) {
				instance.stop();
			},
			module
		);
	};

	module.remove = function(id) {
		if(_instances.hasOwnProperty(id)) {
			_instances[id].stop();
			delete _instances[id];
		}
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.ViewportDimensions = function() {
	var module = {
		initialized: false,
		vw: -1,
		vh: -1
	};
	
	module.init = function() {
		window.addEventListener('resize', module.onWindowResize);
		module.calculate();
		module.initialized = true;
	};
	
	module.calculate = function() {
		var width = document.documentElement.clientWidth;
		var height = document.documentElement.clientHeight;
		module.vw = width/100;
		module.vh = height/100;
	};
	
	module.onWindowResize = function() {
		module.calculate();
	};
	
	return module;
}();

if(!PWG.ViewportDimensions.initialized) {
	PWG.ViewportDimensions.init();
}

var PWG = PWG || {};
PWG.WindowParams = function() {
	var module = {};
	
	var _previousOrientation = '';

	module.width = -1;
	module.height = -1;
	module.orientation = '';
	module.isOrientationChanged = false; 
	
	module.update = function() {
		module.isOrientationChanged = false;
		module.width = document.documentElement.clientWidth;
		module.height = document.documentElement.clientHeight;

		if(module.width > module.height) {
			module.orientation = 'landscape';
		} else {
			module.orientation = 'portrait';
		}
		
		if(module.orientation !== _previousOrientation) {
			module.isOrientationChanged = true;
			_previousOrientation = module.orientation;
		}
		
		return { width: module.width, height: module.height, orientation: module.orientation, isOrientationChanged: module.isOrientationChanged };
	};

	return module;
}();

var PWG = PWG || {};
PWG.StyleElManager = function() {
	var module = {};

	var _head = document.getElementsByTagName('head')[0];
	var _previousOrientation = '';
	var _styleEls = {};
	
	module.create = function(styleStrings) {
		PWG.Utils.each(
			styleStrings,
			function(style, key) {
				module.add(style, key);
			},
			module
		);
	};
	
	module.add = function(styleString, key) {
		var styleEl = document.createElement('style');
		styleEl.setAttribute('id', key);
		styleEl.appendChild(document.createTextNode(styleString));
		
		_styleEls[key] = styleEl;
	};
	
	module.update = function() {
		if(PWG.WindowParams.isOrientationChanged) {
			var orientation = PWG.WindowParams.orientation;
			if(_previousOrientation !== '') {
				_styleEls[_previousOrientation].parentNode.removeChild(_styleEls[_previousOrientation]);
			}

			_head.appendChild(_styleEls[orientation]);
			_previousOrientation = orientation;
		}
	};
	
	module.replace = function(styleString, key) {
		if(_styleEls.hasOwnProperty(key)) {
			_styleEls[key].parentNode.removeChild(_styleEls[key]);
			delete _styleEls[key];
		}
		module.add(styleString, key);
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.TouchManager = function() {
	var module = {};

	function TouchController(el, listeners) {
		this.el = el;
		this.currentTouches = [];

		this.listeners = {};
		PWG.Utils.each(
			listeners,
			function(listener, key) {
				this.listeners[key] = {};
				this.listeners[key].fn = listener.fn;
				this.listeners[key].ctx = listener.ctx || this;
				this.listeners[key].params = listener.params || {};
			},
			this
		);
		// trace('TouchController listeners = ', this.listeners);
		this.addListeners();
	}

	TouchController.prototype.addListeners = function() {
		if(PWG.DeviceUtils.isMobile()) {
			this.touchStartListener = function(listener) {
				return function(event) {
					listener.onTouchStart.call(listener, event);
				};
			}(this);

			this.touchMoveListener = function(listener) {
				return function(event) {
					listener.onTouchMove.call(listener, event);
				};
			}(this);

			this.touchEndListener = function(listener) {
				return function(event) {
					listener.onTouchEnd.call(listener, event);
				};
			}(this);

			this.touchCancelListener = function(listener) {
				return function(event) {
					listener.onTouchCancel.call(listener, event);
				};
			}(this);

			this.el.addEventListener("touchstart", this.touchStartListener, false);
			this.el.addEventListener("touchmove", this.touchMoveListener, false);
			this.el.addEventListener("touchend", this.touchEndListener, false);
			this.el.addEventListener("touchleave", this.touchEndListener, false);
			this.el.addEventListener("touchcancel", this.touchCancelListener, false);

		} else {
			this.mouseDownListener = function(listener) {
				return function(event) {
					listener.onMouseDown.call(listener, event);
				};
			}(this);

			this.mouseMoveListener = function(listener) {
				return function(event) {
					listener.onMouseMove.call(listener, event);
				};
			}(this);

			this.mouseUpListener = function(listener) {
				return function(event) {
					listener.onMouseUp.call(listener, event);
				};
			}(this);

			this.el.addEventListener("mousedown", this.mouseDownListener, false);
			this.el.addEventListener("mousemove", this.mouseMoveListener, false);
			this.el.addEventListener("mouseup", this.mouseUpListener, false);
		}
	};

	TouchController.prototype.removeListeners = function() {
		if(PWG.DeviceUtils.isMobile()) {
			this.el.removeEventListener("touchstart", this.touchStartListener, false);
			this.el.removeEventListener("touchmove", this.touchMoveListener, false);
			this.el.removeEventListener("touchend", this.touchEndListener, false);
			this.el.removeEventListener("touchleave", this.touchEndListener, false);
			this.el.removeEventListener("touchcancel", this.touchCancelListener, false);
		} else {
			this.el.removeEventListener("mousedown", this.mouseDownListener, false);
			this.el.removeEventListener("mousemove", this.mouseMoveListener, false);
			this.el.removeEventListener("mouseup", this.mouseUpListener, false);
		}
	};
	
	TouchController.prototype.onTouchStart = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i;
		for(i = 0; i < l; i++) {
			this.currentTouches.push(_copyTouch(touches[i]));
			// trace('this.currentTouches = ', this.currentTouches);
			this.onStart(touches[i]);
		}
	};
	
	TouchController.prototype.onTouchMove = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i; 

		// trace('TouchController/onTouchMove, touches.length = ' + touches.length + ', move = ', (this.listeners['move']));
		// trace('touches = ', touches);
		for(i = 0; i < l; i++) {
			// trace('touches['+i+'].identifier = ' + (touches[i].identifier));
			var idx = _getTouchById(touches[i].identifier, this);
			// trace('\tidx = ' + idx);
			if(idx > -1) {
				// trace('has move = ' + (this.listeners.hasOwnProperty('move')));
				this.onMove(touches[i]);
				this.currentTouches.splice(idx, 1, _copyTouch(touches[i]));
			}
		}
	};

	TouchController.prototype.onTouchEnd = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i; 

		for(i = 0; i < l; i++) {
			var idx = _getTouchById(touches[i].identifier, this);
			if(idx > -1) {
				this.onEnd(touches[i]);
				this.currentTouches.splice(idx, 1);
			}
		}
	};
	
	TouchController.prototype.onTouchCancel = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i; 
		for(i = 0; i < l; i++) {
			var idx = _getTouchById(touches[i].identifier, this);
			if(idx > -1) {
				this.onCancel(touches[i]);
				this.currentTouches.splice(i, 1);
			}
		}
	};
	
	TouchController.prototype.onMouseDown = function(evt) {
		evt.preventDefault();
		// trace('TouchController/onMouseDown, evt = ', evt);
		this.mouseDown = true;
		this.onStart(evt);
	};
	
	TouchController.prototype.onMouseMove = function(evt) {
		evt.preventDefault();
		// trace('TouchController/onMouseMove, evt = ', evt);
		if(this.mouseDown) {
			this.onMove(evt);
		}
	};
	
	TouchController.prototype.onMouseUp = function(evt) {
		evt.preventDefault();
		// trace('TouchController/onMouseUp, evt = ', evt);
		this.mouseDown = false;
		this.onEnd(evt);
	};
	
	TouchController.prototype.onStart = function(evt) {
		if(this.listeners.hasOwnProperty('start')) {
			var start = this.listeners['start'];
			start.fn.call(start.ctx, evt, this.el, this, start.params);
		}
	};
	
	TouchController.prototype.onMove = function(evt) {
		if(this.listeners.hasOwnProperty('move')) {
			var move = this.listeners['move'];
			// trace('\tthere is a move');
			move.fn.call(move.ctx, evt, this.el, this, move.params);
		}
	};
	
	TouchController.prototype.onEnd = function(evt) {
		if(this.listeners.hasOwnProperty('end')) {
			var end = this.listeners['end'];
			// trace('there is an end: ', end);
			end.fn.call(end.ctx, evt, this.el, this, end.params);
		}
	};
	
	TouchController.prototype.onCancel = function(evt) {
		if(this.listeners.hasOwnProperty('cancel')) {
			var cancel = this.listeners['cancel'];
			cancel.fn.call(cancel.ctx, evt, this.el, this, cancel.params);
		}
	};
	
	TouchController.prototype.removeCurrentTouches = function() {
		PWG.Utils.each(
			this.currentTouches,
			function(touch, t) {
				this.currentTouches.pop();
			},
			this
		);
	};
	
	TouchController.prototype.destroy = function() {
		this.removeListeners();
		this.removeCurrentTouches();
	};
	
	module.TouchController = TouchController;
	module.touchControllers = {};
	
	module.add = function(el, listeners, id) {
		var key = id || el.id;
		var touchController = new TouchController(el, listeners);
		module.touchControllers[key] = touchController;
		return touchController;
	};
	
	module.remove = function(id) {
		if(module.touchControllers.hasOwnProperty(id)) {
			module.touchControllers[id].destroy();
			delete module.touchControllers[id];
		}
	};
	
	function _copyTouch(touch) {
		return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
	}
	
	function _getTouchById(identifier, touchEl) {
		var l = touchEl.currentTouches.length;
		var i;
		var idx = -1;
		for(i = 0; i < l; i++) {
			// trace('\tcurrentTouches['+i+'].id = ' + touchEl.currentTouches[i].id + ', id = ' + id);
			if(touchEl.currentTouches[i].identifier === identifier) {
				idx = i;
				break;
			}
		}
		return idx;
	}
	
	return module;
}();
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events

(function() {
	// MIT license
	// https://gist.github.com/paulirish/1579671
	
	/**
	 * A polyfill for requestAnimationFrame
	 * You can actually use both requestAnimationFrame and requestAnimFrame, 
	 * you will still benefit from the polyfill
	 *
	 * @method requestAnimationFrame
	 */
	/**
	 * A polyfill for cancelAnimationFrame
	 *
	 * @method cancelAnimationFrame
	 */
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
	        window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function(callback) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	          timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };
	}

	if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function(id) {
	        clearTimeout(id);
	    };
	}

	window.requestAnimFrame = window.requestAnimationFrame;
})();

var PWG = PWG || {};
PWG.Animator = function() {
	var module = {};
	var _instances = {};
	var _currentId = 0;
	
	function Controller(id, el, props, duration, callback, context, params) {
		// trace('Animation['+id+'] duration = ' + duration);
		this.id = id;
		this.el = el;
		this.props = props;
		PWG.Utils.each(
			props,
			function(prop, idx) {
				prop.begin = parseInt(prop.begin);
				prop.end = parseInt(prop.end);
				prop.difference = (prop.end > prop.begin) ? (prop.end - prop.begin) : -(prop.begin - prop.end);
				// prop.difference /= (duration/10);
				// prop.difference /= (duration);
				// trace(this.id + ': prop['+prop.key+'] begin = ' + prop.begin + ', end = ' + prop.end + ', difference = ' + prop.difference + ', duration = ' + duration);
				prop.newValue = prop.begin;
			},
			this
		);
		this.duration = duration;
		this.callback = callback; 
		this.context = context || window;
		this.params = params || {};
		this.completed = false;
	};
	
	Controller.prototype.start = function() {
		// this.el.style[this.prop] = this.begin;
		this.startTime = Date.now();
		requestAnimationFrame(this.update.bind(this));
	};

	Controller.prototype.update = function() {
		var currentTime = Date.now();
		var styleString = '';
		var animatedPercentage;
		var animatedTime = currentTime - this.startTime;

		if(animatedTime > this.duration) {
			animatedTime = this.duration;
		}
		animatedPercentage = animatedTime / this.duration;

		PWG.Utils.each(
			this.props,
			function(prop, idx) {
				prop.newValue = prop.begin + (animatedPercentage * prop.difference);

				if(prop.key === 'rotate') {
					styleString += '-webkit-transform:rotate(' + prop.newValue + 'deg); ';
					styleString += '-ms-transform:rotate(' + prop.newValue + 'deg); ';
					styleString += 'transform:rotate(' + prop.newValue + 'deg); ';
				} else {
					styleString += prop.key + ':' + prop.newValue + prop.unit + '; ';
				}
			},
			this
		);
		if(this.params && this.params.styleString) {
			styleString += this.params.styleString;
		}

		this.el.setAttribute('style', styleString);

		if(animatedTime >= this.duration) {
			this.completed = true;
		}
		
		if(!this.completed) {
			requestAnimationFrame(this.update.bind(this));
		} else {
			this.onCompleted();
		}
	};
	
	Controller.prototype.stop = function() {
		this.completed = true;
	};
	
	Controller.prototype.onCompleted = function() {
		PWG.Utils.each(
			this.props,
			function(prop) {
				// trace(this.id + ': ' + prop.key + ' newvalue = ' + prop.newValue);
			},
			this
		);
		if(this.callback) {
			this.callback.call(this.context, this.id, this.el, this.params);
		}
		PWG.Animator.kill(this.id);
	};
	
	module.Controller = Controller;
	
	module.create = function(el, props, time, autoStart, callback, context, params, id) {
		var key = 'animation_' + (id || _currentId);
		var controller = new Controller(key, el, props, time, callback, context, params);
		if(autoStart) {
			controller.start();
		}
		_instances[key] = controller; 
		_currentId++;
		return controller;
	};

	module.get = function(id) {
		if(!_instances.hasOwnProperty(id)) {
			return;
		}
		return _instances[id];
	};
	
	module.stopAll = function() {
		PWG.Utils.each(
			_instances,
			function(controller) {
				controller.stop();
			},
			module
		);
	};
	
	module.kill = function(id) {
		if(!_instances.hasOwnProperty(id)) {
			return;
		}
		if(!_instances[id].completed) {
			_instances[id].stop();
		}
		_instances[id] = null;
		delete _instances[id];
		// trace('Animator.kill, id = ' + id + ', _instances now = ', _instances);
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.AudioManager = function() {
	var module = {};
	
	var _sounds = {};
	
	function Sound(elId) {
		trace('AudioManager.Sound, elId = ' + elId);
		this.soundEl = document.getElementById(elId);
	}
	
	Sound.prototype.play = function() {
		trace('AudioManager.Sound/play, soundEl = ', this.soundEl);
		if(this.soundEl) {
			this.soundEl.play();
		}
	};
	
	Sound.prototype.pause = function() {
		if(this.soundEl) {
			this.soundEl.pause();
		}
	};
	
	Sound.prototype.load = function(src) {
		if(this.soundEl) {
			this.soundEl.src = src;
			this.soundEl.load();
		}
	};
	
	module.Sound = Sound; 
	
	module.createEl = function(config) {
		var audio = document.createElement('audio');
		audio.setAttribute('id', config.id);
		PWG.Utils.each(
			config.sources,
			function(source) {
				trace('adding source: ', source);
				var s = document.createElement('source');
				PWG.Utils.each(
					source,
					function(attr, key) {
						trace('\tadding attr['+key+']: ', attr);
						s.setAttribute(key, attr);
					},
					module
				);
				audio.appendChild(s);
			},
			module
		);
		if(config.styles) {
			PWG.Utils.each(
				config.styles,
				function(style, key) {
					audio.style[key] = style;
				},
				module
			);
		}
		var p = (config.parentId) ? document.getElementById(config.parentId) : document.getElementsByTagName('body')[0];
		p.appendChild(audio);
		
		config.el = config.id;
		module.addEl(config);
	};
	
	module.addEl = function(config) {
		var sound = new Sound(config.el);
		_sounds[config.id] = sound;
		trace('AudioManager/addEl, config = ', config);
		if(config.cb) {
			var ctx = config.ctx || window;
			config.cb.call(ctx);
		}
	};
	
	module.play = function(id) {
		if(_sounds.hasOwnProperty(id)) {
			_sounds[id].play();
		}
	};
	
	module.pause = function(id) {
		if(_sounds.hasOwnProperty(id)) {
			_sounds[id].pause();
		}
	};
	
	module.load = function(id, src) {
		if(_sounds.hasOwnProperty(id)) {
			_sounds[id].load(src);
		}
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.User = function() {
	'use strict';

	var module = {};
	
	module.localStorageKey = 'pwgUser';
	
	var _data = {
		isFirstPlay: true,
		needsGameOverMessage: true,
		needsPlayerStatMessage: true,
		players: {},
		tournaments: {}
	};
	
	module.init = function(cb, storageKey) {
		module.localStorageKey = storageKey || module.localStorageKey;
		var savedData = PWG.Storage.get(module.localStorageKey);
		
		if(typeof(savedData) !== 'undefined') {
			_data = PWG.Utils.extend(_data, savedData);
		}
		// trace('User/init, _data = ', _data);
		if(cb) {
			cb.call(module, _data);
		}
	};

	module.get = function(key) {
		return _data[key];
	};

	module.getData = function() {
		return _data;
	};
	
	module.set = function(key, value) {
		if(key === 'players' && _data.players) {
			_data.players = PWG.Utils.extend(_data.players, value);
		} else {
			_data[key] = value;
		}
		_saveData();
	};
	
	function _saveData() {
		// trace('User/_saveData, _data = ', _data);
		var params = {};
		params[module.localStorageKey] = _data;
		PWG.Storage.set(params);
	}
	
	return module;
}();

var PWG = PWG || {};
PWG.GameEvents = {
	GAME_STARTED: 'gameStarted',
	LEVEL_STARTED: 'levelStarted',
	LEVEL_FAILED: 'levelFailed',
	LEVEL_COMPLETED: 'levelCompleted',
	TURN_STARTED: 'turnStarted',
	TURN_COMPLETED: 'turnCompleted',
	GAME_OVER: 'gameOver',
	GAME_COMPLETED: 'gameCompleted',
	AD_STARTED: 'adStarted',
	AD_COMPLETED: 'adCompleted'
};

var PWG = PWG || {};
PWG.TGSAdapter = (function() {
	'use strict';
	
	var module = {};
	
	var LEVEL_PLAYS_PER_AD = 1;
	var TRE_SENSA_WIDGET_WIDTH = 300;
	var PWG_WIDGET_UNITS = 5;
	var LEADERBOARD_ID = 1;
	
	var _levels = [];

	var _tgsExists = false;
	var _needAd = false;
	
	var _tgsConfig = {
		GAME_ID: 'farklesafari',
		ADS: {
			INTERSTITIAL_INTERVAL: 300
		}
	};
	
	var _divIds = {
		parentDiv: 'adContainer',
		blurDiv: 'gameContainer',
		endScreenDiv: 'endScreenContainer'
	};
	
	var _displayConfig = {
		parentDiv: null,
		blurDiv: null,
		endScreenDiv: null,
		closeCallback: function() {
			_finishAdSession();
		}
	};
	
	var _config = {};
	
	
	module.events = {
		game: {
			LOAD: 'load',
			BEGIN: 'begin',
			PAUSE: 'pause',
			RESUME: 'resume',
			END: 'end'
		},
		log: {
			GAME_EVENT: 'logGameEvent',
			LEVEL_EVENT: 'logLevelEvent',
			CUSTOM_EVENT: 'logCustomEvent',
			SHARE_EVENT: 'logShareEvent',
			SCREEN: 'logScreen',
			ACHIEVEMENT_EVENT: 'logAchievementEvent'
		},
		level: {
			START: 'start',
			COMPLETE: 'complete',
			FAIL: 'fail',
			REPLAY: 'replay'
		},
		achievement: {
			NEW_HIGH_SCORE: 'newHighScore',
			GAME_COMPLETED: 'gameCompleted'
		}
	};

	module.init = function(config) {
		_config = config;

		_initDisplayEls();
		
		if(config.gameId) {
			_tgsConfig.GAME_ID = config.gameId;
		}
		if(config.events) {
			_initEvents();
		}
		if(config.levelCount) {
			for(var i = 0; i < config.levelCount; i++) {
				_levels[i] = LEVEL_PLAYS_PER_AD;
			}
		}
		if(config.callback) {
			_initCallback();
		}
		
		if(typeof(TGS) !== 'undefined') {
			_tgsExists = true;
		}
		// trace('TGSAdapter/init, _levels = ', _levels);
	};
	
	// http://developer.tresensa.com/docs/tgs/symbols/TGS.Analytics.html#.logGameEvent
	module.logEvent = function(type, args) {
		if(_tgsExists) {
			// trace('TGSAdapter/logEvent, type = ' + type + ', args = ', args);
			TGS.Analytics[type].apply(module, args);
		}
	};
	
	module.submitScore = function(params) {
		// trace('TGSAdaper/submitScore, _tgsExists = ' + _tgsExists);
		if(_tgsExists) {
			params.leaderboardID = LEADERBOARD_ID;
			// trace('submitting score: ', params);
			TGS.Leaderboard.SubmitScore(params);
		}
	};
	
	module.turnStarted = function() {
		module.adCheck();
	};
	
	module.adCheck = function() {
		// trace('TGSAdapter/adCheck');
		if(_needAd) {
			module.displayInterstitial();
			_needAd = false;
		} else {
			_needAd = true;
			_finishAdSession();
		}
	};
	
	module.displayInterstitial = function() {
		// trace('TGSAdapter/displayInterstitial');
		_trigger({ type: PWG.GameEvents.AD_STARTED });

		// _displayConfig['parentDiv'].style.display = 'block';

		if(typeof(TGS) !== 'undefined') {
			TGS.Advertisement.DisplayInterstitialAd(_displayConfig);		
		}
	};
	
	module.addWidget = function() {
		// trace('TGSAdapter/addWidget');
		if(_tgsExists) {
			var winW = PWG.Stage.winW; 
			var winH = PWG.Stage.winH;
		
			var unit = PWG.Stage.unit; 
			var widgetX = (unit * 3);
			var widgetY = (unit * 0.5);
			var widgetScale = (unit * PWG_WIDGET_UNITS) / TRE_SENSA_WIDGET_WIDTH;
			// trace('\twidget x/y = ' + widgetX + '/' + widgetY + ', scale = ' + widgetScale + ', widget w should be = ' + (unit * PWG_WIDGET_UNITS));

			// module.widget = PolyworksGame.Tresensa.createWidget({
			// 	x: widgetX,
			// 	y: widgetY,
			// 	scale: widgetScale,
			// 	shareUrl: 'https://keke.tresensa.com/',
			// 	shareImage: 'http://www.polyworksgames.com/games/keke2/assets/images/keke_grey_expanse_title.png',
			// 	shareTitle: 'keke and the grey expanse',
			// 	shareMessage: 'i love playing keke and the grey expanse!',
			// 	leaderboardID: LEADERBOARD_ID
			// });
			module.isOpen = true;
		}
	};

	module.removeWidget = function() {
		// trace('TGSAdapter/removeWidget, module.widget = ', module.widget);
		if(module.widget) {
			module.widget.close();
		}
		module.isClosed = true;
	};
	
	module.hideGameOverWidget = function() {
		// trace('TGSAdapter/hideGameOverWidget');
		if(module.widget) {
			module.widget.close();
		}
		_displayConfig.endScreenDiv.style.display = 'none';
	};

	function _initDisplayEls() {
		PWG.Utils.each(
			_config.divIds,
			function(id, key) {
				var elId = (_config.divIds[key] ? _config.divIds[key] : id);
				_displayConfig[key] = document.getElementById(elId);
			},
			module
		);
	}
	
	function _initEvents() {
		PWG.Utils.each(
			config.events,
			function(events, key) {
				module.events[key] = PWG.Utils.extend(module.events[key], events);
			},
			module
		);
	}
	
	function _initCallback() {
		if(_config.callback instanceof Function) {
			var fn = _config.callback;
			var ctx = module;
			_config.callback = {
				fn: fn,
				ctx: ctx
			};
		} else {
			_config.callback.ctx = _config.callback.ctx || module;
		}
	}
	
	function _finishAdSession() {
		// trace('TGSAdapter/_finishAdSession');
		_trigger({ type: PWG.GameEvents.AD_COMPLETED });
	}
	
	function _trigger(event) {
		if(_config.callback) {
			var cb = _config.callback;
			cb.fn.call(cb.ctx, event);
		} else if(PWG.EventCenter) {
			PWG.EventCenter.trigger({ type: event });
		}
	}

	return module;
}());

var PWG = PWG || {};
PWG.AdManager = function(module) {
	var _controllers = [];
	var Systems = {
		TRE_SENSA: 'TGSAdapter'
	};
	
	function Controller(idx, type, config, appCallback) {
		this.idx = idx;
		this.type = type;
		// this.config = config;
		this.system = PWG[Systems[type]];
		this.appCallback = appCallback || function() {}; 
		
		config.callback = {
			fn: this.callback,
			ctx: this
		};

		this.system.init(config);
	}
	
	Controller.prototype.callback = function(event) {
		// trace('AdsController['+this.idx+']/callback, type = ' + event.type + ', event = ', event);
		if(this[event.type] instanceof Function) {
			this[event.type].call(this, event);
			this.appCallback({ type: PWG.GameEvents.AD_STARTED });
		}
	};
	
	Controller.prototype.turnStarted = function(params) {
		// trace('AdsController/turnStarted, params = ', params);
		if(params.userTurn) {
			// user is up, time to make a request
			this.system.turnStarted(params);
		}
	};
	
	Controller.prototype.turnCompleted = function(params) {
		
	};
	
	Controller.prototype.levelStarted = function(params) {
		
	};
	
	Controller.prototype.levelCompleted = function(params) {
		
	};
	
	Controller.prototype.updateData = function(params) {
		
	};
	
	Controller.prototype.gameOver = function(params) {
		
	};
	
	module.create = function(type, config, appCallback) {
		if(!Systems.hasOwnProperty(type)) {
			return;
		}
		// trace('AdsController/constructor, type = ' + type + ', config = ', config);
		var controller;
		controller = new Controller(_controllers.length, type, config, appCallback);
		if(controller) {
			_controllers.push(controller);
		}
		return controller;
	};
	
	module.Systems = Systems;
	
	return module;
}(PWG.AdManager || {});

var PWG = PWG || {};
PWG.FarkleSounds = function() {
	'use strict';
	var module = {};
	
	var DICE_ROLL = 'diceRoll';
	
	module.init = function(audioEl) {
		// PWG.AudioManager.addSound({ id: DICE_ROLL, el: audioEl });
	};
	
	module.diceRoll = function() {
		// PWG.AudioManager.play(DICE_ROLL);
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.Tutorial = function() {
	'use strict';

	Tutorial.FIRST_TIME_PLAYER = 'First time playing? Try the tutorial to learn the rules of the game.';
	Tutorial.PRE_GAME = 'Let\'s play farkle! <br />The object of the game is to be the first to gain 10,000 points.';
	Tutorial.GAME_START = 'We\'ll go through some practice turns first.<br />Press roll to start.';
	Tutorial.FIRST_BANK = 'Press down to bank selected dice.<br />Dice go into your "bank" or collection of scoring dice for the turn. Note: a minimum of 300 points is needed to end a turn.';
	Tutorial.FIRST_SELECTION = 'Your turn score has been updated. Your total score will not be affected until the turn is completed.<br />Roll again.';
	Tutorial.FIRST_MINIMUM = 'The minimum turn score has been met. You can roll again for the chance of a higher score or press > to end the turn. For now, let\'s see what one more roll will bring.';
	Tutorial.FIRST_FARKLE = 'You farkled! Be careful: 3 consecutive farkles in a row will deduct 500 points.';
	Tutorial.FIRST_HOT_DICE = 'You got hotdice! All dice are scorable.<br />The turn can continue with 6 new dice, but rolling is optional. Let\'s give it a try...';
	Tutorial.FIRST_AI_TURN = 'My turn...';
	Tutorial.PLAY_REAL_GAME = 'You seem to have the hang of it. Press next to complete tutorial.';
	Tutorial.TUTORIAL_COMPLETE = 'Note: only one die needs to be banked after each roll. Sometimes it\'s better to leave scoring dice in play -- the next roll might have better scores.<br />Press > to complete the tutorial and start a real game!';
	
	Tutorial.ROLLS = [
		[5, 2, 4, 6, 3, 2],
		[5, 1, 3, 3, 4, 2],
		[5, 1, 2, 4, 4, 4],
		[5, 1, 1, 4, 4, 4],
		[2, 4, 6, 3, 3, 4],
		[3, 3, 4, 4, 6, 6],
		[1, 2, 3, 4, 5, 6]
	];
	
	Tutorial.ROLL_TEXTS = [
		'This roll has one scorable die as well. A single 1 is worth 100 points. Drag and bank it.',
		'This roll is a three-of-a-kind, worth 400 points. When you roll a triple, it is worth 100x the die. Four-of-a-kind = 200x, five-of-a-kind = 300x, etc.<br />Three 1\'s = 1000 points.',
		'This last die is scorable since it is a 1. Drag and bank it to see what happens.',
		'Oh no! It\'s a "farkle." There are no scoring dice. When a farkle is rolled, the turn ends and 0 points are scored. Three in-a-row deducts 500 points from your total score.<br />Click > to continue.',
		'This roll is 3 pairs or "full house". It is worth 750 points. The only time pairs score is when there are 3 of them. In this case, it is 3\'s, 4\'s, and 6\'s, but it can be any combination.',
		'The final roll is a "straight" 1, 2, 3, 4, 5, 6. It\'s worth 1500 points. They are a rare, but lucky roll.'
	];
	
	function Tutorial() {
		this.displayFirstRollTutorial = true;
		this.displayFirstBankTutorial = true; 
		this.displayFirstSelectedTutorial = true; 
		this.displayFirstMinimumTutorial = true;
		this.displayFirstFarkleTutorial = true; 
		this.displayFirstHotDiceTutorial = true; 
		this.displayFirstAITurn = true;
		this.displayFreestyleRolls = true; 
		this.displayPlayRealGame = true; 
		
		this.isPresetRollsActive = true;
		this.currentPresetRoll = 0;
		this.currentPresetRollText = 0;
		
		// drag / click needs to change based on environment
		var firstRollText = 'The 5 die is the lowest scoring die. ' + ((PWG.App.isAndroid) ? 'Drag it' : 'Click it to go') + ' to the gray area at the bottom (bank.) Then, click the check button to score it for 50 points';
		Tutorial.ROLL_TEXTS.shift(firstRollText);
	}
	
	Tutorial.prototype.getPresetRoll = function() {
		
		var roll = null;
		if(this.currentPresetRoll < Tutorial.ROLLS.length) {
			roll = Tutorial.ROLLS[this.currentPresetRoll];
			this.currentPresetRoll++;
		}
		// trace('Tutorial/getPresetRoll, roll = ', roll);
		return roll;
	};
	
	Tutorial.prototype.getPresetRollText = function() {
		// trace('getPresetRollText, current = ' + this.currentPresetRollText + ' length: ' + Tutorial.ROLLS.length);
		var text = '';
		if(this.currentPresetRollText < Tutorial.ROLLS.length) {
			text = Tutorial.ROLL_TEXTS[this.currentPresetRollText];
			this.currentPresetRollText++;
		}
		// set the preset rolls active flag to false after receiving the last preset rolls text
		if(this.currentPresetRoll >= Tutorial.ROLLS.length) {
			this.isPresetRollsActive = false;
		}

		return text;
	};
	
	return Tutorial;
}(); 

var PWG = PWG || {};
PWG.Farkle = function() {
	'use strict';
	var module = {};
	
	module.NUM_DICE = 6;
	module.MIN_TURN_SCORE = 300;
	module.STRAIGHT_SCORE = 1500;
	module.FULL_HOUSE_SCORE = 750;
	module.ONE_TRIPLE_MULTIPLIER = 1000;
	module.TRIPLE_MULTIPLIER = 100;
	module.FIVE_SCORE = 50;
	module.ONE_SCORE = 100;
	module.TRIPLE_FARKLE = 500;
	module.NUM_FARKLES_BEFORE_DEDUCTION = 3;
	// module.WINNING_SCORE = 300;
	// module.WINNING_SCORE = 2999;
	module.WINNING_SCORE = 10000;

	function Die(idx) {
		this.idx = idx;
		this.value = -1;
		this.groupId = '';
		this.isScorable = false;
		this.isActive = true;
		this.isSelected = false;
	};
	
	Die.prototype.roll = function() {
		this.value = PWG.Utils.diceRoll();
	};
	
	Die.prototype.setActive = function(active) {
		this.isActive = active;
		this.groupId = '';
	};
	
	// data / calculations
	function TurnDice(startingDice) {
		this.availableDice = startingDice;
		this.collection = [];
		this.throwScores = [];
		this.totalScore = 0;
		this.usedDice = 0;
		for(var i = 0; i < startingDice; i++) {
			this.collection.push(new module.Die(i));
		}
	};
	
	TurnDice.prototype.roll = function() {
		PWG.Utils.each(
			this.collection,
			function(die) {
				// trace('\tdie['+die.idx+'].isActive = ' + die.isActive);
				if(die.isActive) {
					die.roll();
				}
			},
			this
		);
	};
	
	TurnDice.prototype.getActive = function() {
		var active = [];
		PWG.Utils.each(
			this.collection,
			function(die) {
				if(die.isActive) {
					active.push(die);
				}
			},
			this
		);
		return active;
	};
	
	TurnDice.prototype.getActiveValues = function() {
		// trace('TurnDice/getActiveValues')
		var values = [];
		PWG.Utils.each(
			this.collection,
			function(die) {
				if(die.isActive) {
					values.push(die.value);
				}
			},
			this
		);
		return values;
	};
	
	TurnDice.prototype.setAllActive = function() {
		PWG.Utils.each(
			this.collection,
			function(die) {
				die.setActive(true);
			},
			this
		);
	};

	TurnDice.prototype.resetGroupIds = function() {
		PWG.Utils.each(
			this.collection,
			function(die) {
				die.groupId = '';
			},
			this
		);
	};
	
	TurnDice.prototype.parseCurrentRoll = function() {
		// trace('TurnDice/parseCurrentRoll');
		var activeDice = this.getActive();
		// var activeValues = this.getActiveValues();
		this.setAllScorable(false);

		this.groups = [];
		this.hotDice = false;
		this.farkled = true;
		this.scoringDice = 0;

		if(module.straightTest(this.getActiveValues())) {
			// STRAIGHT
			this.hotDice = true;
			this.farkled = false;
			this.scoringDice = 6;
			this.setAllScorable(true, 'straight');
			this.groups.push('straight');
		} else {
			var sorted = {
				1: [],
				2: [],
				3: [],
				4: [],
				5: [],
				6: []
			};

			PWG.Utils.each(
				activeDice,
				function(die) {
					sorted[die.value].push(die);
				},
				this
			);

			// trace('sorted = ', sorted);
			var doublesCount = 0;
			var tripleCount = 0;

			PWG.Utils.each(
				sorted,
				function(dice, val) {
					if(dice.length >= 3) {
						// there's at least one triple
						// trace('there is a triple of: ' + val);
						this.farkled = false;
						this.groups.push('triple'+val);
						tripleCount++;

						PWG.Utils.each(
							dice,
							function(die) {
								this.scoringDice++;
								die.isScorable = true;
								if(parseInt(val) !== 1 && parseInt(val) !== 5) {
									die.groupId = 'triple' + val;
								}
							},
							this
						);
					} else if(dice.length == 2) {
						doublesCount++;
					}
				},
				this
			);

			if(doublesCount === 3) {
				// full house
				this.setAllScorable(true, 'fullHouse');
				this.groups.push('fullHouse');
				this.farkled = false;
				this.hotDice = true;
				this.scoringDice = 6;
			} else if(tripleCount === 2) {
				// double triples
				this.hotDice = true;
			}

			if(sorted[1].length > 0 && sorted[1].length < 3) {
				// 1 or 2 1s
				// trace('there are 1s, sorted[1] length = ' + sorted[1].length);
				this.farkled = false;
				this.parseOnesAndFives(sorted, 1);
			}
			if(sorted[5].length > 0 && sorted[5].length < 3) {
				// 1 or 2 5s
				// trace('there are 5s, sorted[5] length = ' + sorted[5].length);
				this.farkled = false;
				this.parseOnesAndFives(sorted, 5);
			}

			if(this.scoringDice === 6) {
				this.hotDice = true;
			}
		}

		// trace('\tturnDice now: ', this);
	};
	
	TurnDice.prototype.parseOnesAndFives = function(sorted, val) {
		PWG.Utils.each(
			sorted[val],
			function(die) {
				die.isScorable = true;
				this.scoringDice++;
			},
			this
		);
	};
	
	TurnDice.prototype.setAllScorable = function(scorable, group) {
		// trace('Farke.Dice/setAllScorable');
		this.hotDice = true;
		PWG.Utils.each(
			this.collection,
			function(die) {
				die.isScorable = scorable;
				if(group) {
					die.groupId = group;
				}
			},
			this
		);
	};
	
	TurnDice.prototype.bankScoringDice = function(selections) {
		// trace('TurnDice/bankScoringDice, selections = ', selections);
		var score = 0;
		var triples = {};
		var oneCount = 0;
		var fiveCount = 0;

		for(var key in selections) {
			var die = this.collection[selections[key]];
			// trace('\tdie = ', die);
			if(die.groupId !== '') {
				if(die.groupId === 'straight') {
					score += module.STRAIGHT_SCORE;
					this.setAllActive(false);
					this.usedDice += 6;
					break;
				} else if(die.groupId === 'fullHouse') {
					score += module.FULL_HOUSE_SCORE;
					this.setAllActive(false);
					this.usedDice += 6;
					break;
				} else {
					if(!triples[die.value]) {
						triples[die.value] = 0;
					}
					triples[die.value]++;
					// trace('triples['+die.value+'] = ' + triples[die.value]);
					die.setActive(false);
					this.availableDice--;
					this.usedDice++;
				}

			} else {
				if(die.value === 1) {
					oneCount++;
					die.setActive(false);
					this.availableDice--;
					this.usedDice++;
				} else if(die.value === 5) {
					fiveCount++;
					die.setActive(false);
					this.availableDice--;
					this.usedDice++;
				}
			}
		}
		// add triplesfiveCount
		PWG.Utils.each(
			triples,
			function(triple, val) {
				// trace('\ttriple = ' + triple + ', val = ' + val);
				score += (triple - 2) * (val * module.TRIPLE_MULTIPLIER);
			},
			this
		);
		// add ones and fives
		if(oneCount > 0) {
			if(oneCount >= 3) {
				score += (oneCount - 2) * module.ONE_TRIPLE_MULTIPLIER;
			} else {
				score += oneCount * module.ONE_SCORE;
			}
		}
		if(fiveCount > 0) {
			if(fiveCount >= 3) {
				score += (fiveCount - 2) * (5 * module.TRIPLE_MULTIPLIER);
			} else {
				score += fiveCount * module.FIVE_SCORE;
			}
		}


		this.totalScore += score;
		this.throwScores.push(score);

		this.resetGroupIds();

		if(this.usedDice % 6 === 0) {
			this.hotDice = true;
		} else {
			this.hotDice = false;
		}

		if(this.availableDice === 0) {
			// trace('ALL DICE USED, RESETING');
			this.availableDice = module.NUM_DICE;
			this.setAllActive(true);
			// trace('\tpost set all active, collection = ', this.collection);
		}
		// trace('TurnDice/bankScoringDice\n\tscore = ' + score 
		// 		+ '\tthrowScores now: ' + this.throwScores 
		// 		+ '\n\tturn score: ' + this.totalScore
		// 		+ '\n\tavailable = ' + this.availableDice 
		// 		+ '\n\tusedDice = ' + this.usedDice,
		// 		this
		// );
	};

	TurnDice.prototype.destroy = function() {
		PWG.Utils.each(
			this.collection,
			function(die, key) {
				delete this.collection[key];
			},
			this
		);
		this.collection = null;
	};
	
	module.Die = Die;
	module.TurnDice = TurnDice;
	
	module.straight = [1, 2, 3, 4, 5, 6];
	module.games = {};
	
	module.initGame = function(id, callback) {
		module.games[id] = {};
		module.games[id].callback = callback;
	};

	module.getTurnDice = function(id) {
		if(!module.games[id]) {
			return;
		}
		return module.games[id].turnDice;
	};
	
	module.startTurn = function(id) {
		module.games[id].turnDice = new module.TurnDice(module.NUM_DICE);
	};

	module.roll = function(id, callback) {
		module.games[id].turnDice.roll();
		module.games[id].turnDice.parseCurrentRoll();

		return module.games[id].turnDice;
	};

	module.rollStraight = function(id, callback) {
		module.games[id].turnDice.collection[0].value = 1;
		module.games[id].turnDice.collection[1].value = 2;
		module.games[id].turnDice.collection[2].value = 3;
		module.games[id].turnDice.collection[3].value = 4;
		module.games[id].turnDice.collection[4].value = 5;
		module.games[id].turnDice.collection[5].value = 6;
		module.games[id].turnDice.parseCurrentRoll();

		return module.games[id].turnDice;
	};

	module.rollFullHouse = function(id, callback) {
		module.games[id].turnDice.collection[0].value = 2;
		module.games[id].turnDice.collection[1].value = 2;
		module.games[id].turnDice.collection[2].value = 3;
		module.games[id].turnDice.collection[3].value = 3;
		module.games[id].turnDice.collection[4].value = 6;
		module.games[id].turnDice.collection[5].value = 6;
		module.games[id].turnDice.parseCurrentRoll();

		return module.games[id].turnDice;
	};

	module.rollDoubleTrips = function(id, callback) {
		module.games[id].turnDice.collection[0].value = 2;
		module.games[id].turnDice.collection[1].value = 2;
		module.games[id].turnDice.collection[2].value = 2;
		module.games[id].turnDice.collection[3].value = 6;
		module.games[id].turnDice.collection[4].value = 6;
		module.games[id].turnDice.collection[5].value = 6;
		module.games[id].turnDice.parseCurrentRoll();

		return module.games[id].turnDice;
	};

	module.rollFarkle = function(id, callback) {
		module.games[id].turnDice.collection[0].value = 2;
		module.games[id].turnDice.collection[1].value = 2;
		module.games[id].turnDice.collection[2].value = 3;
		module.games[id].turnDice.collection[3].value = 3;
		module.games[id].turnDice.collection[4].value = 4;
		module.games[id].turnDice.collection[5].value = 6;
		module.games[id].turnDice.parseCurrentRoll();

		return module.games[id].turnDice;
	};

	module.rollValues = function(id, vals, callback) {
		PWG.Utils.each(
			vals,
			function(val, idx) {
				module.games[id].turnDice.collection[idx].value = val;
			},
			module
		);

		module.games[id].turnDice.parseCurrentRoll();

		return module.games[id].turnDice;
	};

	module.bankScoringDice = function(id, selection) {
		module.games[id].turnDice.bankScoringDice(selection);
		return module.games[id].turnDice.throwScores;
	};

	module.straightTest = function(arr) {
		var straight = false; 
		var length = arr.length;
		if(length === 6) {
			var counts = PWG.Utils.elementCount(arr);
			if(counts[1] === 1 && counts[2] === 1 && counts[3] === 1 && counts[4] === 1 && counts[5] === 1 && counts[6] === 1) {
				straight = true;
			}
		}
		return straight;
	};

	module.getGroupScore = function(id, count) {
		// trace('Farkle/getDiceScore, id = ' + id + ', count = ' + count);
		var score = 0;

		if(id === 'straight') {
			score = module.STRAIGHT_SCORE;
		} else if(id === 'fullHouse') {
			score = module.FULL_HOUSE_SCORE;
		} else if(id.indexOf('triple') > -1) {
			var val = parseInt(id.substr(('triple').length, id.length));
			// trace('val = ' + val);
			score = (count - 2) * (val * module.TRIPLE_MULTIPLIER);
		}
		return score;
	};

	module.getOnesScore = function(count) {
		// trace('Farkle/getOnesScore, count = ' + count);
		var score = 0;
		if(count >= 3) {
			score = (count - 2) * module.ONE_TRIPLE_MULTIPLIER;
		} else {
			score = count * module.ONE_SCORE;
		}
		return score;
	};

	module.getFivesScore = function(count) {
		// trace('Farkle/getFivesScore, count = ' + count);
		var score = 0;
		if(count >= 3) {
			score = (count - 2) * (5 * module.TRIPLE_MULTIPLIER);
		} else {
			score = count * module.FIVE_SCORE;
		}
		return score;
	};

	module.quitGame = function(id) {
		// trace('Farkle/quit');
		if(module.games[id].turnDice) {
			module.games[id].turnDice.destroy();
			module.games[id].turnDice = null;
			delete module.games[id];
		}
	};

	return module;
}();

var PWG = PWG || {};
PWG.Player = function() {
	'use strict';
	Player.detailText = {
		intTounamentGames: 'tournament games: ',
		intTounamentsWon: 'tournament wins: ',
		intGames: 'games:',
		intWins: 'wins: ',
		intFastestWin: 'fastest win: ',
		intHighestTurnScore: 'highest turn score: ',
		intTotalHotDice: 'total hot dice: ',
		intTotalFarkles: 'total farkles: '
	};
	
	Player.config = {
		name: '',
		intTounamentGames: 0,
		intTounamentsWon: 0,
		intGames: 0,
		intWins: 0,
		intFastestWin: 0,
		intHighestTurnScore: 0,
		intTotalHotDice: 0,
		intTotalFarkles: 0
	};

	function Player(config) {
		var playerConfig = PWG.Utils.extend(PWG.Utils.clone(Player.config), config);
		// trace('Player/constructor, playerConfig = ', playerConfig);
		PWG.Utils.extend(this, playerConfig);
		this.isAIPlayer = config.isAIPlayer || false;
		this.isTournamentGame = config.isTournamentGame || false;
		this.score = 0;
		this.turns = 0;
		this.currentFarkles = 0;
		this.currentHotDice = 0;
		this.isPaused = false;
	}

	Player.prototype.pause = function() {
		this.isPaused = true;
	};
	
	Player.prototype.resume = function() {
		this.isPaused = false;
	};
	
	Player.prototype.reset = function() {
		this.score = 0;
		this.currentFarkles = 0;
		this.turns = 0;
		this.isPaused = false;
	};

	Player.prototype.onTurnEnded = function(farkled, turnDice) {
		// trace('Player['+this.name+']/onTurnEnded, farkled = ' + farkled);
		if(farkled) {
			if(this.currentFarkles >= PWG.Farkle.NUM_FARKLES_BEFORE_DEDUCTION) {
				// trace('TRIPLE FARKLE! setting score back: ' + PWG.Farkle.TRIPLE_FARKLE);
				this.score -= PWG.Farkle.TRIPLE_FARKLE;
				this.currentFarkles = 0;
			}
		} else {
			this.currentFarkles = 0;
			this.score += turnDice.totalScore;
			this.checkHighestTurnScore(turnDice.totalScore);
		}
	};
	
	Player.prototype.checkHighestTurnScore = function(score) {
		if(score > this.intHighestTurnScore) {
			this.intHighestTurnScore = score;
		}
	};
	
	Player.prototype.hasHotDice = function(hotDice) {
		// trace('Player['+this.name+']/hasHotDice');
		if(hotDice) {
			this.intTotalHotDice++;
			this.currentHotDice++;
			if(this.currentHotDice > this.intConsecutiveHotDice) {
				this.intConsecutiveHotDice = this.currentHotDice;
			}
		} else {
			this.currentHotDice = 0;
		}
	};
	
	Player.prototype.hasFarkled = function() {
		// trace('Player['+this.name+']/hasFarkled');
		this.currentFarkles++;
		this.intTotalFarkles++;
	};
	
	Player.prototype.hasFinishedGame = function() {
		// trace('Player['+this.name+']/hasFinishedGame');
		this.intGames++;
		if(this.isTournamentGame) {
			this.intTounamentGames++;
		}
	};
	
	Player.prototype.hasWon = function() {
		// trace('Player['+this.name+']/hasWon');
		this.intWins++;
		if(this.intFastestWin === 0 || (this.turns < this.intFastestWin)) {
			this.intFastestWin = this.turns;
		}
	};
	
	Player.prototype.hasWonTournament = function() {
		this.intTounamentsWon++;
	};
	
	Player.prototype.getStats = function() {
		var details = {
			name: this.name,
			intTounamentGames: this.intTounamentGames,
			intTounamentsWon: this.intTounamentsWon,
			intGames: this.intGames,
			intWins: this.intWins,
			intFastestWin: this.intFastestWin,
			intHighestTurnScore: this.intHighestTurnScore,
			intTotalHotDice: this.intTotalHotDice,
			intTotalFarkles: this.intTotalFarkles
		};
		
		return details;
	};

	return Player;
}();



var PWG = PWG || {};
PWG.Personalities = function() {
	'use strict';
	var module = {};

	var _generic = {
		game: {
			start: ['Let\'s begin.', 'Game on!']
		},
		dealer: {
			startTurn: ['My turn.', 'I\'m up.', 'Dice are to me.'],
			positive: ['Yay!', 'Excellent'],
			negative: ['Boo!', 'No.'],
			leading: ['You\'re falling behind.'],
			won: ['I\'m the winner!', 'I win.']
		},
		player: {
			startTurn: ['Your turn', 'You\'re up', 'Dice are to you'],
			positive: ['Good for you.', 'Well done.'],
			negative: ['That\'s too bad.', 'Ouch.'],
			leading: ['I\'m falling behind.'],
			won: ['You\'re the winner!', 'You win']
		}
	};

	module.animals = {
		bear: {
			game: {
				start: ['Come to my den for a game.']
			},
			dealer: {
				startTurn: ['THIS is going to be the one.'],
				positive: ['Smooth, like honey!'],
				negative: ['*GROWL*'],
				leading: ['I can chase you up a hill!'],
				won: ['Time to hibernate.']
			},
			player: {
				startTurn: ['You give it a try.'],
				positive: ['Berry good!'],
				leading: ['I should have gone fishing.'],
				negative: ['You should have gone fishing.'],
				won: ['Time to hibernate.']
			}
		},
		wolf: {
			game: {
				start: ['*HOWL*', 'The moon is down.']
			},
			dealer: {
				startTurn: ['Put the dice in my paw.'],
				positive: ['*HOWL*'],
				negative: ['*HOWL*'],
				leading: ['I love a full moon.'],
				won: ['Winter is coming.']
			},
			player: {
				startTurn: ['Take the dice.'],
				positive: ['*HOWL*'],
				leading: ['You should join our pack!'],
				negative: ['That\'s rough.'],
				won: ['You should join our pack!']
			}
		},
		fox: {
			game: {
				start: ['Time to get out of my hole.']
			},
			dealer: {
				startTurn: ['Nothing up my sleeve...'],
				positive: ['The fox knows many tricks.'],
				negative: ['I hate it when that happens.'],
				leading: ['There\'s no stopping me!'],
				won: ['You can only catch the fox with cunning.']
			},
			player: {
				startTurn: ['One must be a fox to recognize traps.'],
				positive: ['You\'re cunning is impressive!'],
				leading: ['You\'re cunning is impressive!'],
				negative: ['Many foxes grow gray, but few grow good.'],
				won: ['With foxes, you must play the fox.']
			}
		},
		lynx: {
			game: {
				start: ['I challenge you to a game of dice!']
			},
			dealer: {
				startTurn: ['And now I shall prevail!'],
				positive: ['Fortune shines upon me!'],
				negative: ['Oh! The fates are wicked.'],
				leading: ['I shall leave you to weep.'],
				won: ['Your time of reconing is here.']
			},
			player: {
				startTurn: ['Now is your chance to succeed'],
				positive: ['Well played!'],
				leading: ['You\'re crushing it!'],
				negative: ['Fortune has left you.'],
				won: ['My time of reconing is here.']
			}
		},
		beaver: {
			game: {
				start: ['What is that hat you\'re wearing?']
			},
			dealer: {
				startTurn: ['I\'m a believer.'],
				positive: ['DAM!'],
				negative: ['DAM!'],
				leading: ['This is going swimmingly for me.'],
				won: ['I\'ve got beaver fever!']
			},
			player: {
				startTurn: ['Gopher it!'],
				positive: ['Kangaroo RATS!'],
				leading: ['I should have stayed in the lodge'],
				negative: ['DAM!'],
				won: ['Stay away from my dam.']
			}
		},
		deer: {
			game: {
				start: ['Doe you wanna play a game?']
			},
			dealer: {
				startTurn: ['The dog that is forced into the woods will not hunt many deer.'],
				positive: ['That\'s a 12-pointer!'],
				negative: ['Bambi will not be happy.'],
				leading: ['Lions in time of peace; deer in war.'],
				won: ['Lions in time of peace; deer in war.']
			},
			player: {
				startTurn: ['Serve as a serf or fly like a deer!'],
				positive: ['A monkey that amuses me is better than a deer astray.'],
				leading: ['Bambi is going to cry.'],
				negative: ['If you are hunting for a red deer then ignore the hares.'],
				won: ['Deer-hunter, waste not your arrow on the hare.']
			}
		},
		hawk: {
			game: {
				start: ['Are you ready for some dice?']
			},
			dealer: {
				startTurn: ['Nothing up my sleeve...', 'Sometimes you gotta roll the hard six.'],
				positive: ['I\'m on a roll!'],
				negative: ['I hate it when that happens.', 'RATS!'],
				leading: ['There\'s no stopping me!'],
				won: ['I win!']
			},
			player: {
				startTurn: [
				// 'All of this has happened before and all of this will happen again.',
				'You\'re up.', 'Your time to shine!'],
				positive: ['You\'re on a roll!'],
				leading: ['You\'re crushing it!'],
				negative: ['Sorry about you\'re luck.'],
				won: ['You are a superb opponent!', 'You win!']
			}
		},
		squirrel: {
			endGame: 'Click the farkle title to end a game.',
			playerStats: 'Click player names to see their stats.',
			game: {
				start: ['Are you ready for some dice?']
			},
			dealer: {
				startTurn: ['Nothing up my sleeve...', 'Sometimes you gotta roll the hard six.'],
				positive: ['I\'m on a roll!'],
				negative: ['I hate it when that happens.', 'NUTS!'],
				leading: ['There\'s no stopping me!'],
				won: ['I win!']
			},
			player: {
				startTurn: [
				// 'All of this has happened before and all of this will happen again.',
				'You\'re up.', 'Your time to shine!'],
				positive: ['You\'re on a roll!'],
				leading: ['You\'re crushing it!'],
				negative: ['Sorry about you\'re luck.'],
				won: ['You are a superb opponent!', 'You win!']
			}
		},
		shark: {
			game: {
				start: ['Let\'s play a game.']
			},
			dealer: {
				startTurn: ['I\'m gonna make it right.'],
				positive: ['I can taste it in the water tonight!'],
				negative: ['I\'m throwin\' it all away.'],
				leading: ['You\'re in too deep!'],
				won: ['I won, against all odds!']
			},
			player: {
				startTurn: ['You oughta know by now.'],
				positive: ['I just can\'t take it.', 'Don\'t you lose that number!'],
				leading: ['I\'m throwin\' it all away.'],
				negative: ['You\'re throwin\' it all away'],
				won: ['There\'s something about you!']
			}
		},
		whale: {
			game: {
				start: ['I sing a song of dice.']
			},
			dealer: {
				startTurn: ['C\'mon hot dice!', 'I gotta good feeling about this one.'],
				positive: ['*sprays from blowhole*', '*sings*', 'It\'s no fluke!'],
				negative: ['*sigh*', 'Plankton!'],
				leading: ['You better swim faster.'],
				won: ['*sings* I love this game!']
			},
			player: {
				startTurn: ['Dive deeper.', 'My cousin once ate a shark.', 'Work your flippers!'],
				positive: ['*sprays from blowhole*', 'Plankton!'],
				leading: ['*splashes* I need to catch up.'],
				negative: ['You better swim faster.'],
				won: ['*moans*']
			}
		},
		squid: {
			game: {
				start: ['Game on!']
			},
			dealer: {
				startTurn: ['C\'mon hot dice!', 'I\'m gonna drag you down to the depths.'],
				positive: ['I have 3 hearts and 3 times the luck!'],
				negative: ['*sigh*'],
				leading: ['You\'d better swim to the surface soon.'],
				won: ['I love this game!']
			},
			player: {
				startTurn: ['Give it your best!', 'Roll \'em.'],
				positive: ['Amazing!'],
				leading: ['I\'m falling too far behind.'],
				negative: ['Better luck next time.'],
				won: ['You\'re pretty good at this.']
			}
		},
		barracuda: {
			game: {
				start: ['Game on!']
			},
			dealer: {
				startTurn: ['Teeth like razors', 'I\'m about to SCHOOL you.'],
				positive: ['OOO! Barracuda!'],
				negative: ['MACKEREL!'],
				leading: ['I could eat a dolphin!'],
				won: ['Piranhas are overrated.', 'I could eat a dolphin!']
			},
			player: {
				startTurn: ['Give it your best!', 'Roll \'em.'],
				positive: ['MACKEREL!'],
				leading: ['I\'m falling too far behind.'],
				negative: ['Feel the bite.', 'Painful, isn\'t it?'],
				won: ['I going back to hunting.']
			}
		},
		stingray: {
			game: {
				start: ['I\'m not ray of sunshine.']
			},
			dealer: {
				startTurn: ['Don\'t tread on me.', 'I bit off Hercules\'s finger.', 'I lent Circe my stinger for a spear.'],
				positive: ['That\'s the STING', 'My poison hurts.'],
				negative: ['I\'m going back to the floor', 'I gotta get my head outta the sand'],
				leading: ['My poison hurts.'],
				won: ['You should\'ve played Manta - he\'s a softy.']
			},
			player: {
				startTurn: ['Don\'t tread on me.', 'Don\'t caught in undertow'],
				positive: ['I\'ve felt YOUR sting now.'],
				leading: ['I gotta get my head outta the sand'],
				negative: ['Better luck next time.'],
				won: ['I\'ll just got back to the sand now.']
			}
		},
		crab: {
			game: {
				start: ['*snaps claws*']
			},
			dealer: {
				startTurn: ['*snaps claws*'],
				positive: ['*snaps claws*'],
				negative: ['*snaps claws*'],
				leading: ['*snaps claws*'],
				won: ['*snaps claws*']
			},
			player: {
				startTurn: ['*snaps claws*'],
				positive: ['*snaps claws*'],
				leading: ['*snaps claws*'],
				negative: ['*snaps claws*'],
				won: ['*snaps claws*']
			}
		},
		dolphin: {
			game: {
				start: ['My name is Opo.']
			},
			dealer: {
				startTurn: ['Fishing boats leave a great trail.', 'Don\'t call me Jack.'],
				positive: ['That\'s my favorite stunt!', 'I loved \'Opo the Friendly Dolphin\'.'],
				negative: ['Fishermen can be mean.'],
				leading: ['Swim faster! Swim faster!'],
				won: ['*flips*']
			},
			player: {
				startTurn: ['I love playing with children.'],
				positive: ['\'tBottlenose\' is insulting.', 'Koutu Point!'],
				leading: ['I\'m falling too far behind.'],
				negative: ['I never met Kupe.'],
				won: ['*flips*']
			}
		},
		penguin: {
			endGame: 'Click the farkle title to end a game.',
			playerStats: 'Click player names to see their stats.',
			game: {
				start: ['Game on!']
			},
			dealer: {
				startTurn: ['C\'mon hot dice!', 'I gotta good feeling about this one.'],
				positive: ['That\'s nice!'],
				negative: ['*sigh*'],
				leading: ['You\'d better step it up.'],
				won: ['I love this game!']
			},
			player: {
				startTurn: ['Give it your best!', 'Roll \'em.'],
				positive: ['Amazing!'],
				leading: ['I\'m falling too far behind.'],
				negative: ['Better luck next time.'],
				won: ['You\'re pretty good at this.']
			}
		},
		lion: {
			game: {
				start: ['I am the king.']
			},
			dealer: {
				startTurn: ['Watch and learn.', 'Hear me ROAR...'],
				positive: ['WOO HOO!'],
				negative: ['I hate it when that happens.'],
				leading: ['You have your work cut out for you!'],
				won: ['*ROAR*']
			},
			player: {
				startTurn: ['Let\'s see what you got.', 'Throw with heart.'],
				positive: ['You\'re a natural.'],
				leading: ['You\'re stealing my pride.'],
				negative: ['...'],
				won: ['You are a superb opponent!']
			}
		},
		cobra: {
			game: {
				start: ['Yo Joe?']
			},
			dealer: {
				startTurn: ['Citizens of the world...', 'I make all of the important decisions.', 'A sterling symbol of power.'],
				positive: ['Look and tremble!', 'I am the new fire department!'],
				negative: ['Out in the rain...', 'Whose side are you on?', 'Poppycock!'],
				leading: ['I have a power greater than any in history.'],
				won: ['Stop sputtering.', 'I must have control.', 'Oh, picky, picky, picky.']
			},
			player: {
				startTurn: ['You\'ve got them eating out of your hand.', 'You\'ll give them someone to look up to.'],
				positive: ['I lost my cubes!', 'I will not allow such impertinence.', 'Poppycock!'],
				leading: ['My wonderful cubes!'],
				negative: ['Look and tremble!', 'You lack imagination.'],
				won: ['I have morons on my payroll!', 'Now I\'ll never rule the world!', 'An assassination of my character!']
			}
		},
		badger: {
			game: {
				start: ['THIS is the honey badger.']
			},
			dealer: {
				startTurn: ['Give me some snake eyes.', 'I\'m crazy!', 'I\'m hungry.'],
				positive: ['Loot out, Jackal, here I come!', 'I take what I want.', 'I do all of the work.'],
				negative: ['I don\'t give a rip.', 'I\'m running backwards!'],
				leading: ['My shoulders are broad!'],
				won: ['I need a mouse to eat.', 'Cobra for two weeks.', 'I need to find some honey.']
			},
			player: {
				startTurn: ['I eat snakes.', 'I love to dig.', 'Poison can\'t hurt me.'],
				positive: ['I\'m fearless.', '*grunts*', 'Sting me all you want!'],
				leading: ['I will never stop chasing you!'],
				negative: ['I have no regard for any animal.', 'I like bee larva for dinner.'],
				won: ['I need a mouse to eat.', 'I going to take a nap.', 'I need some honey to eat.']
			}
		},
		elk: {
			game: {
				start: ['Are you ready, red deer?']
			},
			dealer: {
				startTurn: ['Watch and learn.', 'Don\'t touch my velvet.'],
				positive: ['This velvet has been good to me!', 'I have the loudest bugles!'],
				negative: ['It\'s an infectious disease!', 'I need a vaccination.'],
				leading: ['You have your work cut out for you!'],
				won: ['Only a moose can lose.', 'Conquering ']
			},
			player: {
				startTurn: ['Stop posturing and role.'],
				positive: ['WAPITI!', '*bugles*', 'I need a thicker coat.'],
				leading: ['*bugles*'],
				negative: ['*bugles*', 'You need a thicker coat.'],
				won: ['Time to shed my antlers.', 'Gotta go find a cow.']
			}
		},
		vulture: {
			game: {
				start: ['Let me tell you about my family...']
			},
			dealer: {
				startTurn: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'				
				],
				positive: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'
				],
				negative: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'
				],
				leading: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'				
				],
				won: [
					'And me, King Vulture.'
				]
			},
			player: {
				startTurn: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'
				],
				positive: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'				
				],
				leading: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'				
				],
				negative: [
					'Cinereous',
					'Griffon',
					'White-rumped',
					'Rüppell\'s',
					'Indian',
					'Slender-billed',
					'Himalayan',
					'White-backed',
					'Cape',
					'Hooded',
					'Red-headed',
					'Lappet-faced',
					'White-headed',
					'Lammergeier',
					'Bearded',
					'Egyptian',
					'Palm-nut',
					'Black',
					'Turkey',
					'Lesser yellow-head',
					'Greater yellow-head',
					'California condor',
					'Andean condor'				
				],
				won: [
					'And me, King Vulture.'
				]
			}
		},
		jackal: {
			game: {
				start: ['Here we go!']
			},
			dealer: {
				startTurn: ['I am not the lonely type.', 'Hunting is my hobby.'],
				positive: ['It\'s a dog-eat-dog world!', 'I\'m golden.'],
				negative: ['That\'s rough!', 'I prefer dusk to dawn.'],
				leading: ['I\'m golden.'],
				won: ['Anubis helped.', 'I\'m golden.']
			},
			player: {
				startTurn: ['Throw with heart.'],
				positive: ['It\'s a dog-eat-dog world!', 'I\'m not cowardly; you are!'],
				negative: ['That\'s rough!'],
				leading: ['I had a hunting partner once.'],
				won: ['Why do jackals get such a bad rap?', 'I never liked hunting in groups.']
			}
		},
		rhino: {
			game: {
				start: ['Welcome to Earth!']
			},
			dealer: {
				startTurn: ['Sometimes, I spend whole nights looking to the stars.', 'I want to believe.'],
				positive: ['They\'ve beamed me powers!', 'Did you see that?', 'Welcome Visitors!', 'Strange lights in the night!'],
				negative: ['They\'re not telling us SOMETHING.', 'I\'m stuck in a blackhole!'],
				leading: ['I\'m light years ahead of you!'],
				won: ['The truth IS out there.', 'I am off to Proxima Centuri!']
			},
			player: {
				startTurn: ['I was abducted once.', 'No one believes me.'],
				positive: ['You\'re outta this world!', 'NOTHING can travel faster than light!'],
				negative: ['...'],
				leading: ['I\'m two parsecs behind!'],
				won: ['The truth IS out there.', 'Area 51 is calling me.']
			}
		},
		camel: {
			endGame: 'Click the farkle title to end a game.',
			playerStats: 'Click player names to see their stats.',
			game: {
				start: ['Here we go!']
			},
			dealer: {
				startTurn: ['Watch and learn.', 'Dice don\'t fail me now!'],
				positive: ['WOO HOO!'],
				negative: ['I hate it when that happens.'],
				leading: ['You have your work cut out for you!'],
				won: ['You\'ll have to try again...']
			},
			player: {
				startTurn: ['Let\'s see what you got.', 'Throw with heart.'],
				positive: ['You\'re a natural.'],
				leading: ['I gotta get ahead!'],
				negative: ['...'],
				won: ['You are a superb opponent!']
			}
		},
		gorilla: {
			game: {
				start: ['...']
			},
			dealer: {
				startTurn: ['*chuckles*'],
				positive: ['*chuckles*', '*HOOTS*'],
				negative: ['*cries*', '*ROARS*'],
				leading: ['*HOOTS*'],
				won: ['*HOOTS*']
			},
			player: {
				startTurn: ['*chuckles*'],
				positive: ['*ROARS*'],
				negative: ['*chuckles*'],
				leading: ['*cries*'],
				won: ['*cries*']
			}
		},
		panther: {
			game: {
				start: ['Up for a game of cat and mouse?']
			},
			dealer: {
				startTurn: ['Where\'s the nip?', 'You gotta ball of yarn?'],
				positive: ['*PURR*', '*raises tail*'],
				negative: ['*hisses*', '*growls*', '*roars*', '*flattens ears*'],
				leading: ['You\'re HISStory!'],
				won: ['You\'re HISStory!']
			},
			player: {
				startTurn: ['You can be my scratching post.', 'Got milk?'],
				negative: ['*purrs*', '*raises tail*'],
				positive: ['*hisses*', '*growls*', '*roars*'],
				leading: ['I\'d better catch up!'],
				won: ['Meow-t.']
			}
		},
		python: {
			game: {
				start: ['Let\'sss play!']
			},
			dealer: {
				startTurn: ['SSStarting my turn...'],
				positive: ['YESSS!'],
				negative: ['Unsssettling.'],
				leading: ['SSSomeone\'sss not doing ssso well.'],
				won: ['SSSorry about your luck.']
			},
			player: {
				startTurn: ['SSStart your turn!'],
				positive: ['SSSuper.'],
				leading: ['SSSomeone\'sss doing well.'],
				negative: ['SSSo sssad.'],
				won: ['Thisss makesss me sssad.']
			}
		},
		elephant: {
			game: {
				start: ['The circus is in town!', 'I am the children\'s giant pet.']
			},
			dealer: {
				startTurn: ['I am not a clown.', 'My balance is better than yours.', 'My brother is Dumbo.', 'My father was Jumbo.'],
				positive: ['I like picking up the lady with my trunk.', '*TRUMPETS*'],
				negative: ['PEANUTS!'],
				leading: ['I\'ve got a good lead going!'],
				won: ['*TRUMPETS*']
			},
			player: {
				startTurn: ['Barnum was a good guy.', 'Bailey was mean.', 'The brothers are fools'],
				positive: ['PEANUTS!'],
				negative: ['I hate walking on that ball.'],
				leading: ['I\'d better catch up!'],
				won: ['*sits down*']
			}
		},
		cockatoo: {
			game: {
				start: ['Let\'s play!']
			},
			dealer: {
				startTurn: ['I just flew in from Miami Beach.', 'Have you ever been to Key West?'],
				positive: ['Celebration!', 'Spring BREAK!'],
				negative: ['Orlando has too many tourists for me.'],
				leading: ['I\'ve got a good lead going!'],
				won: ['Gators RULE!']
			},
			player: {
				startTurn: ['Jacksonville never offered me much', 'I prefer fishing on the Wassisa.', 'Wakula is nice too.'],
				positive: ['Swamp water!', 'WHERE did you say you were from?'],
				negative: ['Celebration!', 'Spring BREAK!'],
				leading: ['I\'d better catch up!'],
				won: ['Save the Manatee!']
			}
		},
		crocodile: {
			game: {
				start: ['*SNAPS*']
			},
			dealer: {
				startTurn: ['I overheat in the sun if my mouth isn\'t open.', 'I used to eat crustaceans.', 'I like eating bats now.'],
				positive: ['I still have 68 of my 72 teeth!', 'The eggs are hatching.'],
				negative: ['Oh snap!'],
				leading: ['I\'ve got a good lead going!'],
				won: ['*SNAPS*']
			},
			player: {
				startTurn: ['My kids love insects.', 'I am 8 feet, 3 inches. You?'],
				positive: ['I bet I weigh more than you.'],
				negative: ['I still have 68 of my 72 teeth!'],
				leading: ['I\'d better catch up!'],
				won: ['*SNAPS*']
			}
		},
		bat: {
			game: {
				start: ['Step into my castle.']
			},
			dealer: {
				startTurn: ['Vlad was overrated.', 'I never drink... wine.', 'I\'m out of the coffin now.'],
				positive: ['Bring on the night!'],
				negative: ['The sun is too much!', 'No more garlic!'],
				leading: ['You have quite the CROSS to bare.'],
				won: ['You will never leave my castle now.']
			},
			player: {
				startTurn: ['Your turn.', 'Bella did a fine portrayal.', 'This is a high STEAKS game.'],
				positive: ['I can not stand the sun!', 'Keep that garlic away from me!'],
				leading: ['I\'d better catch up!'],
				negative: ['Bring on the night!'],
				won: ['You may leave my castle now.']
			}
		},
		monkey: {
			endGame: 'Click the farkle title to end a game.',
			playerStats: 'Click player names to see their stats.',
			game: {
				start: ['Let\'s play!']
			},
			dealer: {
				startTurn: ['My turn...', 'Here goes nothin\'.'],
				positive: ['Yeah!'],
				negative: ['Oh no!', 'I hate it when that happens.'],
				leading: ['I\'ve got a good lead going!'],
				won: ['You played well, but I was better.', 'Better luck next game.', 'Sweet victory!']
			},
			player: {
				startTurn: ['Good luck!', 'Your turn.'],
				positive: ['Nice one.'],
				leading: ['I\'d better catch up!'],
				negative: ['Womp womp.', 'Too bad.'],
				won: ['Great game!', 'I\'ll get you next time!', 'I can\'t believe I lost.']
			}
		}
	};

	module.init = function() {
		PWG.Utils.each(
		module.animals, function(animal) {
			_extendPersonality(animal.game, 'game');
			_extendPersonality(animal.dealer, 'dealer');
			_extendPersonality(animal.player, 'player');
		}, module);
	};

	module.getPersonality = function(name) {
		if (PWG.Utils.has(module.animals, name)) {
			return module.animals[name];
		} else {
			return _generic;
		}
	};

	function _extendPersonality(portion, portionKey) {
		PWG.Utils.each(
		portion, function(commentType, key) {
			var generics = _generic[portionKey][key];
			PWG.Utils.each(
			generics, function(genericComment) {
				commentType.push(genericComment);
			}, module);
		}, module);
	}

	return module;
}();


var PWG = PWG || {};
PWG.AIPersonality = function() {
	'use strict';
	var module = {};
	
	var MIN_VAL_FOR_COMMENT = 6;
	var SCORE_DIVIDE = 2000; 
	
	function Controller(name, isTournamentGame) {
		this.name = name;
		this.isTournamentGame = isTournamentGame;
		this.opponentName = '';
		this.isFirstComment = true;
		this.isWinning = false;
		this.isLosing = false;
		this.endGameDisplayed = false;
		this.playerStatsDisplayed = false;
		this.closeTimer = null;
		this.personality = PWG.Personalities.getPersonality(name);
	}
	
	Controller.prototype.getTurnStartComment = function(gameId, isAITurn) {
		var isAITurn = PWG.Players.getIsAITurn(gameId);
		// trace('AIPersonality/getTurnStartComment, isAITurn = ' + isAITurn);
		if(module.closeTimer) {
			module.closeTimer.stop();
		}
		if(this.opponentName === '') {
			var players = PWG.Players.getAll(gameId);
			PWG.Utils.each(
				players,
				function(player) {
					if(!player.isAIPlayer) {
						this.opponentName = player.name;
						// trace('opponentName = ' + this.opponentName);
					}
				},
				this
			);
		}
		
		var comment = '';
		if(this.isFirstComment) {
			comment = _getComment(this.personality, 'game', 'start');
			this.isFirstComment = false;
		} else {
			var scores = PWG.Players.getScores();

			if(isAITurn) {
				if(PWG.App.getData('needsGameOverMessage') && !this.isTournamentGame) {
					comment = this.personality.endGame;
					PWG.App.saveData('needsGameOverMessage', false);
					if(module.closeCallback) {
						_startCloseTimer(2);
					}
				} else if(PWG.App.getData('needsPlayerStatMessage') && !this.isTournamentGame) {
					comment = this.personality.playerStats;
					PWG.App.saveData('needsPlayerStatMessage', false);
					if(module.closeCallback) {
						_startCloseTimer(2);
					}
				} else {
					if((scores[this.name] + SCORE_DIVIDE) < scores[this.opponentName] && !this.isLosing) {
						// trace('player winning');
						comment = _getComment(this.personality, 'player', 'leading');
						this.isLosing = true;
						this.isWinning = false;
					} else {
						comment = _getComment(this.personality, 'dealer', 'startTurn');
					}
				}
			} else {
				if(scores[this.name] > (scores[this.opponentName] + SCORE_DIVIDE) && !this.isWinning) {
					// trace('dealer winning');
					comment = _getComment(this.personality, 'dealer', 'leading');
					this.isWinning = true;
					this.isLosing = false;
				} else {
					comment = _getComment(this.personality, 'player', 'startTurn');
				}
			}
		}
		// trace('comment = ' + comment);
		return comment; 
	};

	Controller.prototype.getRollComment = function(gameId, farkle, hotDice) {
		var isAITurn = PWG.Players.getIsAITurn(gameId);
		// trace('AIPersonality/getRollComment, isAITurn = ' + isAITurn + ', farkle = ' + farkle + ', hotDice = ' + hotDice);
		var comment = '';
		
		if(isAITurn) {
			if(farkle) {
				comment = _getComment(this.personality, 'dealer', 'negative');
			} else if(hotDice) {
				comment = _getComment(this.personality, 'dealer', 'positive');
			}
		} else {
			if(farkle) {
				comment = _getComment(this.personality, 'player', 'negative');
			} else if(hotDice) {
				comment = _getComment(this.personality, 'player', 'positive');
			}
		}
		// trace('comment = ' + comment);
		return comment;
	};
	
	Controller.prototype.getWinComment = function(winningPlayer) {
		// trace('AIPersonality/getWinComment, winner = ' + winningPlayer.name + ', this.name = ' + this.name);
		var comment = ''; 
		
		if(winningPlayer.name === this.name) {
			comment = _getComment(this.personality, 'dealer', 'won');
		} else {
			comment = _getComment(this.personality, 'player', 'won');
		}
		
		return comment;
	};
	
	module.gameEndCommentGiven = false;
	module.playerStatsCommentGiven = false;
	
	module.create = function(name, isTournamentGame) {
		var controller = new Controller(name, isTournamentGame);
		module.activeComments = PWG.Utils.clone(controller.personality);
		module.previousComment = {
			game: { 
				start: -1 
			},
			dealer: {
				startTurn: -1,
				positive: -1,
				negative: -1,
				leading: -1,
				won: -1
			},
			player: {
				startTurn: -1,
				positive: -1,
				negative: -1,
				leading: -1,
				won: -1
			}
		};
		// trace('AIPersonality/create, personality = ', controller.personality);
		return controller;
	};
	
	module.setCloseCallback = function(closeCallback, context) {
		module.closeCallback = closeCallback || null;
		module.closeCallbackContext = context || module;
	};
	
	function _getComment(personality, key1, key2) {
		// trace('AIPersonality/_getComment, key1 = ' + key1 + ', key2 = ' + key2);
		if(module.closeCallback) {
			_startCloseTimer(1);
		}

		var idx = PWG.Utils.diceRoll(module.activeComments[key1][key2].length) - 1;
		var comment = module.activeComments[key1][key2].splice(idx, 1);

		if(module.previousComment[key1][key2] > -1) {
			module.activeComments[key1][key2].push(personality[key1][key2][module.previousComment[key1][key2]]);
		}
		module.previousComment[key1][key2] = idx;
		
		return comment;
	};
	
	function _startCloseTimer(multiplier) {
		// trace('AIPersonality/_startCloseTimer');
		if(module.closeTimer) {
			module.closeTimer.stop();
			PWG.Timer.remove(module.closeTimer.id);
		}
		module.closeTimer = PWG.Timer.create();
		module.closeTimer.start(
			(PWG.App.DELAY_TIME * multiplier),
			function(t, params) {
				// trace('close comment');
				params.cb.call(params.ctx);
				PWG.Timer.remove(t.id);
			},
			{ cb: _onTimerCompleted, ctx: module },
			module
		);
	};
	
	function _onTimerCompleted() {
		module.closeTimer = null;
		if(module.closeCallback) {
			module.closeCallback.call(module.closeCallbackContext);
		}
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.AILogic = function() {
	'use strict';
	var module = {};
	
	module.selectDice = function(sorted, usedDice) {
		// trace('AILogic/selectDice, usedDice = ' + usedDice);
		var selectedDice = [];
		var scores = {};
		var topValue = 0;
		var topKey;
		var totalRoll = 0;
		var totalScoring = 0;
		var potentialScore = 0; 

		PWG.Utils.each(
			sorted,
			function(scorers, key) {
				if(key === 'ones') {
					scores[key] = PWG.Farkle.getOnesScore(scorers.length);
				} else if(key === 'fives') {
					scores[key] = PWG.Farkle.getFivesScore(scorers.length);
				} else {
					scores[key] = PWG.Farkle.getGroupScore(key, scorers.length);
				}
				totalScoring += scorers.length;
				potentialScore += scores[key];
			},
			module
		);
		// trace('totalScoring = ' + totalScoring + '\n\tpotentialScore = ' + potentialScore + '\n\tscores = ', scores);
		PWG.Utils.each(
			scores,
			function(score, key) {
				if(score === topValue) {
					// trace(key + ' equal to ' + topKey + ' topValue: ' + topValue + '\n\tsorted[key].length = ' + sorted[key].length + '\n\tsorted[topKey].length = ' + sorted[topKey].length);
					if(sorted[key].length < sorted[topKey].length) {
						// get the same value using fewer dice
						topKey = key;
						topValue = score;
					}
				} else if(score > topValue) {
					topKey = key;
					topValue = score;
				}
				totalRoll += score;
			},
			module
		);

		// trace('topKey['+topKey+'] = ' + topValue + ', totalRoll = ', totalRoll);

		// trace('sorted = ', sorted);
		// there was something scored
		if(totalRoll > 0) {
			// all dice scoring
			if(totalScoring + usedDice === 6) {
				// trace('\tselecting all 6: totalScoring = ' + totalScoring + ', usedDice = ' + usedDice);
				PWG.Utils.each(
					sorted,
					function(collection) {
						PWG.Utils.each(
							collection,
							function(die) {
								selectedDice.push(die);
							},
							module
						);
					},
					module
				);
			} else {
				// trace('\tselecting topKey: ' + topKey);
				// ONES 
				if(topKey === 'ones') {
					if(sorted.ones.length > 2) {
						// trace('\t3 or more ones');
						selectedDice = sorted[topKey];
					} else if(usedDice < 3) {
						// only add 1 one if have enough dice left to get a triple next roll
						// trace('\tonly adding 1 ones');
						// selectedDice.push(sorted.ones.pop());
						selectedDice.push(sorted.ones[0]);
					} else {
						// add them all
						// trace('\tadding all ones');
						selectedDice = sorted[topKey];
					}
					if(sorted.fives) {
						selectedDice = module.checkForSmallerScorerAdd(usedDice, selectedDice, sorted.fives);
					}
				// FIVES
				} else if(topKey === 'fives') {
					if(sorted.fives.length > 2) {
						// trace('\t3 or more fives');
						selectedDice = sorted[topKey];
					} else if(usedDice < 3) {
						// only add 1 one if have enough dice left to get a triple next roll
						// trace('\tonly adding 1 fives');
						// selectedDice.push(sorted.fives.pop());
						selectedDice.push(sorted.fives[0]);
					} else {
						// add them all
						// trace('\tadding all fives');
						selectedDice = sorted[topKey];
					}
					if(sorted.ones) {
						selectedDice = module.checkForSmallerScorerAdd(usedDice, selectedDice, sorted.ones);
					}
				// OTHER
				} else {
					selectedDice = sorted[topKey];
					if(sorted.ones || sorted.fives) {
						if(sorted.ones && sorted.fives) {
							// add 1s and 5s to use all of the available dice
							if(usedDice + selectedDice.length + sorted.ones.length + sorted.fives.length === 0) {
								// trace('adding ones and fives in order to complete the hotdice');
								selectedDice = selectedDice.concat(sorted.ones);
								selectedDice = selectedDice.concat(sorted.fives);
							}
						} else {
							if(topKey !== 'ones' && sorted.ones) {
								selectedDice = module.checkForSmallerScorerAdd(usedDice, selectedDice, sorted.ones);
							}
							if(topKey !== 'fives' && sorted.fives) {
								selectedDice = module.checkForSmallerScorerAdd(usedDice, selectedDice, sorted.fives);
							}
						}
					}
				}
			}

			// trace('selectedDice = ', selectedDice);
		}
		// trace('selectedDice now = ', selectedDice);

		return selectedDice;
	};
	
	module.sortDice = function(dice) {
		// trace('AILogic/sortDice, dice = ', dice);
		var sorted = {};
		
		PWG.Utils.each(
			dice,
		 	function(die, idx) {
				// trace('\tdie['+idx+'] = ', die.value);
				if(die.isActive) {
					// trace('\t\tit is active');
					if(die.groupId) {
						// trace('\t\tit is part of a group');
						if(!sorted[die.groupId]) {
							sorted[die.groupId] = [];
						}
						sorted[die.groupId].push(die);

					} else if(die.value === 1) {
						// trace('\t\tit is a 1');
						if(!sorted['ones']) {
							sorted['ones'] = [];
						}
						sorted.ones.push(die);
					} else if(die.value === 5) {
						// trace('\t\tit is a 5');
						if(!sorted['fives']) {
							sorted['fives'] = [];
						}
						sorted.fives.push(die);
					}
				}
			},
			module
		);
		
		return sorted;
	};
	
	module.checkForSmallerScorerAdd = function(usedDice, selectedDice, scorer) {
		if(scorer.length > 2) {
			// add ones when there are 3 or more
			// trace('\t3 or more ones');
			selectedDice = selectedDice.concat(scorer);
		} else if(usedDice + (selectedDice.length + scorer.length) >= 5) {
			// add ones if near end of dice / hot dice
			// trace('\tadding ones since near the end');
			selectedDice = selectedDice.concat(scorer);
		} else if(selectedDice.length === 0 && scorer.length > 0) {
			// add a ones if there are no other scoring dice
			// trace('\tadding a 1');
			selectedDice.push(scorer.pop());
			// selectedDice = scorer;
		}
		return selectedDice; 
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.AIPlayer = function() {
	'use strict';
	PWG.Utils.inherit(AIPlayer, PWG.Player);
	
	var THINKING_TIME = 1300; 

	var REROLL_CHANCE = 3; 
	var PLAY_IT_SAFE_CHANCE = 5;
	
	var MAX_DICE_USED_TO_BANK = 3;
	var MAX_REROLL_SCORE = 700;
	var MIN_PLAY_IT_SAFE_SCORE = 1000;
	
	function AIPlayer(config) {
		// trace('AIPlayer/constructor, config = ', config, '_super = ', AIPlayer._super);
		config.isAIPlayer = true;
		AIPlayer._super.constructor.call(this, config);
		this.isGUIGame = config.isGUIGame;
		this.gameId = config.gameId;
		this.rolledDice;
		this.turnScore;
		this.usedDice;
		this.resumeAction = null;
	}

	AIPlayer.prototype.resume = function() {
		AIPlayer._super.resume.call(this);
		if(this.resumeAction) {
			this.resumeAction.method.call(this, this.resumeAction.params);
			this.resumeAction = null;
		}
	};
	
	AIPlayer.prototype.startTurn = function() {
		// trace('AIPlayer/startTurn, this = ', this);
		this.rolledDice = {};
		this.turnScore = 0;
		this.usedDice = 0;
		this.totalUsedDice = 0;
		
		this.doAction(this.roll);
	};
	
	AIPlayer.prototype.roll = function() {
		// trace('AIPlayer/roll, this = ', this);
		if(!this.isPaused) {
			PWG.Games.roll(this.gameId);
			// PWG.Games.rollFarkle(this.gameId);
		} else {
			this.resumeAction = {
				method: this.roll,
				params: null
			};
		}
	};
	
	AIPlayer.prototype.hasFarkled = function() {
		this.turnScore = 0;
		AIPlayer._super.hasFarkled.call(this);
	};
	
	AIPlayer.prototype.setRolledDice = function(dice) {
		// trace('AIPlayer/setRolledDice, dice = ', dice);
		this.rolledDice = dice; 

		this.doAction(this.selectDice);
	};
	
	AIPlayer.prototype.selectDice = function() {
		// trace('AIPlayer/selectDice');
		var selectedDice = PWG.AILogic.selectDice(PWG.AILogic.sortDice(this.rolledDice.collection), this.usedDice);

		if(selectedDice.length > 0) {
			this.totalUsedDice = this.usedDice += selectedDice.length;
			if(this.usedDice >= 6) {
				this.usedDice = 0;
			}
			if(!this.isPaused) {
				this.submitSelectedDice(selectedDice);
			} else {
				this.resumeAction = {
					method: this.submitSelectedDice,
					params: selectedDice
				};
			}
		} else {
			// trace('------- no scoring dice found');
			// nothing scored
			// trace('AIPlayer selectedDice, pause = ' + this.isPaused);
			if(!this.isPaused) {
				this.doAction(this.endTurn);
			} else {
				this.resumeAction = {
					method: this.endTurn, 
					params: null
				};
			}
		}
		this.rolledDice = {};
	};
	
	AIPlayer.prototype.submitSelectedDice = function(selectedDice) {
		// trace('AIPlayer/submitSelectedDice, selectedDice = ', selectedDice);
		PWG.Games.selectDice(this.gameId, selectedDice);
		this.doAction(this.completeSelection);
	};
	
	AIPlayer.prototype.completeSelection = function() {
		// trace('AIPlayer/completeSelection');
		PWG.Games.selectionComplete(this.gameId);
	};
	
	AIPlayer.prototype.updateTurnScore = function(score, hotDice) {
		var takeAChance;
		this.turnScore = score;
		// trace('------- AIPlayer/updateTurnScore\n\tscore = ' + score + '\n\tturnScore = ' + this.turnScore + '\n\thotDice = ' + hotDice + '\n\tusedDice = ' + this.usedDice + '\n\ttotalUsedDice = ' + this.totalUsedDice);
		
		if(this.score >= PWG.Farkle.WINNING_SCORE) {
			// trace('\twon game, end turn');
			this.doAction(this.endTurn);
		} else if(hotDice) {
			// trace('\thas hot dice, rolling again');
			this.doAction(this.roll);
		} else if(this.turnScore >= MIN_PLAY_IT_SAFE_SCORE) {
			// trace('\tover min play it safe score'); 
			takeAChance = PWG.Utils.diceRoll();
			if(takeAChance > PLAY_IT_SAFE_CHANCE) {
				// trace('\t\ttaking a chance');
				this.doAction(this.roll);
			} else {
				// trace('\t\tplaying it safe');
				this.doAction(this.endTurn);
			}
		} else {
			if(this.turnScore >= PWG.Farkle.MIN_TURN_SCORE) {
				// trace('\tusedDice = ' + this.totalUsedDice + ', max = ' + MAX_DICE_USED_TO_BANK);
				if(this.currentFarkles === (PWG.Farkle.NUM_FARKLES_BEFORE_DEDUCTION - 1)) {
					// trace('\t\ttoo many farkles: playing it safe and ending turn');
					this.doAction(this.endTurn);
				} else if(this.totalUsedDice > MAX_DICE_USED_TO_BANK) {
					// trace('\t\tthe dice used is greater than num to bank');
					if(this.turnScore < MAX_REROLL_SCORE) {
						// trace('\t\t\tthe score is less than the max reroll score');
						takeAChance = PWG.Utils.diceRoll();
						if(takeAChance > REROLL_CHANCE) {
							// trace('\t\t\t\ttaking a chance!');
							this.doAction(this.roll);
						} else {
							// trace('\t\t\t\tno gamble: end turn');
							this.doAction(this.endTurn);
						}
					} else {
						// trace('\t\t\tthe score is greater than the max reroll score, end turn');
						this.doAction(this.endTurn);
					}
				} else {
					// if less than 3 dice used, take a chance and reroll
					// trace('\t\tthe used dice is less than num to bank roll again');
					this.doAction(this.roll);
				}
			} else {
				// haven't made mininum turn score
				// trace('\thave not made minimum turn score: roll again');
				this.doAction(this.roll);
			}
		}
	};

	AIPlayer.prototype.doAction = function(action) {
		// trace('AIPlayer['+this.name+']/doAction, isGUIGame = ' + this.isGUIGame + ', action = ', action.constructor.name);
		if(!this.isGUIGame) {
			action.call(this);
		} else {
			var aiActionTimer = PWG.Timer.create();
			aiActionTimer.start(
				THINKING_TIME,
				function(t, params) {
					// trace('AIPlayer timer of doAction, conttext = ', params.context);
					params.action.call(params.context);
					PWG.Timer.remove(t.id);
				},
				{ action: action, context: this },
				this
			);
		}
	};
	
	AIPlayer.prototype.endTurn = function() {
		this.turnScore = 0;
		PWG.Games.endTurn(this.gameId);
	};

	return AIPlayer;
}();

var PWG = PWG || {};
PWG.Players = function() {
	'use strict';
	var module = {};
	
	module.TUTORIAL_PLAYER_NAME = 'student';
	
	// hold arrays of players in game.id object
	var _players = {};
	var _currentIndices = {};
	var _isAITurn = {};
	
	module.getCurrent = function(id) {
		if(_currentIndices[id] === -1) {
			return null;
		}
		return _players[id][_currentIndices[id]];
	};
	
	module.getAll = function(id) {
		return _players[id];
	};

	module.get = function() {
		return _players;
	};
	
	module.getIsAITurn = function(id) {
		return _isAITurn[id];
	};
	
	module.getSinglePlayerName = function(id) {
		var name;
		// trace('Players/getSinglePlayerName, _players['+id+'] = ', _players[id]);
		PWG.Utils.each(
			_players[id],
			function(player) {
				if(!player.isAIPlayer) {
					name = player.name;
				}
			},
			module
		);
		return name;
	};
	
	module.getPlayer = function(id, name) {
		// var player = PWG.Utils.find(_players[id], function(p) { return (p.name === name) ? true : false; }, module);
		// var player = PWG.Utils.find(_players[id], name);
		var player = null;
		PWG.Utils.each(
			_players[id],
			function(p) {
				if(p.name === name) {
					player = p;
				}
			},
			module
		);
		return player;
	};
	
	module.getScores = function(id) {
		var scores = {};
		PWG.Utils.each(
			_players[id],
			function(player) {
				scores[player.name] = player.score;
			},
			module
		);
		
		return scores;
	};
	
	module.getAllPlayerStats = function(id) {
		var details = {};
		// trace('Players/getAllPlayerStats, _players['+id+'] = ', _players[id]);
		PWG.Utils.each(
			_players[id],
			function(player) {
				// trace('player.name = ' + player.name);
				details[player.name] = player.getStats();
			},
			module
		);
		return details;
	};
	
	module.create = function(id, players, savedPlayerData, isGUIGame, isTournamentGame) {
		// trace('Players/create, id = ' + id + ', players = ', players);

		_currentIndices[id] = -1;
		var newPlayers = [];

		PWG.Utils.each(
			players,
			function(player) {
				var playerConfig;
				// trace('player name = ' + player.name);
				if(savedPlayerData.hasOwnProperty(player.name)) {
					playerConfig = savedPlayerData[player.name];
				} else {
					playerConfig = player;
				}
				playerConfig.isGUIGame = isGUIGame;
				playerConfig.isTournamentGame = isTournamentGame;
				playerConfig.gameId = id;
				
				var newPlayer = (player.isAIPlayer) ? new PWG.AIPlayer(playerConfig) : new PWG.Player(playerConfig);
				// trace('\tnewPlayer = ', newPlayer);
				newPlayers.push(newPlayer);
			},
			module
		);

		_players[id] = newPlayers;
		// trace('\tend of PWG.Players.create, _players = ', _players);
	};

	module.startGame = function(id) {
		_currentIndices[id] = 0;
		module.resume(id);
	};

	module.incrementTurn = function(id) {
		_players[id][_currentIndices[id]].turns++;
	};
	
	module.startTurn = function(id) {
		// trace('Players/startTurn, _currentIndices[id] = ' + _currentIndices[id] + ', _players = ', _players);

		if(_players[id][_currentIndices[id]].isAIPlayer) {
			_isAITurn[id] = true;
			_players[id][_currentIndices[id]].startTurn();
		} else {
			_isAITurn[id] = false;
		}
		return _isAITurn[id];
	};
	
	module.hasHotDice = function(id, hotDice) {
		// trace('Players/hasHotDice, _current = ' + _currentIndices[id] + ', _players[' + id + '] = ', _players[id]);
		_players[id][_currentIndices[id]].hasHotDice(hotDice);
	};
	
	module.hasFarkled = function(id) {
		// trace('Players/hasFarkled, id = ' + id + ', currentIndex = ' + _currentIndices[id] + ', players = ', _players[id], ', _currentIndices = ', _currentIndices);
		_players[id][_currentIndices[id]].hasFarkled();
	};
	
	module.setRolledDice = function(id, dice) {
		if(_players[id][_currentIndices[id]].isAIPlayer) {
			_players[id][_currentIndices[id]].setRolledDice(dice);
		}
	};
	
	module.updateTurnScore = function(id, score, hotDice) {
		// trace('Players/updateTurnScore, hotDice = ', hotDice);
		if(_players[id][_currentIndices[id]].isAIPlayer) {
			_players[id][_currentIndices[id]].updateTurnScore(score, hotDice);
		}
	};
	
	module.onTurnEnded = function(id, farkled, turnDice) {
		// trace('Players/endTurn, id = ' + id + ', _players = ', _players[id], ', _currentIndices: ' + _currentIndices[id]);
		_players[id][_currentIndices[id]].onTurnEnded(farkled, turnDice);
	};
	
	module.nextPlayer = function(id) {
		if(_currentIndices[id] < (_players[id].length - 1)) {
			_currentIndices[id]++;
		} else {
			_currentIndices[id] = 0;
		}
	};
	
	module.gameOver = function(id) {
		// trace('Players/gameOver, id = ' + id);
		var winner;
		
		PWG.Utils.each(
			_players[id],
			function(player, idx) {
				player.hasFinishedGame();
				if(idx === _currentIndices[id]) {
					player.hasWon();
					winner = player;
				}
			},
			module
		);
		return winner;
	};

	module.hasWonTournament = function(id) {
		// trace('Players/hasWonTournament, ' + id + ', _players[id][_currentIndices[id]] = ', _players[id][_currentIndices[id]]);
		_players[id][_currentIndices[id]].hasWonTournament();
	};
	
	module.pause = function(id) {
		PWG.Utils.each(
			_players[id],
			function(player) {
				player.pause();
			},
			this
		);
	};
	
	module.resume = function(id) {
		PWG.Utils.each(
			_players[id],
			function(player) {
				player.resume();
			},
			this
		);
	};
	
	module.quit = function(id) {
		// trace('---------------------- Players/quit');
		_currentIndices[id] = -1;
		_players[id] = [];
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.PlayerAnimalHomes = {
	dog: 'forest',
	rabbit: 'savannah',
	fish: 'ocean',
	cat: 'jungle'
};

PWG.Animals = function() {
	var module = {};
	var guideIdx = 7;
	
	var locations = {
		forest: [
			'bear',
			'wolf',
			'fox',
			'lynx',
			'beaver',
			'deer',
			'hawk',
			'squirrel'
		],
		ocean: [
			'shark',
			'whale',
			'squid',
			'barracuda',
			'stingray',
			'crab',
			'dolphin',
			'penguin'
		],
		savannah: [
			'lion',
			'cobra',
			'badger',
			'elk',
			'vulture',
			'jackal',
			'rhino',
			'camel'
		],
		jungle: [
			'gorilla',
			'panther',
			'python',
			'elephant',
			'cockatoo',
			'crocodile',
			'bat',
			'monkey'
		]
	};
	
	module.locations = locations;

	module.guides = {
		forest: locations.forest[guideIdx],
		savannah: locations.savannah[guideIdx],
		ocean: locations.ocean[guideIdx],
		jungle: locations.jungle[guideIdx]
	};
	
	module.getLocationsLength = function() {
		return PWG.Utils.objLength(locations);
	};
	
	module.getLocationKeys = function() {
		return Object.keys(locations);
	};
	
	module.getHome = function(animal) {
		var location = PWG.Utils.find(locations, animal);
		for(var key in locations) {
			if(~locations[key].indexOf(animal)) {
				location = key;
				break;
			}
		}
		return location;
	};
	
	return module;
}();


var PWG = PWG || {};
PWG.GUIDie = function() {
	function GUIDie(idx, value, id, parentEl, scorable, groupId) {
		this.idx = idx;
		this.id = id;
		this.value = value;
		this.isSelected = false;
		this.isScorable = scorable;
		this.groupId = groupId;
		this.styleString = '';

		// trace('GUIDie/constructor, idx = ' + idx + ', value = ' + value + ', id = ' + id + ', parentEl = ', parentEl);
		this.el = document.createElement('div');
		this.el.className = "die die_" + value;
		this.el.setAttribute('id',  id);

		this.styleString = 'width: ' + PWG.GUIDice.dieWidthHeight + 'px;';
		this.styleString += 'height: ' + PWG.GUIDice.dieWidthHeight + 'px;';
		parentEl.appendChild(this.el); 

	};

	GUIDie.prototype.destroy = function() {
		if(this.clickHandler) {
			this.el.removeEventListener('click', this.clickHandler);
		} 
		if(this.touchController) {
			this.touchController.destroy();
		}
	};

	return GUIDie;
}(); 



var PWG = PWG || {};
PWG.RolledDie = function() {
	PWG.Utils.inherit(RolledDie, PWG.GUIDie);
	
	var ANIMATION_MAX_TIME = 300; 
	var ANIMATION_MIN_TIME = 10;

	var SELECTABLE_DIE_CLASS = ' selectable_die';
	var NON_SCORING_DIE_CLASS = ' non_scoring_die';
	var DIE_LEFT_OFFSET = 15;

	var _rotateStyle = ' transform:rotate(~{rotation}~deg);-ms-transform:rotate(~{rotation}~deg);-webkit-transform:rotate(~{rotation}~deg);';
	
	function RolledDie(idx, value, id, parentEl, scorable, groupId, isAITurn) {
		RolledDie._super.constructor.call(this, idx, value, id, parentEl, scorable, groupId);

		var animatedStyleString = '';
		var animations = [];

		var left = Math.floor(((idx * PWG.GUIDice.dieDiameter) + (PWG.GUIDice.unit * 9)) + DIE_LEFT_OFFSET);

		this.animatedStyleString = 'left:' + left + 'px;';
		animations.push({ key: 'left', begin: parentEl.clientWidth, end: left, unit: 'px' });

		if(PWG.GUIDice.randomPositions) {
			var top;

			if(idx === 0 || idx === 5) {
				// keep 1st and 6th die from positioning under control buttons
				top = (Math.floor(Math.random() * (PWG.GUIDice.rollingGreenRect.height - (PWG.GUIDice.dieDiameter + (PWG.GUIDice.playScreenRect.height/6) + (PWG.GUIDice.unit * 10)))));
			} else {
				top = (Math.floor(Math.random() * (PWG.GUIDice.rollingGreenRect.height - PWG.GUIDice.dieDiameter) + (PWG.GUIDice.unit * 3)));
			}

			this.animatedStyleString += 'top:' + top + 'px;';

			animations.push({ key: 'top', begin: (top + 200), end: top, unit: 'px' });
		}

		if(PWG.GUIDice.randomRotations) {
			var endRot = Math.floor(Math.random() * 360);
			var neg = PWG.Utils.coinToss();
			var beginRot = (neg) ? (endRot - 180) : (endRot + 180);
			var rotationRule = PWG.Utils.parseMarkup(_rotateStyle, { rotation: endRot });

			this.styleString += ' ' + rotationRule;
			// this.animatedStyleString += rotationRule;
			// animations.push({ key: 'rotate', begin: beginRot, end: endRot, unit: '' });
		}

		if(!isAITurn) {
			if(scorable) {
				this.el.className += SELECTABLE_DIE_CLASS;

				if(PWG.App.isAndroid) {
					var listeners = {
						move: {
							fn: PWG.GUIDice.touchMove,
							ctx: this
						},
						end: {
							fn: PWG.GUIDice.touchEnd,
							ctx: this
						}
					};
					this.touchController = PWG.TouchManager.add(this.el, listeners);
				} else {
					this.el.className += SELECTABLE_DIE_CLASS;
					this.clickHandler = function(ctx) {
						return function(event) {
							PWG.GUIDice.addDieToBank(ctx);
						};
					}(this);
					this.el.addEventListener('click', this.clickHandler);
				}
			} else if(PWG.App.isTutorialActive) {
				this.el.className += NON_SCORING_DIE_CLASS;
			}
		}

		var params = { 
			styleString: this.styleString, 
			id: this.id,
			idx: this.idx
		};

		if(PWG.GUIDice.animateDice) {
			var time = Math.floor(Math.random() * (ANIMATION_MAX_TIME - ANIMATION_MIN_TIME) + ANIMATION_MIN_TIME);

			PWG.Animator.create(
				this.el, 
				animations, 
				time, 
				true, 
				function(animationId, el, params) {
					PWG.GUIDice.dieAdded(el, params);
				}, 
				this,
				params
			);
		} else {
			this.el.setAttribute('style', (this.styleString + this.animatedStyleString));
			PWG.GUIDice.dieAdded(this.el, params);
		}
	}
	
	return RolledDie;
}();



var PWG = PWG || {};
PWG.BankedDie = function() {
	PWG.Utils.inherit(BankedDie, PWG.GUIDie);
	
	function BankedDie(idx, value, id, parentEl, scorable, groupId) {
		BankedDie._super.constructor.call(this, idx, value, id, parentEl, scorable, groupId);

		this.styleString += 'left:' + (idx * PWG.GUIDice.dieDiameter) + 'px;';
		this.styleString += 'top:0px;';

		var params = { 
			styleString: this.styleString, 
			id: this.id,
			idx: this.idx
		};

		this.el.setAttribute('style', (this.styleString));
		PWG.GUIDice.dieAdded(this.el, params);
	}
	
	return BankedDie;
}();



var PWG = PWG || {};
PWG.GUIDice = function() {
	'use strict';
	var module = {};
	
	var SHOW_ROLLED_DICE_DELAY = 25;

	module.gui = null;
	module.dice = {};
	module.rollingGreenRect = {};
	module.playScreenRect = {};
	module.dieDiameter = 0;
	module.dieWidthHeight = 0; 
	module.unit = 0;
	module.randomPositions = true;
	// module.randomPositions = false;
	module.randomRotations = true; 
	// module.randomRotations = false;
	module.animateDice = true;
	// module.animateDice = false; 
	
	module.init = function(gui) {
		module.gui = gui;
	};
	
	module.getDieById = function(id, collection) {
		if(!module.dice[collection].hasOwnProperty(id)) {
			return;
		}
		return module.dice[collection][id];
	};
	
	module.addDie = function(name, idx, value, parentEl, onGreen, scorable, groupId) {
		if(!module.dice[name]) {
			module.dice[name] = {};
		}
		// trace('GUIDDice/addDie, onGreen = ' + onGreen + ', name = ' + name + ', idx = ' + idx);
		var id = name + idx + '-' + String(new Date().getTime()) + '-' + String(Math.floor(Math.random() * 99));
		if(onGreen) {
			var guiDie = new PWG.RolledDie(idx, value, id, parentEl, scorable, groupId);
		} else {
			var guiDie = new PWG.BankedDie(idx, value, id, parentEl, scorable, groupId);
		}

		module.dice[name][id] = guiDie;
	};

	module.addDiceWithTimer = function(params, diceAddedCallback, context) {
		var rolledTimer = PWG.Timer.create();
		
		module.callback = diceAddedCallback;
		module.context = context || module;
		
		module.diceAdded = 0;
		module.numToAdd = 0;
		
		var onGreen = (params.name === 'rolledDice') ? true : false;
		// trace('onGreen = ' + onGreen + ', name = ' + params.name);
		rolledTimer.loop(
			SHOW_ROLLED_DICE_DELAY, 
			function(t, params) {
				var die = params.collection[params.idx];
				if(die.isActive) {
					// only add dice that are active as all 6 are in collection at all times
					module.numToAdd++;
					module.addDie(
						params.name, 
						params.idx, 
						die.value, 
						params.parentEl, 
						onGreen, 
						die.isScorable, 
						die.groupId,
						params.isAITurn
					);
				}
				params.idx++;
			
				if(params.idx === params.collection.length) {
					PWG.Timer.remove(t.id);
				}
			},
			params,
			module
		);
	};
	
	module.dieAdded = function(el, params) {
		// trace('GUIDice/dieAdded, el = ', el);
		// trace('GUIDie/dieAdded, diceAdded = ' + module.diceAdded + ', numToAdd = ' + module.numToAdd);
		module.diceAdded++;
		if(module.diceAdded === module.numToAdd) {
			module.allDiceAdded();
		}
	};
	
	module.allDiceAdded = function() {
		// trace('GUIDie/addDiceAdded');
		module.numToAdd = 0;
		if(module.callback) {
			module.callback.call(module.context);
		}
	};
	
	module.getDice = function(collection) {
		// if(module.dice[collection].hasOwnProperty(collection)) {
		if(module.dice.hasOwnProperty(collection)) {
			return module.dice[collection];
		}
		return;
	};

	module.updateSizes = function() {
		var base = (PWG.WindowParams.orientation === 'landscape') ? PWG.WindowParams.height : PWG.WindowParams.width;
		// trace('base = ' + base);
		if(PWG.WindowParams.orientation === 'portrait' || PWG.App.isTutorialActive) {
			base *= 0.75;
		}
		
		var dieDiameter = ((base/6) * 0.85);
		module.dieDiameter = dieDiameter;
		module.dieWidthHeight = Math.floor(Math.sqrt(Math.pow(dieDiameter, 2)/2));
	};
	
	module.resizeDice = function(dice, onGreen) {
		PWG.Utils.each(
			dice,
			function(die) {
				var oldStyle = die.el.getAttribute('style');
				var sansWidthHeight = oldStyle.substr(oldStyle.indexOf('top'), oldStyle.length);
				var newStyle = 'width:' + module.dieWidthHeight + 'px;' + 'height:' + module.dieWidthHeight + 'px;' + sansWidthHeight;
				// trace('sansWidthHeight = ' + sansWidthHeight);
				// trace('onGreen = ' + onGreen);
				if(onGreen) {
					var left = ((die.idx * module.dieDiameter) + (module.unit * 7));
					// trace('die['+die.idx+'] left = ' + left);
					newStyle += 'left:' + left + 'px;';
				} else {
					newStyle += 'left:' + (die.idx * module.dieDiameter) + 'px;';
				}
				die.el.setAttribute('style', newStyle);
			},
			this
		);
	};
	
	module.touchMove = function(evt, el) {
		// trace('gui dice touchMove, x/y = ' + evt.pageX + '/' + evt.pageY);
		el.style.left = (evt.pageX - (el.clientWidth/2)) + 'px';
		el.style.top = ((evt.pageY - (el.clientHeight/2)) - module.rollingGreenRect.top) + 'px';
	};
	
	module.touchEnd = function(evt, el) {
		// this context is the GUIDice intance
		
		el.style.left = (evt.pageX - (el.clientWidth/2)) + 'px';
		el.style.top = ((evt.pageY - (el.clientHeight/2)) - module.rollingGreenRect.top) + 'px';
		
		if(evt.pageY >= module.bankRect.top) {
			module.addDieToBank(this);
		}
	};
	
	module.addDieToBank = function(guiDie) {
		// trace('FlatGui/addDieToBank, guiDie = ', guiDie, '\n\tselectedDice = ', module.selectedDice);
		module.selectedDice = {};

		guiDie.isSelected = true;
		
		module.selectedDice[guiDie.id] = guiDie.idx;
		module.gui.toSelect[guiDie.id] = guiDie.idx;
		
		if(guiDie.groupId !== '') {
			var groupId = guiDie.groupId;
			var group = module.dice['rolledDice'];
			PWG.Utils.each(
				group, 
				function(gd, key) {
					// trace('\tgd.isSelected = ' + gd.isSelected + ', groupId = ' + gd.groupId + ', groupId = ' + groupId);
					if(gd.groupId === groupId) {
						// trace('\tit is a group sibling');
						if(!gd.isSelected) {
							// trace('\tgoing to remove group sibling: ' + gd.id);
							gd.isSelected = true;
							module.selectedDice[gd.id] = gd.idx;
							module.gui.toSelect[gd.id] = gd.idx;
						}
					}
				},
				module
			);
		}

		// trace('\tselectedDice = ', module.selectedDice);
		PWG.Utils.each(
			module.selectedDice,
			function(dieIdx, id) {
				module.gui.addDieToBank(id);
			},
			module
		);
		
	};
	
	module.bankSelectionComplete = function() {
		module.gui.allDiceMovedToBank();
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.SafariTemplates = {
	TOURNAMENT_NEW: '<div id="tournament_choice_~{idx}~" class="location_choice choice_box ~{xPos}~ ~{yPos}~"><div id="" class="tournament_add_icon plus_control controls" data-id="~{id}~" data-idx="~{idx}~"></div><div id="tournament_~{idx}~_highlight" class="selection_highlight"></div></div>',
	TOURNAMENT_CONTINUE: '<div id="tournament_choice_~{idx}~" class="location_choice choice_box ~{xPos}~ ~{yPos}~"><div id="" class="choice_icon player_animal_spritesheet ~{userAnimal}~" data-id="~{id}~" data-idx="~{idx}~"></div><div id="tournament_~{idx}~_highlight" class="selection_highlight"></div></div>',
	BRACKET_PLAYER_ELEMENTS: '<div id="tournament_contender_~{name}~" class="bracket_contender ~{name}~ ~{contenderClass}~ ~{xPos}~ ~{yPos}~"></div>',
	PLAYER_GAME_ELEMENTS: '<div id="player_name_~{name}~" class="player_name text_xxl text_white no_select" onclick="PWG.SafariGUI.playerElClicked(\'~{name}~\')">~{name}~</div><div id="farkles_~{name}~" class="current_farkles" onclick="PWG.SafariGUI.playerElClicked(\'~{name}~\')"></div><div class="scores"><div id="turn_score_~{name}~" class="turn_score text_lg text_white no_select" onclick="PWG.SafariGUI.playerElClicked(\'~{name}~\')"></div><div id="total_score_~{name}~" class="total_score text_lg text_white no_select" onclick="PWG.SafariGUI.playerElClicked(\'~{name}~\')">game: 0</div></div>',
	PLAYER_FARKLES: '<div class="farkle_f_icon" style="right: ~{right}~%"></div>',
	PLAYER_STATS_OPEN: '<div class="~{name}~ player_animal_spritesheet player_icon"></div><div id="player_statistics_~{name}~" class="player_statistics text_xl text_right"><b>~{name}~</b>',
	AI_PLAYER_STATS_OPEN: '<div class="~{name}~ npc_animal_bg ~{location}~_animal_spritesheet ai_player_icon"></div><div id="player_statistics_~{name}~" class="player_statistics text_xl text_right"><b>~{name}~</b>',
	PLAYER_STATS_DETAIL: '<div id="player_stats_~{key}~" class="player_stats text_md">~{value}~</div>',
	PLAYER_STATS_CLOSE: '</div>',
	CLOSE_BUTTON: '<div id="close_button" class="control controls button1 cancel_control"></div>',
	NOTIFICATION: '<div id="notification" class="~{className}~"></div>'
};

var PWG = PWG || {};
PWG.SafariAnimator = function() {
	var module = {};
	
	var ANIMATE_OFF_SCREEN_TO_RIGHT = ' animate_left_off_screen';
	var ANIMATE_ONTO_HALF_SCREEN_FROM_LEFT = ' animate_left_onto_half_screen';
	var ANIMATE_VERSUS_ONTO_SCREEN = ' animate_versus_onto_screen';
	
	var OPPONENT_ONTO_SCREEN_ANIMATION = ' dealer_on_screen animate_right_onto_half_screen';
	var OPPONENT_OFF_SCREEN_ANIMATION = ' dealer_off_screen animate_right_off_half_screen';
	
	var ONTO_SCREEN_FROM_TOP = ' animate_down_onto_screen';
	
	var DEFAULT_DURATION = 300;
	
	var DEFAULT_DELAY = 500;

	function CSSAnimation(params) {
		this.params = params;
		if(params.delay && params.delay > 0) {
			this.delayTimer = PWG.Timer.create();
			this.delayTimer.start(
				this.params.delay,
				function(timer, params) {
					PWG.Timer.remove(timer.id);
					this.start();
				},
				this.params,
				this
			);
		} else {
			this.start();
		}
	}
	
	CSSAnimation.prototype.start = function() {
		if(this.params.duration) {
			this.durationTimer = PWG.Timer.create();
			this.durationTimer.start(
				this.params.duration,
				function(timer, params) {
					PWG.Timer.remove(timer.id);
					this.onAnimationComplete();
				},
				this.params,
				this
			);
		} else {
			this.onAnimationComplete();
		}
		this.params.el.style.display = 'block';
		this.params.el.className = this.params.currentClass + this.params.newClass;
	};
	
	CSSAnimation.prototype.onAnimationComplete = function() {
		if(this.params.callback) {
			this.params.callback.call(this.params.context);
		}
	};
	
	module.animateOpponentOntoScreen = function(el, currentClass, callback, context) {
		module.animate(el, currentClass, OPPONENT_ONTO_SCREEN_ANIMATION, DEFAULT_DURATION, DEFAULT_DELAY, callback, context);
	};

	module.animateOpponentOffScreen = function(el, currentClass, callback, context) {
		module.animate(el, currentClass, OPPONENT_OFF_SCREEN_ANIMATION, DEFAULT_DURATION, DEFAULT_DELAY, callback, context);
	};
	
	module.animatePlayerOntoScreen = function(el, currentClass, callback, context) {
		module.animate(el, currentClass, ANIMATE_ONTO_HALF_SCREEN_FROM_LEFT, DEFAULT_DURATION, DEFAULT_DELAY, callback, context);
	};
	
	module.animateVersusOntoScreen = function(el, callback, context) {
		module.animate(el, '', ANIMATE_VERSUS_ONTO_SCREEN, DEFAULT_DURATION, DEFAULT_DURATION, callback, context);
	};

	module.animateTrophyOntoScreen = function(el, currentClass, callback, context) {
		module.animate(el, currentClass, ONTO_SCREEN_FROM_TOP, DEFAULT_DURATION, DEFAULT_DELAY, callback, context);
	};
	
	module.animate = function(el, currentClass, newClass, duration, delay, callback, context) {
		var params = { 
			el: el, 
			currentClass: currentClass || '', 
			newClass: newClass, 
			duration: duration || 0, 
			delay: delay || 0,
			callback: callback || null, 
			context: context || module 
		};
		var animation = new CSSAnimation(params);
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.SafariGUI = function() {
	'use strict';

	var module = {};

	var SPLASH_CLASS = 'farkle_splash';
	var SPLASH_CLASS_GAME_PLAY = 'farkle_splash_game_play';
	
	var BACKGROUNDS = {
		forest: ' forest_bg',
		savannah: ' savannah_bg',
		ocean: ' ocean_bg',
		jungle: ' jungle_bg'
	};
	var MOUNTAIN_BACKGROUND = 'mountain_bg';
	
	var SQUARE_STYLE_EL_ID = 'square_screen';
	
	var START_CLASS = ' start_control controls';
	var ROLL_CLASS = ' roll_control controls';
	var BANK_CLASS = ' down_control controls';
	var NEXT_CLASS = ' next_control controls';
	var PLUS_CLASS = ' plus_control controls';
	var MINUS_CLASS = ' minus_control controls';
	var CONFIRM_CLASS = ' confirm_control controls';
	var EDIT_CLASS = ' edit_control controls';
	
	var NPC_ANIMAL_SPRITESHEET_CLASS = '_animal_spritesheet npc_animal_bg ';
	
	var PLAYER_ANIMAL_SPRITESHEET_CLASS = 'player_animal_spritesheet ';
	
	var PLAYER_CHOICE_SINGLE = 'select player';
	var PLAYER_CHOICE_MULTI = 'select players';
	var SELECTED_PLAYER_ANIMALS = {
		dog: false,
		cat: false,
		fish: false,
		rabbit: false
	};
	
	var NEW_TOURNAMENT_ID = 'newTournament';
	
	var ACTIVE_PLAYER_OPACITY = 1;
	var IDLE_PLAYER_OPACITY = 0.66;

	var MOVE_SELECTED_DICE_DELAY = 300;
	
	var NOTIFICATION_ANIMATE_TIME = 3000;
	var OPPONENT_ANIMATE_TIME = 500; 
	var TUTORIAL_ALERT_SPEECH_DELAY_TIME = 500;
	var OPPONENT_ANIMATE_BEGIN_X = 57.5;
	var OPPONENT_ANIMATE_END_X = 100;
	var TUTORIAL_ALERT_NOTIFICATION_TIME = 5000;
	
	var ROLLING_GREEN_WIGGLE_ITERATIONS = 10;
	var ROLLING_GREEN_WIGGLE_TIME = 30;
	var ROLLING_GREEN_WIGGLE_DEGREES = 1;
	
	var FARKLE_F_ICON_WIDTH = 10;
	var FARKLE_F_ICON_RIGHT = 2; 

	var ANIMATE_ONTO_SCREEN_FROM_RIGHT = ' animate_right_onto_screen';
	
	var _orientationStyleStrings = {
		landscape: '.players_title_and_info{right:0}.title_and_info{height:15%}.players{width:100%;height:75%;top:25%}.choice_box{background-color:#333;width:30%;padding-bottom:30%;position:absolute;cursor:pointer}',
		portrait: '.players_title_and_info{top:0}.title_and_info{height:25%}.players{width:100%;height:75%;top:25%}.choice_box{background-color:#333;width:30%;padding-bottom:30%;position:absolute;cursor:pointer}'
	};
	var _squareStyleString = '.screen_orientation {width:~{size}~px;height:~{size}~px;left:0;top:~{top}~px;} .double_wide_screen_orientation {width:~{doubleSize}~px;height:~{size}~px;left:0;top:~{top}~px;} .players_title_and_info {width:~{titleWidth}~px;height:~{titleHeight}~px;right:0;}';
	var _dieDiameter;

	var _head; 
	
	module.screenEls = {};
	module.currentScreen = '';
	
	module.currentTournament = -1;
	module.previousTournament = '';
	
	module.currentLocation = '';
	module.previousLocation = '';
	
	module.currentAI = PWG.Animals.guides[module.currentLocation];
	
	module.rolledDice = {};
	module.playerEls = {};

	module.numPlayers = 0;
	
	module.quitCb = null;
	module.closeCb = null;
	module.selectedCb = null;
	module.button1Callback = null;
	module.button2Callback = null;

	module.isTournamentGame = false;
	module.isFinalsGame = false;
	module.isAIGame = false;
	module.isWithDealerPersonality = true;
	module.dealerPersonality = null;
	
	module.isTransitionedToFinals = false;
	module.isConfirmBoxOpen = false;
	
	module.currentGameId = null;
	
	///////////////////////////////////////// INTIALIZATION AND NON-PLAY SCREEN
	module.init = function() {
		module.initCurrentLocation();
		
		module.createStyleEls();
		module.updateSquareStyleEl();
		
		module.currentScreen = 'welcome';

		module.cacheElements(); 
		module.addEventListeners();
		module.addAnimalChoiceClickHandlers();
		module.addLocationChoiceClickHandlers();
		
		module.button1.className += START_CLASS;
		module.button1Class = START_CLASS;
		module.layout();

		// trace('PWG.App.isTutorialActive = ' + PWG.App.isTutorialActive);
		module.showDealerSpeechBubble(PWG.App.isTutorialActive);

		if(module.isWithDealerPersonality) {
			PWG.AIPersonality.setCloseCallback(module.closeDealerSpeech, module);
		}
		
		PWG.GUIDice.init(module);

		module.checkFirstPlay();
	};
	
	module.initCurrentLocation = function() {
		var tutorialAlertDealerIcon = document.getElementById('tutorial_alert_dealer_icon');

		module.currentLocation = module.opponentLocation = PWG.Utils.randomKey(PWG.Animals.locations);
		module.screenEls['welcome'] = document.getElementById('welcome_screen');
		module.screenEls['welcome'].className += module.currentLocation + '_bg';
		module.currentAI = PWG.Animals.guides[module.currentLocation];
		
		tutorialAlertDealerIcon.className = module.currentLocation + '_animal_spritesheet npc_animal_bg ' + module.currentAI;;
	};
	
	module.createStyleEls = function() {
		// cache head for later use
		_head = document.getElementsByTagName('head')[0];

		PWG.StyleElManager.create(_orientationStyleStrings);
		PWG.WindowParams.update();
		PWG.StyleElManager.update();
		
		var squareEl = document.createElement('style');
		squareEl.setAttribute('id', SQUARE_STYLE_EL_ID);
		
		module.squareStyleEl = squareEl;

		_head.appendChild(squareEl);
	};
	
	module.cacheElements = function() {
		// global
		module.titleButton = document.getElementById('farkle_splash');
		
		// home screen
		module.screenEls['home'] = document.getElementById('home_screen');
		module.tournamentButton = document.getElementById('tournament_button');
		module.practiceGameButton = document.getElementById('practice_game_button');
		module.multiplayerGameButton = document.getElementById('multiplayer_game_button');

		// tournament 
		module.screenEls['tournament'] = document.getElementById('tournament_screen');
		
		// bracket
		module.screenEls['bracket'] = document.getElementById('bracket_screen');
		module.bracketLeftEl = document.getElementById('bracket_left');
		module.bracketRightEl = document.getElementById('bracket_right');
		module.bracketNextButton = document.getElementById('bracket_next_button');
		module.bracketCloseButton = document.getElementById('bracket_close_button');
		
		// location choice
		module.screenEls['location'] = document.getElementById('location_screen');
		
		// player set-up 
		module.screenEls['animal'] = document.getElementById('animal_screen');
		module.playerChoiceTitle = document.getElementById('choice_title');
		
		// rules screen
		module.screenEls['rules'] = document.getElementById('rules_screen');
		module.rulesButton = document.getElementById('rules_button');

		// tutorial / animals
		module.dealerIcon = document.getElementById('dealer_icon');
		module.dealerSpeech = document.getElementById('dealer_speech');
		module.dealerSpeechTextEl = document.getElementById('dealer_speech_text');
		module.tutorialButton = document.getElementById('tutorial_button');

		// play screen
		module.screenEls['play'] = document.getElementById('play_screen');
		
		// player details
		module.screenEls['stats'] = document.getElementById('stats_screen');

		// notifications
		module.notificationHolder = document.getElementById('notification_holder');

		// buttons
		module.button1 = document.getElementById('button1');
		module.button2 = document.getElementById('button2');
	};
	
	module.addEventListeners = function() {
		module.addCloseButtonListeners();

		module.screenEls['welcome'].addEventListener('click', module.onWelcomeScreenClick);
		module.titleButton.addEventListener('click', module.onTitleClick);
		
		module.tournamentButton.addEventListener('click', module.onTournamentClick);
		module.practiceGameButton.addEventListener('click', module.onPracticeGameClick);
		module.multiplayerGameButton.addEventListener('click', module.onMultiplayerGameClick);
		module.rulesButton.addEventListener('click', module.onRulesClick);
		module.tutorialButton.addEventListener('click', module.onTutorialClick);
		module.button1.addEventListener('click', module.onButton1Click);
		module.button2.addEventListener('click', module.onButton2Click);
		module.bracketCloseButton.addEventListener('click', module.onCloseButtonClick);
		module.bracketNextButton.addEventListener('click', module.onBracketNextClick);

		window.addEventListener('resize', module.layout);
		window.addEventListener('orientationchange', module.layout);
		window.addEventListener('beforeunload', module.houseKeeping);
	};

	module.addCloseButtonListeners = function() {
		var closeButton;
		
		PWG.Utils.each(
			module.screenEls,
			function(el, screenName) {
				if(screenName !== 'welcome' && screenName !== 'play') {
					closeButton = document.getElementById(screenName + '_close_button');
					closeButton.addEventListener('click', module.onCloseButtonClick);
				}
			},
			module
		);
	};
	
	module.removeEventListeners = function() {
		module.removeCloseButtonListeners();
		
		module.screenEls['welcome'].removeEventListener('click', module.onWelcomeScreenClick);
		module.titleButton.removeEventListener('click', module.onTitleClick);
		module.tournamentButton.addEventListener('click', module.onTournamentClick);
		module.practiceGameButton.removeEventListener('click', module.onPracticeGameClick);
		module.multiplayerGameButton.removeEventListener('click', module.onMultiplayerGameClick);
		module.rulesButton.removeEventListener('click', module.onRulesClick);
		module.tutorialButton.removeEventListener('click', module.onTutorialClick);
		module.button1.removeEventListener('click', module.onButton1Click);
		module.button2.removeEventListener('click', module.onButton2Click);
		module.bracketCloseButton.removeEventListener('click', module.onCloseButtonClick);
		module.bracketNextButton.removeEventListener('click', module.onBracketNextClick);

		window.removeEventListener('resize', module.layout);
		window.removeEventListener('orientationchange', module.layout);
		window.removeEventListener('beforeunload', module.houseKeeping);
	};
	
	module.removeCloseButtonListeners = function() {
		var closeButton;
		
		PWG.Utils.each(
			module.screenEls,
			function(el, screenName) {
				if(screenName !== 'welcome' && screenName !== 'play') {
					closeButton = document.getElementById(screenName + '_close_button');
					closeButton.removeEventListener('click', module.onCloseButtonClick);
				}
			},
			module
		);
	};

	module.addTournamentChoiceClickHandlers = function(tournamentChoices) {
		module.addChoiceClickHandlers(tournamentChoices, 'tournamentChoiceClickHandlers', 'onTournamentChoiceClicked');
	};
	
	module.addLocationChoiceClickHandlers = function() {
		module.addChoiceClickHandlers(BACKGROUNDS, 'locationChoiceClickHandlers', 'onLocationChoiceClicked');
	};

	module.addAnimalChoiceClickHandlers = function() {
		module.addChoiceClickHandlers(SELECTED_PLAYER_ANIMALS, 'animalChoiceClickHandlers', 'onAnimalChoiceClicked');
	};
	
	module.addChoiceClickHandlers = function(list, dest, handlerName) {
//		// trace('addChoiceClickHandlers, handlerName = ' + handlerName + ', list = ', list);
		var keys;
		module[dest] = {};
		
		keys = Object.keys(list);

		for(var i = 0, l = keys.length; i < l; i++) {
			var el = document.getElementById(keys[i]);

			var clickHandler = function(listener) {
				return function(event) {
					listener[handlerName](event);
				};
			}(module);

			module[dest][keys[i]] = clickHandler;
			el.addEventListener('click', clickHandler);
		}
	};
	
	module.removeTournamentChoiceClickHandlers = function() {
		module.removeChoiceClickHandlers('div.tournament_choice', 'tournamentChoiceClickHandlers');
	};
	
	module.removeLocationChoiceClickHandlers = function() {
		module.removeChoiceClickHandlers('div.location_choice', 'locationChoiceClickHandlers');
	};
	
	module.removeAnimalChoiceClickHandlers = function() {
		module.removeChoiceClickHandlers('div.player_animal_choice', 'animalChoiceClickHandlers');
	};
	
	module.removeChoiceClickHandlers = function(qsString, handlers) {
		var choices = document.querySelectorAll(qsString);
		// trace('animal_choices = ', animal_choices);
		var length = choices.length;
		for(var i = 0; i < length; i++) {
			choices[i].removeEventListener('click', module[handlers][choices[i]]);
			delete module[handlers][choices[i]];
		}
	};
	
	module.checkFirstPlay = function() {
		if(PWG.App.getIsFirstPlay()) {
			document.getElementById('tutorial_alert').style.display = 'block';
			var tutorialAlertDealerHolder = document.getElementById('tutorial_alert_dealer_holder');
			var tutorialAlertDealerIcon = document.getElementById('tutorial_alert_dealer_icon');
			var currentDealerClass;
			
			if(!module.isTournamentGame) {
				module.opponentLocation = module.currentLocation;
			}
			
			PWG.SafariAnimator.animateOpponentOntoScreen(
				tutorialAlertDealerIcon, 
				tutorialAlertDealerIcon.className, 
				module.onTutorialAlertDealerIn, 
				module
			); 
		} else {
			document.getElementById('logo_dice').style.display = 'block';
		}
	};
	
	module.onTutorialAlertDealerIn = function() {
		var speechBubble = document.getElementById('tutorial_alert_dealer_speech');

		var tutorialAlertSpeechTimer = PWG.Timer.create();
		var params = { el: speechBubble };

		tutorialAlertSpeechTimer.start(
			TUTORIAL_ALERT_SPEECH_DELAY_TIME,
			function(t, params) {
				params.el.style.display = 'block';
				PWG.Timer.remove(tutorialAlertSpeechTimer.id);
				module.onTutorialAlertSpeechDisplayed();
			},
			params,
			module
		);

	};
	
	module.onTutorialAlertSpeechDisplayed = function() {
		var speechBubble = document.getElementById('tutorial_alert_dealer_speech');
		module.tutorialAlertDealerSpeechText = document.getElementById('tutorial_alert_dealer_speech_text');
		module.updateText('tutorialAlertDealerSpeechText', PWG.Tutorial.FIRST_TIME_PLAYER);
		
		var tutorialAlertTimer = PWG.Timer.create();
		var params = { el: speechBubble };
		
		tutorialAlertTimer.start(
			TUTORIAL_ALERT_NOTIFICATION_TIME,
			function(t, params) {
				if(params.el.parentNode) {
					params.el.parentNode.removeChild(params.el);
				}
				PWG.Timer.remove(tutorialAlertTimer.id);
				module.onTutorialAlertSpeechRemoved();
			},
			params,
			module
		);
	};
	
	module.onTutorialAlertSpeechRemoved = function() { 
		var tutorialAlertDealerIcon = document.getElementById('tutorial_alert_dealer_icon');
		module.animateOpponentOffOfScreen(
			tutorialAlertDealerIcon, 
			module.onTutorialAlertDealerOut, 
			module
		);
	};
	
	module.onTutorialAlertDealerOut = function() {
		document.getElementById('tutorial_alert').style.display = 'none';
		
		PWG.App.setIsFirstPlay(false);
	};
	
	module.onWelcomeScreenClick = function() {
		if(PWG.App.isMobile) {
			PWG.DeviceUtils.enterFullScreen();
		}
		document.getElementById('logo_dice').style.display = 'none';
		document.getElementById('start_message').style.display = 'none';
		module.openScreen('home', null);
	};
	
	module.onTitleClick = function() {
		// reset stuff in case tutorial was active
		module.showDealerSpeechBubble(false);
		PWG.App.isTutorialActive = false;
		
		if(module.currentScreen !== 'home') {
			switch(module.currentScreen) {
				case 'play':
				// only let the player quite when it is their turn
				if(module.isAIGame) {
					if(!PWG.Players.getIsAITurn(module.currentGameId)) {
						PWG.App.quit();
					}
				} else {
					PWG.App.quit();
				}
				break;
				
				case 'rules':
				module.closeScreen('rules');
				break;
				
				case 'welcome':
				module.onWelcomeScreenClick();
				break;
				
				default:
				// trace('unknown screen: ' + module.currentScreen);
				break;
			}
		}
	};
	
	module.onRulesClick = function() {
		module.openScreen('rules');
	};
	
	module.onTutorialClick = function() {
		var playerName = PWG.Players.TUTORIAL_PLAYER_NAME;
		var players = {};
		players[playerName] = { name: playerName };

		if(module.dealerPersonality) {
			module.dealerPersonality = null;
		}

		module.isAIGame = false;
		PWG.App.isTutorialActive = true;

		module.createGame(players);

	};
	
	module.showDealerSpeechBubble = function(show) {
		module.dealerSpeech.style.display = (show) ? 'block' : 'none';
	};
	
	module.onCloseButtonClick = function() {
		module.closeScreen(module.currentScreen);
	};

	module.onTournamentClick = function() {
		module.openScreen('tournament', module.onTournamentScreenOpened);

	};
	
	module.onTournamentScreenOpened = function() {
		// trace('SafariGUI/onTournamentScreenOpened');
		// var tournaments = PWG.App.getData('tournaments');
		var tournaments = PWG.Tournaments.getActive();
		var tournamentKeys = Object.keys(tournaments);
		var tournamentMenu = document.getElementById('tournament_menu');
		var tournamentChoiceElIds = {};
		var tournamentHtml = '';
		
		module.currentTournament = -1;
		
		module.isTournamentGame = true;
		module.isTournamentOver = false;
		module.isAIGame = true; 
		module.isTournamentAnimalSelected = false;
		module.isTransitionedToFinals = false; 
		
		module.existingTournamentAnimals = [];
		
		var nextButton = document.getElementById('tournament_next_button');
		nextButton.style.display = 'none';
		nextButton.addEventListener('click', module.onTournamentSelected);
		
		if(tournamentKeys.length < 4) {
			tournamentKeys.push(NEW_TOURNAMENT_ID);
		}
		// trace('SafariGUI/onTournamentScreenOpened, tournaments = ', tournaments, '\n\ttournamentKeys = ', tournamentKeys); 

		// build tournament menu icons
		PWG.Utils.each(
			tournamentKeys,
			function(tournamentKey, idx) {
				var xPos = (idx % 2 === 0) ? 'choice_left' : 'choice_right';
				var yPos = (idx < 2) ? 'choice_top' : 'choice_bottom';
				
				var choiceConfig = {
					idx: idx,
					xPos: xPos,
					yPos: yPos
				};
				// trace('\ttournamentKey = ' + tournamentKey + ', tournaments = ', tournaments);
				if(tournaments.hasOwnProperty(tournamentKey)) {
					module.existingTournamentAnimals.push(choiceConfig.userAnimal = tournaments[tournamentKey].userAnimal);
					
					choiceConfig.id = tournaments[tournamentKey].id;
					// trace('choiceConfig = ', choiceConfig);
					tournamentHtml += PWG.Utils.parseMarkup(PWG.SafariTemplates.TOURNAMENT_CONTINUE, choiceConfig);
				} else {
					choiceConfig.id = NEW_TOURNAMENT_ID;
					tournamentHtml += PWG.Utils.parseMarkup(PWG.SafariTemplates.TOURNAMENT_NEW, choiceConfig);
				}
				tournamentChoiceElIds['tournament_choice_'+idx] = '';
			},
			module
		);
		// trace('tournamentHtml:\n' + tournamentHtml);
		tournamentMenu.innerHTML = tournamentHtml; 
		// clear out bracket contenders before getting to screen
		document.getElementById('contender_names').innerHTML = '';

		module.addTournamentChoiceClickHandlers(tournamentChoiceElIds);
		module.tournamentKeys = tournamentKeys;
	};
	
	module.onTournamentChoiceClicked = function(event) {
		// trace('SafariGUI/onTournamentChoiceClicked, target dataset = ', event.target.dataset);
		var id = event.target.dataset.id;
		var idx = event.target.dataset.idx;
		var newHighlightId;
		var oldHighlightId; 

		if(idx !== module.currentTournament) {
			if(module.currentTournament > -1) {
				document.getElementById('tournament_' + module.currentTournament + '_highlight').style.display = 'none';
			}
			// trace('\ttournament choice idx = ' + idx);
			document.getElementById('tournament_' + idx + '_highlight').style.display = 'block';
			module.currentTournament = idx;
		}
		document.getElementById('tournament_next_button').style.display = 'block';
		
	};

	module.onTournamentSelected = function() {
		var nextButton = document.getElementById('tournament_next_button');
		nextButton.removeEventListener('click', module.onTournamentSelected);

		if(module.tournamentKeys[module.currentTournament] === NEW_TOURNAMENT_ID) {
			module.openScreen('animal', module.onAnimalScreenOpened);
		} else {
			module.openScreen('bracket', module.onBracketScreenOpened);
		}

		// make close and next are in the left brack screen
		module.bracketNextButton.parentNode.removeChild(module.bracketNextButton);
		module.bracketCloseButton.parentNode.removeChild(module.bracketCloseButton);
		module.bracketLeftEl.appendChild(module.bracketNextButton);
		module.bracketLeftEl.appendChild(module.bracketCloseButton);
		
	};
	
	module.onTournamentAnimalSelected = function() {
		// trace('SafariGUI/onTournamentAnimalSelected');
		var selectedAnimal;
		var tournamentId;
		
		module.isTournamentAnimalSelected = true;
		
		PWG.Utils.each(
			module.selectedPlayerAnimals,
			function(selected, animal) {
				if(selected) {
					selectedAnimal = animal;
				}
			},
			module
		);
		
		module.currentTournament = module.tournamentKeys.length;
		tournamentId = PWG.Tournaments.create(selectedAnimal);
		module.tournamentKeys.push(tournamentId);
		
		// start npc games
		PWG.Tournaments.start(tournamentId);
		// close animal screen since it has a higher z-index
		module.closeScreen('animal');

		// goto bracket
		module.openScreen('bracket', module.onBracketScreenOpened);
	};
	
	module.onBracketScreenOpened = function() {
		var tournaments = PWG.Tournaments.getAll('tournaments');
		var tournament = tournaments[module.tournamentKeys[module.currentTournament]];
		var rounds = tournament.rounds;
		var userHome = module.currentLocation = tournament.userHome;
		var contenderNamesHtml = '';
		
		module.selectedPlayerAnimals = {};
		module.selectedPlayerAnimals[tournament.userAnimal] = true;
		module.transitionToFinals = false;
		module.isFinalsGame = false;

		var contenderNamesHtml = module.processTournamentNamesAndLocations(rounds[userHome], tournament, false);
		
		if(tournament.locationChampions[userHome]) {
			contenderNamesHtml += PWG.Utils.parseMarkup(PWG.SafariTemplates.BRACKET_PLAYER_ELEMENTS, { xPos: 'bracket_location_column_3', yPos: 'bracket_location_row_0_3', name: tournament.locationChampions[userHome], contenderClass: 'player_contender' });
		}

		document.getElementById('tournament_state_bg').className = ' location_bg ' + BACKGROUNDS[userHome];

		if(PWG.Utils.objLength(tournament.locationChampions) === PWG.Animals.getLocationsLength()) {
			// trace('it\'s the finals');
			// if(tournament.currentRoundIndices[PWG.Tournaments.FINALS] === 0) {
			if(!module.isTransitionedToFinals) {
				module.transitionToFinals = true;
				module.isTransitionedToFinals = true;
			}
			module.isFinalsGame = true;
			var finalistNamesHtml = module.processTournamentNamesAndLocations(rounds[PWG.Tournaments.FINALS], tournament, true);
			
			document.getElementById('finalist_names').innerHTML = finalistNamesHtml;
			
			// trace('module.locationBackgroundThumbs = ' + module.locationBackgroundThumbs);
			PWG.Utils.each(
				module.locationBackgroundThumbs,
				function(location, idx) {
					if(idx < 4) {
						var thumbEl = document.getElementById('location' + idx);
						thumbEl.className = 'mini_location_bg location_bg ' + location;
					}
				},
				module
			);
		}
		document.getElementById('contender_names').innerHTML = contenderNamesHtml;
	};
	
	module.processTournamentNamesAndLocations = function(rounds, tournament, isFinalsGame) {
		var contenderNamesHtml = '';
		module.locationBackgroundThumbs = [];

		PWG.Utils.each(
			rounds,
			function(round, rIdx) {
				var rowCount = 0;
				var xIdx = (isFinalsGame) ? (rIdx + 1) : rIdx;
				var xPos = 'bracket_location_column_' + xIdx;
				var yPos;
				var yClass = (isFinalsGame) ? 'bracket_finals_row_' : 'bracket_location_row_'; 
				var location;
				var contenderClass;
				// trace('round.contenders = ', round.contenders);
				
				PWG.Utils.each(
					round.contenders,
					function(contenders, rcIdx) {
						PWG.Utils.each(
							contenders,
							function(contender, cIdx) {
								// found the user game and opponent; set ai to non-user contender from this group
								if(contender === tournament.userAnimal) {
									module.currentAI = (cIdx === 0) ? contenders[1] : contenders[0];
									// trace('============= userGameId = ' + round.userGameId);
									module.currentGameId = round.userGameId;
									contenderClass = "player_contender";
									if(isFinalsGame) {
										module.locationBackgroundThumbs.push(tournament.userHome + '_bg');
										
										module.opponentLocation = PWG.Animals.getHome(module.currentAI);

									} else {
										module.opponentLocation = module.currentLocation;
									}
								} else {
									location = PWG.Animals.getHome(contender);
									contenderClass = location + "_contender";
									if(isFinalsGame) {
										module.locationBackgroundThumbs.push(location + '_bg');
									}
								}
								yPos = yClass + rowCount + '_' + rIdx;
								contenderNamesHtml += PWG.Utils.parseMarkup(PWG.SafariTemplates.BRACKET_PLAYER_ELEMENTS, { xPos: xPos, yPos: yPos, name: contender, contenderClass: contenderClass });
								rowCount++;
							},
							module
						);
					},
					module
				);
			},
			module
		);
		return contenderNamesHtml;
	};
	
	module.onBracketNextClick = function() {
		if(module.transitionToFinals) {
			module.transitionToFinals = false;
			module.animateToFinals();
		} else {
			module.continueToTournament();
		}
	};
	
	module.animateToFinals = function() {
		// trace('animate to finals');
		var animations = [{ key: 'left', begin: '0', end: '-100', unit: '%' }], time = 150;

		module.bracketLeftEl.removeChild(module.bracketNextButton);
		module.bracketLeftEl.removeChild(module.bracketCloseButton);

		var animation = PWG.Animator.create(
			module.screenEls['bracket'], 
			animations, 
			time, 
			true, 
			module.onAnimatedToFinals, 
			module, 
			{ styleString: 'display:block ' }
		);
	};
	
	module.onAnimatedToFinals = function() {
		module.bracketRightEl.appendChild(module.bracketNextButton);
		module.bracketRightEl.appendChild(module.bracketCloseButton);
	};
	
	module.continueToTournament = function() {
		module.initializeGameAI();
		module.addAllPlayers();
	};
	
	module.onPracticeGameClick = function() {
		module.gameTypeSelected(true);
	};
	
	module.onMultiplayerGameClick = function() {
		module.gameTypeSelected(false);
	};
	
	module.gameTypeSelected = function(dealerGame) {
		// trace('gameTypeSelected, dealerGame = ' + dealerGame);
		module.isTournamentGame = false;
		module.dealerIcon.style.display = (dealerGame) ? 'block' : 'none';
		module.isWithDealerPersonality = module.isAIGame = dealerGame;

		if(!PWG.App.isTournamentGame) {
			module.openScreen('location', module.onLocationSelectionScreenOpened);
		}
	};

	module.onLocationSelectionScreenOpened = function() {
		// trace('SafariGUI/onLocationSelectionScreenOpened, module.currentLocation = ' + module.currentLocation);
		module.previousPlayerSelection = '';		

		PWG.Utils.each(
			BACKGROUNDS,
			function(value, key) {
				var highlightEl = document.getElementById(key + '_highlight');
				// trace('\tkey = ' + key + '\n\thighlightEl = ' + highlightEl);
				if(key === module.currentLocation) {
					highlightEl.style.display = 'block';
				} else {
					highlightEl.style.display = 'none';
				}
			},
			module
		);

		var nextButton = document.getElementById('location_next_button');
		nextButton.addEventListener('click', module.onLocationSelected);

	};

	module.onLocationChoiceClicked = function(event) {
		// trace('onLocationChoiceClicked, id = ' + event.target.id + ', currentLocation = ' + module.currentLocation);
		var id = event.target.id;

		if(id !== module.currentLocation) {
			if(module.currentLocation !== '') {
				document.getElementById(module.currentLocation + '_highlight').style.display = 'none';
			}
			document.getElementById(id + '_highlight').style.display = 'block';
		}
		module.currentLocation = module.opponentLocation = id;

	};

	module.onLocationSelected = function() {
		trace('onLocationSelected, currentLocation = ' + module.currentLocation + ', opponentLocation = ' + module.opponentLocation);
		var nextButton = document.getElementById('location_next_button');
		nextButton.removeEventListener('click', module.onLocationSelected);
		module.initializeGameAI();
		module.openScreen('animal', module.onAnimalScreenOpened);
	};
	
	module.initializeGameAI = function() {
		// trace('SafariGui/initiailizeGameAI, opponentLocation = ' + module.opponentLocation);
		if(module.isAIGame) {
			if(!module.isTournamentGame) {
				module.currentAI = PWG.Animals.guides[module.currentLocation];
			}
			// trace('initializeGameAI, location ' + module.oponentLocation);
			module.dealerIcon.className = module.opponentLocation + NPC_ANIMAL_SPRITESHEET_CLASS + ' ' + module.currentAI;
		}
		if(module.isWithDealerPersonality) {
			// trace('make a personality');
			module.dealerPersonality = PWG.AIPersonality.create(module.currentAI, module.isTournamentGame);
		} else {
			module.dealerPersonality = null;
		}
	};
	
	module.onAnimalScreenOpened = function() {
		// trace('SafariGUI/onAnimalScreenOpened, isTournamentGame = ' + module.isTournamentGame);
		var availablePlayerAnimals = {};
		var nextButton = document.getElementById('animal_next_button');

		if(module.isTournamentGame) {
			var tournamentAnimals = PWG.Tournaments.getActiveAnimals();
			// trace('\tactive tournamentAnimals = ', tournamentAnimals);
			PWG.Utils.each(
				SELECTED_PLAYER_ANIMALS,
				function(value, key) {
					if(tournamentAnimals.indexOf(key) === -1) {
						availablePlayerAnimals[key] = false;
					}
				},
				module
			);
			
			nextButton.removeEventListener('click', module.addAllPlayers);
			nextButton.addEventListener('click', module.onTournamentAnimalSelected);
		} else {
			availablePlayerAnimals = SELECTED_PLAYER_ANIMALS;
			nextButton.removeEventListener('click', module.onTournamentAnimalSelected);
			nextButton.addEventListener('click', module.addAllPlayers);
		}
		module.selectedPlayerAnimals = PWG.Utils.clone(SELECTED_PLAYER_ANIMALS);
		module.previousPlayerSelection = '';		
		
		PWG.Utils.each(
			SELECTED_PLAYER_ANIMALS,
			function(value, key) {
				var animalChoiceEl = document.getElementById(key + '_choice');
				if(availablePlayerAnimals.hasOwnProperty(key)) {
					animalChoiceEl.style.opacity = 1;
				} else {
					animalChoiceEl.style.opacity = 0.3;
				}
				document.getElementById(key + '_highlight').style.display = 'none';
			},
			module
		);

		if(module.isAIGame || module.isTournamentGame) {
			module.updateText('playerChoiceTitle', PLAYER_CHOICE_SINGLE);
		} else {
			module.updateText('playerChoiceTitle', PLAYER_CHOICE_MULTI);
		}
		nextButton.style.display = 'none';
		
	};
	
	module.onAnimalChoiceClicked = function(event) {
		// trace('onAnimalChoiceClicked, id = ' + event.target.id + ', selected = ', module.selectedPlayerAnimals);
		var id = event.target.id;
		var somethingSelected = false; 
		
		module.selectedPlayerAnimals[id] = !module.selectedPlayerAnimals[id];

		if(module.isAIGame && module.previousPlayerSelection !== '' && module.previousPlayerSelection !== id) {
			module.selectedPlayerAnimals[module.previousPlayerSelection] = false;
		}

		PWG.Utils.each(
			module.selectedPlayerAnimals,
			function(selected, animal) {
				document.getElementById(animal + '_highlight').style.display = (selected) ? 'block' : 'none';
				if(selected) {
					somethingSelected = true;
				}
			},
			module
		);

		document.getElementById('animal_next_button').style.display = (somethingSelected) ? 'block' : 'none';
		
		module.previousPlayerSelection = id;
	};
	
	module.addAllPlayers = function() {
		// trace('SafariGUI/addAllPlayers, selectedPlayerAnimals = ', module.selectedPlayerAnimals);
		var players = {};
		PWG.Utils.each(
			module.selectedPlayerAnimals,
			function(selected, animal) {
				if(selected) {
					players[animal] = { name: animal };
				}
			},
			module
		);
		if(module.isAIGame) {
			players[module.currentAI] = { name: module.currentAI, isAIPlayer: true };
		}
		// trace('\tplayers = ', players);
		module.createGame(players);
	};
	
	module.createGame = function(players) {
		// trace('players = ', players);
		var nextButton = document.getElementById('animal_next_button');
		var playerIcon = document.getElementById('player_icon');
		
		if(!module.isTournamentGame) {
			module.currentGameId = PWG.Games.createGUIGame(players);
		}
		
		nextButton.removeEventListener('click', module.addAllPlayers);

		module.button1Callback = module.startGame;
		
		if(PWG.App.isTutorialActive) {
			module.rollingGreen = document.getElementById('inner_green');
			module.rollingGreen.style.display = 'block';

			document.getElementById('versus_text').style.display = 'none';

			playerIcon.style.display = 'none';
			playerIcon.className = '';
			
			module.dealerIcon.className = module.opponentLocation + NPC_ANIMAL_SPRITESHEET_CLASS + ' ' + module.currentAI;
			module.animateOpponentOntoScreen(module.onGuideAnimatedOntoScreen);
		} else {
			if(module.isAIGame) {
				module.replaceClass(module.dealerSpeechTextEl, 'text_lg', 'text_xl');
				module.showDealerSpeechBubble(false);

				module.dealerIcon.style.display = 'none';
				playerIcon.style.display = 'none';
				module.button1.style.display = 'none';

				module.animatePlayerOntoScreen();
			}

			module.rollingGreen = document.getElementById('rolling_green');
			document.getElementById('inner_green').style.display = 'none';
			module.showDealerSpeechBubble(false);

			document.getElementById('versus_text').style.display = 'none';
			playerIcon.style.display = 'none';
			playerIcon.className = '';
		}

		module.layout();

		module.screenEls['play'].className = 'screen screen_orientation location_bg ';
		if(module.isFinalsGame) {
			module.screenEls['play'].className += MOUNTAIN_BACKGROUND;
		} else {
			module.screenEls['play'].className += BACKGROUNDS[module.currentLocation];
		}

		module.openScreen('play');

		module.bankEl = document.getElementById('bank');

		module.updateRectsAndSizes();

	};
	
	module.animatePlayerOntoScreen = function() {
		var currentClass = PLAYER_ANIMAL_SPRITESHEET_CLASS + PWG.Players.getSinglePlayerName(module.currentGameId);
		var playerIcon = document.getElementById('player_icon');

		PWG.SafariAnimator.animatePlayerOntoScreen(
			playerIcon, 
			currentClass, 
			module.onPlayerAnimatedOntoScreen, 
			module
		);
	};
	
	module.onPlayerAnimatedOntoScreen = function() {
		var versusText = document.getElementById('versus_text');

		PWG.SafariAnimator.animateVersusOntoScreen(
			versusText,
			module.onVersusAnimatedOntoScreen,
			module
		);
	};
	
	module.onVersusAnimatedOntoScreen = function() {
		module.animateOpponentOntoScreen(module.onOpponentAnimatedOntoScreen);
		// var currentClass = module.opponentLocation + NPC_ANIMAL_SPRITESHEET_CLASS + module.currentAI;
		
	};

	module.animateOpponentOntoScreen = function(callback) {
		// if(!module.isTournamentGame) {
			module.opponentLocation = module.currentLocation;
		// }
		PWG.SafariAnimator.animateOpponentOntoScreen(
			module.dealerIcon, 
			module.dealerIcon.className, 
			callback, 
			module
		);
	};
	
	module.onGuideAnimatedOntoScreen = function() {
		module.button1.style.display = 'block';
		module.updateText('dealerSpeechTextEl', PWG.Tutorial.PRE_GAME);
		module.replaceClass(module.dealerSpeechTextEl, 'text_xl', 'text_lg');
		module.showDealerSpeechBubble(true);
	};

	module.onOpponentAnimatedOntoScreen = function() {
		module.button1.style.display = 'block';
	};
	
	module.animateOpponentOffOfScreen = function(el, callback, context) {
		var currentClass = module.opponentLocation + NPC_ANIMAL_SPRITESHEET_CLASS + module.currentAI;

		PWG.SafariAnimator.animateOpponentOffScreen(
			el,
			currentClass,
			callback,
			context
		);

	};
	
	module.startGame = function() {
		if(module.currentGameId) {
			PWG.App.startGame(module.currentGameId);
		} else {
			module.openScreen('home');
		}
	};
	
	module.onGameStarted = function(players) {
		// trace('SafariGUI/onGameStarted, players = ', players);
		if(PWG.App.isTutorialActive) {
			module.updateText('dealerSpeechTextEl', PWG.Tutorial.GAME_START);
		}

		document.getElementById('versus_text').style.display = 'none';

		var playerIcon = document.getElementById('player_icon');
		playerIcon.style.display = 'none';
		playerIcon.className = '';

		module.addPlayerEls(players);

		module.replaceClass(module.titleButton, SPLASH_CLASS, SPLASH_CLASS_GAME_PLAY);
		
		module.unit = module.screenEls['play'].offsetWidth/100;
		module.hideButton(module.button1);
		module.hideButton(module.button2);
		module.updateButton('button2', NEXT_CLASS, true);
	};
	
	module.addPlayerEls = function(players) {
		// trace('SafariGUI/addPlayerEls, players = ', players);
		var playersEl = document.getElementById('players');
		PWG.Utils.each(
			players,
			function(player, idx) {
				// trace('\tadding player: ' + player.name);
				var el = document.createElement('div');
				el.setAttribute('id', player.name);
				var html = PWG.Utils.parseMarkup(PWG.SafariTemplates.PLAYER_GAME_ELEMENTS, player);
				el.innerHTML = html;
				el.className = 'player';
				el.style.opacity = 0.5;
				el.style.width = 100/players.length + '%';
				el.style.left = idx * (100/players.length) + '%';
				module.playerEls[player.name] = el;
				playersEl.appendChild(el);
			},
			module
		);
	};
	
	module.playerElClicked = function(name) {
		// trace('SafariGUI/playerElClicked, name = ' + name);
		var player,
			playerStats,
			formattedDetails,
			playerDetailHolder;
		
		if(!PWG.App.isTutorialActive) {
			if(module.currentScreen === 'stats') {
				module.closeScreen('stats');
			}

			if(!module.isConfirmBoxOpen) {
				// trace('SafariGUI/playerElClicked, name = ' + name);
				player = PWG.Players.getPlayer(module.currentGameId, name);
				// trace('player = ', player, ' is AIPlayer: ' + (player instanceof PWG.AIPlayer));
				
				if(player) {
					playerStats = player.getStats();
					// trace('\tplayerStats = ', playerStats);
					if(player instanceof PWG.AIPlayer) {
						formattedDetails = PWG.Utils.parseMarkup(PWG.SafariTemplates.AI_PLAYER_STATS_OPEN, { name: name, location: module.opponentLocation });
					} else {
						formattedDetails = PWG.Utils.parseMarkup(PWG.SafariTemplates.PLAYER_STATS_OPEN, { name: name });
					}

					PWG.Utils.each(
						playerStats,
						function(detail, key) {
							if(key !== 'name') {
								var data = {
									key: key,
									value: PWG.Player.detailText[key] + detail
								};
								formattedDetails += PWG.Utils.parseMarkup(PWG.SafariTemplates.PLAYER_STATS_DETAIL, data);
							}
						},
						module
					);
					formattedDetails += PWG.SafariTemplates.PLAYER_STATS_CLOSE;
					playerDetailHolder = document.getElementById('player_stats_holder');
					playerDetailHolder.innerHTML = formattedDetails;

					module.closeCb = module.playerDetailClosed;
					module.openScreen('stats');
				}
			}
		}
	};
	
	module.playerDetailClosed = function() {
		PWG.App.isPaused = false;
	};
	
	module.removePlayerEls = function() {
		var playersEl = document.getElementById('players');
		PWG.Utils.each(
			module.playerEls,
			function(el, key) {
				playersEl.removeChild(el);
				delete module.playerEls[key];
			},
			this
		);
	};
	
	module.closeDealerSpeech = function() {
		// trace('SafariGUI/closeDealerSpeech, endingGame = ' + module.isEndingGame);
		module.updateText('dealerSpeechTextEl', '');
		module.showDealerSpeechBubble(false);
		
		if(module.isEndingGame) {
			module.animateOpponentOffOfScreen(module.dealerIcon, module.onDealerAnimatedOffScreen, module);
			module.isEndingGame = false;
		}
	};
	
	module.onDealerAnimatedOffScreen = function() {
		// trace('SafariGUI/onDealerAnimatedOffScreen');
		if(module.displayTrophy) {
			var trophyEl = document.getElementById('large_trophy');

			PWG.SafariAnimator.animateTrophyOntoScreen(
				trophyEl, 
				trophyEl.className,
				module.onTrophyDisplayed,
				module
			); 
			
			// module.wiggleRollingGreen();
			module.displayTrophy = false;
		} else {
			module.showButton(module.button2);
		}
	};

	module.onTrophyDisplayed = function() {
		module.showButton(module.button2);
	};
	
	///////////////////////////////////////// GAME PLAY
	module.startTurn = function(player) {
		// trace('SafariGUI/startTurn, player = ', player);
		module.switchPlayerEl(player.name);
		module.usedThisTurn = 0;

		module.updateText('turnScore', player.turns + ': 0');
		module.updateText('totalScore',  player.score);

		if(module.dealerPersonality) {
			// players isAITurn hasn't updated yet, need to inverse
			module.processDealerPersonality(true);
		}

	};
	
	module.switchPlayerEl = function(name) {
		module.playerTitle = document.getElementById('player_name_' + name);
		module.totalScore = document.getElementById('total_score_'+name);
		module.turnScore = document.getElementById('turn_score_'+name);
		module.farklesText = document.getElementById('farkles_'+name);

		PWG.Utils.each(
			module.playerEls,
			function(el, key) {
				if(key === name) {
					// module.playerTitle.innerHTML = name + '\'s turn';
					el.style.opacity = ACTIVE_PLAYER_OPACITY;
				} else {
						// module.playerTitle.innerHTML = name;
					el.style.opacity = IDLE_PLAYER_OPACITY;
				}
			},
			this
		);
	};
	
	module.startRoll = function() {
		// trace('SafariGUI/startRoll');
		module.removeDice(module.rolledDice);
		module.toSelect = {};
		module.selecting = false;
		
		if(PWG.Players.getIsAITurn(module.currentGameId)) {
			module.hideButton(module.button1);
			module.hideButton(module.button2);
			
		} else {
			var hideButton1 = false;
			if(PWG.App.isTutorialActive && !PWG.App.tutorial.isPresetRollsActive) {
				module.updateText('dealerSpeechTextEl', PWG.Tutorial.TUTORIAL_COMPLETE);
				module.button2Callback = PWG.App.quit;
				hideButton1 = true;
			}
			// hack needed for tutorial games:
			// if(PWG.Games.isGUIGameActive) {
				module.updateButton('button1', ROLL_CLASS, hideButton1);
				module.button1Callback = module.roll;
			// }
		}
	};
	
	module.roll = function() {
		// cheating for tournament testing:
		// PWG.Games.roll(module.currentGameId, true);
		// PWG.Games.rollFarkle(module.currentGameId);
		PWG.Games.roll(module.currentGameId);
	};
	
	module.displayRoll = function(dice) {
		// trace('SafariGUI/displayRoll, dice = ', dice);
		if(PWG.App.isTutorialActive && PWG.App.tutorial.isPresetRollsActive) {
			module.updateText('dealerSpeechTextEl', PWG.App.tutorial.getPresetRollText());
		}
		if(PWG.Players.getIsAITurn(module.currentGameId)) {
			module.hideButton(module.button1);
		} else {
			module.updateButton('button1', BANK_CLASS, true);
			module.button1Callback = module.addDiceToBank;
		}

		module.selecting = false;
		module.addRolledDiceDisplayed = false;
		module.diceAdded = 0;
		module.numToAdd = 0;

		var params = {
			idx: 0,
			name: 'rolledDice',
			collection: dice.collection,
			keys: Object.keys(dice.collection),
			parentEl: module.rollingGreen,
			isAITurn: PWG.Players.getIsAITurn(module.currentGameId)
		};

		var diceDisplayedCallback = function() {
			module.rolledDiceDisplayed();
		};
		
		PWG.GUIDice.addDiceWithTimer(params, diceDisplayedCallback, module);
		
	};

	module.wiggleRollingGreen = function() {
		var wiggleTimer = PWG.Timer.create();
		var animations1 = [{ key: 'rotate', begin: ROLLING_GREEN_WIGGLE_DEGREES, end: -(ROLLING_GREEN_WIGGLE_DEGREES), unit: "" }];
		var animations2 = [{ key: 'rotate', begin: -(ROLLING_GREEN_WIGGLE_DEGREES), end: ROLLING_GREEN_WIGGLE_DEGREES, unit: "" }];
		var animationEnd = [{ key: 'rotate', begin: -(ROLLING_GREEN_WIGGLE_DEGREES), end: 0, unit: "" }];
		var wiggleParams = {
			count: ROLLING_GREEN_WIGGLE_ITERATIONS,
			time: ROLLING_GREEN_WIGGLE_TIME,
			positive: true,
			// rg: module.rollingGreen,
			rg: document.getElementById('game_box'),
			animations1: animations1,
			animations2: animations2,
			animationEnd: animationEnd
		};
		
		wiggleTimer.loop(
			30, 
			function(t, params) { 
				params.count--; 
				// console.log('count = ' + params.count + ', params = ', params); 
				if(params.count > 0) { 
					var anm = (params.positive) ? params.animations1 : params.animations2; 
					params.positive = !params.positive; 
					PWG.Animator.create(params.rg, anm, params.time, true, null, this, {}); 
				} else { 
					PWG.Animator.create(params.rg, params.animationEnd, params.time, true, null, this, {}); 
					// console.log('stopping timer'); 
					t.stop(); 
					PWG.Timer.remove(t.id); 
				} 
			}, 
			wiggleParams,
			module
		);
	};
	
	module.rolledDiceDisplayed = function() {
		// trace('SafariGUI/rolledDiceDisplayed, module.hasFarkled = ' + module.hasFarkled);
		module.rolledDice = PWG.GUIDice.getDice('rolledDice');
		module.addRolledDiceDisplayed = true;

		if(module.hasFarkled) {
			module.updateForFarkle();
			module.hasFarkled = false;
		}
	};
	
	module.selectDice = function(dice) {
		// trace('SafariGUI/selectDice, dice = ', dice);
		module.toSelect = {};

		PWG.Utils.each(
			dice,
			function(die) {
				for(var key in module.rolledDice) {
					if(module.rolledDice[key].idx === die.idx) {
						module.selectDie(module.rolledDice[key].id);
					}
				}
			},
			module
		);
	};
	
	module.selectDie = function(id) {
		// trace('SafariGUI/selectDie, id = ' + id);
		var die = module.rolledDice[id];
		// trace('\tdie = ', die);
		if(!die.isSelected) {
			die.el.style.opacity = 0.5;
			die.isSelected = true;
			module.addSelectedDie(die);
			// process group for non-ai players
			if(die.groupId !== '' && !PWG.Players.getIsAITurn(module.currentGameId)) {
				// trace('\tthere is a group: ' + die.groupId);
				PWG.Utils.each(
					module.rolledDice,
					function(d) {
						// trace('\td = ', d.groupId);
						if(d.groupId === die.groupId) {
							d.el.style.opacity = 0.5;
							d.isSelected = true;
							module.addSelectedDie(d);
						}
					},
					this
				);
			}
		} else {
			die.el.style.opacity = 1;
			die.isSelected = false;
			module.removeSelectedDie              (die);
			// process group for non-ai players
			if(die.groupId !== '' && !PWG.Players.getIsAITurn(module.currentGameId)) {
				PWG.Utils.each(
					module.rolledDice,
					function(d) {
						if(d.groupId === die.groupId) {
							d.el.style.opacity = 1;
							d.isSelected = false;
							module.removeSelectedDie              (d);
						}
					},
					this
				);
			}
		}
	};

	module.addSelectedDie = function(die) {
		// trace('SafariGUI/addSelectedDie');
		if(PWG.App.isTutorialActive && PWG.App.tutorial.displayFirstBankTutorial) {
			if(!PWG.Players.getIsAITurn(module.currentGameId)) {
				module.updateText('dealerSpeechTextEl', PWG.Tutorial.FIRST_BANK);
				PWG.App.tutorial.displayFirstBankTutorial = false;
			}
		}
		module.toSelect[die.id] = die.idx;
		module.checkForSelectedDice();
	};
	
	module.removeSelectedDie = function(die) {
		// delete module.toSelect[die.idx];
		delete module.toSelect[die.id];
		module.checkForSelectedDice();
	};
	
	module.checkForSelectedDice = function() {
		if(!PWG.Players.getIsAITurn(module.currentGameId)) {
			if(PWG.Utils.objLength(module.toSelect) > 0) {
				module.showButton(module.button1);
			} else {
				module.hideButton(module.button1);
			}
		}
	};
	
	module.setSelectedCallback = function(cb) {
		module.selectedCb = cb;
	};
	
	module.onSelectionComplete = function() {
		module.addDiceToBank();
	};

	module.addDiceToBank = function(fromDrag) {
		module.selecting = true;
		var params = { 
			idx: 1,
			keys: Object.keys(module.toSelect)
		};
		// move first die immediately
		module.addDieToBank(params.keys[0]);

		if(params.keys.length === 1) {
			module.allDiceMovedToBank();
		} else {
			// move additional selected dice with delay
			var selectedTimer = PWG.Timer.create();

			selectedTimer.loop(
				MOVE_SELECTED_DICE_DELAY, 
				function(t, params) {
						module.addDieToBank(params.keys[params.idx]);
						params.idx++;

						if(params.idx === params.keys.length) {
							module.allDiceMovedToBank();
							PWG.Timer.remove(selectedTimer.id);
						}
				},
				params,
				module
			);
		}
	};
	
	module.addDieToBank = function(key) {
		// trace('SafariGUI/addDieToBank, key = ' + key + ', die = ', module.rolledDice[key]);
		var die = module.rolledDice[key];
		module.removeDie(module.rolledDice[key], module.rolledDice);
		PWG.GUIDice.addDie('selectedDice', PWG.Utils.objLength(PWG.GUIDice.dice.selectedDice), die.value, module.bankEl);
		module.usedThisTurn++;
			// trace('\tusedThisTurn = ' + module.usedThisTurn);
		if(module.usedThisTurn > 0 && !PWG.Players.getIsAITurn(module.currentGameId)) {
			// trace('\tgoing to show confirm button');
			module.button1Callback = PWG.GUIDice.bankSelectionComplete;
			module.updateButton('button1', CONFIRM_CLASS, false);
			
		}
	};
	
	module.allDiceMovedToBank = function() {
		if(PWG.App.isTutorialActive && PWG.App.tutorial.displayFirstSelectedTutorial) {
			if(!PWG.Players.getIsAITurn(module.currentGameId)) {
				// trace('should be displaying FIRST_SELECTION');
				module.updateText('dealerSpeechTextEl', PWG.Tutorial.FIRST_SELECTION);
				PWG.App.tutorial.displayFirstSelectedTutorial = false;
			}
		}

		module.selectedDice = PWG.GUIDice.getDice('selectedDice');
		// trace('SafariGUI/allDiceMovedToBank, selectedDice = ', module.selectedDice);
		// trace('USED THIS TURN = ' + module.usedThisTurn);
		var length = PWG.Utils.objLength(module.toSelect);
		if(length > 0) {
			if(module.usedThisTurn % 6 === 0) {
				// trace('\tcalling showHotDice');
				module.showHotDice();
			}
			PWG.Games.onDiceSelected(module.currentGameId, module.toSelect);
		}
	};
	
	module.showHotDice = function() {
		// trace('SafariGUI/showHotDice');
		if(PWG.App.isTutorialActive && PWG.App.tutorial.displayFirstHotDiceTutorial) {
			module.updateText('dealerSpeechTextEl', PWG.Tutorial.FIRST_HOT_DICE);
			PWG.App.tutorial.displayFirstHotDiceTutorial = false;
		} else {
			module.wiggleRollingGreen();
		}
		module.showNotification('hot_dice_notification');

		if(module.dealerPersonality) {
			// trace('\tgetting comment');
			module.processDealerPersonality(false, false, true);
		}
	};
	
	module.farkled = function(player) {
		// trace('SafariGUI/farkled');
		module.hasFarkled = true;
		module.updateText('turnScore', player.turns + ': 0');
		module.setFarkleIcons(player);
		module.hideButton(module.button1);
		if(!PWG.Players.getIsAITurn(module.currentGameId)) {
			module.button2Callback = module.endTurn;
		}
		module.updateForFarkle();
		
	};
	
	module.updateForFarkle = function() {
		// trace('SafariGUI/updateForFarkle addRolledDiceDisplayed = ' + module.addRolledDiceDisplayed);
		if(module.addRolledDiceDisplayed) {
			module.showNotification('farkle_notification');
			if(!PWG.Players.getIsAITurn(module.currentGameId)) {
				module.showButton(module.button2);
			}
			if(PWG.App.isTutorialActive) {
				module.button2Callback = module.endTurn;
				module.button2.style.opacity = 1;
			} else {
				module.wiggleRollingGreen();

				if(module.dealerPersonality) {
					// trace('SafariGUI/updateForFarkle, getting comment');
					module.processDealerPersonality(false, true, false);
				}
			}
		} else {
			module.hasFarkled = true;
		}
	};

	module.showNotification = function(cls) {
		var className = 'fade_out_notification ' + cls;
		var html = PWG.Utils.parseMarkup(PWG.SafariTemplates.NOTIFICATION, { className: className });
		module.notificationHolder.innerHTML = html;
		module.notificationHolder.style.zIndex = 10000000;
		var params = { el: document.getElementById('notification') };

		var notificationRemoveTimer = PWG.Timer.create();
		
		// remove div after x seconds
		notificationRemoveTimer.start(
			NOTIFICATION_ANIMATE_TIME,
			function(t, params) {
				if(params.el.parentNode) {
					params.el.parentNode.removeChild(params.el);
				}
				module.notificationHolder.style.zIndex = -1;
				PWG.Timer.remove(notificationRemoveTimer.id);
			},
			params,
			module
		);
	};
	
	module.setFarkleIcons = function(player) {
		// var text = '';
		// trace('FlatFarklGUI/setFarkleIcons, currentFarkles = ' + player.currentFarkles);
		var farkleIcons = '';
		var pos = {};
		
		for(var i = 0; i < player.currentFarkles; i++) {
			// text += 'F ';
			pos = {
				right: (FARKLE_F_ICON_RIGHT * (i+1)) + (FARKLE_F_ICON_WIDTH * i)
			};
			farkleIcons += PWG.Utils.parseMarkup(PWG.SafariTemplates.PLAYER_FARKLES, pos);
		}
		// trace('\ttext = ' + text);
		// module.updateText('farklesText', text);
		module.farklesText.innerHTML = farkleIcons;
	};
	
	module.removeDice = function(list) {
		// trace('SafariGUI/removeDice, list = ', list);
		PWG.Utils.each(
			list,
			function(die) {
				// trace('\tdie = ', die);
				module.removeDie(die, list);
			},
			this
		);
		// trace('----- SafariGUI/removeDice, list now = ', list);
	};
	
	module.removeDie = function(die, list) {
		// trace('SafariGUI/removeDie, die = ', die, '\tlist = ', list);
		if(die && die.el) {
			die.el.parentNode.removeChild(die.el);
			die.destroy();
			delete list[die.id];
		}
	};
	
	module.updateText = function(el, text, className, clearClass) {
		// trace('SafariGUI/updateText, text = ' + text + ', el = ', el);
		var prefixText = '';
		if(el === 'turnScore') {
			prefixText = 'turn';
		} else if(el === 'totalScore') {
			prefixText = 'game: ';
		} else if(el === 'dealerSpeechTextEl') {
			if(text !== '') {
				module.dealerSpeech.style.display = 'block';
			} else {
				module.dealerSpeech.style.display = 'none';
			}
		} 
		this[el].innerHTML = prefixText + text;
/*
		if(el !== 'farklesText') {
			if(text === 'FARKLE!') {
				var redIdx = this[el].className.indexOf(' text_red');
				if(redIdx === -1) {
					this[el].className += ' text_red';
				}
			} else {
				var redIdx = this[el].className.indexOf(' text_red');
				if(redIdx > -1) {
					var sansRed = this[el].className.substr(0, redIdx);
					this[el].className = sansRed;
				}
			}
		}
*/
		if(className) {
			this[el].className = (clearClass) ? className : ' ' + className;
		}
	};
	
	module.updateTurnScore = function(player, score) {
		module.updateText('turnScore', player.turns + ': ' + score);
	};
	
	module.minimumTurnScoreMet = function() {
		if(PWG.App.isTutorialActive) {
			if(PWG.App.tutorial.displayFirstMinimumTutorial) {
				module.updateText('dealerSpeechTextEl', PWG.Tutorial.FIRST_MINIMUM);
				PWG.App.tutorial.displayFirstMinimumTutorial = false;
			}
			if(PWG.App.tutorial.isPresetRollsActive) {
				module.button2Callback = null;
				module.button2.style.opacity = 0.5;
			} else {
				if(PWG.App.tutorial.playRealGame) {
					module.updateText('dealerSpeechTextEl', PWG.Tutorial.PLAY_REAL_GAME);
					PWG.App.tutorial.displayPlayRealGame = false;
				}
				module.button2.style.opacity = 1;
			}
		} else {
			module.button2Callback = module.endTurn;
			module.button2.style.opacity = 1;
		}
		module.showButton(module.button2);
	};
	
	module.endTurn = function() {
		PWG.Games.endTurn(module.currentGameId);
	};
	
	module.onTurnEnded = function(player) {
		if(PWG.App.isTutorialActive) {
			module.updateText('dealerSpeechTextEl', '');
		}

		module.removeDice(module.rolledDice);
		module.rolledDice = {};
		module.removeDice(module.selectedDice);
		module.selectedDice = {};
		
		module.hideButton(module.button1);
		module.hideButton(module.button2);

		module.updateText('totalScore', player.score);
		module.setFarkleIcons(player);
	};
	
	module.gameOver = function(winner) {
		// trace('SafariGUI/gameOver, winner = ', winner);
		module.winner = winner; 
		
		if(!PWG.App.isTutorialActive) {
			module.updateText('farklesText', 'winner!', ' text_xl text_green text_right');

			if(module.dealerPersonality) {
				module.isEndingGame = true;
				module.processDealerPersonality(false, false, false, true, winner);
			}
			
			if(module.isTournamentGame) { 
				if(winner instanceof PWG.AIPlayer) {
					// trace('\tuser lost tournament, show elimination');
					// kill tournament
					module.currentTournament = -1;
					module.isTournamentGame = false;
					// display elimination text
					module.showNotification('elimination_notification');
					module.isTournamentOver = true;
				} else {
					var tournaments = PWG.Tournaments.getAll('tournaments');
					var tournament = tournaments[module.tournamentKeys[module.currentTournament]];
					if(tournament.champion !== '' && winner.name === tournament.userAnimal) {
						// trace('\user won tournament, show trophy');
						module.displayTrophy = true;
						module.isTournamentOver = true;
					}
				}
			}
		}
		// trace('\tshould be hiding button1');
		module.hideButton(module.button1);
		
		module.updateButton('button2', CONFIRM_CLASS, true);
		module.button2Class = CONFIRM_CLASS;
		module.button2Callback = PWG.App.quit;
		// trace('\tbutton2Callback should be PWG.App.quit: ', module.button2Callback);
		module.hideButton(module.button2);
	};
	
	///////////////////////////////////////// LAYOUT AND UTILITIES
	module.setButton = function(button, text) {
		// trace('SafariGUI/setButton, text = ', text, '\n\tbutton = ', button);
		button.innerHTML = text;
		module.showButton(button);
	};
	
	module.updateButton = function(name, newClass, hide) {
		var className = name + 'Class';
		var button = module[name];
		module.replaceClass(button, module[className], newClass);
		module[className] = newClass;
		if(hide) {
			module.hideButton(button);
		} else {
			module.showButton(button);
		}
	};
	
	module.hideButton = function(button) {
		// trace('SafariGUI/hideButton, button = ', button);
		button.style.display = 'none';
	};
	
	module.showButton = function(button) {
		// trace('SafariGUI/showButton, button = ', button);
		button.style.display = 'block';
	};
	
	module.onButton1Click = function() {
		// trace('onButton1Click, callback = ', module.button1Callback);
		if(PWG.App.isTutorialActive) {
			module.showDealerSpeechBubble(false);
		}
		module.button1Callback.call(this);
	};
	
	module.onButton2Click = function() {
		// trace('onButton2Click, callback = ', module.button2Callback);
		if(module.button2Callback !== null) {
			module.hideButton(module.button2);
			module.button2Callback.call(this);
		}
	};
	
	module.openScreen = function(name, cb, skipAnimation) {
		// trace('SafariGUI/openScreen, name = ' + name + ', currentScreen = ' + module.currentScreen);
		if(module.currentScreen !== name) {
			if(module.currentScreen !== 'play' && module.currentScreen !== 'home') {
				// trace('\thiding: ' + module.currentScreen);
				// module.screenEls[name].style.display = 'none';
			}
			
			module.currentScreen = name;

			module.screenEls[name].style.display = 'block';

			if(!skipAnimation) {
				module.screenEls[name].className += ANIMATE_ONTO_SCREEN_FROM_RIGHT;
			}

			if(cb) {
				cb.call(module);
			}
		}
	};
	
	module.closeScreen = function(name) {
		// trace('SafariGUI/closeScreen, name = ' + name + ', skipAnimation = ' + skipAnimation);
		var screenEl = module.screenEls[name];
		module.removeClass(screenEl, ANIMATE_ONTO_SCREEN_FROM_RIGHT);

		var closeEl = document.getElementById(name + '_close_holder');
		if(closeEl) {
			closeEl.parentNode.removeChild(closeEl);
		}

		screenEl.style.display = 'none';

		switch(name) {
			case 'rules':
			case 'location':
			case 'tournament':
			if(name === 'tournament') {
				module.isTournamentGame = false;
			}
			module.screenEls['home'].style.display = 'block';
			module.currentScreen = 'home';
			break;

			case 'animal':
			if(module.isTournamentGame) {
				if(!module.isTournamentAnimalSelected) {
					module.openScreen('tournament', module.onTournamentScreenOpened, true);
				}
			} else {
				module.openScreen('location', module.onLocationSelectionScreenOpened, true);
			}
			break;
			
			case 'bracket':
			module.screenEls['bracket'].style.left = '0px';
			if(module.isTournamentGame) {
				module.openScreen('tournament', module.onTournamentScreenOpened, true);
			}
			break; 
			
			case 'stats':
			module.currentScreen = 'play';
			break;

			case 'play':
			if(module.isTournamentGame) {
				document.getElementById('large_trophy').style.display = 'none';
				if(module.isTournamentOver) {
					module.closeScreen('bracket');
					module.closeScreen('tournament');
				}
			}
			break;
			
			case 'home': 
			module.screenEls['welcome'].style.display = 'block';
			document.getElementById('start_message').style.display = 'block';
			module.currentScreen = 'welcome';
			break; 
			
			default: 
			// trace('unknown screen name: ' + name);
			break;
		}
		if(module.closeCb) {
			module.closeCb.call(module);
			module.closeCb = null;
		}
	};
	
	module.removeClass = function(el, className) {
		var oldClass = el.className;
		if(oldClass.indexOf(className) > -1) {
			el.className = oldClass.substr(0, oldClass.indexOf(className));
		}
	};

	module.replaceClass = function(el, toRemove, toAdd) {
		module.removeClass(el, toRemove);
		if(el.className.indexOf(toAdd) === -1) {
			el.className += toAdd;
		}
	};
	
	module.layout = function() {
		PWG.WindowParams.update();
		module.updateSquareStyleEl();
		
		if(PWG.WindowParams.isOrientationChanged) {
			PWG.StyleElManager.update();
			// module.updateOrientationClass();
		}

		PWG.GUIDice.updateSizes(); 
		
		if(PWG.Games.isGUIGameActive) {
			module.updateRectsAndSizes();
			
			if(PWG.Utils.objLength(module.rolledDice)) {
				PWG.GUIDice.resizeDice(module.rolledDice, true);
			}

			if(PWG.Utils.objLength(module.selectedDice)) {
				PWG.GUIDice.resizeDice(module.selectedDice, false);
			}
		}
	};

	module.updateSquareStyleEl = function() {
		// trace('SafariGUI/updateSquareStyleEl');
		var square = {};
		
		if(PWG.WindowParams.orientation === 'landscape') {
			square.size = PWG.WindowParams.height;
			square.doubleSize = square.size * 2;
			square.top = 0;
			
			square.titleWidth = PWG.WindowParams.width - PWG.WindowParams.height;
			square.titleHeight = PWG.WindowParams.height;
		} else {
			square.size = PWG.WindowParams.width;
			square.doubleSize = square.size * 2;
			square.top = PWG.WindowParams.height - PWG.WindowParams.width;

			square.titleWidth = PWG.WindowParams.width;
			square.titleHeight = PWG.WindowParams.height - PWG.WindowParams.width;
		}
		
		_head.removeChild(module.squareStyleEl);

		module.squareStyleEl.innerHTML = PWG.Utils.parseMarkup(_squareStyleString, square);
		
		_head.appendChild(module.squareStyleEl);
	};
	
	module.updateRectsAndSizes = function() {
		PWG.GUIDice.playScreenRect = module.screenEls['play'].getBoundingClientRect();
		PWG.GUIDice.rollingGreenRect = module.rollingGreen.getBoundingClientRect();
		PWG.GUIDice.bankRect = module.bankEl.getBoundingClientRect();
		PWG.GUIDice.unit = Math.floor(module.screenEls['play'].offsetWidth/100);
	};
	
	module.processDealerPersonality = function(startTurn, farkle, hotDice, gameOver, player) {
		// trace('SafariGUI/processDealerPersonality, gameOver = ' + gameOver + ', player = ', player);
		var comment;
		if(startTurn) {
			comment = module.dealerPersonality.getTurnStartComment(module.currentGameId);
		} else if(gameOver) {
			comment = module.dealerPersonality.getWinComment(player);
		} else {
			comment = module.dealerPersonality.getRollComment(module.currentGameId, farkle, hotDice);
		}

		if(comment !== '') {
			module.updateText('dealerSpeechTextEl', comment);
			module.showDealerSpeechBubble(true);
		}
	};
	
	module.confirmQuit = function(cb) {
		// trace('SafariGUI/confirmQuit');
		if(PWG.App.isTutorialActive) {
			module.updateText('dealerSpeechTextEl', '');
		}

		PWG.App.pause(module.currentGameId);

		module.isConfirmBoxOpen = true;
		module.confirmQuitCb = cb;

		var confirmBox = document.getElementById('confirm_box');
		confirmBox.style.display = 'block';

		var cancelButton = document.getElementById('cancel_button');
		var confirmButton = document.getElementById('confirm_button');

		cancelButton.addEventListener('click', module.onCancelQuitClicked); 
		confirmButton.addEventListener('click', module.onConfirmQuitClicked); 

	};

	module.onCancelQuitClicked = function() {
		// trace('SafariGUI/cancelQuit');
		PWG.App.resume(module.currentGameId);

		module.confirmQuitCb.call(this, false);
		module.closeConfirmBox();
	};
	
	module.onConfirmQuitClicked = function() {
		module.confirmQuitCb.call(this, true);
		module.closeConfirmBox();
	};
	
	module.closeConfirmBox = function() {
		// trace('SafariGUI/closeConfirmBox');
		var confirmBox = document.getElementById('confirm_box');
		confirmBox.style.display = 'none';

		var cancelButton = document.getElementById('cancel_button');
		var confirmButton = document.getElementById('confirm_button');

		cancelButton.removeEventListener('click', module.cancelQuit); 
		confirmButton.removeEventListener('click', module.confirmQuit); 

		module.isConfirmBoxOpen = false;
	};
	
	module.quit = function(cb) {
		// trace('SafariGUI/quit, isTournamentGame = ' + module.isTournamentGame + ', currentTournament = ' + module.currentTournament);
		module.removePlayerEls();
		module.replaceClass(module.titleButton, SPLASH_CLASS_GAME_PLAY, SPLASH_CLASS);

		module.removeDice(module.rolledDice);
		module.rolledDice = {};
		module.removeDice(module.selectedDice);
		module.selectedDice = {};
		module.bankEl.innerHTML = '';
		
		module.button1Callback = cb;
		module.updateButton('button1', START_CLASS);
		module.button1Class = START_CLASS;
		module.hideButton(module.button2);

		module.closeScreen('play');

		if(module.isTournamentGame && module.currentTournament !== '') {
			// trace('\topening bracket screen');
			module.openScreen('bracket', module.onBracketScreenOpened);
		} else {
			// trace('\topening home screen');
			module.closeScreen('tournament');
			module.closeScreen('animal');
			module.closeScreen('location');
			module.closeScreen('bracket');
			module.openScreen('home', null, true);
		}
		
		if(PWG.App.isTutorialActive) {
			module.updateText('dealerSpeechTextEl', 'tutorial active');
		}
		
		module.showDealerSpeechBubble(PWG.App.isTutorialActive);
	};
	
	module.houseKeeping = function(event) {
		// trace('SafariGUI/houseKeeping');
		module.removeEventListeners();
		module.removeLocationChoiceClickHandlers();
		module.removeAnimalChoiceClickHandlers();
	};

	return module;
}();


var PWG = PWG || {};
PWG.Games = function() {
	'use strict';
	
	var module = {};

	var MAX_ROUNDS = 500;
	
	module.isGUIGameActive = false;
	
	var _games = {};
	
	function Controller(isGUIGame, isTournamentGame, gameOverCallback) {
		this.isGUIGame = isGUIGame;
		this.isTournamentGame = isTournamentGame;
		this.gameOverCallback = gameOverCallback;
		this.id = String(Date.now() + Math.floor(Math.random() * 9999));
		this.isFirstTurn = true;
		this.isActive = false;
		this.isPaused = false; 
		
		this.rolledCallback = {
			fn: this.onRolled,
			ctx: this
		};

		PWG.Farkle.initGame(this.id, this.rolledCallback);
	}
	
	Controller.prototype.start = function() {
		// trace('Game['+this.id+']/start');
		this.isActive = true;
		
		module.isGUIGameActive = this.isGUIGame;
		
		PWG.Players.startGame(this.id);

		if(this.isGUIGame) {
			PWG.App.gui.onGameStarted(PWG.Players.getAll(this.id));
		}

		this.totalTurns = 1;
		this.startTurn();
	};

	Controller.prototype.startTurn = function() {
		// trace('Game['+this.id+']/startTurn');
		if(!this.isPaused) {
			if(this.isGUIGame && !this.isFirstTurn) {
				var delayTimer = PWG.Timer.create();
				delayTimer.start(
					module.TURN_DELAY_TIME,
					function(t, params) {
						return function(context) {
							context.initializeTurn();
						}(this);
					},
					{},
					this
				);
			} else {
				this.initializeTurn();
				this.isFirstTurn = false;
			}
		}
	};

	Controller.prototype.initializeTurn = function() {
		PWG.Players.incrementTurn(this.id);
		PWG.Farkle.startTurn(this.id);
		PWG.Players.startTurn(this.id);
		
		if(!PWG.Players.getIsAITurn(this.id)) {
			this.startRoll();
		}
		
		if(this.isGUIGame) {
			PWG.App.startTurn(this.id, PWG.Players.getIsAITurn(this.id));
			PWG.App.gui.startTurn(PWG.Players.getCurrent(this.id));
		}
	};

	Controller.prototype.startRoll = function() {
		// trace('Game['+this.id+']/startRoll, isGUIGame = ' + this.isGUIGame);
		if(this.isGUIGame) {
			PWG.App.gui.startRoll();
		} else {
			this.selectedDice = {};
		}
	};

	Controller.prototype.roll = function(cheat, farkle) {
		// trace('Game['+this.id+']/roll');
		var rolledDice;
		if(!this.isPaused) {
			if(PWG.App.isTutorialActive) {
				rolledDice = PWG.Farkle.rollValues(this.id, PWG.App.tutorial.getPresetRoll());
			} else if(farkle) {
				rolledDice = PWG.Farkle.rollFarkle(this.id);
			} else if(cheat) {
				rolledDice = PWG.Farkle.rollStraight(this.id);
			} else { 
				rolledDice = PWG.Farkle.roll(this.id);
			}
		}
		// trace('\troll complete: isAITurn = ' + PWG.Players.getIsAITurn(this.id) + ', farkled = ' + rolledDice.farkled + ', active = ' + this.isActive);
		if(this.isGUIGame) {
			PWG.App.gui.displayRoll(rolledDice);
			PWG.App.gui.setSelectedCallback({ fn: this.onDiceSelected, ctx: this });
		}

		if(PWG.Players.getIsAITurn(this.id)) {
			PWG.Players.setRolledDice(this.id, rolledDice);
		}
		// trace('rolledDice.farkled = ' + rolledDice.farkled + ', active = ' + this.isActive);
		if(this.isActive && rolledDice.farkled) {
			this.hasFarkled();
		}
	};

	// used by ai
	Controller.prototype.selectDice = function(dice) {
		// trace('Game['+this.id+']/selectDice, dice = ', dice, '\tthis = ', this);
		if(this.isGUIGame) {
			PWG.App.gui.selectDice(dice);
		} else {
			this.selectedDice = {};
			PWG.Utils.each(
				dice,
				function(die) {
					this.selectedDice[die.idx] = die.idx;
				},
				this
			);
		}
	};

	// used by ai
	Controller.prototype.selectionComplete = function() {
		if(this.isGUIGame) {
			PWG.App.gui.addDiceToBank();
		} else {
			this.onDiceSelected(this.selectedDice);
		}
	};

	Controller.prototype.onDiceSelected = function(dice) {
		// trace('Game['+this.id+']/onDiceSelected, isTutorialGame = ' + PWG.App.isTutorialGame + ', active = ' + this.active + '\n\tthis = ', this);
		var rolledDice = PWG.Farkle.getTurnDice(this.id);
		var scores = [];
		scores = PWG.Farkle.bankScoringDice(this.id, dice);
		// trace('\t...scores = ' + scores + ', is array = ' + (scores instanceof Array));
		var score = 0;
		if(rolledDice.hotDice) {
			PWG.Players.hasHotDice(this.id, true);
		} else {
			PWG.Players.hasHotDice(this.id, false);
		}
		if(scores instanceof Array) {
			// trace('\tlength = ' + scores.length);
			PWG.Utils.each(
				scores,
				function(value) {
					score += value;
				},
				this
			);
		} else {
			score = scores;
		}
		// trace('---- score now = ' + score);
		if(this.isGUIGame) {
			PWG.App.gui.updateTurnScore(PWG.Players.getCurrent(this.id), score);
		}

		if(PWG.Players.getIsAITurn(this.id)) {
			PWG.Players.updateTurnScore(this.id, score, rolledDice.hotDice);
		}
		if(score >= PWG.Farkle.MIN_TURN_SCORE) {
			this.farkled = false;
			if(this.isGUIGame) {
				PWG.App.gui.minimumTurnScoreMet();
			}
		}
		
		this.startRoll();
	};

	Controller.prototype.hasFarkled = function() {
		this.farkled = true;
		PWG.Players.hasFarkled(this.id);
		
		if(this.isGUIGame) {
			PWG.App.gui.farkled(PWG.Players.getCurrent(this.id));
		} else {
			this.endTurn();
		}
	};

	Controller.prototype.endTurn = function() {
		// trace('Game['+this.id+']/endTurn');
		PWG.Players.onTurnEnded(this.id, this.farkled, PWG.Farkle.getTurnDice(this.id));
		var player = PWG.Players.getCurrent(this.id);

		if(this.isGUIGame) {
			PWG.App.gui.onTurnEnded(player);
		}

		// trace('----- end of ' + player.name + '\'s turn with a score of: ' + player.score + ', in turn: ' + this.totalTurns);
		if(player.score >= PWG.Farkle.WINNING_SCORE || this.totalTurns > MAX_ROUNDS) {
			this.gameOver();
		} else {
			this.nextTurn();
		}
	};

	Controller.prototype.nextTurn = function() {
		// trace('Game['+this.id+']/nextTurn');
		PWG.Players.nextPlayer(this.id);
		this.totalTurns++;
		// trace('----- start of ' + this.players[this.currentPlayer].name + '\'s turn');
		this.startTurn();
	};

	Controller.prototype.gameOver = function() {
		// trace('Game['+this.id+']/gameOver');
		this.isActive = false;
		module.gameOver(this.id, this.isGUIGame);
	};

	module.createGUIGame = function(players, isTournamentGame, gameOverCallback) {
		return module.create(players, true, isTournamentGame, gameOverCallback);
	};
	
	module.createNPCGame = function(players, isTournamentGame, gameOverCallback) {
		return module.create(players, false, isTournamentGame, gameOverCallback);
	};
	
	module.create = function(players, isGUIGame, isTournamentGame, gameOverCallback) {
		// trace('Games/create, gameOverCallback = ', gameOverCallback);
		var game = new Controller(isGUIGame, isTournamentGame, gameOverCallback);
		var savedPlayerData = PWG.App.getData('players');
		PWG.Players.create(game.id, players, savedPlayerData, isGUIGame, isTournamentGame);
		if(!PWG.App.isTutorialActive) {
			PWG.App.savePlayerData(game.id);
		}
		
		_games[game.id] = game;

		return game.id;
	};
	
	module.start = function(id) {
		_games[id].start();
	};
	
	module.roll = function(id, cheat) {
		// trace('Games/roll, id = ' + id + ', cheat = ' + cheat);
		_games[id].roll(cheat);
	};
	
	module.rollFarkle = function(id) {
		_games[id].roll(false, true);
	};
	
	module.selectDice = function(id, dice) {
		_games[id].selectDice(dice);
	};
	
	module.selectionComplete = function(id) {
		_games[id].selectionComplete();
	};
	
	module.onDiceSelected = function(id, dice) {
		_games[id].onDiceSelected(dice);
	};
	
	module.endTurn = function(id) {
		// trace('Games/endTurn, id = ' + id);
		_games[id].endTurn();
	};
	
	module.get = function() {
		return _games;
	};
	
	module.gameOver = function(id, isGUIGame) {
		// trace('Games/gameOver, id = ' + id);
		module.isGUIGameActive = false;
		var winner = PWG.Players.gameOver(id);
		// trace('\twinner = ', winner);
		if(PWG.App.isTutorialActive) {
			PWG.App.isTutorialActive = false;
			PWG.App.gui.gameOver();
		} else {
			PWG.App.savePlayerData(id);
		}
		var game = _games[id];
		// trace('\tcb = ', game.gameOverCallback);
		if(game.gameOverCallback) {
			game.gameOverCallback.fn.call(game.gameOverCallback.ctx, id, winner, game.isTournamentGame);
		}

		if(isGUIGame) {
			var winner = PWG.Players.getCurrent(id);
			PWG.App.gui.gameOver(winner);
		}

		PWG.Players.quit(id);
		PWG.Farkle.quitGame(id);
		_games[id] = null;
	};
	
	return module;
}();

var PWG = PWG || {};
PWG.Tournaments = function() {
	'use strict';

	var module = {};
	
	module.FINALS = 'finals';
	
	var _tournaments = {};
	
	function Controller(config) {
		this.id = config.id || String(new Date().getTime());
		this.isInitialized = config.isInitialized || false;
		this.rounds = config.rounds || {};
		this.currentRoundIndices = config.currentRoundIndices || {}; 
		this.locationChampions = config.locationChampions || {};
		this.champion = config.champion || '';
		
		this.userAnimal = config.userAnimal;
		this.userHome = config.userHome; 
		
		this.isActive = true;
		
		this.gameIds = {};

		this.callback = {
			fn: this.gameOverCallback,
			ctx: this
		};

		// being built for the first time instead of created from saved game data
		if(!this.isInitialized) {
			this.init(config.contenders);
		}

		return this.id;
	}
	
	Controller.prototype.init = function(contenders) {
		PWG.Utils.each(
			contenders,
			function(contenders, location) {
				this.initLocationRounds(contenders, location);
			},
			this
		);
		
		this.initFinalsRounds();
		
		this.isInitialized = true; 
	};
	
	Controller.prototype.initLocationRounds = function(contenders, location) {
		var numGames = contenders.length;

		this.currentRoundIndices[location] = 0;
		this.gameIds[location] = [];
		this.rounds[location] = [];
		this.rounds[location].push({ numGames: numGames, completed: [], contenders: contenders });
		
		this.createRounds(numGames, location);
		this.initRound(location);
	};
	
	Controller.prototype.initFinalsRounds = function() {
		this.rounds[module.FINALS] = [];
		this.currentRoundIndices[module.FINALS] = 0;
		this.gameIds[module.FINALS] = [];

		this.createRounds(PWG.Animals.getLocationsLength(), module.FINALS);
	};
	
	Controller.prototype.createRounds = function(numGames, location) {
		while(numGames > 1) {
			numGames /= 2;
			this.rounds[location].push({ completed: [], contenders: [] });
		}
	};
	
	Controller.prototype.initRound = function(location) {
		var currentIdx = this.currentRoundIndices[location];
		var round = this.rounds[location][currentIdx];
		var contenders = round.contenders;

		round.winners = round.winners || [];
		
		this.gameIds[location] = this.gameIds[location] || [];
		this.gameIds[location][currentIdx] = [];
		
		PWG.Utils.each(
			contenders,
			function(contenderGroup) {
				this.initGame(contenderGroup, round, currentIdx, location);
			},
			this
		);
	};
	
	Controller.prototype.initGame = function(contenderGroup, round, currentIdx, location) {
		var isUserGame = false;
		var gamePlayers = {};
		var gameId; 
		
		PWG.Utils.each(
			contenderGroup,
			function(contender) {
				var isAIPlayer = true;
				if(contender === this.userAnimal) {
					isUserGame = true;
					isAIPlayer = false;
				}
				gamePlayers[contender] = { name: contender, isAIPlayer: isAIPlayer };
			},
			this
		);

		if(isUserGame) {
			gameId = PWG.Games.createGUIGame(gamePlayers, location, this.callback);
			this.currentUserGameId = round.userGameId = gameId;
			
		} else {
			gameId = PWG.Games.createNPCGame(gamePlayers, location, this.callback);
		}
		this.gameIds[location][currentIdx] = this.gameIds[location][currentIdx] || [];
		this.gameIds[location][currentIdx].push(gameId);
	};
	
	Controller.prototype.reInitRounds = function() {
		var locations = PWG.Animals.getLocationKeys();
		var locationChampions = this.locationChampions;
		var numChampions = PWG.Utils.objLength(locationChampions);
		
		if(numChampions === 0) {
			// no locations have champs, init from start
			this.init();
			
		} else if(numChampions == locations.length) {
			// locations all completed, semi-finals/finals need init
			this.initRound(module.FINALS);
			
		} else {
			// some locations have finished, but not all
			// trace('reinit partial location rounds');
			PWG.Utils.each(
				locations,
				function(location) {
					if(!locationChampions.hasOwnProperty(location)) {
						var currentIdx = this.currentRoundIndices[location];
						var round = this.rounds[location][currentIdx];
						var completed = round.completed;
						var contenders = round.contenders;
						
						PWG.Utils.each(
							contenders,
							function(contenderGroup, idx) {
								// trace('\tindex of ' + idx + ' = ' + completed.indexOf(idx));
								if(completed.indexOf(idx) === -1) {
									// trace('\tcontenderGroup['+idx+'] never completed');
									this.gameIds[location] = this.gameIds[location] || [];
									// trace('this.gameIds['+location+'] now = ', this.gameIds[location]);
									this.initGame(contenderGroup, round, currentIdx, location);
								}
							},
							this
						);
					}
				},
				this
			);
		}
	};
	
	Controller.prototype.startAllLocations = function() {
		PWG.Utils.each(
			this.rounds,
			function(rounds, location) {
				if(location !== module.FINALS) {
					this.startRound(location);
				}
			},
			this
		);
	};
	
	Controller.prototype.startRound = function(location) {
		var currentIdx = this.currentRoundIndices[location];
		var round = this.rounds[location][currentIdx];
		var gameIds = this.gameIds[location][currentIdx];
		// trace('Controller['+this.id+']/startRound, location = ' + location + ', gameIds = ', gameIds);
		
		PWG.Utils.each(
			gameIds,
			function(gameId) {
				if(gameId != round.userGameId) {
					// trace(location + ' gameId = ' + gameId);
					PWG.Games.start(gameId);
				} else {
					// trace('skipping ' + location + ' user game: ' + gameId);
					this.currentUserGameId = gameId;
				}
			},
			this
		);
	};
	
	Controller.prototype.gameOverCallback = function(id, winner, location) {
		var currentIdx = this.currentRoundIndices[location];
		var round = this.rounds[location][currentIdx];
		var contenderIdx = _findContenderIndex.call(this, round.contenders, winner.name);
		// trace('Controller/gameOverCallback, id = ' + id + '\n\twinner = ' + winner.name + '\n\tlocation = ' + location + '\n\tcurrentIdx = ' + currentIdx + '\n\tcontenderIdx = ' + contenderIdx);

		round.completed.push(contenderIdx);
		// round.winners[contenderIdx] = winner.name;
		round.winners.push(winner.name);
		
		if(currentIdx < (this.rounds[location].length - 1)) {
			// trace('\tthere is another round in ' + location + ', adding winner to winners: ', round.winners);
			if(round.completed.length === round.contenders.length) {
				// trace('\t' + location + ' round ' + currentIdx + ' completed, winners = ' + round.winners);
				currentIdx++;
				this.rounds[location][currentIdx].contenders = _groupContenders(PWG.Utils.clone(round.winners));
				this.currentRoundIndices[location] = currentIdx;
				this.initRound(location);
				this.startRound(location);
			}
		} else {
			if(location === module.FINALS) {
				this.champion = winner.name;
				this.isActive = false;
				PWG.Players.hasWonTournament(id);
				PWG.App.savePlayerData(id);
			} else {
				// push to finals contenders
				this.locationChampions[location] = winner.name;
				this.addContenderToEndRounds.call(this, winner.name);
			}
		}
		_saveTournamentData(this.id);
	};
	
	Controller.prototype.addContenderToEndRounds = function(contender) {
		// trace('-------- Tournament['+this.id+']/addContenderToEndRounds, contender = ' + contender);
		var rounds = this.rounds[module.FINALS];
		var index = this.currentRoundIndices[module.FINALS];
		var iterations = index;
		var expected = PWG.Animals.getLocationsLength();

		var round = rounds[index] || {};
		round.contenders = round.contenders || [];

		round.contenders.push(contender);
		this.rounds[module.FINALS][index] = round;

		while(iterations > 0) {
			expected /= 2;
			iterations--;
		}

		// if all expected contenders added, start the finals:
		if(round.contenders.length === expected) {
			round.contenders = _groupContenders(round.contenders);
			round.completed = [];
			this.initRound(module.FINALS);
			this.startRound(module.FINALS);
		}
	};
	
	Controller.prototype.getData = function() {
		return {
			id: this.id,
			isInitialized: this.isInitialized,
			isActive: this.isActive,
			location: this.location,
			userAnimal: this.userAnimal,
			userHome: this.userHome,
			rounds: this.rounds,
			currentRoundIndices: this.currentRoundIndices,
			locationChampions: this.locationChampions,
			champion: this.champion
		};
	};
	
	module.init = function(tournaments) {
		if(tournaments) {
			PWG.Utils.each(
				tournaments,
				function(tournament) {
					if(tournament.isActive) {
						tournament = new Controller(tournament);
						tournament.reInitRounds();
						// trace('initd tournament = ', tournament);
						_tournaments[tournament.id] = tournament;
					}
				},
				module
			);
		}
	};
	
	module.create = function(userAnimal) {
		var tournament;
		var config = {
			userAnimal: userAnimal,
			userHome: PWG.PlayerAnimalHomes[userAnimal]
		};

		var contenders = {};
		
		PWG.Utils.each(
			PWG.Animals.locations,
			function(animals, location) {
				var locationContenders = PWG.Utils.clone(animals);
				if(location === PWG.PlayerAnimalHomes[userAnimal]) {
					// replace last animal from user's home with user animal
					locationContenders.pop(); 
					locationContenders.push(userAnimal);
				}
				locationContenders = PWG.Utils.shuffle(locationContenders);
				// trace('locationContenders['+location+'] = ', locationContenders);
				contenders[location] = _groupContenders(locationContenders);
			},
			module
		);
		// trace('contenders = ', contenders);

		config.contenders = contenders;
		// trace('groupedContenders = ', contenders);
		tournament = new Controller(config);
		_tournaments[tournament.id] = tournament;
		
		_saveTournamentData(tournament.id);
		
		return tournament.id;
	};
	
	module.start = function(id) {
		if(!_tournaments.hasOwnProperty(id)) {
			return;
		}
		_tournaments[id].startAllLocations();
	};

	module.getUserGameId = function(id) {
		if(!_tournaments.hasOwnProperty(id)) {
			return;
		}
		return _tournaments[id].currentUserGameId;
	};
	
	module.getAll = function() {
		return _tournaments;
	};
	
	module.getActive = function() {
		var active = {};
		
		PWG.Utils.each(
			_tournaments,
			function(tournament, key) {
				if(tournament.isActive) {
					active[key] = tournament;
				}
			},
			module
		);
		return active;
	};
	
	module.getActiveAnimals = function() {
		var animals = [];
		PWG.Utils.each(
			_tournaments,
			function(tournament) {
				if(tournament.isActive) {
					animals.push(tournament.userAnimal);
				}
			},
			module
		);
		return animals;
	};
	
	module.kill = function(id) {
		if(!_tournaments.hasOwnProperty(id)) {
			return;
		}
		_tournaments[id] = null;
		delete _tournaments[id];
	};
	
	function _groupContenders(initial) {
		var grouped = [];
		while(initial.length > 0) {
			grouped.push(initial.splice(0, 2));
		}
		return grouped;
	}
	
	function _findContenderIndex(contenderGroup, name) {
		var index = -1;
		PWG.Utils.each(
			contenderGroup,
			function(contenders, idx) {
				PWG.Utils.each(
					contenders,
					function(contender) {
						if(contender === name) {
							index = idx;
						}
					},
					module
				);
			},
			module
		);
		return index;
	}
	
	function _saveTournamentData(id) {
		var data = PWG.App.getData('tournaments');

		if(_tournaments[id].isActive) {
			data[id] = _tournaments[id].getData();
		} else if(data.hasOwnProperty(id)) {
			delete data[id];
		}

		PWG.App.saveData('tournaments', data);
	}
	
	return module;
}();

var PWG = PWG || {};
PWG.App = function() {
	'use strict';

	var module = {};

	var PLAYER_DATA_URL = 'http://localhost:3000/users/players/';
	var _loadedCallback;
	var _listeners = [];
	
	module.DELAY_TIME = 1500;
	module.TURN_DELAY_TIME = 500; 
	
	module.name = 'pwg_farkle_safari';
	module.isTournamentGame = false;
	module.isTutorialActive = false;
	module.isPaused = false;
	module.tutorial = null;
	
	module.init = function(config) {
		// trace('Game/init, config = ', config);
		module.isMobile = PWG.DeviceUtils.isMobile();
		module.isAndroid = PWG.DeviceUtils.isAndroid();
		module.gui = config.gui;
		module.soundFX = config.soundFX || false;

		PWG.Personalities.init();
		
		PWG.User.init(module.onGameDataLoaded, module.name);
		
		if(config.adSystem) {
			var adController = PWG.AdManager.create(config.adSystem.type, config.adSystem.config);
			if(adController) {
				_listeners.push({ fn: adController.callback, ctx: adController });
			}
		}
	};
	
	module.onGameDataLoaded = function() {
		module.gui.init();
		PWG.Tournaments.init(PWG.User.getData().tournaments);
	};

	module.startGame = function(id) {
		_trigger({ type: PWG.GameEvents.GAME_STARTED, id: id });
		if(module.isTutorialActive) {
			module.tutorial = new PWG.Tutorial();
		}
		PWG.Games.start(id);
	};
	
	module.startTurn = function(id, isAITurn) {
		_trigger({ type: PWG.GameEvents.TURN_STARTED, userTurn: !isAITurn });
	};
	
	module.pause = function(id) {
		PWG.Players.pause(id);
	};

	module.resume = function(id) {
		PWG.Players.resume(id);
	};
	
	module.getIsFirstPlay = function() {
		return PWG.User.get('isFirstPlay');
	};
	
	module.setIsFirstPlay = function(isFirstPlay) {
		PWG.User.set('isFirstPlay', isFirstPlay);
	};
	
	module.getData = function(key) {
		return PWG.User.get(key);
	};
	
	module.saveData = function(key, value) {
		PWG.User.set(key, value);
	};
	
	module.savePlayerData = function(id) {
		var playerDetails = PWG.Players.getAllPlayerStats(id);
		// trace('App/savePlayerData, playerDetails = ', playerDetails);
		PWG.User.set('players', playerDetails);
	};
	
	module.quit = function() {
		if(PWG.Games.isGUIGameActive) {
			if(module.isTutorialActive) {
				module.confirmQuit(true);
			} else {
				module.gui.confirmQuit(module.confirmQuit);
			}
		} else {
			module.confirmQuit(true);
		}
	};
	
	module.confirmQuit = function(confirmQuit) {
		if(confirmQuit) {
			if(module.tutorial) {
				module.tutorial = null;
			}
			module.isTutorialActive = false;
			module.gui.quit(module.createGame);
		}
	};
	
	function _trigger(params) {
		if(_listeners.length > 0) {
			PWG.Utils.each(
				_listeners,
				function(listener) {
					listener.fn.call(listener.ctx, params);
				},
				module
			);
		}
	}
	
	return module;
}();

