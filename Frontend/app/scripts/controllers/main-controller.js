(function(){
	'use strict';

	function MainController($location, identity, auth) {
		var self = this;

        function waitForLogin() {
            console.log('waiting for login...');

            identity.getUser()
            .then(function (user) {
                self.currentUserGlobal = user;
                console.log('ready');
            });
        }

        self.logout = function () {
            console.log('Logging out...');
            auth.logout();
            self.currentUserGlobal = null;
            waitForLogin();

            $location.path('/');
        };

        waitForLogin();
	}

	angular.module('quizProjectApp.controllers')
		.controller('MainController', ['$location', 'identity', 'auth', MainController]);
		
}());