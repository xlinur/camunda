'use strict';

module.exports = [
  '$scope',
  'Views',
function($scope, Views) {
  $scope.navbarVars = { read: [] };
  $scope.navbarActions = Views.getProviders({ component: 'cockpit.navbar.action' });
}];
