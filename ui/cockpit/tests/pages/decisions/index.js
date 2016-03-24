'use strict';

var Base = require('./../base');
var DeployedDecisionsListPage = require('./deployed-decisions-list');
var AuthenticationPage = require('../../../../common/tests/pages/authentication');

module.exports = Base.extend({

  url: '/camunda/app/cockpit/default/#/decisions',

  pluginList: function () {
    return element.all(by.css('.dashboard-view'));
  }
});

module.exports.deployedDecisionsList = new DeployedDecisionsListPage();
module.exports.authentication = new AuthenticationPage();
