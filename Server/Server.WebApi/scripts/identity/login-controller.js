(function () {
    'use strict';

    function LoginController($location, auth) {
        var self = this;

        self.login = function(user, loginForm) {
            if (loginForm.$valid) {
                auth.login(user)
                    .then(function (res) {
                        console.log(res);
                        $location.path('/');
                    });
            }
        };
    }

    angular.module('quizProjectApp.controllers')
        .controller('LoginController', ['$location', 'auth', LoginController]);
}());