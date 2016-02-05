'use strict';

var fs = require('fs');

var repositoryLinkTemplate = fs.readFileSync(__dirname + '/repositoryLink.html', 'utf8');

var Configuration = function PluginConfiguration(ViewsProvider) {

  ViewsProvider.registerDefaultView('cockpit.navbar.action', {
    id: 'repository-link',
    template: repositoryLinkTemplate,
    priority: 150
  });
};

Configuration.$inject = ['ViewsProvider'];

module.exports = Configuration;
