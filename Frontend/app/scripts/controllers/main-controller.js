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
                console.log(user);
            });
        }

        // This will be replaced with real content once such exists
        self.footerContent = [
            footerSpot1, footerSpot2, footerSpot3
        ];

        self.logout = function () {
            console.log('Logging out...');
            auth.logout();
            self.currentUserGlobal = null;
            waitForLogin();

            $location.path('/');
        };

        waitForLogin();
	}

    var fake = 'Rhoncus quis, varius sed velit. Mauris quis nunc eu nunc molestie egestas et sit amet odio. Morbi lacinia velit in nibh sodales sed pharetra sem feugiat. Vivamus ut cursus augue. Integer sit amet arcu lorem, at egestas tellus. Phasellus tellus orci, congue at tristique at, mattis ut arcu. Donec dictum';

    var footerSpot1 = {
        title: 'What We Offer',
        content: fake
    };

    var footerSpot2 = {
        title: 'Who We Are',
        content: fake
    };

    var footerSpot3 = {
        title: 'Recent Posts',
        content: fake
    };

	angular.module('quizProjectApp.controllers')
		.controller('MainController', ['$location', 'identity', 'auth', MainController]);
		
}());