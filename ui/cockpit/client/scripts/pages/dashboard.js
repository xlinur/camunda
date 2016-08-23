'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');

var moment = require('moment');

var Controller = [
  '$scope',
  '$injector',
  '$interval',
  'Views',
  'page',
  function(
  $scope,
  $injector,
  $interval,
  Views,
  page
) {
    $scope.mainPlugins = [];
    $scope.miscPlugins = [];

    Views.getProviders({
      component: 'cockpit.dashboard.section'
    }).forEach(function(plugin) {
      (plugin.priority >= 0 ? $scope.mainPlugins : $scope.miscPlugins).push(plugin);
      if (plugin.getSparklineData) {
        if (typeof plugin.getSparklineData === 'function') {
          plugin.sparklineData = plugin.getSparklineData();
        }
        else if (Array.isArray(plugin.getSparklineData)) {
          plugin.sparklineData = $injector.invoke(plugin.getSparklineData);
        }
      }
    });

  // old plugins are still shown on the dashboard
    $scope.dashboardVars = { read: [ 'processData' ] };
    $scope.deprecateDashboardProviders = Views.getProviders({ component: 'cockpit.dashboard'});


    // $scope.$root.showBreadcrumbs = true;

  // reset breadcrumbs
    page.breadcrumbsClear();

    page.titleSet('Dashboard');

  // ----------------------------------------------------------------------------------------
    var dateDisplayFormat = 'YYYY-MM-DD HH:mm:ss';
    var dateQueryFormat = 'YYYY-MM-DD[T]HH:mm:ss';

    $scope.now = moment().format(dateDisplayFormat);

    var autoRefresh;
    function stopAutoRefresh() {
      if (autoRefresh) {
        $interval.cancel(autoRefresh);
        autoRefresh = undefined;
      }
    }



    $scope.selection = {
      start: null,
      sampling: 'seconds-15'
    };

    $scope.$watch('selection', function() {
      var options = {
        start: ($scope.selection.start && !$scope.selection.autoRefresh ? moment($scope.selection.start, dateDisplayFormat) : moment()).format(dateQueryFormat),
        unit: $scope.selection.unit,
        count: $scope.selection.count
      };

      $scope.$broadcast('stats-time-range-change', options);

      stopAutoRefresh();
      if ($scope.selection.autoRefresh) {
        $scope.now = moment().format(dateDisplayFormat);
        var millis = moment.duration(options.count, options.unit).asMilliseconds();

        autoRefresh = $interval(function() {
          $scope.now = moment().format(dateDisplayFormat);

          options.start = moment().format(dateQueryFormat);

          $scope.$broadcast('stats-refresh', options);
        }, Math.max(millis, 1000));
      }
    }, true);

    $scope.$on('$destroy', function() {
      stopAutoRefresh();
    });
  }];

var RouteConfig = [ '$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    template: template,
    controller: Controller,
    authentication: 'required',
    reloadOnSearch: false
  });
}];

module.exports = RouteConfig;
