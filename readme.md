## Utilisation

```html
<p class="js-reveal">Hello world!</p>
```

```css
.js-reveal {
	opacity: 0;
	transform: translateY(100px);
	transition: opacity 0.4s cubic-bezier(0.190, 1.000, 0.220, 1.000), transform 0.4s cubic-bezier(0.190, 1.000, 0.220, 1.000);
}

.js-reveal.is-visible {
	opacity: 1;
	transform: translateY(0);
}
```

```js
// Init reveal
var reveal = new Reveal('.js-reveal');
reveal.init();

// Add new elements
reveal.add('.js-reveal-this-too');

// Stop the reveal
reveal.disable();
```



## Dépendances

- jQuery
- Modernizr
- TweenLite (TweenLite, EasePack, CSSPlugin)
