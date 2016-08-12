'use strict';
/* jshint browserify: true */
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/user-profile.html', 'utf8');
var angular = require('camunda-commons-ui/vendor/angular');

module.exports = ['camAPI', function(camAPI) {
  return {
    restrict: 'A',

    template: template,

    scope: {
      username: '='
    },

    replace: true,

    link: function($scope) {
      $scope.processing = false;
      $scope.user = {
        id: $scope.username
      };

      var userResource = camAPI.resource('user');

      userResource.profile({
        id: $scope.user.id
      }, function(err, data) {
        angular.extend($scope.user, data);
      });

      $scope.submit = function() {
        $scope.processing = true;
        userResource.updateProfile($scope.user, function(err) {
          $scope.processing = false;
          if (!err) {
            $scope.userProfile.$setPristine();
          }
        });
      };
    }
  };
}];