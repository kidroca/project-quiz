(function() {
	'use strict';

	function CreateQuizController($scope, quizStorage) {
		var self = this;
		
		self.addQuiz = function addQuiz(quiz) {
			quizStorage.addQuiz(quiz);
		};
	}
	
	/**
	 * @ngdoc function
	 * @name quizProjectApp.controller:MainCtrl
	 * @description
	 * # MainCtrl
	 * Controller of the quizProjectApp
	 */
	angular.module('quizProjectApp.controllers')
		.controller('CreateQuizController', ['$scope', 'quizStorageService', CreateQuizController]);
}());