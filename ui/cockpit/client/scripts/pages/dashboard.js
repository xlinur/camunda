'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');

var angular = require('camunda-commons-ui/vendor/angular');
var each = angular.forEach;

var Controller = [
  '$scope',
  'Views',
  'Data',
  'dataDepend',
  // 'decisionDefinition',
  'page',
function (
  $scope,
  Views,
  Data,
  dataDepend,
  // decisionDefinition,
  page
) {
  var $rootScope = $scope.$root;

  var processData = $scope.processData = dataDepend.create($scope);

  Data.instantiateProviders('cockpit.dashboard.data', {
    $scope: $scope,
    processData: processData
  });

  var procStats = $scope.procDefStats = {
    definitions: {
      value: 0,
      label: [
        'process definition',
        'process definitions'
      ]
    },
    instances: {
      value: 0,
      label: [
        'running instance',
        'running instances'
      ]
    },
    incidents: {
      value: 0,
      label: [
        'incident',
        'incidents'
      ]
    },
    failedJobs: {
      value: 0,
      label: [
        'failed job',
        'failed jobs'
      ]
    }
  };

  $scope.gimmeDaLabel = function (prop) {
    return prop.label[(prop.value === 1) ? 0 : 1];
  };
  $scope.gimmeDaValue = function (count) {
    return count === 0 ? 'No' : count;
  };

  // should I mention how much I love AngularJS?
  $scope.procDefStatsKeys = Object.keys($scope.procDefStats);

  processData.observe('processDefinitionStatistics', function (defStats) {
    console.info();
    each(defStats, function (stats) {
      procStats.instances.value += stats.instances || 0;
      procStats.failedJobs.value += stats.failedJobs || 0;
      procStats.definitions.value++;
      procStats.incidents.value = stats.incidents.length;
    });
  });








  // var decisionData = $scope.decisionData = dataDepend.create($scope);

  // decisionData.provide('decisionDefinition', decisionDefinition);


  // decisionData.observe('allDefinitions', [ 'decisionDefinition', function(decisionDefinition) {
  //   console.info('decisionDefinition', decisionDefinition);
  // }]);


  var reportPlugins = $scope.reportPlugins = Views.getProviders({
    component: 'cockpit.report'
  });
  console.info('reportPlugins', reportPlugins);




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
