'use strict';

var commentLineExp =  /^[\s]*<!-- (\/|#) (CE|EE)/;
var requireConfExp =  /require-conf.js$/;

module.exports = function(config, copyConf) {
  var grunt = config.grunt;

  var path = require('path');
  var now = (new Date()).getTime();
  var version = grunt.file.readJSON(path.resolve(__dirname, '../../../../package.json')).version;
  version = (version.indexOf('-SNAPSHOT') > -1 ? (version +'-'+ now) : version);


  function prod () {
    return grunt.config('buildMode') === 'prod';
  }

  function cacheBust(content, srcpath) {
    if (srcpath.slice(-4) !== 'html') { return content; }
    return content.split('$GRUNT_CACHE_BUST').join(prod() ? version : now);
  }

  function fileProcessing(content, srcpath) {
    if(prod()) {
      // removes the template comments
      content = content
                .split('\n').filter(function(line) {
                  return !commentLineExp.test(line);
                }).join('\n');
    }

    content = cacheBust(content, srcpath);

    return content;
  }

  copyConf.hub_index = {
      options: {
        process: fileProcessing
      },
      files: [
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.hubSourceDir %>/scripts/',
          src: [
            'index.html',
            'camunda-hub-bootstrap.js'
          ],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/'
        }
      ]
  };

  copyConf.hub_assets = {
      files: [
        // custom styles and/or other css files
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.hubSourceDir %>/styles',
          src: ['*.css'],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/styles/'
        },

        // images, fonts & stuff
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.hubSourceDir %>/',
          src:  [
            '{fonts,images}/**/*.*'
          ],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/assets'
        },

        // commons-ui images
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.commonsUiDir %>/resources/img/',
          src:  [
            '*.*'
          ],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/assets/images'
        },

        // dojo & dojox
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.hubSourceDir %>/vendor/dojo',
          src:  [
            '**/*.*'
          ],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/assets/vendor'
        },

        // bootstrap fonts
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.commonsUiDir %>/node_modules/bootstrap/fonts',
          src: [
            '*.{eot,ttf,svg,woff,woff2}'
          ],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/fonts/'
        },
        // bpmn fonts
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.commonsUiDir %>/node_modules/bpmn-font/dist/font',
          src: [
            '*.{eot,ttf,svg,woff}'
          ],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/fonts/'
        },
        // open sans
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.commonsUiDir %>/vendor/fonts',
          src: ['*.{eot,svg,ttf,woff,woff2}'],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/fonts/'
        },
        // dmn
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.commonsUiDir %>/node_modules/dmn-js/fonts',
          src: ['*.{eot,svg,ttf,woff,woff2}'],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/fonts/'
        },

        // placeholder shims
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.commonsUiDir %>/vendor',
          src: ['placeholders.*'],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/scripts/'
        }
      ]
    };

  copyConf.hub_config = {
      files: [
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.hubSourceDir %>/scripts',
          src: ['config.js'],
          dest: '<%= pkg.gruntConfig.hubBuildTarget %>/scripts/'
        }
      ]
  };
};
