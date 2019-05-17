(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  require(['life', 'utils/utils', 'utils/base64', 'utils/mobile', 'utils/underscore', 'utils/jquery', 'utils/json2'], function(li, utils, b64, mobile) {
    var Game, Scheduler, leftTop;
    leftTop = function(elem) {
      var x, y;
      x = 0;
      y = 0;
      while (elem !== null) {
        x += parseInt(elem.offsetLeft);
        y += parseInt(elem.offsetTop);
        elem = elem.offsetParent;
      }
      return [x, y];
    };
    Game = (function() {
      function Game(canvas, life, brush, gap) {
        this.canvas = canvas;
        this.life = life;
        this.brush = brush;
        this.gap = gap;
        if (!(life != null)) {
          this.life = new li.Life(new li.Field(30, 30));
        }
        if (!(brush != null)) {
          this.brush = [[0, 0]];
        }
        if (!(gap != null)) {
          this.gap = 0.5;
        }
        this.ctx = canvas.getContext('2d');
        this.down = null;
        $(canvas).mousedown(__bind(function(evt) {
          return this.down = this.getMousePos(evt);
        }, this));
        $(canvas).mouseup(__bind(function(evt) {
          var pos, x, y;
          pos = this.getMousePos(evt);
          if (_.isEqual(this.down, pos)) {
            x = pos[0], y = pos[1];
            this.life.field.set(x, y, !this.life.field.get(x, y));
            this.redrawAll();
          }
          return this.down = null;
        }, this));
        $(canvas).mousemove(__bind(function(evt) {
          var sq, v, x, y, _i, _len, _ref, _ref2;
          sq = this.getBox();
          _ref = this.getMousePos(evt), x = _ref[0], y = _ref[1];
          if (this.down !== null) {
            this.life.field.set(x, y);
          }
          this.clearCanvas();
          this.drawLife();
          if (this.down === null) {
            this.ctx.fillStroke = '#6D7B8D';
            _ref2 = this.brush;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              v = _ref2[_i];
              this.ctx.fillRect((v[0] + x) * sq, (v[1] + y) * sq, sq, sq);
            }
            this.ctx.fillStroke = '#000';
          }
          return this.drawGrid();
        }, this));
        $(canvas).mouseleave(__bind(function(evt) {
          this.redrawAll();
          return this.down = null;
        }, this));
      }
      Game.prototype.getMousePos = function(evt) {
        var d, sq, x, y;
        d = leftTop(this.canvas);
        x = evt.pageX - d[0];
        y = evt.pageY - d[1];
        sq = this.getBox();
        x = Math.floor(x / sq);
        y = Math.floor(y / sq);
        return [x, y];
      };
      Game.prototype.drawGrid = function() {
        var i, sq, _ref, _ref2, _results;
        this.ctx.lineWidth = 0.2;
        sq = this.getBox();
        for (i = 0, _ref = this.life.field.xsize; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
          this.ctx.beginPath();
          this.ctx.moveTo(i * sq, 0);
          this.ctx.lineTo(i * sq, this.life.field.xsize * sq);
          this.ctx.stroke();
        }
        _results = [];
        for (i = 0, _ref2 = this.life.field.ysize; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, i * sq);
          this.ctx.lineTo(this.life.field.ysize * sq, i * sq);
          _results.push(this.ctx.stroke());
        }
        return _results;
      };
      Game.prototype.getBox = function() {
        return utils.min(this.canvas.height, this.canvas.width) / utils.max(this.life.field.ysize, this.life.field.xsize);
      };
      Game.prototype.drawLife = function() {
        var sq, x, y, _ref, _results;
        sq = this.getBox();
        _results = [];
        for (x = 0, _ref = this.life.field.xsize; (0 <= _ref ? x < _ref : x > _ref); (0 <= _ref ? x += 1 : x -= 1)) {
          _results.push((function() {
            var _ref, _results;
            _results = [];
            for (y = 0, _ref = this.life.field.ysize; (0 <= _ref ? y < _ref : y > _ref); (0 <= _ref ? y += 1 : y -= 1)) {
              _results.push(this.life.field.get(x, y) ? this.ctx.fillRect(x * sq + this.gap, y * sq + this.gap, sq - this.gap, sq - this.gap) : void 0);
            }
            return _results;
          }).call(this));
        }
        return _results;
      };
      Game.prototype.drawAll = function() {
        this.drawGrid();
        return this.drawLife();
      };
      Game.prototype.redrawAll = function() {
        this.clearCanvas();
        return this.drawAll();
      };
      Game.prototype.clearCanvas = function() {
        var w;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        w = this.canvas.width;
        this.canvas.width = 1;
        return this.canvas.width = w;
      };
      return Game;
    })();
    Scheduler = (function() {
      function Scheduler(interval, tick) {
        this.interval = interval;
        this.tick = tick;
        this.intervalno = null;
      }
      Scheduler.prototype.start = function() {
        return this.intervalno = window.setInterval(__bind(function() {
          return this.doTick();
        }, this), this.interval);
      };
      Scheduler.prototype.doTick = function() {
        if (this.intervalno !== null) {
          return this.tick();
        }
      };
      Scheduler.prototype.stop = function() {
        window.clearInterval(this.intervalno);
        return this.intervalno = null;
      };
      Scheduler.prototype.toggle = function() {
        if (this.intervalno !== null) {
          return this.stop();
        } else {
          return this.start();
        }
      };
      Scheduler.prototype.running = function() {
        return this.intervalno !== null;
      };
      Scheduler.prototype.setInterval = function(i) {
        this.interval = i;
        if (this.intervalno !== null) {
          this.stop();
          return this.start();
        }
      };
      return Scheduler;
    })();
    return $(document).ready(function() {
      var GET, game, sched, showCorrectCSSChange, v, _i, _len, _ref;
      game = new Game(document.getElementById('gol'));
      sched = new Scheduler(500, __bind(function() {
        game.life.tick();
        return game.redrawAll();
      }, this));
      if (document.location.hash) {
        _ref = JSON.parse(b64.decode(document.location.hash.slice(1)));
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          game.life.field.set(v[0], v[1]);
        }
      }
      game.drawAll();
      $("#toggle").click(function() {
        $("#toggle").attr('value', sched.running() ? 'Play' : 'Pause');
        return sched.toggle();
      });
      $("#clear").click(function() {
        var x, y, _ref, _ref2;
        for (x = 0, _ref = game.life.field.xsize; (0 <= _ref ? x < _ref : x > _ref); (0 <= _ref ? x += 1 : x -= 1)) {
          for (y = 0, _ref2 = game.life.field.ysize; (0 <= _ref2 ? y < _ref2 : y > _ref2); (0 <= _ref2 ? y += 1 : y -= 1)) {
            game.life.field.unset(x, y);
          }
        }
        return game.redrawAll();
      });
      $("#freq").change(function() {
        return sched.setInterval(1000 / parseFloat($(this).val()));
      });
      $("#perma").click(function(e) {
        var l;
        e.preventDefault();
        l = window.location;
        return $("#permap").val(l.protocol + '//' + l.host + l.pathname + "?freq=" + 1000 / sched.interval + "&play=" + (sched.running() ? "1" : "0") + "#" + b64.encode(JSON.stringify(game.life.field.getSet())).replace('\n', ''));
      });
      GET = utils.parseGet(window.location.search);
      if (GET.freq != null) {
        sched.setInterval(1000 / parseFloat(GET.freq));
        $("#freq").val(GET.freq + " Hz");
      }
      if (GET.play != null) {
        if (parseInt(GET.play)) {
          $("#toggle").click();
        }
      }
      if (GET.css != null) {
        $("#css").attr("href", GET.css + '.css');
      } else {
        $("#css").attr("href", mobile.isMobile(navigator.userAgent || navigator.vendor || window.opera) ? 'mobile.css' : 'screen.css');
      }
      showCorrectCSSChange = function() {
        var elem, _i, _len, _ref, _results;
        _ref = $(".csschange");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          _results.push($(elem).attr('ref') === $("#css").attr('href') ? $(elem).hide() : $(elem).show());
        }
        return _results;
      };
      $(".csschange").click(function(e) {
        e.preventDefault();
        $("#css").attr("href", $(this).attr("ref"));
        return showCorrectCSSChange();
      });
      return showCorrectCSSChange();
    });
  });
}).call(this);
