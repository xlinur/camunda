'use strict';

var angular = require('camunda-commons-ui/vendor/angular'),
    processesLink = require('./plugins/processesLink'),
    repositoryLink = require('./plugins/repositoryLink'),
    reportsLink = require('./plugins/reportsLink'),
    camHeaderViewsCtrl = require('./controllers/cam-header-views-ctrl');

var navigationModule = angular.module('cam.cockpit.navigation', []);

navigationModule.controller('camHeaderViewsCtrl', camHeaderViewsCtrl);

navigationModule.config(processesLink);
navigationModule.config(repositoryLink);
navigationModule.config(reportsLink);


module.exports = navigationModule;
