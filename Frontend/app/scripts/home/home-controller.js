(function() {
    'use strict';

    function HomeController($scope) {
        var self = this;

        self.hi = 'HI!';
    }

    angular.module('quizProjectApp.controllers')
        .controller('HomeController', ['$scope', HomeController]);
}());