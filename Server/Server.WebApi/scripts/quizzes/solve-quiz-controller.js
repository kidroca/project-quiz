(function(){
	'use strict';

	function SolveQuizController (
		$scope, $routeParams, $sessionStorage, $location, quizData, sidebarService) {
		var self = this;

		console.log('Hello from SolveQuizController');
		if (!$sessionStorage.solveQuiz) {
			throw new Error('No data for the quiz to be solved');
		}

		init(self, $scope, $sessionStorage, sidebarService);

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

	function init(self, $scope, $sessionStorage, sidebarService) {
		self.quiz = $sessionStorage.solveQuiz;

		self.pageTitle = self.quiz.title;
		self.pageRoute = "Home » Quizzes » <strong class='sub-title'>Solve</strong>";
		self.mainContentTemplate = "views/quiz/solve-quiz.html";
		self.sidebarTemplate = 'views/templates/side-content/recent.html';

		self.questionsPerPage = 2;
		self.currentPage = 1;

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
		.controller('SolveQuizController', 
			['$scope', 
			'$routeParams',
			'$sessionStorage',
			'$location',
			'QuizDataService',
			'sidebarService',
			SolveQuizController]);
}());