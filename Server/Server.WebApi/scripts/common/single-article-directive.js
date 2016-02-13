(function(){
    'use strict';

    function singleArticle() {
        return {
            templateUrl: 'views/templates/single-article.html',
            restrict: 'AE',
            transclude: true,
            replace:true,
            scope: {
                articleImage: '@'
            },
            link: function($scope, $element, $attrs, ctrl, transclude) {
                console.log('Hello from singleArticle');
                $element.addClass('single-article');

                resolveTransclude($element, transclude);
            }
        };
    }

    function resolveTransclude($element, transclude) {
        transclude(function(clones) {
            angular.forEach(clones, function(clone) {
                // node type 3 is "text" node
                if (clone.nodeType === 3)  {
                    return;
                }

                var destinationId = clone.attributes['transclude-to'].value;
                var destination = $element.find('[transclude-id="'+ destinationId +'"]');

                if (destination.length) {

                    destination.append(clone);
                } else {
                    clone.remove();

                    throw new Error(
                        'Target not found. Please specify the correct transclude-to attribute.');
                }
            });
        });
    }

    angular.module('quizProjectApp.directives')
        .directive('singleArticle', [singleArticle]);
}());