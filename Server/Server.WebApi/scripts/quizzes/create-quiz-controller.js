(function() {
	'use strict';

	var DEFAULT_STORAGE = {
		title: '',
		description: '',
		category: '',
		completedCounter: 0,
		questions: []
	};

	function CreateQuizController($scope, $uibModal, $sessionStorage, $location, quizData, sidebarService) {
		var self = this;

		console.log('Hello from CreateQuizController');
		init(self, $scope, $sessionStorage, sidebarService);

		self.addQuiz = function addQuiz(quiz, form) {
			console.log('adding quiz...');
			console.log(quiz);
			quizData.addQuiz(angular.copy(quiz))
				.then(function(id) {
					console.log('quiz added (id: %s)', id);
					$scope.resetForm(form);
					$location.path('/quizzes');
				});
		};

		$scope.resetForm = function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();

			$sessionStorage.quiz = angular.copy(DEFAULT_STORAGE);
			$scope.quiz = $sessionStorage.quiz;
		};

		self.removeQuestion = function removeQuestion(index) {
			$scope.quiz.questions.splice(index, 1);
		};

		self.getCategories = function getCategories(pattern) {
			return quizData.getCategories(pattern);
		};

		self.openQuesitonMenu = function openQuesitonMenu(question) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/quiz/add-question.html',
				controller: 'AddQuestionController',
				controllerAs: 'ctrl',
				resolve: {
					items: question
				}
			});

			modalInstance.result.then(function(question) {
				if (question !== null) {
					$scope.quiz.questions.push(question);
				}
			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});
		};
	}

	function init(self, $scope, $sessionStorage, sidebarService) {
		$sessionStorage.quiz = $sessionStorage.quiz || angular.copy(DEFAULT_STORAGE);
		$scope.quiz = $sessionStorage.quiz;

		self.pageTitle = "Create A New Quiz";
		self.pageRoute = "Home » Quizzes » <strong class='sub-title'>Create</strong>";
		self.mainContentTemplate = "views/templates/add-quiz.html";
		self.sidebarTemplate = 'views/templates/side-content/recent.html';

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
		.controller('CreateQuizController', ['$scope',
			'$uibModal',
			'$sessionStorage',
			'$location',
			'QuizDataService',
			'sidebarService',
			CreateQuizController
		]);
}());