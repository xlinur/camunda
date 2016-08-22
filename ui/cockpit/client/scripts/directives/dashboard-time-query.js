'use strict';

var fs = require('fs');

var template = fs.readFileSync(__dirname + '/dashboard-time-query.html', 'utf8');


module.exports = function() {
  return {
    scope: {
      selection: '='
    },

    replace: true,

    template: template,

    controller: ['$scope', function($scope) {
      $scope.display = {
        start: $scope.selection.start,
        end:  $scope.selection.start,
        diff: null
      };

      // function updateDisplay(data) {
      //   var start = new Date(data[0].timestamp);
      //   var end = new Date(data[data.length - 1].timestamp);

      //   $scope.display.start = moment(start).format(dateFormat);
      //   $scope.display.end = moment(end).format(dateFormat);

      //   $scope.display.diff = moment.duration(Math.abs(start.getTime() - end.getTime())).humanize();
      // }

      function parseSampling(val) {
        var parts = val.split('-');
        return {
          unit: parts[0],
          count: parseInt(parts[1], 10)
        };
      }

      $scope.querying = false;
      function updateDuration() {
        $scope.querying = true;
        var sampling = parseSampling($scope.selection.sampling);
        $scope.selection.unit = sampling.unit;
        $scope.selection.count = sampling.count;
        // mockData({
        //   unit: sampling.unit,
        //   count: sampling.count,
        //   start: ($scope.selection.start ? moment($scope.selection.start, dateFormat) : moment()).format('YYYY-MM-DD[T]HH:mm:ss')
        // }, function(err, data) {
        //   $scope.querying = false;
        //   if (err) { return; }
        //   $scope.$apply(function() {
        //     updateDisplay(data);
        //   });
        // });
      }

      $scope.updateDuration = updateDuration;
      // updateDuration();
    }]
  };
};