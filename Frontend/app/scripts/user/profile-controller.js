(function(){
	'use strict';

	function ProfileController() {
		var self = this;

		console.log('Hello From Profile Controller');

		self.pageTitle = "Your Profile";
		self.pageRoute = "Home » <strong>Profile</strong>";
		self.mainContentTemplate = "views/profile/profile.html";

		// Todo: assign a template
		self.sidebarTemplate = null;
	}

	angular.module('quizProjectApp.controllers')
		.controller('ProfileController', [ProfileController]);
}());