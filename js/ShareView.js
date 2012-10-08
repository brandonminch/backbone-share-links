/*
 * ShareView.js
 *
 */
var ShareView = Backbone.View.extend({
	'defaults': {},
	'events': {},

	'initialize': function() {
		_.bindAll(this);

		this.model.bind('success:google', this.handleGoogle);
		this.model.bind('success:twitter', this.handleTwitter);
		this.model.bind('success:fbui', this.handleFbuiSuccess);
		this.model.bind('fail:fbui', this.handleFbuiFail);

		this.render();

		log('Backbone : ShareView : Initialized');
	},

	'render': function() {
		this.model.trigger('update:urls');
	},

	'handleGoogle': function(url) {
		this.$el.find('#share-google a').attr('href', url);
	},

	'handleTwitter': function(url) {
		this.$el.find('#share-twitter a').attr('href', url);
	},

	'handleFbuiSuccess': function(uiVars) {
		var view = this;

		view.$el.find('#share-facebook a').attr('target', null).on('click', function(e) {
			e.preventDefault();
			FB.ui(uiVars);
		});
	},

	'handleFbuiFail': function(url) {
		view.$el.find('#share-facebook a').attr('href', url);
	}
});