'use strict';

var fs = require('fs');

var template = fs.readFileSync(__dirname + '/processesLink.html', 'utf8');

var Configuration = function PluginConfiguration(ViewsProvider) {

  ViewsProvider.registerDefaultView('cockpit.navbar.action', {
    id: 'processes',
    template: template,
    priority: 200
  });
};

Configuration.$inject = ['ViewsProvider'];

module.exports = Configuration;
