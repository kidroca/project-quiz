'use strict';

describe('Controller: MainController', function() {

  // load the controller's module
  beforeEach(module('quizProjectApp'));

  var MainController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MainController = $controller('MainController', {
      $scope: scope
        // place here mocked dependencies
    });
  }));

  it('should be empty at start', function() {
    expect(MainController.todos.length).toBe(0);
  });

  it('should add items to the list', function() {
    scope.todo = 'Test 1';
    MainController.addTodo();
    expect(MainController.todos.length).toBe(1);
  });

  it('should remove items from the list', function() {
    scope.todo = 'Test 1';
    MainController.addTodo();
    MainController.removeTodo(0);
    expect(MainController.todos.length).toBe(0);
  });

  it('should store data in local storage', inject(['localStorageService', function(ls) {
    scope.todo = 'Test 1';
    
    MainController.addTodo();
    expect(MainController.todos.length).toBe(1);
    scope.$digest();

    expect(ls.get('todos').length).toBe(1);
  }]));

});