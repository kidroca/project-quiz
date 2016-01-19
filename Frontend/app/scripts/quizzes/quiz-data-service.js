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
					// alert(error);
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
					// alert(error);
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
					deffered.resolve(response.data);
				});

			return deffered.promise;
		};

		this.getQuizzes = function getQuizzes(query) {
			var deffered = $q.defer();

				$http.get(baseUrl + 'api/quizzes', {
					params: query
				})
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

		this.rateQuiz = function rateQuiz(id, value) {
			var deffered = $q.defer();

			$http.post(baseUrl + 'api/quizzes/rate/' + id + '?value=' + value)
				.then(function (response) {
					deffered.resolve(response.data);
				}, function (error) {
					deffered.reject(error);
				});

			return deffered.promise;	
		};

		this.resultResponse = {};
	}

	angular.module('quizProjectApp.services')
		.service('QuizDataService', ['$http', '$q', 'baseUrl', QuizDataService]);
}());