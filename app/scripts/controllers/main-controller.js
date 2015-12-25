(function() {
	'use strict';

	function MainController($scope, ls) {
		var self = this,
			todosInStorage = ls.get('todos');

		self.todos = todosInStorage || [];

		$scope.$watch('ctrl.todos', function syncStorageTodos() {
			ls.set('todos', self.todos);
		}, true);

		self.addTodo = function addTodo() {
			self.todos.push($scope.todo);
			$scope.todo = '';
		};

		self.removeTodo = function(index) {
			self.todos.splice(index, 1);
		};

		self.log = function log() {
			console.log($scope);
		};
	}
	
	/**
	 * @ngdoc function
	 * @name quizProjectApp.controller:MainCtrl
	 * @description
	 * # MainCtrl
	 * Controller of the quizProjectApp
	 */
	angular.module('quizProjectApp')
		.controller('MainController', ['$scope', 'localStorageService', MainController]);
}());