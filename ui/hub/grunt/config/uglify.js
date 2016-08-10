module.exports = function(config, uglifyConfig) {
  'use strict';

  uglifyConfig.hub_scripts = {
    files: {
      '<%= pkg.gruntConfig.hubBuildTarget %>/scripts/camunda-hub-ui.js': ['<%= pkg.gruntConfig.hubBuildTarget %>/scripts/camunda-hub-ui.js'],
      '<%= pkg.gruntConfig.hubBuildTarget %>/camunda-hub-bootstrap.js': ['<%= pkg.gruntConfig.hubBuildTarget %>/camunda-hub-bootstrap.js']
    }
  };
};
