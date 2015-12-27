(function() {
	'use strict';

	var DEFAULT_STORAGE = {
		quiz: {
			title: '',
			description: '',
			questions: []
		}
	};

	function CreateQuizController($scope, $uibModal, $sessionStorage, quizStorage) {
		var self = this;

		$sessionStorage.quiz = $sessionStorage.quiz || DEFAULT_STORAGE;
		$scope.$storage = $sessionStorage.quiz;

		self.addQuiz = function addQuiz(quiz, form) {
			quiz = JSON.parse(JSON.stringify(quiz));
			quizStorage.addQuiz(quiz);

			self.resetForm(form);
			console.log('bachka');
		};

		self.resetForm = function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();

			$sessionStorage.quiz = DEFAULT_STORAGE;
			$scope.$storage = $sessionStorage.quiz;
		};

		self.removeQuestion = function removeQuestion(index) {
			$sessionStorage.quiz.questions.splice(index, 1);
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
					$sessionStorage.quiz.questions.push(question);
				}

				console.log(self.quiz.questions);
			}, function() {
				console.log('Modal dismissed at: ' + new Date());
				console.log(self.bonus);
			});
		};
	}

	angular.module('quizProjectApp.controllers')
		.controller('CreateQuizController', ['$scope', '$uibModal', '$sessionStorage', 'quizStorageService', CreateQuizController]);
}());