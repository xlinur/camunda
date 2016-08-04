'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');

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
    var $rootScope = $scope.$root;
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


    $rootScope.showBreadcrumbs = true;

  // reset breadcrumbs
    page.breadcrumbsClear();

    page.titleSet('Dashboard');
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
