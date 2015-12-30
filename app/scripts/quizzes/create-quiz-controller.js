(function() {
	'use strict';

	var DEFAULT_STORAGE = {
		quiz: {
			title: '',
			description: '',
			category: '',
			completedCounter: 0,
			questions: []
		}
	};

	function CreateQuizController($scope, $uibModal, $sessionStorage, $location, quizStorage) {
		var self = this;

		self.init = function init() {
			$sessionStorage.quiz = $sessionStorage.quiz || angular.copy(DEFAULT_STORAGE);
			$scope.$storage = $sessionStorage.quiz;
		};

		self.addQuiz = function addQuiz(quiz, form) {
			// quiz = JSON.parse(JSON.stringify(quiz));
			quiz.createdOn = (new Date()).toDateString();
			quizStorage.addQuiz(angular.copy(quiz));

			self.resetForm(form);
			$location.path("/quizzes");
		};

		self.resetForm = function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();

			$sessionStorage.quiz = angular.copy(DEFAULT_STORAGE);
			$scope.$storage = $sessionStorage.quiz;
		};

		self.removeQuestion = function removeQuestion(index) {
			$scope.$storage.quiz.questions.splice(index, 1);
		};

		self.getCategories = function getCategories () {
			return quizStorage.getCategories();
		};

		self.openQuesitonMenu = function openQuesitonMenu(question) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/quiz/add-question.html',
				controller: 'AddQuestionController',
				controllerAs: 'ctrl',
				resolve: {
					items: question
				}
			});

			modalInstance.result.then(function(question) {
				if (question !== null) {
					$scope.$storage.quiz.questions.push(question);
				}

				console.log($sessionStorage.quiz);
			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});
		};

		self.init();
	}

	angular.module('quizProjectApp.controllers')
		.controller('CreateQuizController', ['$scope', '$uibModal', '$sessionStorage', '$location', 'quizStorageService', CreateQuizController]);
}());