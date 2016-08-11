module.exports = function(config, watchConf) {
  'use strict';

  var options = {
      livereload: false
  };


  watchConf.hub_assets = {
      options: options,
      files: [
        '<%= pkg.gruntConfig.hubSourceDir %>/{fonts,images}/**/*',
        '<%= pkg.gruntConfig.hubSourceDir %>/scripts/index.html',
        '<%= pkg.gruntConfig.hubSourceDir %>/scripts/favicon.ico'
      ],
      tasks: [
        'copy:hub_assets',
        'copy:hub_index'
      ]
  };

  watchConf.hub_styles = {
      options: options,
      files: [
        '<%= pkg.gruntConfig.hubSourceDir %>/styles/**/*.{css,less}',
        '<%= pkg.gruntConfig.hubSourceDir %>/scripts/**/*.{css,less}'
      ],
      tasks: [
        'less:hub_styles'
      ]
  };

  watchConf.hub_plugin_styles = {
      options: options,
      files: [
        '<%= pkg.gruntConfig.pluginSourceDir %>/hub/plugins/**/*.{css,less}'
      ],
      tasks: [
        'less:hub_plugin_styles'
      ]
  };

  watchConf.hub_scripts_lint = {
    options: options,
    files: [
      '<%= pkg.gruntConfig.hubSourceDir %>/scripts/**/*.js'
    ],
    tasks: [
      'newer:eslint:hub_scripts'
    ]
  };

  watchConf.hub_plugins_lint = {
    options: options,
    files: [
      '<%= pkg.gruntConfig.pluginSourceDir %>/hub/plugins/**/*.js'
    ],
    tasks: [
      'newer:eslint:hub_plugins'
    ]
  };


  watchConf.hub_dist = {
    options: {
      livereload: config.livereloadPort || false
    },
    files: [
      '<%= pkg.gruntConfig.hubBuildTarget %>/**/*.{css,html,js}',
      '<%= pkg.gruntConfig.pluginBuildTarget %>/hub/**/*.{css,html,js}'
    ]
  };
};
