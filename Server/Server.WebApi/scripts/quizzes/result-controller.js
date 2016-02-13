(function(){
	'use strict';

	function ResultController (quizData) {
		var self = this;
		init(self);

		quizData.resultResponse
			.then(function(response) {
				if (!response.title) {
					throw new Error('There is no solved quiz to display');
				}

				self.result = response;
				self.pageTitle = 'Result for "' + response.title + '"';
			});

		self.getScore = function getScore () {
			if (!self.result.totalQuestions) {
				return;
			}

			var score = ((self.result.totalQuestions - self.result.wrongAnswers.length) / 
				self.result.totalQuestions) * 100;

			return Math.round(score);
		};
	}

	function init(self) {
		self.pageRoute = "Home » Quizzes » <strong class='sub-title'>Result</strong>";
		self.mainContentTemplate = "views/quiz/solve-quiz.html";
		self.sidebarTemplate = 'views/templates/side-content/recent.html';
		self.result = {};
	}

	angular.module('quizProjectApp.controllers')
		.controller('ResultController', ['QuizDataService', ResultController]);
}());