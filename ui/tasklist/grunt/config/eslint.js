module.exports = function(config, eslintConf) {
  'use strict';

  eslintConf.tasklist_scripts = {
    src: [
      '<%= pkg.gruntConfig.tasklistSourceDir %>/scripts/camunda-tasklist-ui.js'
    ]
  };

  eslintConf.tasklist_plugins = {
    src: [
      '<%= pkg.gruntConfig.pluginSourceDir %>/tasklist/plugins/tasklistPlugins.js'
    ]
  };

};
