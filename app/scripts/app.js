/**
 * @ngdoc overview
 * @name quizProjectApp
 * @description
 * # quizProjectApp
 *
 * Main module of the application.
 */
(function() {
  'use strict';

  function config($routeProvider) {

    var CONTROLLER_VIEW_MODEL_REFERENCE = 'ctrl';

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/quizzes', {
        templateUrl: 'views/quizzes.html',
        controller: 'QuizzesController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/add', {
        templateUrl: 'views/add-quiz.html',
        controller: 'CreateQuizController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .otherwise({
        redirectTo: '/'
      });
  }

    angular.module('quizProjectApp.services', []);

    angular.module('quizProjectApp.controllers', ['quizProjectApp.services']);

    angular
    .module('quizProjectApp', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ngStorage',
      'ui.sortable',
      'ui.bootstrap',
      'quizProjectApp.controllers',
    ])
    .config(['$routeProvider', config]);

}());