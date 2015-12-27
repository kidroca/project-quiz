(function() {
	'use strict';

	// Todo: display a list of the created questions with ng-repeat
	// Todo: selecting a question from the list opens edit menu -> modal

	function CreateQuizController($scope, $uibModal, quizStorage) {
		var self = this;

		self.bonus = {
			title: 'spinderman',
			answers: [{text: 'as', letter: 'a'}, {text: 'bas', letter: 'b'}]
		};

		self.quiz = {
			title: '',
			description: '',
			questions: []
		};

		self.addQuiz = function addQuiz(quiz) {
			quizStorage.addQuiz(quiz);
		};

		self.addQuestion = function addQuestion(question) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/add-question.html',
				controller: 'AddQuestionController',
				controllerAs: 'ctrl',
				resolve: {
					items: question || self.bonus
				}
			});

			modalInstance.result.then(function(question) {
				if (question !== null) {
					self.quiz.questions.push(question);
				}

				console.log(self.quiz.questions);
			}, function() {
				console.log('Modal dismissed at: ' + new Date());
				console.log(self.bonus);
			});
		};
	}

	angular.module('quizProjectApp.controllers')
		.controller('CreateQuizController', ['$scope', '$uibModal', 'quizStorageService', CreateQuizController]);
}());