(function() {
	'use strict';

	function QuizzesController(
		$rootScope, $scope, $sessionStorage, $location, quizData, identity, sidebarService) {
		var self = this;

		console.log('Hello From Quizzes Controller');
		init(self, $scope, quizData, identity, sidebarService);

		$scope.getRandomQuestions = function getRandomQuestions(quiz, count) {
			var questionsCount = quiz.questions.length;
			if (questionsCount <= count) {
				return quiz.questions;
			}

			var result = [];
			while (result.length < count) {
				var next = Math.floor((Math.random() * questionsCount) + 1);
				result.push(quiz.questions[next]);
			}

			return result;
		};

		$scope.rateQuiz = function rateQuiz() {
			console.log('rating...');
			quizData.rateQuiz($scope.quiz.id, $scope.quiz.rating)
				.then(function (response) {
					console.log(response);
					$scope.quiz.rating = response.rating;
				});
		};

		$scope.checkOut = function checkOut(quiz) {
			$sessionStorage.solveQuiz = quiz;
			$location.path('/quizzes/solve/' + quiz.id);
		};
	}

	function init(self, $scope, quizData, identity, sidebarService) {

		$scope.$storage = [];

		self.pageTitle = "Quizzes";
		self.pageRoute = "Home » <strong class='sub-title'>Quizzes</strong>";
		self.questionsPerPage = 3;
		self.currentPage = 1;

		self.mainContentTemplate = "views/quiz/quizzes.html";
		self.sidebarTemplate = 'views/templates/side-content/recent.html';

		quizData.getQuizzes()
			.then(function(result) {
				console.log(result);
				$scope.$storage = result;
				$scope.quiz = $scope.$storage[0];
			});

		identity.getUser()
			.then(function(result) {
				$scope.userDetails = result;
			});

		sidebarService.getComments()
			.then(function(comments) {
				self.comments = comments;
			});

		sidebarService.getPosts()
			.then(function(recent) {
				self.recent = recent;
			});
	}

	angular.module('quizProjectApp.controllers')
		.controller('QuizzesController', [
			'$rootScope',
			'$scope',
			'$sessionStorage',
			'$location',
			'QuizDataService',
			'identity',
			'sidebarService',
			QuizzesController
		]);
}());