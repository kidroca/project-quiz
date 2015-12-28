(function() {
	'use strict';

	// Todo: Redirect ot home on successfull form submit
	// Todo: Keep the curently editted question in sessionStorage to preserve it in case of close
	// if it exist pass it along on addQuestion()

	var DEFAULT_STORAGE = {
		quiz: {
			title: '',
			description: '',
			questions: []
		}
	};

	function CreateQuizController($scope, $uibModal, $sessionStorage, quizStorage) {
		var self = this;

		$sessionStorage.quiz = $sessionStorage.quiz || angular.copy(DEFAULT_STORAGE);
		$scope.$storage = $sessionStorage.quiz;

		self.addQuiz = function addQuiz(quiz, form) {
			// quiz = JSON.parse(JSON.stringify(quiz));
			quizStorage.addQuiz(angular.copy(quiz));

			self.resetForm(form);
			console.log('bachka');
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

		self.openQuesitonMenu = function openQuesitonMenu(question) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/add-question.html',
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
	}

	angular.module('quizProjectApp.controllers')
		.controller('CreateQuizController', ['$scope', '$uibModal', '$sessionStorage', 'quizStorageService', CreateQuizController]);
}());