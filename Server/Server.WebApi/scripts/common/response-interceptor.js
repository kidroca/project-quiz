(function () {
    'use strict';

    function responseInterceptor($q, $location, ngToast) {

        function successHandler(response) {
            console.log('Response from server', response);
            // Return a promise
            return response || $q.when(response);
        }

        function errorHandler(rejection) {
            console.log('Response rejected', rejection);

            var message = rejection.data.error_description ||
                rejection.data.message ||
                'Oh shoot! Looks like something went wrong!';

            ngToast.danger(message);

            if (rejection.status === 403) {
                ngToast.warning('You can do this, I believe in you');
                $location.path('/login');
            }

            return $q.reject(rejection);
        }

        return {
            response: successHandler,
            responseError: errorHandler
        };
    }

    angular
        .module('quizProjectApp.services')
        .factory('responseInterceptor', ['$q', '$location', 'ngToast', responseInterceptor]);
}());