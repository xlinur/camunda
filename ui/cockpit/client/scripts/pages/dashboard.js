'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');

var moment = require('moment');

var Controller = [
  '$scope',
  '$injector',
  'Views',
  'page',
  function(
  $scope,
  $injector,
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
    var dateDisplayFormat = 'YYYY-MM-DD HH:mm';
    var dateQueryFormat = 'YYYY-MM-DD[T]HH:mm:ss';
    $scope.selection = {
      start: null,
      sampling: 'minutes-15'
    };
    $scope.$watch('selection', function() {
      $scope.$broadcast('stats-time-range-change', {
        start: ($scope.selection.start ? moment($scope.selection.start, dateDisplayFormat) : moment()).format(dateQueryFormat),
        unit: $scope.selection.unit,
        count: $scope.selection.count
      });

      // mockData({
      //   unit: $scope.selection.unit,
      //   count: $scope.selection.count,
      //   start: ($scope.selection.start ? moment($scope.selection.start, dateDisplayFormat) : moment()).format('YYYY-MM-DD[T]HH:mm:ss')
      // }, function(err, data) {
      //   $scope.querying = false;
      //   if (err) { return; }
      //   console.info('data...', data);//es-lint-disable-line
      // });

    }, true);
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
