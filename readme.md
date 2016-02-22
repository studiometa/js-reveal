## Use

```html
<html>
	<head>
		<style>
			.js-reveal {
				opacity: 0;
				transform: translateY(100px);
			}

			.is-visible {
				opacity: 1;
				transform: translateY(0);
			}
		</style>
	</head>
	<body>

		<p class="js-reveal">Hello world!</p>
		<p class="js-reveal-this-too" data-offset="100" data-delay="0.2">Hello again, world!</p>

		<script defer src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script defer src="./dist/reveal.min.js"></script>
		<script defer>
			window.addEventListener('load', function() {

				// Create a new instance
				var reveal = new Reveal('.js-reveal', {
					successClass: 'is-visible'
				});

				// Init the reveal
				reveal.init();

				// Add new items
				reveal.add('.js-reveal-this-too');

				// Stop the reveal
				reveal.disable();

				// Enable the reveal again
				reveal.enable();
			});
		</script>
	</body>
```

## Dependencies

- jQuery (tested with 1.11.1, should work with earlier version too)
