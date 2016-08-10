module.exports = function(config, eslintConf) {
  'use strict';

  eslintConf.hub_scripts = {
    src: [
      '<%= pkg.gruntConfig.hubSourceDir %>/scripts/**/*.js'
    ]
  };

  eslintConf.hub_plugins = {
    src: [
      '<%= pkg.gruntConfig.pluginSourceDir %>/hub/plugins/**/*.js'
    ]
  };

};
