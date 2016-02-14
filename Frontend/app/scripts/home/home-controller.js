(function() {
    'use strict';

    function HomeController($scope) {
        var self = this;

        self.hi = 'HI!';
        $scope.hi = 'Hello';
    }

    angular.module('quizProjectApp.controllers')
        .controller('HomeController', ['$scope', HomeController]);
}());