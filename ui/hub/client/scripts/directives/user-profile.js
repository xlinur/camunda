'use strict';
/* jshint browserify: true */
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/user-profile.html', 'utf8');
var angular = require('camunda-commons-ui/vendor/angular');

var _letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
function letterColor(letter) {
  var hex = '' + Math.round((255 / 26) * (_letters.indexOf(letter.toLowerCase()) + 1)).toString(16);
  if (hex.length === 1) {
    hex = '0' + hex;
  }
  return hex;
}

function nameColor(first, last) {
  return '#0' + (first ? letterColor(first[0]) : '00') + (last ? letterColor(last[0]) : '00') + '0';
}

module.exports = ['camAPI', 'Notifications', function(camAPI, Notifications) {
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
      $scope.portraitBGColor = '#000000';

      var userResource = camAPI.resource('user');

      $scope.$watch('user', function() {
        $scope.portraitBGColor = nameColor($scope.user.firstName, $scope.user.lastName);
      }, true);

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

            Notifications.addMessage({
              status: 'Changes saved',
              message: '',
              http: true,
              exclusive: [ 'http' ],
              duration: 5000
            });
          }
          else {
            Notifications.addMessage({
              status: 'Error while saving',
              message: err.message,
              http: true,
              exclusive: [ 'http' ],
              duration: 5000
            });
          }
        });
      };
    }
  };
}];