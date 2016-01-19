(function(){
	'use strict';

	function ResultController (quizData) {
		if (!quizData.resultResponse.title) {
			throw new Error('There is no solved quiz to display');
		}

		var self = this;

		self.result = quizData.resultResponse;

		self.getScore = function getScore () {
			var score = ((self.result.totalQuestions - self.result.wrongAnswers.length) / 
				self.result.totalQuestions) * 100;

			return Math.round(score);
		};
	}

	angular.module('quizProjectApp.controllers')
		.controller('ResultController', ['QuizDataService', ResultController]);
}());