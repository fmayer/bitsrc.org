(function() {
  define(['utils/utils'], function(utils) {
    var Field, Life, neigh;
    neigh = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, 1], [-1, -1]];
    Field = (function() {
      function Field(xsize, ysize) {
        var i, u;
        this.xsize = xsize;
        this.ysize = ysize;
        this.field = (function() {
          var _results;
          _results = [];
          for (u = 0; (0 <= xsize ? u < xsize : u > xsize); (0 <= xsize ? u += 1 : u -= 1)) {
            _results.push((function() {
              var _results;
              _results = [];
              for (i = 0; (0 <= ysize ? i < ysize : i > ysize); (0 <= ysize ? i += 1 : i -= 1)) {
                _results.push(0);
              }
              return _results;
            })());
          }
          return _results;
        })();
      }
      Field.prototype.getOrElse = function(x, y, def) {
        if (def == null) {
          def = null;
        }
        if (x < 0 || x >= this.xsize || y < 0 || y >= this.ysize) {
          return def;
        } else {
          return this.field[x][y];
        }
      };
      Field.prototype.get = function(x, y) {
        return this.field[x][y];
      };
      Field.prototype.set = function(x, y, v) {
        if (v == null) {
          v = 1;
        }
        return this.field[x][y] = v;
      };
      Field.prototype.unset = function(x, y) {
        return this.set(x, y, 0);
      };
      Field.prototype.getSet = function() {
        var ret, x, y, _ref, _ref2;
        ret = [];
        for (x = 0, _ref = this.xsize; (0 <= _ref ? x < _ref : x > _ref); (0 <= _ref ? x += 1 : x -= 1)) {
          for (y = 0, _ref2 = this.ysize; (0 <= _ref2 ? y < _ref2 : y > _ref2); (0 <= _ref2 ? y += 1 : y -= 1)) {
            if (this.field[x][y]) {
              ret.push([x, y]);
            }
          }
        }
        return ret;
      };
      return Field;
    })();
    Life = (function() {
      function Life(field) {
        this.field = field;
      }
      Life.prototype.neighbours = function(x, y) {
        var d;
        return utils.sum((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = neigh.length; _i < _len; _i++) {
            d = neigh[_i];
            _results.push(this.field.get(utils.mod(x + d[0], this.field.xsize), utils.mod(y + d[1], this.field.ysize)));
          }
          return _results;
        }).call(this));
      };
      Life.prototype.tick = function() {
        var n, newfield, x, y, _ref, _ref2;
        newfield = new Field(this.field.xsize, this.field.ysize);
        for (x = 0, _ref = this.field.xsize; (0 <= _ref ? x < _ref : x > _ref); (0 <= _ref ? x += 1 : x -= 1)) {
          for (y = 0, _ref2 = this.field.ysize; (0 <= _ref2 ? y < _ref2 : y > _ref2); (0 <= _ref2 ? y += 1 : y -= 1)) {
            if (this.field.get(x, y)) {
              n = this.neighbours(x, y);
              if (n === 2 || n === 3) {
                newfield.set(x, y);
              }
            } else if (this.neighbours(x, y) === 3) {
              newfield.set(x, y);
            }
          }
        }
        return this.field = newfield;
      };
      return Life;
    })();
    return {
      Field: Field,
      Life: Life
    };
  });
}).call(this);
