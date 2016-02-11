(function(){
    'use strict';

    function singleArticle() {
        return {
            templateUrl: 'single-article.html',
            restrict: 'AE',
            link: function($scope, $element, $attrs) {
                
            }
        }
    }

    angular.module('quizProjectApp.directives')
        .directive('singleArticle', [singleArticle]);
}());