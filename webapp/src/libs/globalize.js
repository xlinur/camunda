define([], function() {
  return function(r, m) {
    var s = {};
    for(var i = 0; i < m.length; i++) {
      (function(i) {
        define(m[i],function(){return window[m[i]];});
        s[m[i]] = {exports: m[i]};
      })(i);
    }
    r.config(s);
  }
});
