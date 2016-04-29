'use strict';

var fs = require('fs');

var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');

var angular = require('camunda-commons-ui/vendor/angular');

var Controller = ['$scope', 'page', function ($scope, page) {

  $scope.$root.showBreadcrumbs = true;

  page.titleSet('Dashboard');

  page.breadcrumbsClear();
}];

module.exports = [ '$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    template: template,
    controller: Controller,
    authentication: 'required',
    reloadOnSearch: false
  });
}];
