(function() {
	'use strict';

	function QuizzesController($rootScope, $scope, $sessionStorage, $location, $timeout, quizData, identity) {
		var self = this;

		$scope.$storage = [];
		$scope.pageFlip = false;

		self.quizQuery = {
			orderBy: null,
			category: null
		};

		self.questionsPerPage = 1;
		self.currentPage = 1;

		self.orderOptions = [{
			name: 'Date',
			value: 0
		}, {
			name: 'Rating',
			value: 1
		}, {
			name: 'Questions Count',
			value: 2
		}, {
			name: 'Times Taken',
			value: 3
		}];

		self.orderBy = {
			desending: false,
			selected: self.orderOptions[0]
		};

		self.sliderChanged = function sliderChanged(id) {
			switch (id) {
				case 'rating':
					self.quizQuery.minRating = self.ratingSlider.minValue;
					self.quizQuery.maxRating = self.ratingSlider.maxValue;
					break;
				case 'questions':
					self.quizQuery.minQuestions = self.questionsSlider.minValue;
					self.quizQuery.maxQuestions = self.questionsSlider.maxValue;
					break;
				default:
					break;
			}


		};

		self.ratingSlider = {
			minValue: 0,
			maxValue: 10,
			options: {
				floor: 0,
				ceil: 10,
				id: 'rating',
				draggableRange: true,
				hideLimitLabels: true,
				onChange: self.sliderChanged
			}
		};

		self.questionsSlider = {
			minValue: 1,
			maxValue: 100,
			options: {
				floor: 1,
				ceil: 100,
				id: 'questions',
				draggableRange: true,
				hideLimitLabels: true,
				onChange: self.sliderChanged
			}
		};

		self.init = function init() {
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
		};

		self.editActive = function editActive() {
			$sessionStorage.editQuiz = $scope.quiz;
			$location.path('/quizzes/edit');
		};

		self.deleteActive = function deleteActive() {
			var i = 0;

			$scope.$storage.find(function(element, index) {
				i = index;
				return element.id === $scope.quiz.id;
			});

			quizData.removeQuiz($scope.quiz.id)
				.then(function() {
					$scope.$storage.splice(i, 1);
				});
		};

		self.solveAlctive = function solveAlctive() {
			$sessionStorage.solveQuiz = $scope.quiz;
			$location.path('/quizzes/solve/' + $scope.quiz.id);
		};

		self.submitQuery = function submitQuery() {
			$scope.queryDissabled = true;
			console.log(self.quizQuery);
			quizData.getQuizzes(self.quizQuery)
				.then(function(result) {
					console.log(result);
					$scope.queryDissabled = false;
					$scope.$storage = result;
					self.currentPage = 1;
					$scope.quiz = $scope.$storage[0];
				});
		};

		self.getCategories = function getCategories(pattern) {
			return quizData.getCategories(pattern);
		};

		self.pageChanged = function pageChanged() {
			$scope.pageFlip = !$scope.pageFlip;

			$timeout(function() {
				$scope.quiz = $scope.$storage[self.currentPage - 1];
				$scope.pageFlip = !$scope.pageFlip;
			}, 500);
		};

		self.prevPage = function prevPage() {
			if (self.currentPage > 1) {
				self.currentPage--;
				self.pageChanged();
			}
		};

		self.nextPage = function nextPage() {
			if (self.currentPage < $scope.$storage.length) {
				self.currentPage++;
				self.pageChanged();
			}
		};

		self.rateQuiz = function rateQuiz() {
			console.log('rating...');
			quizData.rateQuiz($scope.quiz.id, $scope.quiz.rating)
				.then(function (response) {
					console.log(response);
					$scope.quiz.rating = response.rating;
				});
		};

		self.init();
	}

	angular.module('quizProjectApp.controllers')
		.controller('QuizzesController', [
			'$rootScope',
			'$scope',
			'$sessionStorage',
			'$location',
			'$timeout',
			'QuizDataService',
			'identity',
			QuizzesController
		]);
}());