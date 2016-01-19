(function(){
	'use strict';

	function SolveQuizController (
		$scope, $routeParams, $sessionStorage, $location, quizData) {
		var self = this;

		if (!$sessionStorage.solveQuiz) {
			throw new Error('No data for the quiz to be solved');
		}
			
		self.quiz = $sessionStorage.solveQuiz;

		self.questionsPerPage = 2;
		self.currentPage = 1;

		self.setQuestions = function setQuestions (questionsPerPage) {
			self.questionsPerPage = questionsPerPage;
			console.log(questionsPerPage);
		};

		self.pageChanged = function pageChanged () {
			
		};

		self.progress = function progress () {
			var total = self.quiz.questions.length,
				selected = self.quiz.questions.filter(function (question) {
					return question.selected !== undefined;
				}).length;

			var completedInPercent = (selected / total)	* 100;

			return completedInPercent;
		};

		self.submit = function submit (quiz) {
			var result = {
				id: quiz.id,
				questions: quiz.questions.filter(function (question) {
					return {
						title: question.title,
						selectedAnswer: question.selected
					};
				})
			};

			quizData.submitSolution(result)
				.then(function () {
					delete $sessionStorage.solveQuiz;
					$location.path('/quizzes/result');
				});
		};

		self.pageChanged();
	}

	angular.module('quizProjectApp.controllers')
		.controller('SolveQuizController', 
			['$scope', 
			'$routeParams',
			'$sessionStorage',
			'$location',
			'QuizDataService', 
			SolveQuizController]);
}());