'use strict';

var fs = require('fs');

var template = fs.readFileSync(__dirname + '/dashboard-time-query.html', 'utf8');
// var moment = require('moment');

module.exports = function() {
  return {
    scope: {
      selection: '=',
      now: '='
    },

    replace: true,

    template: template,

    controller: ['$scope', function($scope) {
      $scope.display = {
        start: $scope.selection.start,
        end:  $scope.selection.start,
        diff: null
      };

      function parseSampling(val) {
        var parts = val.split('-');
        return {
          unit: parts[0],
          count: parseInt(parts[1], 10)
        };
      }
      var parsed = parseSampling($scope.selection.sampling);
      if ($scope.selection.count !== parsed.count) {
        $scope.selection.count = parsed.count;
      }
      if ($scope.selection.unit !== parsed.unit) {
        $scope.selection.unit = parsed.unit;
      }

      $scope.querying = false;
      function updateDuration() {
        $scope.querying = true;
        var sampling = parseSampling($scope.selection.sampling);
        $scope.selection.unit = sampling.unit;
        $scope.selection.count = sampling.count;
      }

      $scope.updateDuration = updateDuration;
    }]
  };
};