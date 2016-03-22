'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');

var Controller = [
  '$scope',
  'Views',
  'page',
function (
  $scope,
  Views,
  page
) {
  var $rootScope = $scope.$root;

  $scope.dashboardPlugins = Views.getProviders({
    component: 'cockpit.dashboard'
  });

  $rootScope.showBreadcrumbs = false;

  // reset breadcrumbs
  page.breadcrumbsClear();

  page.titleSet([
    'Camunda Cockpit',
    'Dashboard'
  ].join(' | '));
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
