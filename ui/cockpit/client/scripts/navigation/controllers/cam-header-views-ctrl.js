'use strict';

module.exports = [
  '$scope',
  '$location',
  'Views',
function($scope, $location, Views) {
  $scope.navbarVars = { read: [] };
  $scope.navbarActions = Views.getProviders({ component: 'cockpit.navbar.action' });

  $scope.activeClass = function(link) {
    var path = $location.absUrl();
    var checked = link;
    if (link === 'processes') {
      checked = 'process';
    }
    return path.indexOf(checked) != -1 ? "active" : "";
  };
}];
