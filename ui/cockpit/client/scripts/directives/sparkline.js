'use strict';

function Sparkline(el, data, width, height) {
  el.width = width;
  el.height = height;
  this.canvas = el;
  if (data.length === 1) {
    data = [data[0], data[0]];
  }
  this.data = data;

  this.lineWidth = 1;
  this.ctx = this.canvas.getContext('2d');
}

var proto = Sparkline.prototype;

proto.min = function() {
  var val = 0;
  this.data.forEach(function(d) {
    val = Math.min(d, val);
  });
  return val;
};

proto.max = function() {
  var val = 0;
  this.data.forEach(function(d) {
    val = Math.max(d, val);
  });
  return val;
};

proto.avg = function() {
  return (this.min() + this.max()) * 0.5;
};

proto.draw = function() {
  var self = this;
  var ctx = self.ctx;
  var totalWidth = self.canvas.width;
  var step = self.canvas.width / (self.data.length - 1);
  var lineWidth = self.lineWidth;

  ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#000';

  var max = this.max();
  var h = this.canvas.height - (2 * lineWidth);
  function toPx(val) {
    return (h - ((h / max) * val)) + lineWidth;
  }

  ctx.beginPath();
  ctx.moveTo(self.canvas.width, toPx(self.data[0]));
  self.data.forEach(function(d, i) {
    var left = totalWidth - (step * i);
    var top = toPx(d);
    ctx.lineTo(left, top);
  });
  ctx.stroke();
  return self;
};



module.exports = function() {
  return {
    restrict: 'A',

    scope: {
      values: '=',
      width: '@',
      height: '@'
    },

    compile: function() {
      return {
        pre: function($scope) {
          $scope.width = $scope.width || 80;
          $scope.height = $scope.height || 20;
        },

        post: function($scope, $element) {
          setTimeout(function() {
            var sparkline = new Sparkline($element[0].querySelector('canvas'), $scope.values, $scope.width, $scope.height);
            sparkline.draw();
          }, 10);
        }
      };
    },

    template: '<canvas width="{{ width }}" height="{{ height }}"></canvas>'
  };
};