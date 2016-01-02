(function() {
	'use strict';

	// Todo: Delete quiz button
	// Todo: Take Quiz button and page

	function QuizzesController($scope, $sessionStorage, $location, quizData, identity) {
		var self = this;

		self.init = function init() {
			quizData.getQuizzes()
				.then(function(result) {
					$scope.$storage = result;
				});

			identity.getUser()
				.then(function(result) {
					$scope.userDetails = result;
				});
		};

		self.editActive = function editActive () {
			var quiz = self.getActiveQuiz();

			console.log(quiz);
			$sessionStorage.editQuiz = quiz;
			$location.path('/quizzes/edit');
		};

		self.deleteActive = function deleteActive () {
			var i = 0;

			$scope.$storage.find(function(element, index) {
				i = index;
				return element.active;
			});

			quizData.removeQuiz($scope.$storage[i].id)
				.then(function() {
					$scope.$storage.splice(i, 1);
				});
		};

		self.solveAlctive = function solveAlctive () {
			var quiz = self.getActiveQuiz();
			
			$sessionStorage.solveQuiz = quiz;
			$location.path('/quizzes/solve/' + quiz.id);
		};

		self.getActiveQuiz = function getActiveQuiz () {
			var quiz = $scope.$storage.filter(function(item) {
				return item.active;
			})[0];

			return quiz;
		};

		$scope.noWrapSlides = false;
		
		self.init();
	}

	angular.module('quizProjectApp.controllers')
		.controller('QuizzesController', 
			[
			'$scope', 
			'$sessionStorage', 
			'$location', 
			'QuizDataService',
			'identity',
			 QuizzesController]);
}());