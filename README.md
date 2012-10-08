# backbone-share-links

Backbone template for adding Twitter, Facebook and Google+ share links.

### Dependencies

http://platform.twitter.com/widgets.js
http://connect.facebook.net/en_US/all.js#xfbml=1
https://apis.google.com/js/plusone.js

### Example Markup

	<ul id="share">
		<li id="share-facebook"><a href="#" target="_blank">Share on facebook</a></li>
		<li id="share-twitter"><a href="#" target="_blank">Share on twitter</a></li>
		<li id="share-google"><a href="#" target="_blank">Share on google+</a></li>
	</ul>

### Example usage within a Backbone.js view

	var shareView = new ShareView({
		'el': $('#share'),
		'model': new ShareModel({
			'shareCopy': 'Text to share.',
			'useBitly': true, // Use bitly to shorten shared URL. Default is true.
			'networks': {
				'Facebook': {
					'appendUrlToDescription': true, // Append url to end of share text? Default is false.
					'uiVars': {
						'app_id': 'facebook_app_id_goes_here',
						'name': 'Title for shared content',
						'picture': 'path_to_share_image_goes_here',
						'caption': 'Subtitle for shared content'
					}
				}
			}
		})
	});