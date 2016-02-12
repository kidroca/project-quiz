(function() {
    'use strict';



    function RegisterController($location, auth, ngToast) {
        var self = this;

        self.formLegend = "Register";

        self.register = function register(user, registerForm) {
            if (registerForm.$valid) {
                console.log('Registering...');
                auth.register(user)
                    .then(function() {
                        ngToast.success('Registered Successfully');
                        return user;
                    })
                    .then(function(user) {
                        console.log('User for login', user);
                        var login = {
                            username: user.username,
                            password: user.password
                        };

                        return auth.login(login);
                    })
                    .then(function (res) {
                        console.log(res);
                        ngToast.success('Welcome ' + res.userName);
                        $location.path('/quizzes');
                    });
            }
        };
    }

    angular.module('quizProjectApp.controllers')
        .controller('RegisterController', ['$location', 'auth', 'ngToast', RegisterController]);
}());