(function() {
  'use strict';
  var BASE_URL = "http://superquiz.apphb.com/";
  var DEFAULT_TEMPLATE_URL = 'views/templates/default-layout.html';

  function config($routeProvider) {

    var CONTROLLER_VIEW_MODEL_REFERENCE = 'ctrl';

    var routeResolvers = {
      authenticated: ['$q', 'auth', function ($q, auth) {
        console.log('route resolve');
        if (auth.isAuthenticated()) {
          return true;
        }

        return $q.reject('not authorised');
      }]
    };

    var solveQuizResolvers = {
      loadQuizIfNeeded: ['$q', '$route', '$sessionStorage', 'QuizDataService',
        function solveQuizResolvers($q, $route, $sessionStorage, QuizDataService) {

          if (!$sessionStorage.solveQuiz || $sessionStorage.solveQuiz.id !== +$route.current.params.id) {
            var deffered = $q.defer();

            QuizDataService.getQuiz($route.current.params.id)
              .then(function(result) {
                console.log(result);
                $sessionStorage.solveQuiz = result;
                deffered.resolve(true);
              }, function (error) {
                deffered.reject(error);
              });

              return deffered.promise;
          } else {
            return true;
          }
        }
      ]
    };

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
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
        templateUrl: DEFAULT_TEMPLATE_URL,
        controller: 'ProfileController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE,
        resolve: routeResolvers.authenticated
      })
      .when('/quizzes', {
        templateUrl: DEFAULT_TEMPLATE_URL,
        controller: 'QuizzesController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      .when('/quizzes/create', {
        templateUrl: DEFAULT_TEMPLATE_URL,
        controller: 'CreateQuizController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE,
        resolve: routeResolvers.authenticated
      })
      //.when('/quizzes/edit', {
      //  templateUrl: 'views/quiz/add-quiz.html',
      //  controller: 'UpdateQuizController',
      //  controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE,
      //  resolve: routeResolvers.authenticated
      //})
      .when('/quizzes/solve/:id', {
        templateUrl: DEFAULT_TEMPLATE_URL,
        controller: 'SolveQuizController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE,
        resolve: solveQuizResolvers.loadQuizIfNeeded
      })
      .when('/quizzes/result', {
        templateUrl: 'views/quiz/quiz-result.html',
        controller: 'ResultController',
        controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      })
      //.when('/about', {
      //  templateUrl: 'views/about.html',
      //  controller: 'AboutCtrl',
      //  controllerAs: CONTROLLER_VIEW_MODEL_REFERENCE
      //})
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

  angular.module('quizProjectApp.directives', []);

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
      'toggle-switch',
      'ngToast',
      'quizProjectApp.services',
      'quizProjectApp.filters',
      'quizProjectApp.directives',
      'quizProjectApp.controllers'
    ])
    .config(['$routeProvider', config])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('responseInterceptor');
    }])
    .run(['$http', '$cookies', '$rootScope', '$location', 'auth', run])
    .constant('baseUrl', BASE_URL);
}());