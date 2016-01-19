(function () {
    'use strict';

    var identityService = function identityService($q) {
        var currentUser = {}; // if any properties exist there is a current user
        var deferred = $q.defer();

        return {
            getUser: function () {
                if (this.isAuthenticated()) {
                    return $q.resolve(currentUser);
                }

                return deferred.promise;
            },
            isAuthenticated: function () {
                return Object.getOwnPropertyNames(currentUser).length !== 0;
            },
            setUser: function (user) {
                console.log(user);
                currentUser = user;
                deferred.resolve(user);
            },
            removeUser: function () {
                currentUser = {};
                deferred = $q.defer();
            }
        };
    };

    angular
        .module('quizProjectApp.services')
        .factory('identity', ['$q', identityService]);
}());