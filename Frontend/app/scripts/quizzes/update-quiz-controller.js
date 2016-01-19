(function(){
	'use strict';

	function UpdateQuizController (
		$scope, $sessionStorage, $controller) {
		angular.extend(this, $controller('CreateQuizController', {$scope: $scope}));

		$scope.init = function init () {
			console.log('child init');
			$scope.quiz = $sessionStorage.editQuiz;
		};

		$scope.resetForm = function resetForm (form) {
			form.$setPristine();
			form.$setUntouched();

			delete $sessionStorage.editQuiz;
			$scope.quiz = {};
		};

		$scope.init();
	}

	angular.module('quizProjectApp.controllers')
		.controller('UpdateQuizController', 
			[
			'$scope' ,
			'$sessionStorage',
			'$controller',
			UpdateQuizController]);
}());