'use strict';

var throttle = require('lodash').throttle;

function Sparkline(width, height, lineColors) {
  this.resize(width, height);

  this.lineColors = lineColors;

  this.lineWidth = 1;
}

var proto = Sparkline.prototype;

proto.resize = function(width, height) {
  this.canvas = this.canvas || document.createElement('canvas');
  this.canvas.width = width;
  this.canvas.height = height;

  this.ctx = this.canvas.getContext('2d');

  return this;
};

proto.setData = function(data) {
  data = data || [[{value: 0}, {value: 0}]];

  this.rawData = data;
  this.data = data.map(function(set) {
    if (!set || !set.length) {
      set = [{value: 0}];
    }

    if (set.length === 1) {
      set = [set[0], set[0]];
    }

    return set.map(function(item) {
      return item.value ? item.value : item;
    });
  });

  return this.draw();
};

proto.max = function(index) {
  var self = this;

  var val = 0;
  if (!arguments.length) {
    self.data.forEach(function(set, i) {
      val = Math.max(val, self.max(i));
    });
    return val;
  }

  self.data[index].forEach(function(d) {
    val = Math.max(d, val);
  });

  return val;
};

proto.min = function(index) {
  var self = this;

  var val = self.max();
  if (!arguments.length) {
    self.data.forEach(function(set, i) {
      val = Math.min(val, self.min(i));
    });
    return val;
  }

  val = self.max(index);
  self.data[index].forEach(function(d) {
    val = Math.min(d, val);
  });

  return val;
};

proto.avg = function(index, round) {
  var tt = 0;
  this.data[index].forEach(function(v) {
    tt += v;
  });
  var avg = tt / (this.data[index].length);
  if (round) {
    return Math.round(avg * round) / round;
  }
  return avg;
};

proto.legend = function(index) {
  var avg = Math.round(this.avg(index) * 100) / 100;
  var min = this.min(index);
  var max = this.max(index);
  return 'Min: ' + min + ', Max: ' + max + ', Avg: ' + avg;
};

proto.draw = function() {
  var self = this;
  var lineWidth = self.lineWidth;
  var ctx = self.ctx;
  var padding = 2 * lineWidth;


  ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

  var legendRegionX = 0;//Math.min(Math.max(self.canvas.width * 0.25, 50), 100);
  // ctx.fillStyle = '#eee';
  // ctx.fillRect(self.canvas.width - legendRegionX, 0, legendRegionX, self.canvas.height);


  var innerW = self.canvas.width - (2 * padding) - legendRegionX;
  var innerH = self.canvas.height - (2 * padding);

  this.data.forEach(function(set, index) {
    var step = innerW / (set.length - 1);
    var max = self.max();
    // var max = self.max(index);
    var avg = self.avg(index);
    var color = self.lineColors[index];

    function toPx(val) {
      return (innerH - ((innerH / max) * val)) + padding;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;

    // var _debug = [];
    ctx.moveTo(innerW + padding, toPx(set[0]));
    ctx.beginPath();
    set.forEach(function(d, i) {
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
    ctx.fillStyle = color;
    ctx.arc(innerW + padding, toPx(set[0]), lineWidth * 2, 0, 2 * Math.PI);
    ctx.fill();

    var avgH = toPx(avg);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.moveTo(0, avgH);
    ctx.lineTo(innerW + padding, avgH);
    ctx.stroke();
  });

  if (typeof this.ondraw === 'function') {
    this.ondraw();
  }
  return self;
};



module.exports = function() {
  return {
    restrict: 'A',

    scope: {
      values: '=',
      colors: '=',
      drawn: '&onDraw'
    },

    link: function($scope, $element) {
      $scope.colors = $scope.colors || ['#333', '#454545', '#606060'];

      var container = $element[0];
      var win = container.ownerDocument.defaultView;

      var sparkline = $scope.sparkline = new Sparkline(container.clientWidth, container.clientHeight, $scope.colors);
      sparkline.ondraw = $scope.drawn;
      $scope.$watch('values', function() {
        sparkline.setData($scope.values);
      });

      container.appendChild(sparkline.canvas);

      var resize = throttle(function() {
        sparkline.resize(container.clientWidth, container.clientHeight).draw();
      }, 100);

      win.addEventListener('resize', resize);

      $scope.$on('$destroy', function() {
        win.removeEventListener('resize', resize);
      });
    },

    template: '<!-- sparkline comes here -->'
  };
};