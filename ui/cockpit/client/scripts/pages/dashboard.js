'use strict';

var fs = require('fs');
var template = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');
var moment = require('moment');



function mockData(opts, done) {

  setTimeout(function() {
    done(null, {});
  }, 100);
}


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
    var dateFormat = 'YYYY-MM-DD HH:mm';

    $scope.selection = {
      start: moment().format(dateFormat),
      amount: 15,
      unit: 'seconds',
      samples: 200
    };

    $scope.durationEl = {
      min: 15,
      max: 45,
      step: 15
    };

    $scope.display = {
      start: $scope.selection.start,
      end:  $scope.selection.start,
      diff: null
    };

    function updateDisplay() {
      var sel = $scope.selection;
      console.info('updateDisplay');//es-lint-disable-line
      var recs = sel.samples;
      var start = moment(sel.start, dateFormat);
      var end = start.clone().subtract(recs * sel.amount, sel.unit);

      $scope.display.start = sel.start;
      $scope.display.end = end.format(dateFormat);

      $scope.display.diff = moment.duration(end, start).humanize();
    }

    var mappings = {
      seconds: {
        min: 15,
        max: 45,
        step: 15
      },
      minutes: {
        min: 1,
        max: 59,
        step: 1
      },
      hours: {
        min: 1,
        max: 23,
        step: 1
      },
      days: {
        min: 1,
        max: 6,
        step: 1
      },
      weeks: {
        min: 1,
        max: 3,
        step: 1
      },
      months: {
        min: 1,
        max: 11,
        step: 1
      },
      years: {
        min: 1,
        max: 10,
        step: 1
      }
    };
    function updateDuration() {
      var sel = $scope.selection;
      var el = $scope.durationEl;
      var map = mappings[sel.unit];
      console.info('updateDuration');//es-lint-disable-line

      el.step = map.step || 1;

      el.min = map.min || 1;
      if (sel.duration < el.min || !sel.amount) {
        console.info('smaller (or missing) than', sel.amount, el.min);//es-lint-disable-line
        $scope.selection.amount = el.min;
        $scope.timeRange.amount.$setViewValue(el.min);
      }

      el.max = map.max || 1;
      if (sel.duration > el.max) {
        console.info('bigger than', sel.duration, el.max);//es-lint-disable-line
        $scope.selection.amount = el.max;
        $scope.timeRange.amount.$setViewValue(el.max);
      }

      console.info('updateDuration...', $scope.selection.amount,//es-lint-disable-line
        $scope.timeRange ? $scope.timeRange.amount.$viewValue : null,//es-lint-disable-line
        $scope.timeRange ? $scope.timeRange.amount.$modelValue : null);//es-lint-disable-line

      mockData({}, function(err, data) {
        if (err) { return; }
        console.info('data', data);//es-lint-disable-line
        updateDisplay();
      });
    }
    $scope.updateDuration = updateDuration;
    updateDuration();
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
