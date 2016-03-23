'use strict';

module.exports = [
  '$scope',
  '$location',
  'Views',
function($scope, $location, Views) {
  $scope.navbarVars = { read: [] };
  $scope.navbarActions = Views.getProviders({ component: 'cockpit.dashboard.section' });
  $scope.activeClass = function(plugin) {
    var path = $location.absUrl();
    var checked = plugin.id;
    if (checked === 'processes') {
      checked = 'process';
    }
    return path.indexOf(checked) != -1 ? "active" : "";
  };
}];
