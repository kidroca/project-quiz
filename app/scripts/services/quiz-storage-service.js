(function(){
	'use strict';

	function quizStorageService($localStorage) {
		
		function getQuizzes() {
			return $localStorage.quizzes.slice(0);
		}

		function addQuiz(quiz) {
			$localStorage.quizzes.push(quiz);
		}

		function removeQuiz(indexOrName) {
			if (isNumeric(indexOrName)) {
				removeByIndex(indexOrName);
			} else if (typeof indexOrName === 'string') {
				removeByName(indexOrName);
			} else {
				throw  new Error("Invalid Operation");
			}
		}

		function removeByIndex(index) {
			$localStorage.quizzes.splice(index, 1);
		}

		function removeByName(name) {
			$localStorage.quizzes = $localStorage.quizzes.filter(function(el) {
				return el.title !== name;
			});
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
		.factory('quizStorageService', ['$localStorage', quizStorageService]);

}());