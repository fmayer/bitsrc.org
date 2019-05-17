(function() {
  define(['utils/underscore.string'], function() {
    var max, min, mod, parseGet, rem, sum;
    sum = function(arr, init) {
      var elem, _i, _len;
      if (init == null) {
        init = 0;
      }
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        elem = arr[_i];
        init += elem;
      }
      return init;
    };
    max = function(x, y) {
      if (x > y) {
        return x;
      } else {
        return y;
      }
    };
    min = function(x, y) {
      if (x < y) {
        return x;
      } else {
        return y;
      }
    };
    mod = function(x, y) {
      var m;
      m = x % y;
      if (m < 0) {
        return m + y;
      } else {
        return m;
      }
    };
    rem = function(x, y) {
      return x % y;
    };
    parseGet = function(search) {
      var k, ret, v, _i, _len, _ref, _ref2;
      ret = {};
      _ref = _.words(search.slice(1), '&');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _ref2 = _.words(v, '='), k = _ref2[0], v = _ref2[1];
        ret[k] = v;
      }
      return ret;
    };
    return {
      sum: sum,
      min: min,
      max: max,
      mod: mod,
      rem: rem,
      parseGet: parseGet
    };
  });
}).call(this);
