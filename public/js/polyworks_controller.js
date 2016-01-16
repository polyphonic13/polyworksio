var PolyworksController = function() {

	var clickCount = 0;
	var clickInterval = 1000;
	var clickUnlock = 5;
	var unlocked = false; 

	var containerEls = {};
	var sectionContainerEl;
	var modalEl; 
	var modalContentEl;
	var modalOpen = false;
	var sectionContainerShown = false;
	var navIds = ['about', 'contact', 'store', 'games'];
	var gameModalContent = {
		doy: '<div id="doy_game" class="game_modal"><span class="close_x" onclick="PolyworksController.hideShowModal(false)">X</span><div class="game_content"><h3 class="blue1">dreams of yesterday</h3><p>solve mysteries, explore the past and help save the future in a 3D adventure game for mac and windows.</p><p class="release_date"><b>coming in spring 2016</b></p></div><div id="doy_ss" class="game_ss"></div></div>',
		farkle: '<div id="doy_game" class="game_modal"><span class="close_x" onclick="PolyworksController.hideShowModal(false)">X</span><div class="game_content"><h3 class="blue1">farkle safari</h3><p>an html5 farkle tournament held against animals from around the world.</p><p class="release_date"><b>released january 2015</b></p></div><a href="http://polyworks.io/games/farkle" target="_blank"><div id="farkle_ss" class="game_ss"></div></a></div>',
		keke: '<div id="doy_game" class="game_modal"><span class="close_x" onclick="PolyworksController.hideShowModal(false)">X</span><div class="game_content"><h3 class="blue1">keke and the grey expanse</h3><p>keke battles caterpillars and spiders searching for the color crystals in a grey land, in this html5 game for desktop and mobile.</p><p class="release_date"><b>released july 2014</b></p></div><a href="http://keke.tresensa.com/" target="_blank"><div id="keke_ss" class="game_ss"></div></a></div>'
	};

	function openLink(url) {
		window.open(url);
	}

	function hideShowContainer(id) {
		var container;
	
		if(modalOpen) {
			hideShowModal(false);
		}
	
		if(id !== '') {
			if(!sectionContainerShown) {
				showEl(sectionContainer);
				sectionContainerShown = true;
			}
		} else {
			hideEl(sectionContainer);
			sectionContainerShown = false;
		}
	
		for(var key in containerEls) {
			container = containerEls[key];
			if(container.id === id) {
				showEl(container);
			} else {
				hideEl(container);
			}
		}
	}

	function hideEl(el) {
		el.classList.remove('show');
		el.classList.add('hide');
	}

	function showEl(el) {
		el.classList.remove('hide');
		el.classList.add('add');
	}

	function hideShowModal(show) {
		if(show) {
			modalEl.classList.add('show');
			modalEl.classList.remove('hide');
		} else {
			modalEl.classList.add('hide');
			modalEl.classList.remove('show');
			modalContentEl.innerHTML = '';
		}
		modalOpen = show;
	}

	function openGameModal(gameId) {
		if(!gameModalContent.hasOwnProperty(gameId)) {
			return;
		}
		modalContentEl.innerHTML = gameModalContent[gameId];
		hideShowModal(true);
	}

	function unlockCanvas() {
		unlocked = true;
		var canvas = document.getElementById("ee_canvas");
		var ctx = canvas.getContext("2d");
		var width = window.innerWidth;
		var height = window.innerHeight;
		ctx.fillStyle = "#7d869f";
		ctx.fillRect(0,0,width,height);

		showEl(canvas);
		canvas.addEventListener(
			'click',
			function(el) {
				return function(event) {
					unlocked = false;
					hideEl(el);
				};
			}(canvas),
			false
		);
	}

	(function() {
		var id;
		var el;
		var containerId; 

		var pEl = document.getElementById('icon_p');
		pEl.addEventListener(
			'click',
			function(context) {
				return function(event) {
					hideShowContainer('');

					clickCount++;
					setTimeout(function() {
						clickCount = 0;
					}, clickInterval);
					if(clickCount >= clickUnlock && !unlocked) {
						unlockCanvas();
					}
				};
			}(pEl),
			false
		);
	
		modalEl = document.getElementById('modal');
		modalEl.addEventListener(
			'click',
			function(context) {
				return function(event) {
					hideShowModal(false);
				};
			}(modalEl),
			false
		);
	
		sectionContainer = document.getElementById('section_container');
		modalContentEl = document.createElement('div');
		modalEl.appendChild(modalContentEl);
	
		for(var i = 0, l = navIds.length; i < l; i++) {
			id = navIds[i];
			el = document.getElementById(id + '_nav');
			containerId = id + '_container';

			_addClickHandler(el, containerId);
			containerEls[id] = document.getElementById(containerId);
		}
		
		// hideShowContainer(navIds[0] + '_container');
	})();

	function _addClickHandler(el, containerId) {
		el.addEventListener(
			'click', 
			function(context, id) { 
				return function(event) {
					hideShowContainer(id);
				};
			}(el, containerId),
			false
		);		
	}

	return {
		openGameModal: openGameModal,
		openLink: openLink,
		hideShowModal: hideShowModal
	};
}();
