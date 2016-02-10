var Reveal = Reveal || {};

(function() {
	'use strict';

	var _, opts, slctr, lastPos, newPos, loop, viewHeight;
	var $document = $(document);
	var $window = $(window);
	var raf = Modernizr.prefixed('requestAnimationFrame', window) || function(callback) { window.setTimeout(callback, 1000 / 60); };

	/*
	 * Global Reveal
	 * @param  {string} selector Links to the content to load
	 * @param  {object} options  An object containing all the options
	 * @return {object}          The instance's object
	 */
	Reveal = function(selector, options) {
		console.log('reveal');

		if (!(this instanceof Reveal)) return new Reveal(selector, options);
		_ = this;

		opts = options;
		slctr = selector;
		viewHeight = window.innerHeight;

		_.$items = $(selector);
		_.isActive = false;

		// Set all the items
		_.set();

		return _;
	};



	/**
	 * The loop which check for items to reveal
	 * @return {undefined}
	 */
	loop = function() {
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
	};


	/**
	 * Enable/init the loop
	 * @return {object} The instance's object
	 */
	Reveal.prototype.init = function() {
		console.log('reveal:init');
		var _ = this;
		_.isActive = true;
		loop();
		$window.on('resizeEnd', _.update);
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
		$window.off('resizeEnd', _.update);
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
		selector = selector || slctr;

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

		// Trigger a new loop for
		// items which have been added
		// and are in the viewport
		lastPos -= 1;

		// Enable the reveal if it
		// has been disabled
		_.isActive = true;
		loop();

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

		item._isHidden = false;
		TweenLite.to(item, item._dur, {
			delay: item._delay,
			className: '+=is-visible',
			ease: Expo.easeOut,
			onComplete: function() {
				// Remove the classes on the item
				$(item).removeClass(item._selector.substring(1) + ' is-visible');
				// Remove the item from the global object
				_.$items = _.$items.not(item);
				// If no items left, disable reveal
				if (_.$items.length <= 0) _.isActive = false;
			}
		});
	};


}());