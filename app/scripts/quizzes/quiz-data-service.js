(function() {
	'use strict';

	function QuizDataService($http, $q, baseUrl) {
		var self = this;

		this.addQuiz = function addQuiz(quiz) {
			var deffered = $q.defer();
			$http.post(baseUrl + 'api/quizzes', quiz)
				.then(function(response) {
					console.log(response);
					deffered.resolve(response.data);
				}, function(error) {
					deffered.reject(error);
					alert(error);
				});

			return deffered.promise;
		};

		this.removeQuiz = function removeQuiz(id) {
			var deffered = $q.defer();
			console.log('deleting...');

			$http.delete(baseUrl + 'api/quizzes/' + id)
				.then(function(response) {
					console.log('deleted');
					console.log(response);
					deffered.resolve(response);
				}, function(error) {
					deffered.reject(error);
					alert(error);
				});

			return deffered.promise;
		};

		this.getCategories = function getCategories(pattern) {
			if (!pattern) {
				return;
			}

			var deffered = $q.defer();
			$http.get(baseUrl + 'api/quizzes/categories?pattern=' + pattern)
				.then(function(response) {
					console.log(response);
					deffered.resolve(response.data);
				});

			return deffered.promise;
		};

		this.getQuizzes = function getQuizzes(query) {
			var deffered = $q.defer(),
				url = baseUrl + 'api/quizzes';

			if (query !== null) {
				url += '?' + toQueryString(query);
				console.log(url);
			}

			$http.get(url)
				.then(function(response) {
					console.log(response);
					deffered.resolve(response.data);
				}, function(error) {
					deffered.reject(error);
				});

			return deffered.promise;
		};

		this.getQuiz = function getQuiz(id) {
			var deffered = $q.defer();

			$http.get(baseUrl + 'api/quizzes/' + id)
				.then(function(response) {
					deffered.resolve(response.data);
				}, function(error) {
					deffered.reject(error);
				});

			return deffered.promise;
		};

		this.submitSolution = function submitSolution(quiz) {
			var deffered = $q.defer();

			$http.post(baseUrl + 'api/quizzes/solve', quiz)
				.then(function(response) {
					self.resultResponse = response.data;
					deffered.resolve(response.data);
				}, function(error) {
					deffered.reject(error);
				});

			return deffered.promise;
		};

		this.resultResponse = {};
	}

	function toQueryString(obj) {
		var str = [];
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		}

		return str.join("&");
	}

	angular.module('quizProjectApp.services')
		.service('QuizDataService', ['$http', '$q', 'baseUrl', QuizDataService]);
}());