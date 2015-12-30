(function() {
	'use strict';

	// Todo: Edit Quiz sends the selected quiz to session storage and redirects to the given page

	function QuizzesController($scope, $sessionStorage, quizStorageService) {
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
		.controller('QuizzesController', ['$scope', '$sessionStorage', 'quizStorageService', QuizzesController]);
}());