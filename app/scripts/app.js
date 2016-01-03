(function() {
  'use strict';

  function config($routeProvider) {

    var CONTROLLER_VIEW_MODEL_REFERENCE = 'ctrl';

    var routeResolvers = {
      authenticated: ['$q', 'auth', function routeResolvers($q, auth) {
        if (auth.isAuthenticated()) {
          return true;
        }

        return $q.reject('not authorised');
      }]
    };

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/register', {
        templateUrl: 'views/identity/register.html',
        controller: 'RegisterController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/login', {
        templateUrl: 'views/identity/login.html',
        controller: 'LoginController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/me', {
        templateUrl: 'views/user/profile.html',
        controller: 'LoginController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/quizzes', {
        templateUrl: 'views/quiz/quizzes.html',
        controller: 'QuizzesController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/quizzes/add', {
        templateUrl: 'views/quiz/add-quiz.html',
        controller: 'CreateQuizController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE,
        resove: routeResolvers.authenticated
      })
      .when('/quizzes/edit', {
        templateUrl: 'views/quiz/add-quiz.html',
        controller: 'UpdateQuizController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE,
        resove: routeResolvers.authenticated
      })
      .when('/quizzes/solve/:id', {
        templateUrl: 'views/quiz/solve-quiz.html',
        controller: 'SolveQuizController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/quizzes/result', {
        templateUrl: 'views/quiz/result.html',
        controller: 'ResultController',
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

  function run($http, $cookies, $rootScope, $location, auth) {
    $rootScope.$on('$routeChangeError', function routeError(ev, current, previous, rejection) {
      if (rejection === 'not authorised') {
        $location.path('/');
      }
    });

    if (auth.isAuthenticated()) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('authentication');
      auth.getIdentity();
    }
  }

  angular.module('quizProjectApp.services', []);

  angular.module('quizProjectApp.filters', []);

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
      'ui.bootstrap',
      'quizProjectApp.filters',
      'quizProjectApp.controllers',
    ])
    .config(['$routeProvider', config])
    .run(['$http', '$cookies', '$rootScope', '$location', 'auth', run])
    .constant('baseUrl', 'http://localhost:42252/');
}());