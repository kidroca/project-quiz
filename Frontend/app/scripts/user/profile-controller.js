(function () {
    'use strict';

    function ProfileController($scope, identity, sidebarService, defaultAvatar) {
        var self = this;

        console.log('Hello From Profile Controller');
        init(self, $scope, identity, sidebarService);

        self.defaultAvatar = defaultAvatar;
    }

    function init(self, $scope, identity, sidebarService) {
        self.pageTitle = "Your Profile";
        self.pageRoute = "Home » <strong class='sub-title'>Profile</strong>";
        self.mainContentTemplate = "views/templates/profile-widget.html";
        self.sidebarTemplate = 'views/templates/side-content/recent.html';

        sidebarService.getComments()
            .then(function(comments) {
                self.comments = comments;
            });

        sidebarService.getPosts()
            .then(function(recent) {
                self.recent = recent;
            });

        identity.getUser()
            .then(function (user) {
                $scope.user = user;
            });
    }

    angular.module('quizProjectApp.controllers')
        .controller('ProfileController', [
            '$scope',
            'identity',
            'sidebarService',
            'defaultAvatar',
            ProfileController]);
}());