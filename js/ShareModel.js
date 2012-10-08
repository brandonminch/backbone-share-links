/*
 * ShareModel.js
 *
 */
var ShareModel = Backbone.Model.extend({
	'defaults': {
		'originUrl': window.location.origin,
		'shareCopy': '',
		'useBitly': true,
		'shareUrl': '',
		'networks': {
			'Facebook': {
				'rootUrl': 'https://www.facebook.com/sharer.php?u=',
				'appendUrlToDescription': false,
				'appIds': {
					'dev': '',
					'stage': '',
					'prod': ''
				},
				'uiVars': {
					'method': 'feed',
					'name': '',
					'link': '',
					'picture': '',
					'caption': '',
					'description': '',
					'app_id': ''
				}
			},
			'Twitter': {
				'rootUrl': 'https://twitter.com/intent/tweet?original_referer=',
				'content': ''
			},
			'Google': {
				'rootUrl': 'http://plus.google.com/share?url='
			}
		}
	},

	'initialize': function(options) {

		this.o = $.extend(true, {}, this.defaults, options);

		if (this.o.shareUrl === '') {
			this.o.shareUrl = this.o.originUrl + '/' + Backbone.history.fragment;
		}

		if (this.o.useBitly !== false) {
			this.bind('update:urls', this.getBitlyUrl);
		} else {
			this.bind('update:urls', this.updateUrls);
		}

		log('Backbone : ShareModel : Initialized');
	},

	'getBitlyUrl': function() {
		var model = this;

		var $ajax = $.ajax({
			'url': '/services/bitly',
			'data': 'url=' + model.o.shareUrl,
			'dataType': 'json',
			'success': function(data) {
				var bitly = data.data;
				if (_.isUndefined(bitly.url)) return;
				model.o.shareUrl = bitly.url;
				model.updateUrls();
			},
			'error': function(errorThrown, textStatus) {
				log(errorThrown, textStatus);
				model.updateUrls();
			}
		});

	},

	'updateUrls': function() {
		var model = this;
		for (key in this.o.networks) {
			model['update' + key].apply(model);
		}
	},

	'updateGoogle': function() {
		this.trigger('success:google', this.o.networks.Google.rootUrl + this.o.shareUrl);
	},

	'updateFacebook': function() {
		var model = this,
			facebook = this.o.networks.Facebook,
			fallbackUrl = facebook.rootUrl + this.o.shareUrl,
			description = (facebook.appendUrlToDescription) ? model.o.shareCopy + ' ' + model.o.shareUrl : model.o.shareCopy;

		$.extend(true, facebook.uiVars, {
			'link': model.o.shareUrl,
			'description': description
		});

		if (FB != undefined) {
			this.trigger('success:fbui', facebook.uiVars);
		} else {
			this.trigger('fail:fbui', fallbackUrl);
		}
	},

	'updateTwitter': function() {
		var model = this,
			twitter = this.o.networks.Twitter;

		twitter.content = encodeURIComponent(model.o.shareCopy);
		this.trigger('success:twitter', twitter.rootUrl + this.o.originUrl + '&source=tweetbutton&text=' + twitter.content + '&url=' + this.o.shareUrl);
	}
});