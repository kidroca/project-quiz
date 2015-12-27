(function() {
	'use strict';

	// Todo: mark the correct answer with ng-class
	// Todo: remove button 

	function AddQuestionController($uibModalInstance, resource) {
		var self = this,
			letters = 'abcdefghijk',
			nextLetter = 0,
			backup = '';

		if (resource) {
			self.question = resource;
			nextLetter = resource.answers.length;
			backup = JSON.stringify(resource);
		} else {
			self.question = {
				title: '',
				answers: []
			};
		}

		self.ok = function() {
			if (backup) {
				// if backup exists this is an edit, no need to return the question
				$uibModalInstance.close(null);
			} else {
				// return the question to be added to the quiz
				$uibModalInstance.close(self.question);
			}
		};

		self.cancel = function() {
			if (backup) {
				restoreBackup(resource, backup);

				console.log(resource);
			}

			$uibModalInstance.dismiss('cancel');
		};

		self.addAnswer = function addAnswer() {
			self.question.answers.push({
				letter: letters[nextLetter++],
				text: ''
			});
		};
	}

	function restoreBackup(obj, backup) {
		var backupAsObject = JSON.parse(backup),
			prop;

		for (prop in backupAsObject) {
			obj[prop] = backupAsObject[prop];
		}
	}

	angular.module('quizProjectApp.controllers')
		.controller('AddQuestionController', ['$uibModalInstance', 'items', AddQuestionController]);
}());