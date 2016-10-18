'use strict';

var throttle = require('lodash').throttle;
var moment = require('moment');

function Sparkline(options) {
  this.resize(options.width, options.height);

  this.lineColors = options.lineColors;

  this.rulesColor = options.rulesColor || '#666';

  this.fontSize = options.fontSize || 12;

  this.duration = options.duration;

  this.lineWidth = options.lineWidth || 1;

  this.labelsH = options.labels && options.labels.length > 1 ? options.labels : [];
}

var proto = Sparkline.prototype;

proto.resize = function(width, height) {
  this.canvas = this.canvas || document.createElement('canvas');
  this.canvas.width = width;
  this.canvas.height = height;

  this.ctx = this.canvas.getContext('2d');

  return this;
};

// proto.setLabels = function(labels) {
//   this.labelsH = labels;
//   this.draw();
// };

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

  var max = this.max();
  this.labelsV = [
    max,
    max * 0.75,
    max * 0.5,
    max * 0.25,
    0
  ].map(Math.round);

  this.labelsH = [];
  if (data.length && data[0] && data[0].length && data[0][0].timestamp) {
    var set = data[0];
    var to = moment(set[0].timestamp, 'YYYY-MM-DDTHH:mm:ss');
    var from = moment(set[set.length - 1].timestamp, 'YYYY-MM-DDTHH:mm:ss');
    var milliDiff = from - to;
    var diff = moment.duration(milliDiff);

    var cc = 12;
    var format = 'HH:mm';
    if (Math.round(diff.as('months')) >= 1) {
      cc = 4;
      format = 'MM-DD';
    }
    else if (Math.round(diff.as('weeks')) >= 1) {
      cc = 7;
      format = 'MM-DD HH:mm';
    }

    for (var c = 0; c <= cc; c++) {
      this.labelsH.push(from.clone().subtract((milliDiff / cc) * c, 'milliseconds').format(format));
    }

    console.info('time labels %s > %s', to.format('MM-DD HH:mm'), from.format('MM-DD HH:mm'), cc, moment.duration(milliDiff / cc).humanize(), Math.round(diff.as('months')), Math.round(diff.as('weeks')));
  }

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
  var padding = Math.max(2 * lineWidth, 10);
  var textPadding = 3;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


  ctx.strokeStyle = this.rulesColor;
  ctx.fillStyle = this.rulesColor;
  ctx.lineWidth = 1;

  var scaleVx = 0;
  var scaleHy = 0;
  var scaleLength = 10;
  var fontSize = this.fontSize;
  ctx.font = fontSize + 'px Arial';

  var labelsH = this.labelsH;
  var labelsV = this.labelsV;

  labelsV.forEach(function(l) {
    scaleVx = Math.max(scaleVx, ctx.measureText(l).width + (textPadding * 2) + scaleLength);
  });
  scaleVx = Math.round(Math.max(scaleVx, scaleLength + textPadding)) + 0.5;
  var innerW = ctx.canvas.width - ((1 * padding) + scaleVx);

  labelsH.forEach(function(l) {
    scaleHy = Math.max(scaleHy, ctx.measureText(l).width + (textPadding * 2) + scaleLength);
  });
  scaleHy = Math.round(Math.max(scaleHy, scaleLength + textPadding)) + 0.5;
  var innerH = ctx.canvas.height - ((1 * padding) + scaleHy);

  var step;
  var c;



  // draw horizontal (time) scale
  var t = ctx.canvas.height - scaleHy;
  ctx.beginPath();
  ctx.moveTo(scaleVx - scaleLength, t);
  ctx.lineTo(ctx.canvas.width - padding, t);
  ctx.stroke();



  if (labelsH.length > 1) {
    step = innerW / (labelsH.length - 1);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'top';
    for (c = 0; c < labelsH.length; c++) {
      var tx = Math.round((ctx.canvas.width - padding) - (step * c)) - 0.5;
      ctx.save();
      ctx.translate(tx, ctx.canvas.height - (scaleHy - (scaleLength + textPadding)));
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(labelsH[c], 0, fontSize / 2);
      ctx.restore();

      // ctx.fillText(labelsH[c], tx, ctx.canvas.height - (scaleHy - (scaleLength + textPadding)));

      if (c < labelsH.length - 1) {
        ctx.beginPath();
        ctx.moveTo(tx, t);
        ctx.lineTo(tx, t + scaleLength);
        ctx.stroke();
      }
    }
  }




  // draw vertical (value) scale
  ctx.beginPath();
  ctx.moveTo(scaleVx, padding);
  ctx.lineTo(scaleVx, t + scaleLength);
  ctx.stroke();

  if (labelsV.length > 1) {
    step = innerH / (labelsV.length - 1);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (c = 0; c < labelsV.length; c++) {
      var ty = Math.round(padding + (step * c)) - 0.5;
      // ctx.fillText(labelsV[c], scaleVx - (scaleLength + textPadding), Math.round(ty + (fontSize / 2)) - 0.5);
      ctx.fillText(labelsV[c], scaleVx - (scaleLength + textPadding), ty);

      if (c < labelsV.length - 1) {
        ctx.beginPath();
        ctx.moveTo(scaleVx - scaleLength, ty);
        ctx.lineTo(scaleVx, ty);
        ctx.stroke();
      }
    }
  }



  // draw the data
  this.data.forEach(function(set, index) {
    step = innerW / (set.length - 1);
    var max = self.max();

    var color = self.lineColors[index];
    var farX = ctx.canvas.width - padding;

    function toPx(val) {
      return (innerH - ((innerH / max) * val)) + padding;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;

    // var _debug = [];
    ctx.moveTo(farX, toPx(set[0]));
    ctx.beginPath();
    set.forEach(function(d, i) {
      var right = (farX - (step * i));
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

    // draw the starting point
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(farX, toPx(set[0]), lineWidth * 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    /*
    // draw the average line
    var avg = self.avg(index);
    var avgH = Math.round(toPx(avg)) + 0.5;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.moveTo(scaleVx, avgH);
    ctx.lineTo(farX, avgH);
    ctx.stroke();
    */
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
      $scope.labels = $scope.labels || [];

      var container = $element[0];
      var win = container.ownerDocument.defaultView;

      var sparkline = $scope.sparkline = new Sparkline({
        width: container.clientWidth,
        height: container.clientHeight,
        lineColors: $scope.colors
      });

      // sparkline.ondraw = $scope.drawn;
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