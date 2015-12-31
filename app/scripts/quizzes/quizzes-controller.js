(function() {
	'use strict';

	// Todo: Delete quiz button
	// Todo: Take Quiz button and page

	function QuizzesController($scope, $sessionStorage, $location, quizData) {
		var self = this;

		self.init = function init() {
			quizData.getQuizzes()
				.then(function(result) {
					$scope.$storage = result;
				});
		};

		self.editActive = function editActive () {
			var quiz = $scope.$storage.filter(function(item) {
				return item.active;
			})[0];

			console.log(quiz);
			$sessionStorage.editQuiz = quiz;
			$location.path('/quizzes/edit');
		};

		$scope.noWrapSlides = false;
		
		self.init();
	}

	angular.module('quizProjectApp.controllers')
		.controller('QuizzesController', 
			['$scope', '$sessionStorage', '$location', 'QuizDataService', QuizzesController]);
}());