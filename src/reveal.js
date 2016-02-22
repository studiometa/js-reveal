var Reveal = Reveal || {};

(function() {
	'use strict';

	var lastPos, newPos, viewHeight;
	var $document = $(document);
	var $window = $(window);
	var transitionEnd = whichTransitionEvent() ? whichTransitionEvent() : 'transitionend';
	var raf = whichRequestAnimationFrame();


	/*
	 * Global Reveal
	 * @param  {string} selector Links to the content to load
	 * @param  {object} options  An object containing all the options
	 * @return {object}          The instance's object
	 */
	Reveal = function(selector, options) {
		console.log('reveal');

		if (!(this instanceof Reveal)) return new Reveal(selector, options);
		var _ = this;

		lastPos = -1;
		newPos = window.pageYOffset;
		viewHeight = window.innerHeight;

		_.options = options;
		_.selector = selector;
		_.$items = $(selector);
		_.isActive = false;

		// Set all the items
		_.set();

		// Throttle the window resize event
		$window.on('resize', addEndEvent());


		/**
		 * The loop which check for items to reveal
		 * @return {undefined}
		 */
		function loop() {
			console.log('reveal:loop');
			// If reveal is disabled, stop here
			if (!_.isActive) return;

			// Update the pageYOffset
			newPos = window.pageYOffset;

			// If position have not changed,
			// stop here and restart
			if (lastPos == newPos) {
				raf(loop);
				return;
			} else {
				lastPos = newPos;
			}

			// Check for items in view
			_.$items.each(function(i, el) {
				if (newPos + viewHeight > el._top && newPos < el._top + el._height && el._isHidden) {
					_.reveal(el);
				}
			});

			raf(loop);
		}

		_.loop = loop;
		return _;
	};




	/**
	 * Enable/init the loop
	 * @return {object} The instance's object
	 */
	Reveal.prototype.init = function() {
		console.log('reveal:init');
		var _ = this;
		_.enable();
		$window.on('resizeEnd', { instance: _ }, resizeUpdate);
		return _;
	};


	/**
	 * Enable and launch the loop
	 * @return {[type]} [description]
	 */
	Reveal.prototype.enable = function() {
		console.log('reveal:enable');
		var _ = this;
		lastPos = -1;
		_.isActive = _.$items.length ? true : false;
		if (_.isActive) _.loop();
		return _;
	};


	/**
	 * Disable the loop
	 * @return {object} The instance's object
	 */
	Reveal.prototype.disable = function() {
		console.log('reveal:disable');
		var _ = this;
		_.isActive = false;
		$window.off('resizeEnd', resizeUpdate);
		return _;
	};



	/**
	 * Set the reveal items
	 * @param  {object} $items The items to set
	 * @return {object}        The instance's object
	 */
	Reveal.prototype.set = function($items, selector) {
		console.log('reveal:set');
		var _ = this;

		// Set all the items if no
		// argument has been passed
		$items = $items || _.$items;

		// Use the default selector if
		// no argument has been passed
		selector = selector || _.selector;

		// Get all needed variables
		// and save them on the element
		$items.each(function(i, el) {
			var $this = $(this);
			this._top = Math.round($this.offset().top);
			this._height = $this.outerHeight();
			this._isHidden = true;
			this._dur = $this.data('duration') || 1;
			this._delay = $this.data('delay') || 0;
			this._selector = selector;
		});

		return _;
	};



	/**
	 * Update the reveal items
	 * @param  {object} $items The items to update
	 * @return {object}        The instance's object
	 */
	Reveal.prototype.update = function($items) {
		console.log('reveal:update');
		var _ = this;

		// Update the window innerHeight
		viewHeight = window.innerHeight;

		// Set all the items if no
		// argument has been passed
		$items = $items || _.$items;

		// Update all needed variables
		// and save them on the element
		$items.each(function(i, el) {
			var $this = $(this);
			this._top = Math.round($this.offset().top);
			this._height = $this.outerHeight();
		});

		_.enable();

		return _;
	};



	/**
	 * Add items to the reveal
	 * @param {string} selector A selector for the new items
	 * @return {object} The instance's object
	 */
	Reveal.prototype.add = function(selector) {
		console.log('reveal:add');
		var _ = this;

		// Use the default selector if
		// no argument has been passed
		selector = selector || slctr;

		var $newItems = $document.find(selector);

		// Set the new items
		_.set($newItems, selector);

		// Add the new items
		_.$items = _.$items.add($newItems);

		// Re-enable the loop if
		// it has been stopped
		_.enable();

		return _;
	};



	/**
	 * Reveal an item
	 * @param  {object} item The item to reveal
	 * @return {object}      The instance's object
	 */
	Reveal.prototype.reveal = function(item) {
		console.log('reveal:reveal', item);
		var _ = this;

		var $item = $(item);
		item._isHidden = false;

		$item.on(transitionEnd, { item: item, instance: _ }, revealEnd);

		setTimeout(function() {
			$item.addClass('is-visible').trigger('reveal:reveal');
			// If `transitionend` is not supported, trigger it via jQuery
			if (!transitionEnd) $item.trigger('transitionend');
		}, item._delay*1000);
	};




	/* ================================
	 * Utils
	 * ================================ */


	/**
	 * Stuff to do when an item has been revealed
	 * @param  {object} e The `transitionEnd` event's object
	 * @return {undefined}
	 */
	function revealEnd(e) {
		var _ = e.data.instance;
		var item = e.data.item;
		var $item = $(item);
		// Remove the classes on the item and unbind the transition event
		$item.removeClass(item._selector.substring(1) + ' is-visible')
			.off(transitionEnd, revealEnd);
		// Remove the item from the global object
		_.$items = _.$items.not(item);
		// If no items left, disable reveal
		if (_.$items.length <= 0) _.disable();
	}


	/**
	 * Stuff to do on window resize
	 * @return {undefined}
	 */
	function resizeUpdate(e) {
		var _ = e.data.instance;
		_.update(_.$items);
	}


	/**
	 * Returns a function, that, as long as it continues to be invoked, will not
	 * be triggered. The function will be called after it stops being called for
	 * N milliseconds. If `immediate` is passed, trigger the function on the
	 * leading edge, instead of the trailing.
	 * @param  {number}    wait       Timer
	 * @param  {boolean}   immediate  Launch the function immediately
	 * @param  {function}  func       The function that needs debounce
	 * @return {function}             A function to bind to the event debounced
	 */
	function debounce(wait, immediate, func) {
		var timeout;

		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}


	/**
	 * Create an ending event for the event triggered
	 * @param  {object} e The triggered event's object
	 * @return {undefined}
	 */
	function addEndEvent() {
		return debounce(200, false, function(e) {
			$(this).trigger(e.type + 'End');
		});
	}



	/**
	 * Use the correct `transitionend` event
	 * @return {string} The prefixed event name
	 */
	function whichTransitionEvent() {
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};

		for(t in transitions){
				if( el.style[t] !== undefined ){
						return transitions[t];
				}
		}
	}


	/**
	 * Use the correct `requestAnimationFrame` function
	 * @return {function} The prefixed (or not) function
	 */
	function whichRequestAnimationFrame() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
	}


}());