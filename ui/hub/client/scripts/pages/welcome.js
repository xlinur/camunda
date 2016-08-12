'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/welcome.html', 'utf8');

// var Controller = [
//   '$scope',
//   'Views',
//   function(
//   $scope,
//   Views
// ) {
//     console.info($scope.$root);//es-lint-disable-line
//     $scope.mainPlugins = [];
//     $scope.miscPlugins = [];

//     Views.getProviders({
//       component: 'hub.welcome.section'
//     }).forEach(function(plugin) {
//       (plugin.priority >= 0 ? $scope.mainPlugins : $scope.miscPlugins).push(plugin);
//     });
//   }];

var RouteConfig = [ '$routeProvider', function($routeProvider) {
  $routeProvider.when('/welcome', {
    template: template,
    // controller: Controller,
    controller: function() {},
    authentication: 'required',
    reloadOnSearch: false
  });
}];

module.exports = RouteConfig;
