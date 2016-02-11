(function() {
    'use strict';

    function RegisterController($location, auth) {
        var self = this;

        self.formLegend = "Register";

        self.register = function register(user, registerForm) {
            if (registerForm.$valid) {
                auth.register(user)
                    .then(function() {
                        $location.path('/login');
                        alert('Registered Successfully');
                    });
            }
        };
    }

    angular.module('quizProjectApp.controllers')
        .controller('RegisterController', ['$location', 'auth', RegisterController]);
}());