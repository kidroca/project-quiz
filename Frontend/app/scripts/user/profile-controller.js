(function () {
    'use strict';

    var recentPosts = {
            title: 'Recent Posts',
            content: 'Rhoncus quis, varius sed velit. Mauris quis nunc eu nunc molestie egestas et sit amet odio. Morbi lacinia velit in nibh sodales sed pharetra sem feugiat. Vivamus ut cursus augue. Integer sit amet arcu lorem, at egestas tellus. Phasellus tellus orci, congue at tristique at, mattis ut arcu. Donec dictum eros eu felis laoreet egestas. Nullam adipiscing nibh id felis lacinia a iaculis nisi vestibulum. Ut sit amet urna enim, at accumsan quam. Nunc dui elit, hendrerit quis convallis sit amet, dapibus in metus. Ut dolor est, blandit a auctor vitae, accumsan id eros. Vivamus bibendum dolor eget lacus hendrerit et egestas risus tincidunt. Vivamus convallis magna sit amet orci vehicula suscipit. Quisque rhoncus lorem in ligula condimentum sollicitudin at a massa. Donec mattis, libero at euismod semper, magna est bibendum arcu, sit amet tempor lacus mi nec felis. Vestibulum erat ante, laoreet et dignissim ac, blandit dictum elit. Cras auctor iaculis mi at blandit. Fusce id velit metus. Duis turpis ante, consequat a hendrerit nec, biben'
        };

    var recentComments = {
        title: 'Recent Comments',
        items: [
            'Sed neque ipsum pulvinar eu trist',
            'Cras eu eros id dui porttitor luctus',
            'Vivamus vitae nibh id quam conv',
            'Aenean vulputate fermentum ante rhoncus pulvinar',
            'Ut sagittis ultrices urna eget erat purusSed neque ipsum pulvinar eu',
            'Cras eu eros id dui porttitor luctus',
            'Vivamus vitae nibh id quam convallis'
        ]
    };

    function trimSideContent(content) {
        return content.slice(0, 300);
    }

    function trimComment(comment) {
        return comment.slice(0, 'Cras eu eros id dui porttitor luctus'.length);
    }

    function getComments() {
        var result = {
            title: recentComments.title,
            items: []
        };

        angular.forEach(recentComments.items, function(item) {
            result.items.push(trimComment(item));
        });

        return result;
    }

    function getPosts() {
        return {
            title: recentPosts.title,
            content: trimSideContent(recentPosts.content)
        };
    }

    function ProfileController() {
        var self = this;

        console.log('Hello From Profile Controller');

        self.pageTitle = "Your Profile";
        self.pageRoute = "Home » <strong class='sub-title'>Profile</strong>";
        self.mainContentTemplate = "views/profile/profile.html";

        // Todo: assign a template
        self.sidebarTemplate = 'views/templates/side-content/recent.html';

        self.comments = getComments();
        self.recent = getPosts();

        self.user = {
            username: 'Pesho',
            avatarUrl: 'http://findicons.com/files/icons/1072/face_avatars/300/i05.png',
            registeredOn: new Date()
        };
    }

    angular.module('quizProjectApp.controllers')
        .controller('ProfileController', [ProfileController]);
}());