import angular from 'angular';
(function() {
	'use strict';

	angular
		.module('app.pages.profile')
		.controller('ProfileController', ProfileController);

	function ProfileController(Timeline, About, PhotosVideos) {
		'ngInject';
		var vm = this;

		// Data
		vm.posts = Timeline.posts;
		vm.activities = Timeline.activities;
		vm.about = About.data;
		vm.photosVideos = PhotosVideos.data;

		// Methods

		//////////
	}

})();
