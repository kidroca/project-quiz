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

  function config($routeProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('ls');

    var CONTROLLER_VIEW_MODEL_REFERENCE = 'ctrl';

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
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

  angular
    .module('quizProjectApp', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.sortable',
      'LocalStorageModule'
    ])
    .config(['$routeProvider', 'localStorageServiceProvider', config]);

}());