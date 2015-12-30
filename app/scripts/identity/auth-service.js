(function () {
    'use strict';

    var authService = function authService($http, $q, $cookies, identity, baseUrl) {
        var TOKEN_KEY = 'authentication';

        var register = function login(user) {
            var deferred = $q.defer();

            $http.post(baseUrl + 'api/account/register', user)
                .then(function (response) {
                    console.log(response);
                    deferred.resolve(true);
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        var login = function login(user) {
            var deferred = $q.defer();

            var data = 'grant_type=password&username=' + (user.username || '') + '&password=' + (user.password || '');

            $http.post(baseUrl + 'Token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (response) {
                    var tokenValue = response.access_token;

                    var theBigDay = new Date();
                    theBigDay.setHours(theBigDay.getHours() + 72);

                    $cookies.put(TOKEN_KEY, tokenValue, { expires: theBigDay });

                    // Sets the requests of the authenticated users to include a default authorization header with the data
                    $http.defaults.headers.common.Authorization = 'Bearer ' + tokenValue;

                    getIdentity().then(function () {
                        deferred.resolve(response);
                    });
                })
                .error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var getIdentity = function () {
            var deferred = $q.defer();

            $http.get(baseUrl + 'api/Account/UserInfo')
                .success(function (identityResponse) {
                    identity.setUser(identityResponse);
                    deferred.resolve(identityResponse);
                });

            return deferred.promise;
        };

        return {
            register: register,
            login: login,
            getIdentity: getIdentity,
            isAuthenticated: function () {
                return !!$cookies.get(TOKEN_KEY);
            },
            logout: function () {
                console.log('logging out');
                
                $cookies.remove(TOKEN_KEY);
                $http.defaults.headers.common.Authorization = null;
                identity.removeUser();
            },
        };
    };

    angular
        .module('quizProjectApp.services')
        .factory('auth', ['$http', '$q', '$cookies', 'identity', 'baseUrl', authService]);
}());