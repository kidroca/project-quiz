(function(){
	'use strict';

	function quizStorageService(localStorage) {
		var myQuizzes = localStorage.get('myQuizzes') || [];

		function getQuizzes() {
			return myQuizzes.slice(0);
		}

		function addQuiz(quiz) {
			myQuizzes.push(quiz);
			updateStorage();
		}

		function removeQuiz(indexOrName) {
			if (isNumeric(indexOrName)) {
				removeByIndex(indexOrName);
			} else if (typeof indexOrName === 'string') {
				removeByName(indexOrName);
			} else {
				throw  new Error("Invalid Operation");
			}

			updateStorage();
		}

		function removeByIndex(index) {
			myQuizzes.splice(index, 1);
		}

		function removeByName(name) {
			myQuizzes = myQuizzes.filter(function(el) {
				return el.name !== name;
			});
		}

		function updateStorage() {
			localStorage.set('myQuizzes', myQuizzes);
		}

		function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        return {
        	getQuizzes: getQuizzes,
        	addQuiz: addQuiz,
        	removeQuiz: removeQuiz
        };
	}

	angular.module('quizProjectApp.services')
		.factory('quizStorageService', ['localStorageService', quizStorageService]);

}());