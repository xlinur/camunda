'use strict';

var $ = window.jQuery = window.$ = require('jquery');

var commons = require('camunda-commons-ui/lib');
var sdk = require('camunda-commons-ui/vendor/camunda-bpm-sdk-angular');
var dataDepend = require('angular-data-depend');

var APP_NAME = 'cam.hub';

var angular = require('camunda-commons-ui/vendor/angular');

module.exports = function(pluginDependencies) {

  var ngDependencies = [
    'ng',
    'ngResource',
    commons.name
  ].concat(pluginDependencies.map(function(el) {
    return el.ngModuleName;
  }));

  var appNgModule = angular.module(APP_NAME, ngDependencies);

  var ModuleConfig = [
    '$routeProvider',
    'UriProvider',
    function(
      $routeProvider,
      UriProvider
    ) {
      $routeProvider.otherwise({ redirectTo: '/dashboard' });

      function getUri(id) {
        var uri = $('base').attr(id);
        if (!id) {
          throw new Error('Uri base for ' + id + ' could not be resolved');
        }

        return uri;
      }

      UriProvider.replace(':appName', 'hub');
      UriProvider.replace('app://', getUri('href'));
      UriProvider.replace('adminbase://', getUri('app-root') + '/app/admin/');
      UriProvider.replace('hub://', getUri('hub-api'));
      UriProvider.replace('admin://', getUri('hub-api') + '../admin/');
      UriProvider.replace('plugin://', getUri('hub-api') + 'plugin/');
      UriProvider.replace('engine://', getUri('engine-api'));

      UriProvider.replace(':engine', [ '$window', function($window) {
        var uri = $window.location.href;

        var match = uri.match(/\/app\/hub\/(\w+)(|\/)/);
        if (match) {
          return match[1];
        } else {
          throw new Error('no process engine selected');
        }
      }]);
    }];

  appNgModule.config(ModuleConfig);

  angular.bootstrap(document.documentElement, [ appNgModule.name, 'cam.hub.custom' ]);

  if (top !== window) {
    window.parent.postMessage({ type: 'loadamd' }, '*');
  }



};

module.exports.exposePackages = function(container) {
  container.angular = angular;
  container.jquery = $;
  container['camunda-commons-ui'] = commons;
  container['camunda-bpm-sdk-js'] = sdk;
  container['angular-data-depend'] = dataDepend;
  container['moment'] = require('camunda-commons-ui/vendor/moment');
  container['events'] = require('events');
};


/* live-reload
// loads livereload client library (without breaking other scripts execution)
$('body').append('<script src="//' + location.hostname + ':LIVERELOAD_PORT/livereload.js?snipver=1"></script>');
/* */
