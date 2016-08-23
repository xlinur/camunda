'use strict';

function Sparkline(data, width, height, lineColor, dotColor) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = width;
  this.canvas.height = height;

  this.lineColor = lineColor;
  this.dotColor = dotColor;

  this.lineWidth = 1;
  this.ctx = this.canvas.getContext('2d');

  this.setData(data);
}

var proto = Sparkline.prototype;

proto.setData = function(data) {
  if (data.length === 1) {
    data = [data[0], data[0]];
  }

  this.data = data;
  return this.draw();
};

proto.max = function() {
  var val = 0;
  this.data.forEach(function(d) {
    val = Math.max(d, val);
  });
  return val;
};

proto.min = function() {
  var val = this.max();
  this.data.forEach(function(d) {
    val = Math.min(d, val);
  });
  return val;
};

proto.avg = function(round) {
  var tt = 0;
  this.data.forEach(function(v) {
    tt += v;
  });
  var avg = tt / (this.data.length);
  if (round) {
    return Math.round(avg * round) / round;
  }
  return avg;
};

proto.legend = function() {
  var avg = Math.round(this.avg() * 100) / 100;
  var min = this.min();
  var max = this.max();
  return 'Min: ' + min + ', Max: ' + max + ', Avg: ' + avg;
};

proto.draw = function() {
  var self = this;
  var lineWidth = self.lineWidth;

  var ctx = self.ctx;
  var max = self.max();
  var avg = self.avg();

  var padding = 2 * lineWidth;
  var innerW = self.canvas.width - (2 * padding);
  var innerH = self.canvas.height - (2 * padding);
  var step = innerW / (self.data.length - 1);

  function toPx(val) {
    return (innerH - ((innerH / max) * val)) + padding;
  }

  ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = self.lineColor;

  // var _debug = [];
  ctx.moveTo(innerW + padding, toPx(self.data[0]));
  ctx.beginPath();
  self.data.forEach(function(d, i) {
    var right = (innerW - (step * i)) + padding;
    var top = toPx(d);
    ctx.lineTo(right, top);
    // _debug.push({
    //   top: top,
    //   right: right,
    //   d: d
    // });
  });
  ctx.stroke();
  // console.table(_debug);//es-lint-disable-line

  ctx.beginPath();
  ctx.fillStyle = self.dotColor;
  ctx.arc(innerW + padding, toPx(self.data[0]), lineWidth * 2, 0, 2 * Math.PI);
  ctx.fill();

  var avgH = toPx(avg);
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#A00';
  ctx.moveTo(0, avgH);
  ctx.lineTo(innerW + padding, avgH);
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

    link: function($scope, $element) {
      $scope.width = $scope.width || 80;
      $scope.height = $scope.height || 20;
      $scope.tooltip = '';

      var sparkline = new Sparkline($scope.values, $scope.width, $scope.height, '#000', '#b5152b');
      $scope.$watch('values', function() {
        sparkline.setData($scope.values);

        if ($scope.$parent) {
          $scope.$parent.sparkline = sparkline;
        }
      }, true);

      $element[0].appendChild(sparkline.canvas);
    },

    template: '<!-- sparkline comes here -->'
  };
};