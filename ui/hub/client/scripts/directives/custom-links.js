'use strict';
/* jshint browserify: true */
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/custom-links.html', 'utf8');

module.exports = [function() {
  return {
    restrict: 'A',

    template: template,

    link: function($scope, $element, $attr) {
      console.info('custom links directive link', $scope, $element, $attr);//es-lint-disable-line
    }
  };
}];