'use strict';

var angular = require('camunda-commons-ui/vendor/angular');
var camAPI = require('./../../../../common/scripts/services/cam-api');

var servicesModule = angular.module('cam.hub.services', []);

servicesModule.factory('camAPI', camAPI);

module.exports = servicesModule;
