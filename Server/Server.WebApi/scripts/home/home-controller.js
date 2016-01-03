(function() {
    'use strict';

    function HomeController() {
        var self = this;

        self.hi = 'HI!';
    }

    angular.module('quizProjectApp.controllers')
        .controller('HomeController', [HomeController]);
}());