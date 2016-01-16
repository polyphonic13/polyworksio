(function(){(typeof console === 'undefined' || typeof console.log === 'undefined')?console={log:function(){}}:console.log('----- farkle created: 2014-08-10T12:51:30')})();

/*! polyworksjs v0.1.0 2014-08-05T09:09:15 */
var PWG = {};

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


PWG.Stage = function() {
	var _aspectRatio = [16, 9];
	var _maxHeight = 800;
	var _offsetX = 0;
	var _offsetY = 0;
	
	var _windowListeners = false;
	var _center;
	var _callback;
	var _context; 
	
	var module = {
		initialized: false,
		winW: 0,
		winH: 0,
		gameW: 0,
		gameH: 0,
		gameX: 0,
		gameY: 0,
		unit: 0,

		init: function(aspectRatio, maxHeight, offsetX, offsetY, resizable, callback, context) {
		
			if(typeof(aspectRatio) !== 'undefined') {
				_aspectRatio = aspectRatio;
			}
			if(typeof(maxHeight) !== 'undefined') {
				_maxHeight = _maxHeight;
			}
			
			if(typeof(offsetX) !== 'undefined') {
				_offsetX = offsetX;
			}
			
			if(typeof(offsetY) !== 'undefined') {
				_offsetY = offsetY;
			}
			
			_callback = callback;
			_context = context || window;

			_calculateSizes();

			if(resizable) {
				window.addEventListener('resize', function(event) {
					_onSizeChange(event);
					// _calculateSizes();
				});
				window.addEventListener('orientationchagne', function(event) {
					_onSizeChange(event);
					// _calculateSizes();
				});
			}

			if(_callback) {
				_callback.call(_context);
			}
			
			this.initialized = true;
		},

		sizeGame: function(width) {
			PWG.Game.phaser.scale.maxWidth = width;
			PWG.Game.phaser.scale.maxHeight = (width/_aspectRatio[0]) * _aspectRatio[1];
			// trace('Stage/sizeGame, max w/h = ' + PWG.Game.phaser.scale.maxWidth + '/' + PWG.Game.phaser.scale.maxHeight);
			PWG.Game.phaser.scale.setSize();
		},
		
		zoomByWidth: function(baseWidth, el) {
			var zoom = baseWidth/el.offsetWidth;
			
			el.style.zoom = zoom;
		},
		
		zoomByHeight: function(baseHeight, el) {
			var zoom = baseHeight/el.offsetHeight;
			
			el.style.zoom = zoom;
		},
		
		destroy: function() {
			if(_windowListeners) {
				window.removeEventListener('resize', function(event) {
					_onSizeChange(event);
				});
				window.removeEventListener('orientationchagne', function(event) {
					_onSizeChange(event);
				});
			}
		}
	};
	
	function _calculateSizes() {
		module.winW = document.documentElement.clientWidth;
		module.winH = document.documentElement.clientHeight;

		module.gameH = (module.winH > _maxHeight) ? _maxHeight : module.winH;
		module.gameW = ((module.winH/_aspectRatio[1]) * _aspectRatio[0]);
		
		if(module.gameW > module.winW) {
			module.gameW = module.winW;
			module.gameH = (module.gameW/_aspectRatio[0]) * _aspectRatio[1];
		}

		module.gameW -= _offsetX;
		module.gameH -= _offsetY;

		module.unit = module.gameH/_aspectRatio[1];
		module.gameX = (module.winW/2) - (module.gameW/2);
		module.gameY = (module.winH/2) - (module.gameH/2);

		module.gameX += _offsetX;
		module.gameY += _offsetY;
		
		// trace('\nwinW = ' + module.winW + ', winH = ' + module.winH + '\ngameW = ' + module.gameW + ', gameH = ' + module.gameH + '\nunit = ' + module.unit + '\ngameX = ' + module.gameX + ', gameY = ' + module.gameY);

		var loadingWidth = module.winW - 80;
		var loadingHeight = module.winH - 80;

		var loadingDiv = document.getElementById('loading');
		var containerDiv = document.getElementById('game_container');

		if(loadingDiv) _sizeAndPositionDiv(loadingDiv, loadingWidth, loadingHeight, 0, 0);
		if(containerDiv) _sizeAndPositionDiv(containerDiv, module.gameW, module.gameH, module.gameX, module.gameY);

	}


	function _sizeAndPositionDiv(div, width, height, left, top) {
		// trace('Stage/_sizeAndPositionDiv, div = ', div, '\twidth = ' + width + ', height = ' + height + '\n\tleft = ' + left + ', top = ' + top);
		div.style.width = width + 'px';
		div.style.height = height + 'px';
		div.style.left = left + 'px';
		div.style.top = top + 'px';
		div.style.display = 'block';
	}

	function _onSizeChange(event) {
		var containerDiv = document.getElementById('game_container');
		var left = (module.winW/2) - (module.gameW/2);
		var top = (module.winH/2) - (module.gameH/2);
		containerDiv.style.left = left + 'px';
		containerDiv.style.top = top + 'px';
	}

	return module;
}();


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


PWG.Utils = function() {
	var module = {};

	module.each = function(list, callback, context) {
		if(Array.isArray(list)) {
			var length = list.length;
			for(var i = 0; i < length; i++) {
				callback.call(context, list[i], i, list);
			}
		} else {
			for(var key in list) {
				callback.call(context, list[key], key, list);
			}
		}
	};
	
	module.clone = function(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = PWG.Utils.clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = PWG.Utils.clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");	
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
			var length = list.length;
			for (i = 0; i < length; i++) {
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
				for (var matchNum in patternMatch) {
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

	module.diceRoll = function(sides) {
		var s = sides || 6;
		return Math.floor(Math.random() * s) + 1;
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
	
	return module;
}();


PWG.Initializer = function(){
	
	var standardMethods = {
		hide: function() {
			this.view.visible = false;
		},
		show: function() {
			this.view.visible = true;
		},
		destroy: function() {
			this.view.destroy(true);
		}
	};
	
	var module = {};
	
	module.setViewAttributes = function(attrs, view) {
		if(attrs) {
			PWG.Utils.each(
				attrs,
				function(attr, key) {
					view[key] = attr;
				},
				this
			);
		}
	};
	
	module.addStandardMethods = function(controller) {
		PWG.Utils.each(
			standardMethods,
			function(method, key) {
				controller.prototype[key] = method;
			},
			this
		);
	};
	
	return module;
}();

PWG.GridGenerator = function() {
	var module = {};
	
	module.createSquare = function(cells, dimension) {
		return module.createRectangle(cells, cells, dimension, dimension);
	};
	
	module.createRectangle = function(xLength, yLength, xDimension, yDimension) {
		// trace('--------------- createRectangle\n\txLength = ' + xLength + '\n\tyLength = ' + yLength + '\n\txDimension = ' + xDimension + '\n\tyDimension = ' + yDimension);
		var grid = [];
		var cell;

		for(var y = 0; y < yLength; y++) {
			for(var x = 0; x < xLength; x++) {
				cell = {
					start:{
						x: (x * xDimension),
						y: (y * yDimension)
					},
					center: {
						x: ((x + 1) * xDimension) - (xDimension/2),
						y: ((y + 1) * yDimension) - (yDimension/2)
					},
					end: {
						x: ((x + 1) * xDimension),
						y: ((y + 1) * yDimension)
					}
				};
				grid.push(cell);
			}
		}
		// trace('grid generator returning: ', grid);
		return grid;
	};
	
	return module;
}();

var alphabet = {
	UPPER: [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	],
	LOWER: [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	]
};

PWG.InputCodes = {
	PLAY: 1,
	LEVEL: 76,		// l
	NEXT: 78,		// n
	PAUSE: 80,		// p
	MENU: 77,		// m
	RETRY: 82,		// r
 	RESET: 99, 		// invisible button
	LEFT: 37, 		// left arrow
	RIGHT: 39, 		// right arrow
	UP: 38,			// up arrow
	DOWN: 40,		// down arrow
	SPACE: 32,		// space bar
	QUIT: 81,		// q
	START: 83,		// s
	CLEAR_DATA: 67	// c
}


PWG.Events = {
	ZOOM_IN: 'zoomIn',
	ZOOM_OUT: 'zoomOut',
	QUIT: 'quit'
};

PWG.EventCenter = function() {

	var module = {};
	var _listeners = {}; 
	
	module.bind = function(type, callback, context) {
		var ctx = context || this;
		// trace('EventCenter/bind, type = ' + type);
		// trace(callback);
		if(!_listeners[type]) {
			_listeners[type] = [];
		}
		_listeners[type].push({ callback: callback, context: ctx });
		// trace('_listeners['+type+'] now = ');
		// trace(_listeners[type]);
	};
	
	module.batchBind = function(listeners, context) {
		PWG.Utils.each(
			listeners,
			function(listener) {
				PWG.EventCenter.bind(listener.event, listener.handler, context);
			},
			context
		);
	};
	
	module.trigger = function(params) {
		var list = _listeners[params.type];
		// trace('----- EventCenter/trigger, type = ' + params.type + ', list = ', list);
		if(list) {
			PWG.Utils.each(list,
				function(listener) {
					// trace('\t\tl = ', l);
					if(listener && listener.callback) { // in case callback is destroyed during course of trigger
						listener.callback.call(listener.context, params);
					}
				},
				this
			);
		}
	};
	
	module.unbind = function(type, callback) {
		var listeners = _listeners[type];
		if(listeners) {
			PWG.Utils.each(listeners,
				function(listener, idx) {
					if(listener && listener.callback === callback) {
						listeners.splice(idx, 1);
					}
				},
				this
			);
		}
	};

	module.batchUnbind = function(listeners, context) {
		PWG.Utils.each(
			listeners,
			function(listener) {
				PWG.EventCenter.unbind(listener.event, listener.handler, context);
			},
			context
		);
	};
	
	module.destroy = function() {
		// iterate thru _listeners object
		// for each type, remove all array elements
		// then delete type from _listeners
		PWG.Utils.each(_listeners,
			function(listener, key) {
				listener = [];
				delete _listeners[key];
			},
			this
		);
		// set entire _listeners array to []
		_listeners = [];
	};
	
	return module;
}();

var ViewTypes = {
	SPRITE: 'sprite',
	TEXT: 'text',
	BUTTON: 'button',
	GROUP: 'group'
};

var TilemapTypes = {
	BLANK: 'blank',
	JSON: 'json',
	DATA: 'data'
}

PWG.PhaserScale = function() {
	var module = {};
	
	module.init = function(config) {
		// trace('PhaserScale/init, config = ', config);
		var scaleManager = PWG.Game.phaser.scale;

		if(config.fullScreen) {
			scaleManager.startFullScreen();
		}
		scaleManager.scaleMode = config.scaleMode;
		scaleManager.setShowAll();
		this.scaleManager = scaleManager;
		this.refresh();
	};
	
	module.refresh = function() {
		this.scaleManager.refresh();
	};
	
	return module;
}();

PWG.PhaserPositioner = function() {
	var module = {};
	
	module.set = function(params, view) {
		// trace('PhaserPositioner/set, params = ', params);
		if(params.centerX) {
			view.x = PWG.Stage.gameW/2 - view.width/2;
		} else if(params.centerToParentX) {
			view.x = (view.parent.width/2 - view.width/2) + view.parent.x;
		} else if(params.x) {
			view.x = x;
		}
		if(params.centerY) {
			view.y = PWG.Stage.gameH/2 - view.height/2;
		} else if(params.centerToParentY) {
			view.y = (view.parent.height/2 - view.height/2) + view.parent.y;
		} else if(params.y) {
			view.y = y;
		}
	};
	
	return module; 
}();

PWG.PhaserAnimation = function() {
	
	var module = {};

	function AnimationController(config, controller) {
		// trace('AnimationController\n\tconfig = ', config, '\tcontroller = ', controller)
		this.config = config;
		this.controller = controller;
		this.name = controller.name;

		this.animations = config.animations;

		PWG.Utils.each(
			this.animations,
			function(animation, key) {
				// trace('\tnow adding animation: ' + key, animation);
				controller.view.animations.add(key, animation.keyFrames, animation.frameRate);
			},
			this
		);

		// trace('\tanimations now = ', controller.view.animations);

		if(config.defaultAnimation) {
			var animation = this.animations[config.defaultAnimation];
			this.play(config.defaultAnimation);
		} else {
			controller.view.frame = 0;
		}
		this.currentAnimation = config.defaultAnimation || '';
	}

	AnimationController.prototype.play = function(name, killOnComplete) {
		// trace('AnimationController/play, name = ' + name);
		if(name !== this.currentAnimation) {
			var kill = killOnComplete || false;
			var animation = this.animations[name];
			// trace('\tgoing to call play on it');
			this.controller.view.animations.play(name, animation.frameRate, animation.looped, kill);
			this.currentAnimation = name;
		}
	};

	AnimationController.prototype.gotoFrame = function(frame) {
		this.controller.view.frame = frame;
	};

	AnimationController.prototype.stop = function() {
		this.controller.view.animations.stop();
		this.currentAnimation = '';
	};

	module.AnimationController = AnimationController;

	module.controllers = {};

	module.addAnimations = function(config, viewController) {
		var controller = new AnimationController(config, viewController); 
		module.controllers[controller.name] = controller;
	};

	module.play = function(view, animation, killOnComplete) {
		if(module.controllers.hasOwnProperty(view)) {
			module.controllers[view].play(animation, killOnComplete);
		}
	};

	module.gotoFrame = function(view, frame) {
		if(module.controllers.hasOwnProperty(view)) {
			module.controllers[view].gotoFrame(frame);
		}
	};

	module.stop = function(view) {
		if(module.controllers.hasOwnProperty(view)) {
			module.controllers[view].stop();
		}
	};

	return module;
}();

PWG.PhaserPhysics = function() {
	var module = {};

	module.controllers = [];
	
	function PhysicsController(config, controller) {
		this.config = config;
		this.controller = controller;
		this.name = controller.name;

		var physics = config.physics;

	 	PWG.Utils.each(
			config.physics,
			function(attr, key) {
				controller.view.body[key] = attr;
			},
			this
		);

		// if(!physics.deferredGravity && !physics.immovable) {
		// 	if(!physics.gravity) {
		// 		controller.view.body.gravity = PWG.Game.get('gravity');
		// 	}
		// }
		module.controllers.push(this);
	}
	
	PhysicsController.prototype.checkCollision = function(target) {
		module.physics.collide(this.controller.view, target);
	};
	
	PhysicsController.prototype.checkOverlap = function(target, callback, context) {
		var ctx = context || this.controller.view;
		module.physics.overlap(
			this.controller.view, 
			target, 
			function(view, target) {
				callback.call(ctx, view, target);
			},
			null,
			this.controller.view
		);
	};
	
	PhysicsController.prototype.deactivateGravity = function() {
		var view = this.controller.view;
		view.exists = false;
		view.allowGravity = false;
		view.body.gravity = 0;
	};
	
	PhysicsController.prototype.activateGravity = function() {
		var view = this.controller.view;
		if(this.config.deferredGravity) {
			var gravity = (this.config.physics.gravity) ? this.config.physics.gravity : PWG.Game.get('gravity');
			view.body.gravity = gravity;
		}
		view.allowGravity = true;
		view.exists = true;
	};
	
	module.PhysicsController = PhysicsController; 
	
	module.init = function() {
		module.physics = PWG.Game.phaser.physics; 
	};
	
	module.checkAllCollisions = function(targets) {
		PWG.Utils.each(
			module.controllers,
			function(controller) {
				module.checkCollisions(controller, targets);
			},
			this
		);
	};
	
	module.checkCollisions = function(controller, targets) {
		module.checkPhysics('checkCollision', controller, targets, null, null);
	};
	
	module.checkAllOverlaps = function(targets, callback, context) {
		PWG.Utils.each(
			module.controllers,
			function(controller) {
				module.checkOverlaps(controller, targets, callback, context);
			},
			this
		);
	};
	
	module.checkOverlaps = function(controller, targets) {
		module.checkPhysics('checkOverlap', controller, callback, context);
	};
	
	module.checkPhysics = function(method, controller, callback, context) {
		context = context || controller;
		if(targets instanceof Array) {
			PWG.Utils.each(
				targets,
				function(target) {
					controller[method].call(context, target, callback, context);
				},
				this
			);
		} else {
			controller[method].call(context, target, callback, context);
		}
	};
	
	return module;
}();

PWG.ViewManager = function() {
	
	var module = {};
	
	function ViewController(config, name) {
		// trace('ViewController['+config.name+']/constructor, type = ' + config.type + ', name = ' + name);
		this.name = name;
		this.config = config;

		switch(config.type) {
			case ViewTypes.SPRITE:
			this.view = PWG.Game.phaser.add.sprite(config.x, config.y, config.img);
			break;

			case ViewTypes.TEXT:
			this.view = PWG.Game.phaser.add.text(config.x, config.y, config.text, config.style);
			break;

			case ViewTypes.BUTTON:
			this.view = PWG.Game.phaser.add.button(config.x, config.y, config.img, config.callback, config.context, config.frames[0], config.frames[0], config.frames[1], config.frames[0]);
			break;

			case ViewTypes.GROUP: 
			this.view = PWG.Game.phaser.add.group();
			break; 

			default: 
			// trace('warning, unknown view type: ' + config.type);
			break;
		}

		this.set(config.attrs);

		if(config.position) {
			PWG.PhaserPositioner.set(config.position, this.view);
		}

		if(config.input) {
			this.inputController = new PWG.PhaserInput.InputController(config.input, this);
		}

		if(config.physics && this.view.body) {
			this.physicsController = new Polworks.PhaserPhysics.PhysicsController(config.physics, this);
		}

		if(config.animation) {
			PWG.PhaserAnimation.addAnimations(config.animation, this);
		}

		this.view.name = this.name = config.name;
	};
	
	ViewController.prototype.update = function() {
		if(this.view.update) {
			this.view.update();
		}
	};
	
	ViewController.prototype.set = function(params) {
		// trace('ViewController/set, view = ', this.view);
		PWG.Utils.each(
			params,
			function(param, key) {
				// trace('\tparam['+key+'] = ' + param);
				this.view[key] = param;
			},
			this
		);
	};
	
	ViewController.prototype.callMethod = function(method, args) {
		// trace('ViewController['+this.name+']/callMethod, method = ' + method + '\n\targs = ' + args);
		if(this.view[method]) {
			// trace('\tview has method, ', this.view);
			this.view[method](args);
		}
		if(method === 'setText' && this.config.position) {
			PWG.PhaserPositioner.set(this.config.position, this.view);
		}	
	};
	
	ViewController.prototype.hide = function() {
		// trace('ViewController, hide, this = ', this);
		if(this.children) {
			PWG.Utils.each(
				this.children,
				function(child) {
					// trace('\thiding child: ', child);
					child.hide();
				},
			this
			);
		}
		this.view.visible = false;
	};
	
	ViewController.prototype.show = function() {
		if(this.children) {
			PWG.Utils.each(
				this.children,
				function(child) {
					// trace('\tshowing child: ', child);
					child.show();
				},
			this
			);
		}		this.view.visible = true;
	};
	
	// groups only
	ViewController.prototype.removeChild = function(id) {
		if(this.config.type === ViewTypes.GROUP) {
			if(this.children[id]) {
				// remove phaser view from group
				this.view.remove(this.children[id].view);
				// remove controller from group controller's children
				delete this.children[id];
			}
		}
	};

	// groups only
	ViewController.prototype.removeAll = function() {
		if(this.type === ViewTypes.GROUP) {
			PWG.Utils.each(
				this.children,
				function(child) {
					this.view.remove(id);
					delete this.children[id];
				},
				this
			);
		}
	};
	
	ViewController.prototype.destroy = function() {
		if(this.view.destroy) {
			this.view.destroy();
		}
	};
	
	module.ViewController = ViewController;
	
	module.currentGroup = '';
	module.collection = {};
	
	module.init = function(views) {
		this.collection = this.build(views);
		// trace('ViewManager/init, collection = ', this.collection);
	};
	
	module.build = function(views, collection) {
		// trace('ViewManager/factory, views = ', views);
		var collection = collection || {};

		PWG.Utils.each(views,
			function(view, key) {
				// trace('\tview.type = ' + view.type);
				var child = new PWG.ViewManager.ViewController(view, key);
				if(view.type === ViewTypes.GROUP) {
					child.children = PWG.ViewManager.build(view.views);
					PWG.ViewManager.initGroup(child);
				}
				collection[view.name] = child;
			},
			this
		);
		// trace('ViewManager, end build, collection = ', collection);
		return collection;
	};
	
	module.initGroup = function(controller) {
		// trace('ViewManager/initGroup, controller = ', controller);
		PWG.Utils.each(
			controller.children,
			function(child) {
				// trace('\tchild = ', child);
				controller.view.add(child.view);
				child.group = controller;
			},
			this
		);

	};

	module.showGroup = function(name) {
		// trace('ViewManager/showGroup, name = ' + name + ', collection = ', this.collection);
		this.collection[name].show();
		this.currentGroup = name;
	};
	
	module.hideGroup = function(name) {
		this.collection[name].hide();
		this.currentGroup = '';
	};
	
	module.switchGroup = function(name) {
		if(name !== this.currentGroup) {
			if(this.currentGroup !== '') {
				this.hideGroup(this.currentGroup);
			}
			this.showGroup(name);
			this.currentGroup = name;
		}
	};
	
	module.hideAllGroups = function() {
		PWG.Utils.each(
			this.collection,
			function(child) {
				child.hide();
			},
			this
		);
	};
	
	module.addToGroup = function(children, group) {
		// trace('ViewManager/addToGroup, group = ', group, '\tchildren = ', children);
		PWG.Utils.each(
			children,
			function(child, key) {
				group.add(child.view);
				// group.children[key] = child;
			},
			this
		);
	};
	
	module.removeFromGroup = function(children, controller) {
		PWG.Utils.each(
			children,
			function(child, key) {
				controller.view.remove(child.view, true);
				delete controller.children[key];
			},
			this
		);
	};
	
	module.removeGroupChildren = function(path) {
		var controller = module.getControllerFromPath(path);
		// trace('view manager removeGroupChild, group = ', controller);
		module.removeFromGroup(controller.children, controller);
	};
	
	module.addViews = function(views, parent, addToGroup) {
		// trace('ViewManager/addViews, views = ', views);
		PWG.Utils.each(
			views,
			function(view) {
				module.addView(view, parent, addToGroup);
			},
			this
		);
	};
	
	module.addView = function(view, parent, addToGroup) {
		// trace('ViewManager/addView, view.type = ' + view.type + ', view = ', view);
		var collection = (parent) ? parent.children : this.collection;

		var child = new PWG.ViewManager.ViewController(view, view.name);
		if(view.type === ViewTypes.GROUP) {
			child.children = PWG.ViewManager.build(view.views);
			PWG.ViewManager.initGroup(child);
		}
		collection[view.name] = child;

		// trace('POST ADD, collection = ', collection);
		if(addToGroup) {
			PWG.ViewManager.initGroup(parent);
			// parent.view.add(child.view);
			// the parent was passed and is a group type view controller
			// PWG.ViewManager.addToGroup(view, parent.view);
		}

		return child;
		
/*
		// trace('ViewManager/addView, view.type = ' + view.type + ', view = ', view);
		var collection;
		if(path) {
			collection = PWG.ViewManager.getControllerFromPath(path).children;
		} else {
			collection = this.collection;
		}

		var child = new PWG.ViewManager.ViewController(view, view.name);
		if(view.type === ViewTypes.GROUP) {
			child.children = PWG.ViewManager.build(view.views);
			PWG.ViewManager.initGroup(child);
		}
		collection[view.name] = child;

		// trace('POST ADD, collection = ', collection);
		if(addToGroup) {
			PWG.ViewManager.initGroup(collection);
		}
		
		return child;
*/
	};
	
	module.removeView = function(name, path) {
		var collection = PWG.ViewManager.getControllerFromPath(path);
		// trace('PhaserVeiw/removeView, name = ' + name + ', collection = ', collection);
		if(collection.children.hasOwnProperty(name)) {
			collection.children[name].view.destroy();
			delete collection.children[name];
		}
	};
	
	module.showView = function(path) {
		var controller = this.getControllerFromPath(path);
		// trace('show view, controller is: ', controller);
		controller.show();
	};
	
	module.hideView = function(path) {
		// trace('hideView: ' + path);
		var controller = this.getControllerFromPath(path);
		// trace('\thiding: ', controller);
		controller.hide();
	};
	
	module.callMethod = function(path, method, args) {
		// trace('ViewManager/callViewMethod\n\tpath: ' + path + '\n\tmethod: ' + method + '\n\targs: ' + args);
		var controller = this.getControllerFromPath(path);
		// trace('calling method ' + method + 'with args: ', args, ' on ', controller);
		controller.callMethod(method, args);
	};

	module.swapDepths = function(path, child1, child2) {
		var parent = this.getControllerFromPath(path);
		// trace('parent = ' + parent);
	};
	
	module.setChildFrames = function(path, frame) {
		var parent = this.getControllerFromPath(path);
		PWG.Utils.each(
			parent.children,
			function(child) {
				child.view.frame = frame;
			},
			this
		);
	};
	
	module.setFrame = function(path, frame) {
		// trace('ViewManager/setFrame, path = ' + path + ', frame = ' + frame);
		var controller = this.getControllerFromPath(path);
		controller.view.frame = frame;
	};
	
	module.getControllerFromPath = function(path) {
		// trace('ViewManager/getControllerFromPath, path = ' + path + ', collection = ', this.collection);
		var chain = path.split(':');
		var length = chain.length;
		var controller = this.collection[chain[0]];
		// trace('\tcontroller = ', controller);
		for(var i = 1; i < length; i++) {
			// trace('\tchain['+i+'] = ' + chain[i] + ', controller now = ', controller);
			controller = controller.children[chain[i]];
		}
		return controller;
	};
	
	module.update = function(controllers) {
		PWG.Utils.each(
			controllers,
			function(controller) {
				controller.update();
			},
			this
		);
	};

	return module;
}();



PWG.TilemapManager = function() {
	var module = {};

	function TilemapController(config) {
		trace('TilemapController/constructor, config = ', config);
		this.config = config;
		this.layers = {};
		this.map = null;
		
		this.map = PWG.Game.phaser.add.tilemap(config.json);
		
		PWG.Utils.each(
			config.tilesets,
			function(tileset) {
				trace('\tadding tileset image: ' + tileset);
				this.map.addTilesetImage(tileset);
			},
			this
		);
		
		// this.map.addTilesetImage('caveForeground01', 'caveForeground01');
		// this.map.addTilesetImage('caveBackground02', 'caveBackground02');

		PWG.Utils.each(
			config.layers,
			function(layer, key) {
				trace('\tadding layer['+key+']: ', layer);
				this.layers[key] = this.map.createLayer(key);
				if(layer.attrs) {
					PWG.Utils.extend(this.layers[key], layer.attrs);
				}
			},
			this
		);
		// this.background = this.map.createLayer('background');
		// this.background.scrollFactorX = 0.33;
		// this.foreground = this.map.createLayer('foreground');
		// this.foreground.scrollFactorX = 0.66;

		// if(config.attrs) {
		// 	PWG.Utils.extend(this.map, config.attrs);
		// }
		// 
		// if(this.map !== null) {
		// 	if(this.config.image) {
		// 		this.addImage(this.config.image);
		// 	}
		// 	if(this.config.layers) {
		// 		this.addLayers(this.config.layers);
		// 	}
		// }
		// 
		// if(config.type === TilemapTypes.DATA && config.data) {
		// 	this.addTiles(config.data.getTiles());
		// }
	}
	
	TilemapController.prototype.addImage = function(image) {
		if(this.config.type === TilemapTypes.DATA) {
			trace('\tadding image: ' + image);
			this.map.addTilesetImage(image);
		} else if(this.config.type === TilemapTypes.JSON) {
			trace('\tadding image: ' + image.jsonName + '/' + image.reference);
			this.map.addTilesetImage(image.jsonName, image.reference);
		}
	};
	
	TilemapController.prototype.addLayers = function(layers) {	

		PWG.Utils.each(
			layers,
			function(lyr, key) {
				trace('\tadding layer['+key+']: ', lyr);
				if(this.config.type === TilemapTypes.DATA) {
					this.layers[key] = this.map.createBlankLayer(key, lyr.width, lyr.height, lyr.tileW, lyr.tileH, lyr.group);

					if(lyr.tiles) {
						this.addTiles(lyr.data.getTileConfig(key), layer);
					}
					
				} else if(this.config.type === TilemapTypes.JSON) {
					this.layers[key] = this.map.createLayer(key);
				}

				if(lyr.attrs) {
					trace('ADDING ATTRIBUTES TO LAYER: ' + key + ': ', lyr.attrs);
					PWG.Utils.extend(this.layers[key], lyr.attrs);
				}

				if(lyr.resizeWorld) {
					this.layers[key].resizeWorld();
				}

				// this.layers[key].scrollFactorX = lyr.scrollFactorX;
				// this.layers[key].scrollFactorY = lyr.scrollFactorY;

			},
			this
		);
	};

	TilemapController.prototype.addTiles = function(tiles, layer) {
		PWG.Utils.each(
			tiles,
			function(tile) {
				this.map.putTile(tile.imgIndex, tile.xCell, this.yCell, layer);
			},
			this
		);
	};
	
	module.TilemapController = TilemapController; 
	
	module.build = function(maps) {
		trace('TilemapManager/build, map = ', maps);
		var tilemaps = [];
		
		PWG.Utils.each(
			maps,
			function(map) {
				tilemaps.push(new TilemapController(map));
			},
			this
		);

		return tilemaps;

	};

	return module;
}();



PWG.StateManager = function() {

	var module = {};
	
	function StateController(name, state) {
		trace('StateController['+name+']/constructor, state = ', state);
		this.name = name;
		PWG.Utils.extend(this, state)
		this.preloaded = false;
		
		PWG.Game.phaser.state.add(this.name, this, false);
	};
	
	StateController.prototype.start = function() {
		trace('StateController['+this.name+']/start');
		if(this.methods.start) {
			this.methods.start.call(this);
		}
	};

	StateController.prototype.preload = function() {
		trace('StateController['+this.name+']/preload, preloaded = ' + this.preloaded + '\n\tthis = ', this);
		if(!this.preloaded) {
			PWG.PhaserLoader.load(this.config.assets);
			this.preloaded = true;
		}
	};
	
	StateController.prototype.create = function() {
		trace('StateController['+this.name+']/create, this.config = ', this.config);
		var world = this.config.world;
		trace('setting world bounds to: x/y = ' + world.x + '/' + world.y + ', w/h = ' + world.width + '/' + world.height);
		PWG.Game.phaser.world.setBounds(world.x, world.y, world.width, world.height);

		if(this.config.views.background) {
			this.views = PWG.ViewManager.build(this.config.views.background);
		}
		
		if(this.config.tilemaps) {
			this.tilemaps = PWG.TilemapManager.build(this.config.tilemaps);
		}
		
		if(this.config.views.foreground) {
			this.views = PWG.ViewManager.build(this.config.views.foreground);
		}

		trace('post method add, this = ', this);
		if(this.listeners) {
			PWG.EventCenter.batchBind(this.listeners, this);
		}

		if(this.methods.create) {
			this.methods.create.call(this);
		}

	};
	
	StateController.prototype.update = function() {
		if(this.methods.update) {
			this.methods.update.call(this);
		}
		if(this.inputs) {
			PWG.Utils.each(
				this.inputs,
				function(input) {
					if(input.update) {
						input.update();
					}
				},
				this
			);
		}

		if(this.tilesMaps) {
			PWG.PhaserTilemap.update(this.tilemaps);
		}
		PWG.PhaserInput.updateKeyboard();
	};
	
	StateController.prototype.getView = function(id) {
		trace('StateController['+this.name+']/getView, id = ' + id);
		if(!this.views.hasOwnProperty(id)) {
			return;
		}
		return this.views[id];
	};
	
	StateController.prototype.shutdown = function() {
		trace('StateController['+this.name+']/shutdown');
		if(this.methods.shutdown) {
			this.methods.shutdown.call(this);
		}

		PWG.Utils.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);

		if(this.listeners) {
			PWG.EventCenter.batchUnbind(this.listeners, this);
		}
	};

	module.StateController = StateController;
	
	module.init = function(config, listeners) {
		trace('StateManager/init, config = ', config);
		this.states = {};
		this.currentId = '';

		PWG.Utils.each(
			config,
			function(state, key) {
				// add config to state logic object
				state.config = PWG.Game.config.states[key];
				trace('\tadding state[' + key + '] = ', state);
				this.states[key] = new this.StateController(key, state);
			},
			this
		);
		trace('\tend of init, states = ', this.states);
		PWG.EventCenter.bind(PWG.Events.CHANGE_STATE, module.onChangeState, module);
	};
	
	module.onChangeState = function(event) {
		module.changeState(event.value);
	};
	
	module.changeState = function(id) {
		trace('StateManager/changeState, id = ' + id + ', currentId = ' + this.currentId + ', states = ', this.states);
		if(this.currentId !== id) {
			if(this.states.hasOwnProperty(id)) {
				this.currentId = id;
				PWG.Game.phaser.state.start(id, this.states[id].clearWorld, this.states[id].clearCache);
			}
		}
	};

	module.getCurrentStateGroup = function() {
		trace('StateManager/getCurrentStateGroup, currentId = ' + this.currentId + ', views = ', this.states[this.currentId].views);
		return this.states[this.currentId].views['state-group'].view;
	};
	
	module.getView = function(id) {
		trace('StateManager/getView, id = ' + id);
		return this.state[this.currentId].getView();
	};
	
	module.destroy = function() {
		PWG.EventCenter.unbind(PWG.Events.CHANGE_STATE, module.changeState, module);
		this.states[this.currentId].shutdown();
	};
	
	return module;
}();



PWG.PhaserInput = function() {
	var module = {};
	var _controllers = {};
	
	function InputController(config, controller) {
		// trace('InputController/constructor, config = ', config, '\tcontroller = ', controller);
		this.config = config;
		this.controller = controller;
		this.name = controller.view.name;

		var view = controller.view;

		view.inputEnabled = true;

		PWG.Utils.each(
			this.config.attrs,
			function(attr, key) {
				view.input[key] = attr;
			},
			this
		);

		if(this.config.enableDrag) view.input.enableDrag(this.config.enableDrag);
		if(this.config.inputDown) view.events.onInputDown.add(this.inputDown, this);
		if(this.config.inputUp) view.events.onInputUp.add(this.inputUp, this);
		if(this.config.onDragStop) view.events.onDragStop.add(this.onDragStop, this);

		this.input = view.input;
	}
	
	InputController.prototype.enableDrag = function() {
		this.input.enableDrag();
	};
	
	InputController.prototype.enableSnap = function(args) {
		this.input.enableSnap(args);
		//	http://docs.phaser.io/Phaser.InputHandler.html#enableSnap
	};
	
	InputController.prototype.inputDown = function(event) {
		// trace('InputController['+this.name+']/inputDown, event = ', event, '\tconfig = ', this.config);
		if(this.config.inputDown) {
			this.config.inputDown.call(this);
		}
	};
	
	InputController.prototype.inputUp = function(event) {
		// trace('InputController['+this.name+']/inputUp, event = ', event, '\tconfig = ', this.config);
		if(this.config.inputUp) {
			this.config.inputUp.call(this);
		}
	};
	
	InputController.prototype.onDragStop = function(event) {
		// trace('InputController['+this.name+']/onDragStop, event = ', event, '\tconfig = ', this.config);
		if(this.config.onDragStop) {
			this.config.onDragStop.call(this);
		}
	};
	
	InputController.prototype.drag = function(event) {
		
	};
	
	function CameraDragger(config) {
		this.name = config.name;
		this.config = config;
		this.camera = null;
	};
	
	CameraDragger.prototype.update = function() {
	    this.dragCamera(PWG.Game.phaser.input.mousePointer);
	    this.dragCamera(PWG.Game.phaser.input.pointer1);
	};
	
	CameraDragger.prototype.dragCamera = function(pointer) {
	    if (!pointer.timeDown) { return; }
	    if (pointer.isDown && !pointer.targetObject) {

	        if (this.camera) {
				// trace('pointer is down and there is a camera, going to move it');
	            PWG.Game.phaser.camera.x += this.camera.x - pointer.position.x;
	            PWG.Game.phaser.camera.y += this.camera.y - pointer.position.y;
	        }
	        this.camera = pointer.position.clone();
	    }
	    if (pointer.isUp) { this.camera = null; }
	};
	
	module.InputController = InputController; 
	module.CameraDragger = CameraDragger;

	module.initKeyboard = function(controls) {
		// trace('--------- PhaserInput/initKeyboard, controls = ', controls);
		module.keys = {};
		
		PWG.Utils.each(
			controls,
			function(control) {
				var key;
				var input = {};
				// trace('\tadding control: ', control);
				key = PWG.Game.phaser.input.keyboard.addKey(control.code);
				if(control.inputDown) {
					// trace('\t\tadding input down: ', control.inputDown);
					// key.onDown.add(control.inputDown);
					input.inputDown = control.inputDown;
				}
				if(control.inputUp) {
					// trace('\t\tadding input up: ', control.inputUp);
					// key.onUp.add(control.inputUp);
					input.inputUp = control.inputUp;
				}
				module.keys[control.code] = {
					key: key,
					input: input
				};
			},
			this
		);
		// return keys;
	};
	
	module.updateKeyboard = function(controls) {
		// trace('PhaserInput/updateKeyboard');
		PWG.Utils.each(
			module.keys,
			function(control, id) {
				// trace('control['+id+']');
				if(control.key.isDown && control.input.inputDown) {
					// trace('control['+id+']/isDown');
					control.input.inputDown();
				}
				if(control.key.isUp && control.input.inputUp) {
					control.input.inputDown();
				}
			},
			this
		);
	};
	return module;
}();

PWG.PhaserTime = function() {
	var _timers = {};
	module = {};
	
	module.add = function(timer, delay, callback, context) {
		var t = timer || PWG.Game.phaser.time.events;
		t.add(delay, callback, context);
	};

	module.repeat = function(timer, time, iterations, callback, context) {
		var t = timer || PWG.Game.phaser.time.events;
		t.repeat(time, iterations, callback, context);
	};
	
	module.loop = function(timer, interval, callback, context) {
		var t = timer || PWG.Game.phaser.time.events;
		t.loop(interval, callback, context);
	};
	
	module.getTimer = function(id) {
		return _timers[id];
	};
	
	module.removeTimer = function(id) {
		if(_timers.hasOwnProperty(id)) {
			_timers[id].destroy();
			PWG.Game.phaser.time.events.remove(_timers[id]);
			delete _timers[id];
		}
	};
	
	function Controller(id) {
		this.timer = PWG.Game.phaser.time.create(false);
		_timers[id] = this.timer;
	}
	
	Controller.prototype.start = function() {
		this.timer.start();
	};
	
	Controller.prototype.pause = function() {
		this.timer.pause();
	};
	
	Controller.prototype.resume = function() {
		this.timer.resume();
	};
	
	Controller.prototype.add = function(delay, callback, context) {
		module.add(this.timer, delay, callback, context);
	};
	
	Controller.prototype.loop = function(interval, callback, context) {
		module.loop(this.timer, interval, callback, context);
	};
	
	Controller.prototype.repeat = function(time, callback, context) {
		module.repeat(this.timer, time, callback, context);
	};

	module.Controller = Controller;
	
	return module;
}();

PWG.PhaserLoader = function() {
	var _config;
	var _phaser;
	
	var module = {};
	
	module.loaded = {
		images: {},
		sprites: {},
		tilemaps: {},
		audio: {}
	};

	module.init = function(config, phaser) {
		trace('PhaserLoader/init, config = ', config);
		_config = config;
		_phaser = phaser;
		
		_initAssets(config.images, 'images');
		_initAssets(config.sprites, 'sprites');
		_initAssets(config.tilemaps, 'tilemaps');
		_initAssets(config.audio, 'audio');
	}
	
	module.load = function(assets) {
		trace('PhaserLoader/load, assets = ', assets);
		
		// IMAGES
		if(assets.images) {
			// var images = _config.images;
			var images = PWG.Game.config.assets.images;
			trace('\timages = ', images);
			PWG.Utils.each(
				assets.images,
				function(key) {
					if(!this.loaded.images[key]) {
						trace('\t------- loading: image = ' + key + ', url = ' + images[key]);
						_phaser.load.image(key, images[key]);
						this.loaded.images[key] = true;
					}
				},
				this
			);
		}
		
		// SPRITES
		if(assets.sprites) {
			// var sprites = _config.sprites;
			var sprites = PWG.Game.config.assets.sprites;
			
			PWG.Utils.each(
				assets.sprites,
				function(key) {
					if(!this.loaded.sprites[key]) {
						trace('\tloading: sprite = ' + key + ', url = ' + sprites[key].url);
						var sprite = sprites[key];
						_phaser.load.spritesheet(key, sprite.url, sprite.width, sprite.height);
						this.loaded.sprites[key] = true;
					}
				},
				this
			);
		}

		// TILEMAPS
		if(assets.tilemaps) {
			var tilemaps = PWG.Game.config.assets.tilemaps;
			
			PWG.Utils.each(
				assets.tilemaps,
				function(key) {
					if(!this.loaded.tilemaps[key]) {
						trace('\tloading: tilemap = ' + key + ', url = ' + tilemaps[key].url);
						var tilemap = tilemaps[key];
						_phaser.load.tilemap(key, tilemap.url, null, tilemap.type); // Phaser.Tilemap.TILED_JSON = 1
					}
				},
				this
			);
		}
	}
	
	function _initAssets(assets, type) {
		trace('Loader/_initAssets, this = ', this);
		PWG.Utils.each(
			assets,
			function(asset, key) {
				module.loaded[type][key] = false;
			},
			this
		);		
	}
	
	return module;
}();

PWG.SocialPanel = function() {

	var _model = {};

	var module = {
		init: function(params) {
			// trace('SocialPanel/init, params = ', params);
			_model = PWG.Utils.extend(_model, params);
			_initViews();
			_addListeners();
		},

		show: function(params) {
			// trace('SocialPanel/show, params = ', params);
			var elements = params.value;
			_model.parentEl.style.display = 'block';
			PWG.Utils.each(elements,
				function(element) {
					if(_model.buttons.hasOwnProperty(element)) {
						_model.buttons[element].style.visibility = 'visible';
					}
				},
				this
			);
		},

		showAll: function() {
			_model.parentEl.style.display = 'block';
			for(var key in _model.buttons) {
				_model.buttons[key].style.visibility = 'visible';
			}
		},

		hideAll: function() {
			_model.parentEl.style.display = 'none';
			for(var key in _model.buttons) {
				_model.buttons[key].style.visibility = 'hidden';
			}
		},

		buttonClick: function(network) {
			// trace('SocialPanel/buttonClick, network = ' + network + '\n\tcurrentActionType = ' + _model.currentActionType);
			var networkActions = _model.socialActions[network];
			if(networkActions) {
				// trace('\tnetworkActions = ', networkActions);
				var socialAction = networkActions[_model.currentActionType];
				if(socialAction) {
					// trace('\tsocialAction = ', socialAction);
					var url;
					if(socialAction['params']) {
						url = socialAction['url'] + PWG.Utils.parseMarkup(socialAction['params'], _model, true);
					} else {
						url = socialAction['url'];
					}
					// trace('\turl = ' + url);
					if(url.indexOf('mailto') > -1) {
						if(PWG.DeviceUtils.isIphone() || PWG.DeviceUtils.isAndroid()) {
							window.location.href = url;
						} else {
							window.open(url, '_blank');
						}
					} else {
						window.open(url, '_blank');
					}
				}
			}
		},

		changeData: function(params) {
			_model[params.type] = params.value;
		},

		destroy: function() {
			_removeListeners();
			_destroyViews();
		}
	};

	function _initViews() {
		_initParentEl(); 
		_addButtons();
	}

	function _initParentEl() {
		_model.parentEl = document.getElementById(_model.parentId) || document.getElementsByTagName('body')[0];
		_model.grandParentEl = _model.parentEl.parentNode;
	}

	function _addButtons() {
		_model.buttons = {};

		var buttonStyle = _model.buttonStyle;

		var buttonClass = _model.buttonClass || 'socialButton';
		var button;
		var style; 
		var length = _model.networks.length; 

		PWG.Utils.each(_model.networks,
			function(network, idx) {
				style = _calculateButtonStyle(buttonStyle, idx, length);
				button = {
					pops: _model.parentEl,
					id: network,
					el: 'img',
					attrs: {
						src: _model.imagePath + network + '.png',
						onclick: 'PWG.SocialPanel.buttonClick("'+network+'");'
					},
					className: buttonClass,
					style: style
				};
				_model.buttons[network] = PWG.Utils.addElement(button);
			},
			this
		);
	}

	function _calculateButtonStyle(attrs, idx, length) {
		var winW = PWG.Stage.winW;
		var winH = PWG.Stage.winH;
		var horizontal = attrs.position.horizontal;
		var vertical = attrs.position.vertical;
		var spacer = attrs.spacer; 
		var offset = attrs.offset || 0;
		
		var style = {
			width: attrs.size.width + 'px',
			height: attrs.size.height + 'px'
		};

		if(horizontal === 'center') {
			var horizontalTotal;
			for(var i = 0; i < length; i++) {
				if(i > 0) {
					horizontalTotal += attrs.spacer;
				}
				horizontalTotal += attrs.size.width;
			}

			style.left = ((winW/2) - (horizontalTotal/2) + (idx * attrs.size.width)) + 'px';
		} else if(horizontal < 0) {
			style.right = -(horizontal) + 'px';
		} else {
			style.left = horizontal + 'px';
		}

		if(vertical === 'center') {
			var verticalTotal = 0;
			for(var i = 0; i < length; i++) {
				if(i > 0) {
					verticalTotal += attrs.spacer;
				}
				verticalTotal += attrs.size.height;
			}
			// trace('\tVERTICAL TOTal = ' + verticalTotal);
			var btnOffset = (idx * attrs.size.height) +  (idx * attrs.spacer) + offset;
			style.top = ((winH/2) - (verticalTotal/2) + (btnOffset)) + 'px';
		} else if(vertical < 0) {
			style.bottom = -(vertical) + 'px';
		} else {
			style.top = vertical + 'px';
		}
		// trace('RETURNING: ', style);
		return style;
	}
	
	function _destroyViews() {
		var buttons = _model.buttons;
		var button;
		for(var key in buttons) {
			button = buttons[key];
			button.parentNode.removeChild(button);
		}
		if(_model.parentEl) {
			_model.parentEl.parentNode.removeChild(_model.parentEl);
		}
	}

	function _addListeners() {
		PWG.Utils.each(_model.listeners,
			function(listener) {
				PWG.EventCenter.bind(listener.type, _eventHandler, this);
			},
			this
		);
	}

	function _removeListeners() {
		PWG.Utils.each(_model.listeners,
			function(listener) {
				PWG.EventCenter.unbind(listener.type, _eventHandler, this);
			},
			this
		);
	}

	function _eventHandler(event) {
		// trace('SocialPanel/_eventHandler event = ', event);
		var listener;
		PWG.Utils.each(_model.listeners,
			function(l) {
				if(l.type === event.type) {
					listener = l;
				}
			},
			this
		);
		var match = listener.match;
		if(match) {
			// trace('\tthere is a match');
			if(match.value === event.value) {
				// trace('\t\tvalue matches the event value');
				_executeActions(match.actions);
			} else if(listener.nonmatch) {
				// trace('\t\tnonmatch');
				_executeActions(listener.nonmatch.actions);
			}
		} else {
			_executeActions(listener.actions);
		}
	}
	
	function _executeActions(actions) {
		// trace('SocialPanel/_executeActions');
		PWG.Utils.each(actions,
			function(action) {
				// trace('\tcalling: ' + action.method + ', passing: ', action.data);
				PWG.SocialPanel[action.method](action.data);
			},
			this
		);
	}

	return module;
}();

PWG.Game = function() {
	var _inPlay = false;
	var _isQuit = false;
	var _gameConfig;
	var _gameLogic;
	
	var module = {};

	module.camera = null;
	
	module.init = function(gameConfig, gameLogic) {
		trace('PWG.Game/init, gameConfig = ', gameConfig, '\tgameLogic = ', gameLogic);
		_gameConfig = gameConfig;
		_gameLogic = gameLogic;
		module.stage = PWG.Stage;
		module.stage.init(gameConfig.aspectRatio, gameConfig.maxHeight, gameConfig.offsetX, gameConfig.offsetY, gameConfig.resizable, _onStageInitialized, module);
	};
	
	module.destroy = function() {
		// trace('PWG.Game/destroy, _inPlay = ' + _inPlay);
		if(_inPlay) {
			PWG.StateManager.destroy();
			module.phaser.destroy();
			_inPlay = false;
		}
	};
	
	module.addLoadingAnimation = function() {
		var loadingAnimation = document.createElement('div');
		loadingAnimation.setAttribute('id', 'loading_animation');
		loadingAnimation.className = 'loading_animation';
		loadingAnimation.style.width = PWG.Stage.winW + 'px';
		loadingAnimation.style.height = PWG.Stage.winH + 'px';
		document.getElementsByTagName('body')[0].appendChild(loadingAnimation);
	}
	
	module.removeLoadingAnimation = function() {
		var loadingAnimation = document.getElementById('loading_animation');
		loadingAnimation.parentNode.removeChild(loadingAnimation);
	}
	
	module.quit = function() {
		if(!_isQuit) 
		{
			_quit();
		}
	};
	
	function _onStageInitialized() {
		trace('PWG.Game/onStageInitialized');
		if(_gameConfig.loadingAnimation) {
			module.addLoadingAnimation();
		}
		_gameConfig.init(_onConfigInitialized, module);
	}
	
	function _onConfigInitialized(cfg) {
		module.config = cfg;
		trace('PWG.Game/onConfigInitalized, config = ', cfg, '\tmodule = ', module);
		_inPlay = true;

		// add global methods
		PWG.Utils.extend(module, _gameLogic.global.methods);

		// add global listeners
		PWG.EventCenter.batchBind(_gameLogic.global.listeners, module);
		
		// create phaser game
		module.phaser = new Phaser.Game(
			module.config.canvasW,
			module.config.canvasH,
			Phaser.AUTO, 
			module.config.gameEl,
			{ 
				preload: _preload, 
				create: _create, 
				update: _update, 
				render: _render 
			}
		);
	}
	
	function _preload() {
		trace('PWG.Game/_preload, module = ', module);
		PWG.PhaserLoader.init(module.config.assets, module.phaser);
		if(module.preload) {
			module.preload.call(this);
		}
	}
	
	function _create() {
		trace('PWG.Game/_create');
		if(_gameConfig.loadingAnimation) {
			module.removeLoadingAnimation();
		}
		PWG.PhaserScale.init(module.config.stage);
		PWG.PhaserPhysics.init();

		PWG.ViewManager.init(module.config.global.views);

		PWG.StateManager.init(_gameLogic.states);
		
		if(module.config.input) 
		{
			if(module.config.input.keys) 
			{
				module.keyboard = PWG.PhaserInput.initKeyboard(module.config.input.keys);
			}
		}
		
		if(module.create) {
			module.create.call(this);
		}
	}
	
	function _update() {
		// trace('PWG.Game/_update');
		if(module.keyboard) 
		{
			PWG.PhaserInput.updateKeyboard(module.keyboard);
		}
		if(module.update) {
			module.update.call(this);
		}
	}
	
	function _render() {
		// trace('PWG.Game/_render');
		if(module.render) {
			module.render.call(this);
		}
	}
	
	function _quit() {
		// trace('PWG.Game/_quit');
		_isQuit = true;
		PWG.EventCenter.batchUnbind(_gameLogic.global.listeners);
		PWG.ScreenManager.destroy();
		module.phaser.destroy();
	}
	
	return module;
}();


var Farkle = function() {
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
	module.WINNING_SCORE = 10000;

	function Die(idx) {
		this.idx = idx;
		this.value = -1;
		this.score = 0;
		this.scorable = false;
		this.groupId = '';
		this.active = true;
		this.selected = false;
	};
	
	Die.prototype.roll = function() {
		this.value = PWG.Utils.diceRoll();
	};
	
	Die.prototype.setActive = function(active) {
		this.active = active;
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
			this.collection.push(new Farkle.Die(i));
		}
	};
	
	TurnDice.prototype.roll = function() {
		PWG.Utils.each(
			this.collection,
			function(die) {
				// trace('\tdie['+die.idx+'].active = ' + die.active);
				if(die.active) {
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
				if(die.active) {
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
				if(die.active) {
					values.push(die.value);
				}
			},
			this
		);
		return values;
	};
	
	TurnDice.prototype.setAllActive = function(active) {
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
		
		this.groups = [];
		this.hotDice = false;
		this.farkled = true;
		this.scoringDice = 0;
		
		if(Farkle.straightTest(this.getActiveValues())) {
			// STRAIGHT
			this.hotDice = true;
			this.farkled = false;
			this.scoringDice = 6;
			this.setAllScorable('straight');
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
					if(dice.length >= 3) {			// there's at least one triple
						// trace('there is a triple of: ' + val);
						this.farkled = false;
						this.groups.push('triple'+val);
						tripleCount++;
						
						PWG.Utils.each(
							dice,
							function(die) {
								this.scoringDice++;
								die.scorable = true;
								if(parseInt(val) !== 1 && parseInt(val) !== 5) { 	// non 1s and 5s have to be scored as part of group
									die.groupId = 'triple' + val;
									// die.groupId = true;
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
			
			if(doublesCount === 3) {				// full house
				this.setAllScorable('fullHouse');
				this.groups.push('fullHouse');
				this.farkled = false;
				this.hotDice = true;
				this.scoringDice = 6;
			} else if(tripleCount === 2) {			// double triples
				this.hotDice = true;
			}
			
			if(sorted[1].length > 0 && sorted[1].length < 3) {
				// trace('there are 1s, sorted[1] length = ' + sorted[1].length);
				this.farkled = false;
					this.parseOnesAndFives(sorted, 1);
			}
			if(sorted[5].length > 0 && sorted[5].length < 3) {
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
				die.scorable = true;
				this.scoringDice++;
			},
			this
		)
	};
	
	TurnDice.prototype.setAllScorable = function(group) {
		// trace('Farke.Dice/setAllScorable');
		this.hotDice = true;
		PWG.Utils.each(
			this.collection,
			function(die) {
				die.scorable = true;
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
		var length = PWG.Utils.objLength(selections);
		for(var key in selections) {
			var die = this.collection[selections[key]];
			// trace('\tdie = ', die);
			if(die.groupId !== '') {
				if(die.groupId === 'straight') {
					score += Farkle.STRAIGHT_SCORE;
					this.setAllActive(false);
					this.usedDice += 6;
					break;
				} else if(die.groupId === 'fullHouse') {
					score += Farkle.FULL_HOUSE_SCORE;
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
				score += (triple - 2) * (val * Farkle.TRIPLE_MULTIPLIER);
			},
			this
		);
		// add ones and fives
		if(oneCount > 0) {
			if(oneCount >= 3) {
				score += (oneCount - 2) * Farkle.ONE_TRIPLE_MULTIPLIER;
			} else {
				score += oneCount * Farkle.ONE_SCORE;
			}
		}
		if(fiveCount > 0) {
			if(fiveCount >= 3) {
				score += (fiveCount - 2) * (5 * Farkle.TRIPLE_MULTIPLIER)
			} else {
				score += fiveCount * Farkle.FIVE_SCORE;
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
			this.availableDice = Farkle.NUM_DICE;
			this.setAllActive(true);
			// trace('\tpost set all active, collection = ', this.collection);
		}
		trace('TurnDice/bankScoringDice\n\tscore = ' + score 
				+ '\tthrowScores now: ' + this.throwScores 
				+ '\n\tturn score: ' + this.totalScore
				+ '\n\tavailable = ' + this.availableDice 
				+ '\n\tusedDice = ' + this.usedDice,
				this
		);
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

	module.init = function(callback, context) {
		this.callback = callback;
		this.ctx = context || window;
	};

	module.startTurn = function() {
		this.turnDice = new Farkle.TurnDice(Farkle.NUM_DICE);
	};
	
	module.roll = function() {
		// this.rollStraight();
		this.turnDice.roll();
		this.turnDice.parseCurrentRoll();
		
		if(this.callback) {
			this.callback.call(this.ctx);
		}
	};
	
	module.rollStraight = function() {
		this.turnDice.collection[0].value = 1;
		this.turnDice.collection[1].value = 2;
		this.turnDice.collection[2].value = 3;
		this.turnDice.collection[3].value = 4;
		this.turnDice.collection[4].value = 5;
		this.turnDice.collection[5].value = 6;
		this.turnDice.parseCurrentRoll();

		if(this.callback) {
			this.callback.call(this.ctx);
		}
	};
	
	module.rollFullHouse = function() {
		this.turnDice.collection[0].value = 2;
		this.turnDice.collection[1].value = 2;
		this.turnDice.collection[2].value = 3;
		this.turnDice.collection[3].value = 3;
		this.turnDice.collection[4].value = 6;
		this.turnDice.collection[5].value = 6;
		this.turnDice.parseCurrentRoll();

		if(this.callback) {
			this.callback.call(this.ctx);
		}
	};
	
	module.rollDoubleTrips = function() {
		this.turnDice.collection[0].value = 2;
		this.turnDice.collection[1].value = 2;
		this.turnDice.collection[2].value = 2;
		this.turnDice.collection[3].value = 6;
		this.turnDice.collection[4].value = 6;
		this.turnDice.collection[5].value = 6;
		this.turnDice.parseCurrentRoll();

		if(this.callback) {
			this.callback.call(this.ctx);
		}
	};
	
	module.checkScoringDice = function(dice) {
		// trace('TurnDice/checkForScoringDice, dice = ', dice);

		var scoringData = {
			score: 0,
			dice: []
		};
		// CALCULATE SCORE
		if(Farkle.straightTest(dice)) {
			// score = Farkle.STRAIGHT_SCORE;
			scoringData.score = Farkle.STRAIGHT_SCORE;
			// trace('\tadding all dice to scoringData.dice');
			scoringData.dice = dice;
		} else {
			var counts = PWG.Utils.elementCount(dice);
			var doubles = [];
			var triples = {};

			for(var key in counts) {
				if(counts[key] >= 3) {
					triples[key] = counts[key];
					delete counts[key];
				} else if(counts[key] === 2) {
					doubles.push(key);
				}
			}

			if(doubles.length === 3) {
				// score = Farkle.FULL_HOUSE_SCORE;
				scoringData.score = Farkle.FULL_HOUSE_SCORE;
				scoringData.dice = dice;
				// trace('\tadding all dice to scoringData.dice');
			} else {
				if(PWG.Utils.objLength(triples) > 0) {
					// trace('there are triples');
					PWG.Utils.each(
						triples,
						function(count, val) {
							// trace('\tadding triples for '+val+': ' + count);
							var multiplier = (parseInt(val) === 1) ? Farkle.ONE_TRIPLE_MULTIPLIER : Farkle.TRIPLE_MULTIPLIER;
							// trace('\tmultiplier = ' + multiplier);
							scoringData.score += (val * multiplier) * (count - 2);
							for(var i = 0; i < count; i++) {
								// trace('\tpushing a triples ' + val + ' die to scoringData.dice');
								scoringData.dice.push(val);
							}
						},
						this
					);
				}
				if(counts[1] && counts[1] < 3) {
					scoringData.score += (counts[1] * Farkle.ONE_SCORE);
					while(counts[1].length > 0) {
						// trace('\tpushing a 1 to scoringData.dice');
						scoringData.dice.push(1);
						counts[1].pop();
					}
				}
				if(counts[5] && counts[5] < 3) {
					scoringData.score += (counts[5] * Farkle.FIVE_SCORE);
					while(counts[5].length > 0) {
						// trace('\tpushing a 5 to scoringData.dice');
						scoringData.dice.push(5);
						counts[5].pop();
					}
				}
			}
		}
		// trace('\tscoringData = ', scoringData);
		return scoringData;
	};
	
	module.bankScoringDice = function(selection) {
		this.turnDice.bankScoringDice(selection);
		return this.turnDice.throwScores;
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

	module.quit = function() {
		trace('Farkle/quit');
		this.turnDice.destroy();
		this.turnDice = null;
	};
	
	return module;
}();

var FlatGUI = function() {
	var dieDiameter;
	var dieWidthHeight;
	var playStarted = false;

	var playerElements = '<div id="player_title_~{name}~" class="player_title">~{name}~</div><div  id="turn_score_~{name}~" class="turn_score text_md">turn: 0</div><div  id="total_score_~{name}~" class="total_score text_md">total: 0</div><div id="farkles_~{name}~" class="current_farkles text_md text_red"></div>';
	
	var rotateStyle = ' transform:rotate(~{rotation}~deg);-ms-transform:rotate(~{rotation}~deg);-webkit-transform:rotate(~{rotation}~deg);';
	
	var module = {};
	
	function GUIDie(idx, value, id, parentEl, onGreen, scorable, groupId) {
		var styleString = '';

		this.idx = idx;
		this.id = id;
		this.value = value;
		this.selected = false;
		this.scorable = scorable;
		this.groupId = groupId;
		
		// trace('GUIDie/constructor, idx = ' + idx + ', value = ' + value + ', id = ' + id);
		this.el = document.createElement('div');
		this.el.className = "die die_" + value;
		this.el.setAttribute('id',  id);

		styleString = 'width: ' + dieWidthHeight + 'px;';
		styleString += 'height: ' + dieWidthHeight + 'px;';
		parentEl.appendChild(this.el); 


		if(onGreen) {
			var left = ((idx * dieDiameter) + (module.unit * 7));
			// trace('die['+idx+'] left = ' + left);
			styleString += 'left:' + left + 'px;';

			if(module.randomPositions) {
				var top;

				if(idx === 0 || idx === 5) {
					// keep 1st and 6th die from positioning under control buttons
					top = (Math.floor(Math.random() * (module.rollingGreenRect.height - (dieDiameter + (module.playScreenRect.height/6) + (module.unit * 10)))));
				} else {
					top = (Math.floor(Math.random() * (module.rollingGreenRect.height - dieDiameter) + (module.unit * 3)));
				}
				// trace('die['+idx+'] top = ' + top);
				styleString += 'top:' + top + 'px;';
			}

			if(module.randomRotations) {
				var rotation = Math.random() * 360;
				var rotationClass = PWG.Utils.parseMarkup(rotateStyle, { rotation: rotation });
				styleString += rotationClass;
			}
			
			if(scorable) {
				this.el.className += ' selectable_die';
				this.el.addEventListener('click', function(event) {
					module.selectDie(id);
				});
			}
		} else {
			styleString += 'left:' + (idx * dieDiameter) + 'px;';
			styleString += 'top:0px;';
		}
		this.el.setAttribute('style', styleString);
	};

	module.GUIDie = GUIDie;

	module.rolledDice = {};
	module.playerEls = {};

	module.quitCb = null;
	
	module.button1Callback = null;

	module.configBoxOpen = false;
	module.randomPositions = true;
	module.randomRotations = true; 
	
	module.init = function(cb, quitCb) {
		module.quitCallback = quitCb;
		module.currentScreen = 'home';
		
		module.titleButton = document.getElementById('title');
		module.titleButton.addEventListener('click', module.onTitleClick);
		
		// home screen
		module.homeScreen = document.getElementById('home_screen');

		module.onePlayer = document.getElementById('one_player');
		module.twoPlayers = document.getElementById('two_players');
		module.threePlayers = document.getElementById('three_players');
		module.fourPlayers = document.getElementById('four_players');
	
		module.onePlayer.addEventListener('click', module.onOnePlayerStart);
		module.twoPlayers.addEventListener('click', module.onTwoPlayerStart);
		module.threePlayers.addEventListener('click', module.onThreePlayerStart);
		module.fourPlayers.addEventListener('click', module.onFourPlayerStart);
		// tutorial screen
		module.tutorialScreen = document.getElementById('tutorial_screen');
		module.tutorialButton = document.getElementById('tutorial');
		module.tutorialButton.addEventListener('click', module.onTutorialClick);
		// play screen
		module.playScreen = document.getElementById('play_screen');

		module.rollingGreen = document.getElementById('rolling_green');

		module.infoArea = document.getElementById('info');
		module.updateText('infoArea', 'choose players');
		
		module.button1 = document.getElementById('button1');
		module.button2 = document.getElementById('button2');

		module.button1.addEventListener('click', module.onButton1Click);
		module.button2.addEventListener('click', module.onButton2Click);

		module.button1Callback = cb;
		module.setButton(module.button1, 'start');

		module.layout();
		
		window.addEventListener('resize', module.layout);
		
	};
	
	module.onTitleClick = function() {
		if(module.currentScreen !== 'home') {
			switch(module.currentScreen) {
				case 'play':
				Game.quit();
				break;
				
				case 'tutorial':
				module.closeScreen('tutorial');
				break;
				
				default:
				trace('unknown screen: ' + module.currentScreen);
				break;
			}
		}
	};
	
	module.confirmQuit = function(cb) {
		trace('FlatGUI/confirmQuit');
		module.configBoxOpen = true;
		module.confirmQuitCb = cb;
		
		var confirmBox = document.getElementById('confirm_box');
		confirmBox.style.display = 'block';
		module.updateOrientationClasses(confirmBox, 'screen');
		
		var cancelButton = document.getElementById('cancel_button');
		var confirmButton = document.getElementById('confirm_button');
		
		cancelButton.addEventListener('click', module.onCancelQuitClicked); 
		confirmButton.addEventListener('click', module.onConfirmQuitClicked); 
		
		var quit = false;
	};

	module.onCancelQuitClicked = function() {
		trace('FlatGUI/cancelQuit');
		module.confirmQuitCb.call(this, false);
		module.closeConfirmBox();
	};
	
	module.onConfirmQuitClicked = function() {
		module.confirmQuitCb.call(this, true);
		module.closeConfirmBox();
	};
	
	module.closeConfirmBox = function() {
		trace('FlatGUI/closeConfirmBox');
		var confirmBox = document.getElementById('confirm_box');
		confirmBox.style.display = 'none';
		
		var cancelButton = document.getElementById('cancel_button');
		var confirmButton = document.getElementById('cancel_button');
		
		cancelButton.removeEventListener('click', module.cancelQuit); 
		confirmButton.removeEventListener('click', module.confirmQuit); 

		module.configBoxOpen = false;
	};
	
	module.onTutorialClick = function() {
		module.currentScreen = 'tutorial';
		module.tutorialScreen.style.display = 'block';
		module.tutorialScreen.className += ' animation_left_onto_screen';
		module.backButton = document.getElementById('back_button');
		module.backButton.addEventListener('click', module.onBackButtonClick);

		module.updateText('infoArea', 'rules');
	};
	
	module.onBackButtonClick = function() {
		module.closeScreen('tutorial');
	};
	
	module.closeScreen = function(name) {
		var el = module[name + 'Screen'];
		var oldClass = el.className;
		el.className = oldClass.substr(0, oldClass.indexOf(' animation_left_onto_screen'));
		el.style.display = 'none';

		module.updateText('infoArea', 'choose players');
		module.currentScreen = 'home';
	};
	
	module.onOnePlayerStart = function() {
		module.playerNumberSelected(1);
	};
	
	module.onTwoPlayerStart = function() {
		module.playerNumberSelected(2);
	};
	
	module.onThreePlayerStart = function() {
		module.playerNumberSelected(3);
	};
	
	module.onFourPlayerStart = function() {
		module.playerNumberSelected(4);
	};
	
	module.playerNumberSelected = function(num) {
		module.updateText('infoArea', '');
		Game.initPlayers(num);
	};
	
	module.initGame = function() {
		module.currentScreen = 'play';
		module.playScreen.style.display = 'block';
		module.playScreen.className += ' animation_left_onto_screen';

		module.playScreenRect = module.playScreen.getBoundingClientRect();
		module.rollingGreenRect = module.rollingGreen.getBoundingClientRect();

		module.bank = document.getElementById('bank');
	};
	
	module.startGame = function(players) {
		trace('FlatGUI/startGame');
		module.addPlayerEls(players);
		module.unit = module.playScreen.offsetWidth/100;
		playStarted = true;
	};
	
	module.addPlayerEls = function(players) {
		// trace('FlatGUI/addPlayerEls, players = ', players);
		var playersEl = document.getElementById('players');
		PWG.Utils.each(
			players,
			function(player) {
				// trace('\tadding player: ' + player.name);
				var el = document.createElement('div');
				el.setAttribute('id', player.name);
				var html = PWG.Utils.parseMarkup(playerElements, player);
				el.innerHTML = html;
				el.className = 'player';
				el.style.opacity = 0.5;
				module.playerEls[player.name] = el;
				playersEl.appendChild(el);
			},
			this
		);
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
	
	module.startTurn = function(player) {
		// trace('FlatGUI/startTurn');
		module.switchPlayerEl(player.name);
		module.usedThisTurn = 0;

		module.removeDice(module.rolledDice);
		module.rolledDice = {};
		module.removeDice(module.selectedDice);
		module.selectedDice = {};
		module.updateText('infoArea', '');
		module.updateText('turnScore', 0);
		module.updateText('totalScore',  player.score);
	};
	
	module.switchPlayerEl = function(name) {
		module.playerTitle = document.getElementById('player_title_' + name);
		module.totalScore = document.getElementById('total_score_'+name);
		module.turnScore = document.getElementById('turn_score_'+name);
		module.farklesText = document.getElementById('farkles_'+name);

		PWG.Utils.each(
			module.playerEls,
			function(el, key) {
				if(key === name) {
					// module.playerTitle.innerHTML = name + '\'s turn';
					el.style.opacity = 1;
				} else {
						// module.playerTitle.innerHTML = name;
					el.style.opacity = 0.33;
				}
			},
			this
		)
	};
	
	module.startRoll = function(cb) {
		// trace('FlatGUI/startRoll, cb = ', cb);
		module.removeDice(module.rolledDice);
		module.toSelect = {};
		module.selecting = false;
		module.button1Callback = cb;
		module.setButton(module.button1, 'roll');
	};
	
	module.endTurn = function(player) {
		module.updateText('totalScore', player.score);
		module.setFarkleText(player);
	};
	
	module.setButton = function(button, text) {
		// trace('FlatGUI/setButton, text = ', text, '\n\tbutton = ', button);
		button.innerHTML = text;
		module.showButton(button);
	};
	
	module.onButton1Click = function(event) {
		// trace('onButton1Click, callback = ', module.button1Callback);
		module.button1Callback.call(this);
	};
	
	module.onButton2Click = function(event) {
		// trace('onButton2Click, callback = ', module.button1Callback);
		module.hideButton(module.button2);
		module.button2Callback.call(this);
	};
	
	module.hideButton = function(button) {
		button.style.visibility = 'hidden';
	};
	
	module.showButton = function(button) {
		button.style.visibility = 'visible';
	};
	
	module.displayRoll = function(dice) {
		// trace('FlatGUI/displayRoll, dice = ', dice);
		module.setButton(module.button1, 'bank');
		module.button1Callback = module.onSelectionComplete;
		module.selecting = false;
		module.updateText('infoArea', '');
		
		PWG.Utils.each(
			dice.collection,
			function(die, idx) {
				if(die.active) {
					// trace('--- die = ', die);
					var id = 'rolledDie' + idx + '-' + String(new Date().getTime()) + '-' + String(Math.floor(Math.random() * 999));
					var guiDie = new GUIDie(idx, die.value, id, module.rollingGreen, true, die.scorable, die.groupId);
					module.rolledDice[id] = guiDie;
				}
			},
			this
		);
	};

	module.selectDie = function(id) {
		// trace('FlatGUI/selectDie, id = ' + id);
		var die = module.rolledDice[id];
		// trace('\tdie = ', die);
		if(!die.selected) {
			die.el.style.opacity = 0.5;
			die.selected = true;
			module.addSelectedDie(die);
			if(die.groupId !== '') {
				// trace('\tthere is a group: ' + die.groupId);
				PWG.Utils.each(
					module.rolledDice,
					function(d) {
						// trace('\td = ', d.groupId);
						if(d.groupId === die.groupId) {
							d.el.style.opacity = 0.5;
							d.selected = true;
							module.addSelectedDie(d);
						}
					},
					this
				);
			}
		} else {
			die.el.style.opacity = 1;
			die.selected = false;
			module.removeSelectedDie(die);
			if(die.groupId !== '') {
				
				PWG.Utils.each(
					module.rolledDice,
					function(d) {
						if(d.groupId === die.groupId) {
							d.el.style.opacity = 1;
							d.selected = false;
							module.removeSelectedDie(d);
						}
					},
					this
				);
			}
		}
	};

	module.addSelectedDie = function(die) {
		// module.toSelect[die.idx] = die;
		module.toSelect[die.id] = die.idx
	};
	
	module.removeSelectedDie = function(die) {
		// delete module.toSelect[die.idx];
		delete module.toSelect[die.id];
	};
	
	module.setSelectedCallback = function(cb) {
		module.selectedCb = cb;
	};
	
	module.onSelectionComplete = function() {
		module.selecting = true;

		// trace('FlatGUI/onSelectionComplete, toSelect = ', module.toSelect, '\tcanSelect = ', canSelect);
		PWG.Utils.each(
			module.toSelect,
			function(val, key) {
				var die = module.rolledDice[key];
				// trace('\tdie = ', die);
				var guiDie = new GUIDie(PWG.Utils.objLength(module.selectedDice), die.value, 'selectedDie' + die.id, module.bank);
				module.selectedDice[die.id] = guiDie;
				module.usedThisTurn++;
			},
			module
		);
		// trace('USED THIS TURN = ' + module.usedThisTurn);
		var length = PWG.Utils.objLength(module.toSelect);
		if(length > 0) {
			if(module.usedThisTurn % 6 === 0) {
				module.showHotDice();
			}
			if(module.selectedCb) {
				module.selectedCb.call(this, module.toSelect);
			}
		}
	};
	
	module.showHotDice = function() {
		module.updateText('infoArea', 'HOT DICE!');
	};
	
	module.farkled = function(cb, player) {
		module.updateText('turnScore', '0');
		module.updateText('infoArea', 'FARKLE!');
		module.setFarkleText(player);
		module.hideButton(module.button1);
		module.button2Callback = cb;
		module.setButton(module.button2, 'next');
	};

	module.setFarkleText = function(player) {
		var text = '';
		// trace('FlatFarklGUI/setFarkleText, currentFarkles = ' + player.currentFarkles);
		for(var i = 0; i < player.currentFarkles; i++) {
			text += 'F ';
		}
		// trace('\ttext = ' + text);
		module.updateText('farklesText', text);
	};
	
	module.removeDice = function(list) {
		// trace('FlatGUI/removeDice, list = ', list);
		PWG.Utils.each(
			list,
			function(die) {
				// trace('\tdie = ', die);
				module.removeDie(die, list);
			},
			this
		);
		// trace('----- FlatGUI/removeDice, list now = ', list);
	};
	
	module.removeDie = function(die, list) {
		// trace('FlatGUI/removeDie, die = ', die, '\tlist = ', list);
		die.el.parentNode.removeChild(die.el);
		delete list[die.id];
	};
	
	module.updateText = function(el, text, style) {
		var prefixText = '';
		if(el === 'turnScore') {
			prefixText = 'turn: ';
		} else if(el === 'totalScore') {
			prefixText = 'total: ';
		} else if(el === 'farklesText') {
			// do nothing
		}
		this[el].innerHTML = prefixText + text;
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
	};
	
	module.showEndTurnButton = function(cb) {
		module.setButton(module.button2, 'next');
		module.button2Callback = cb;
	};
	
	module.gameOver = function(cb, player) {
		module.updateText('infoArea', player.name + ' WINS!');

		module.button1Callback = cb;
		module.setButton(module.button1, 'play again');

		module.button2Callback = Game.quit;
		module.setButton(module.button2, 'quit');
	};
	
	module.cleanUp = function() {
		module.selecting = false;
		module.button1Callback = null;
		module.removeDice(module.selectedDice);
		module.removePlayerEls();
		module.selectedDice = {};

		// module.button1.removeEventListener('click', module.onButton1Click);
		// module.button2.removeEventListener('click', module.onButton2Click);

	};
	
	module.layout = function() {
		var winW = document.documentElement.clientWidth;
		var winH = document.documentElement.clientHeight;
		var base;
		
		if(winW > winH) {
			module.orientation = 'landscape';
			base = winH;
		} else {
			module.orientation = 'portrait';
 			base = winW; 
		}
		

		var titleAndHomeScreen = document.getElementById('title_and_info');
		module.updateOrientationClasses(titleAndHomeScreen, 'title_and_info');

		var players = document.getElementById('players');
		module.updateOrientationClasses(players, 'players');

		module.updateOrientationClasses(module.homeScreen, 'screen');
		module.updateOrientationClasses(module.playScreen, 'screen');
		module.updateOrientationClasses(module.tutorialScreen, 'screen');

		if(module.confirmBoxOpen) {
			var confirmBox = document.getElementById('confirm_box');
			module.updateOrientationClasses(confirmBox, 'screen');
		}

		dieDiameter = ((base/6) * 0.9);
		dieWidthHeight = Math.sqrt(Math.pow(dieDiameter, 2)/2);

		if(playStarted) {
			module.playScreenRect = module.playScreen.getBoundingClientRect();
			module.rollingGreenRect = module.rollingGreen.getBoundingClientRect();
			module.unit = module.playScreen.offsetWidth/100;
			if(PWG.Utils.objLength(module.rolledDice)) {
				module.resizeDice(module.rolledDice, true);
			}
			if(PWG.Utils.objLength(module.selectedDice)) {
				module.resizeDice(module.selectedDice, false);
			}
		}
	};

	module.updateOrientationClasses = function(el, type) {
		// trace('updateOrientationClasses, type = ' + type + ', el = ', el);
		var oldClass = el.className.substr(0, type.length);
		var newClass = oldClass + ' ' + type + '_' + module.orientation;
		el.className = newClass;
	};
	
	module.resizeDice = function(dice, onGreen) {
		PWG.Utils.each(
			dice,
			function(die) {
				var oldStyle = die.el.getAttribute('style');
				var sansWidthHeight = oldStyle.substr(oldStyle.indexOf('top'), oldStyle.length);
				var newStyle = 'width:' + dieWidthHeight + 'px;' + 'height:' + dieWidthHeight + 'px;' + sansWidthHeight;
				// trace('sansWidthHeight = ' + sansWidthHeight);
				// trace('onGreen = ' + onGreen);
				if(onGreen) {
					var left = ((die.idx * dieDiameter) + (module.unit * 7));
					// trace('die['+die.idx+'] left = ' + left);
					newStyle += 'left:' + left + 'px;';
				} else {
					newStyle += 'left:' + (die.idx * dieDiameter) + 'px;';
				}
				die.el.setAttribute('style', newStyle);
			},
			this
		);
	};

	module.quit = function(cb) {
		trace('FlatGUI/quit');
		module.removePlayerEls();
		module.closeScreen('play');

		module.removeDice(module.rolledDice);
		module.rolledDice = {};
		module.removeDice(module.selectedDice);
		module.selectedDice = {};

		module.button1Callback = cb;
		module.setButton(module.button1, 'start');
		module.hideButton(module.button2);

	};
	
	return module;
}();


var Game = function() {
	var module = {};

	function Player(config) {
		// trace('Player/constructor, config = ', config);
		PWG.Utils.extend(this, config);
		this.score = 0;
		this.currentFarkles = 0;
	};
	
	Player.prototype.reset = function() {
		this.score = 0;
		this.currentFarkles = 0;
	};
	
	Player.prototype.printDetails = function() {
		PWG.Utils.each(
			this,
			function(value, key) {
				if(this.hasOwnProperty(key)) {
					// trace('\t' + key + ' = ' + value);
				}
			},
			this
		);
	};
	
	module.Player = Player;

	module.gameActive = false;
	module.players = [];
	module.currentPlayer = -1;
	module.totalRounds = 0;

	module.init = function(gui) {
		module.gui = gui;
		module.players = [];
		Farkle.init(module.onRolled, this);
		module.gui.init(module.startGame, module.quit);

	};

	module.initPlayers = function(numPlayers) {
		for(var i = 0; i < numPlayers; i++) {
			module.players.push(new Player({ name: 'player' + (i+1) }));
		}
		module.gui.initGame(module.players);
	};
	
	module.startGame = function() {
		trace('Game/startGame');
		module.gameActive = true;
		module.gui.startGame(module.players);
		// trace('\tplayers now = ', module.players);
		module.currentPlayer = 0;
		module.totalRounds = 1;
		module.startTurn();
		// trace('----- ' + module.players[module.currentPlayer].name + '\'s turn');
	};

	module.startTurn = function() {
		trace('Game/startTurn');
		module.gui.startTurn(module.players[module.currentPlayer]);
		Farkle.startTurn();
		Game.startRoll();
	};
	
	module.startRoll = function() {
		// trace('Game/startRoll');
		module.gui.startRoll(Game.onRollClicked);
	};
	
	module.onRollClicked = function() {
		// trace('Game/onRollClicked');
		Farkle.roll();
	};
	
	module.onRolled = function() {
		// trace('GAME/onRolled');
		module.gui.displayRoll(Farkle.turnDice);
		module.gui.setSelectedCallback(module.onDiceSelected);
		
		if(Farkle.turnDice.farkled) {
			// trace('FARKLED! womp womp');
			// module.endTurn(true);
			module.showFarkled();
		}
	};
	
	module.onDiceSelected = function(dice) {
		// trace('Game/onDiceSelected, dice = ', dice);
		var scores = [];
		scores = Farkle.bankScoringDice(dice);
		// trace('\t...scores = ' + scores + ', is array = ' + (scores instanceof Array));
		var score = 0;
		if(Farkle.turnDice.hotDice) {
			module.gui.showHotDice();
		}
		if(scores instanceof Array) {
			// trace('\tlength = ' + scores.length);
			PWG.Utils.each(
				scores,
				function(value, idx) {
					// trace('\tvalue['+idx+'] = ' + value);
					score += value;
				},
				this
			);
		} else {
			score = scores;
		}
		// trace('---- score now = ' + score);
		module.gui.updateText('turnScore', score);
		if(score >= Farkle.MIN_TURN_SCORE) {
			Game.farkled = false;
			module.gui.showEndTurnButton(Game.endTurn);
		}
		Game.startRoll();
	};
	
	module.showFarkled = function() {
		Game.farkled = true;
		module.players[module.currentPlayer].currentFarkles++;
		module.gui.farkled(Game.endTurn, module.players[module.currentPlayer]);
	};

	module.endTurn = function() {
		if(Game.farkled) {
			if(module.players[module.currentPlayer].currentFarkles >= 3) {
				// trace('TRIPLE FARKLE! setting score back: ' + Farkle.TRIPLE_FARKLE);
				module.players[module.currentPlayer].score -= Farkle.TRIPLE_FARKLE;
				module.players[module.currentPlayer].currentFarkles = 0;
			}
		} else {
			module.players[module.currentPlayer].currentFarkles = 0;
			module.players[module.currentPlayer].score += Farkle.turnDice.totalScore;
		}

		module.gui.endTurn(module.players[module.currentPlayer]);

		// trace('----- end of ' + module.players[module.currentPlayer].name + '\'s turn with a score of: ' + module.players[module.currentPlayer].score);

		if(module.players[module.currentPlayer].score >= Farkle.WINNING_SCORE) {
			module.gameOver();
		} else {
			module.switchPlayer();
		}
	};
	
	module.switchPlayer = function() {
		if(module.currentPlayer < (module.players.length - 1)) {
			module.currentPlayer++;
		} else {
			module.currentPlayer = 0;
			module.totalRounds++;
		}
		// trace('----- start of ' + module.players[module.currentPlayer].name + '\'s turn');
		module.startTurn();
	};
	
	module.gameOver = function() {
		var topScorer = -1;
		var prevScore = 0;
		
		module.gui.gameOver(Game.restart, module.players[module.currentPlayer]);

	};

	module.quit = function() {
		trace('Game/quit, gameActive = ' + module.gameActive);
		if(module.gameActive) {
			module.gui.confirmQuit(module.confirmQuit);
		}
	};
	
	module.confirmQuit = function(confirmQuit) {
		if(confirmQuit) {
			module.gameActive = false;
			module.currentPlayer = -1;
			module.totalRounds = 0;
			module.players = [];
			module.gui.quit(module.startGame);
			Farkle.quit();
		}
	};
	
	module.restart = function() {
		PWG.Utils.each(
			module.players,
			function(player) {
				player.reset();
			},
			this
		);
		module.gui.cleanUp();
		module.startGame();
	};
	
	return module;
}();

