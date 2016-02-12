(function () {
    'use strict';

    function LoginController($location, auth, ngToast) {
        var self = this;

        self.login = function(user, loginForm) {
            if (loginForm.$valid) {
                console.log('Logging in');
                auth.login(user)
                    .then(function (res) {
                        console.log(res);
                        ngToast.success('Welcome ' + res.userName);
                        $location.path('/quizzes');
                    }, function (error) {
                        ngToast.danger(error.error_description);
                    });
            }
        };
    }

    angular.module('quizProjectApp.controllers')
        .controller('LoginController', ['$location', 'auth', 'ngToast', LoginController]);
}());