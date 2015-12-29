(function() {
	'use strict';

	function QuizzesController($scope, quizStorageService) {
		var self = this;

		self.init = function init() {
			$scope.$storage = quizStorageService.getQuizzes();
			console.log($scope.$storage);
		};

		$scope.myInterval = 5000;
		$scope.noWrapSlides = false;
		
		self.init();
	}

	angular.module('quizProjectApp.controllers')
		.controller('QuizzesController', ['$scope', 'quizStorageService', QuizzesController]);
}());