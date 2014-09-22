var App, Boid, Point, Swarm, Util, Vector, compatibility,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Boid = (function() {
  function Boid(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = new Vector(0, 0);
  }

  Boid.prototype.setPosition = function(x, y) {
    this.position.x = x;
    return this.position.y = y;
  };

  Boid.prototype.setVelocity = function(i, j) {
    this.velocity.x = i;
    return this.velocity.y = j;
  };

  Boid.prototype.squaredDistanceTo = function(that) {
    return Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2);
  };

  Boid.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
  };

  return Boid;

})();

compatibility = (function() {
  var URL, cancelAnimationFrame, detectEndian, getUserMedia, isLittleEndian, lastTime, requestAnimationFrame;
  lastTime = 0;
  isLittleEndian = true;
  URL = window.URL || window.webkitURL;
  requestAnimationFrame = function(callback, element) {
    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    return requestAnimationFrame.call(window, callback, element);
  };
  cancelAnimationFrame = function(id) {
    cancelAnimationFrame = window.cancelAnimationFrame || function(id) {
      clearTimeout(id);
    };
    return cancelAnimationFrame.call(window, id);
  };
  getUserMedia = function(options, success, error) {
    getUserMedia = window.navigator.getUserMedia || window.navigator.mozGetUserMedia || window.navigator.webkitGetUserMedia || window.navigator.msGetUserMedia;
    return getUserMedia.call(window.navigator, options, success, error);
  };
  detectEndian = function() {
    var buf, data;
    buf = new ArrayBuffer(8);
    data = new Uint32Array(buf);
    data[0] = 0xff000000;
    isLittleEndian = true;
    if (buf[0] === 0xff) {
      isLittleEndian = false;
    }
    return isLittleEndian;
  };
  return {
    URL: URL,
    requestAnimationFrame: requestAnimationFrame,
    cancelAnimationFrame: cancelAnimationFrame,
    getUserMedia: getUserMedia,
    detectEndian: detectEndian,
    isLittleEndian: isLittleEndian
  };
})();

Util = (function() {
  function Util() {}

  Util.prototype.render_mono_image = function(src, dst, sw, sh, dw) {
    var alpha, i, j, pix;
    alpha = 0xff << 24;
    i = 0;
    while (i < sh) {
      j = 0;
      while (j < sw) {
        pix = src[i * sw + j];
        dst[i * dw + j] = alpha | (pix << 16) | (pix << 8) | pix;
        ++j;
      }
      ++i;
    }
  };

  return Util;

})();

App = (function() {
  function App() {
    this.add_tracking_points = __bind(this.add_tracking_points, this);
    this.tick = __bind(this.tick, this);
    this.step = __bind(this.step, this);
    this.handleVideo = __bind(this.handleVideo, this);
    var _this = this;
    this.video = $('#webcam')[0];
    this.canvas = $('canvas')[0];
    this.canvas.addEventListener('click', function(e) {
      return _this.swarm.setFocus(e.offsetX, e.offsetY);
    });
    this.imageData = new jsfeat.matrix_t(640, 480, jsfeat.U8_t | jsfeat.C1_t);
    this.swarm = new Swarm(50, this.canvas.width, this.canvas.height);
    this.bindControls();
    compatibility.getUserMedia({
      video: true
    }, this.handleVideo, function() {
      return console.log('Error!');
    });
  }

  App.prototype.bindControls = function() {
    var _this = this;
    $('#grouping').change(function(e) {
      var val;
      val = $('#grouping').val();
      return _this.swarm.CENTRE_INFLUENCE = 1 / (10001 - val);
    });
    $('#match').change(function(e) {
      var val;
      val = $('#match').val();
      return _this.swarm.CENTRE_INFLUENCE = 1 / (10001 - val);
    });
    $('#tend_to').change(function(e) {
      var val;
      val = $('#tend_to').val();
      return _this.swarm.CENTRE_INFLUENCE = 1 / (10001 - val);
    });
    return $('#repel').change(function(e) {
      var val;
      val = $('#repel').val();
      return _this.swarm.CENTRE_INFLUENCE = 1 / (10001 - val);
    });
  };

  App.prototype.handleVideo = function(stream) {
    var error;
    try {
      this.video.src = compatibility.URL.createObjectURL(stream);
    } catch (_error) {
      error = _error;
      this.video.src = stream;
    }
    setTimeout(this.step, 500);
  };

  App.prototype.step = function() {
    this.video.play();
    this.doFish();
    compatibility.requestAnimationFrame(this.tick);
  };

  App.prototype.unload = function() {
    this.video.pause();
    this.video.src = null;
  };

  App.prototype.doFish = function() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "rgb(0,255,0)";
    this.ctx.strokeStyle = "rgb(0,255,0)";
    this.curr_img_pyr = new jsfeat.pyramid_t(3);
    this.prev_img_pyr = new jsfeat.pyramid_t(3);
    this.curr_img_pyr.allocate(640, 480, jsfeat.U8_t | jsfeat.C1_t);
    this.prev_img_pyr.allocate(640, 480, jsfeat.U8_t | jsfeat.C1_t);
    this.point_count = 0;
    this.point_status = new Uint8Array(100);
    this.prev_xy = new Float32Array(100 * 2);
    this.curr_xy = new Float32Array(100 * 2);
    this.options = {
      win_size: 20,
      max_iterations: 30,
      epsilon: 0.01,
      min_eigen: 0.001
    };
  };

  App.prototype.tick = function() {
    var _ref, _ref1;
    compatibility.requestAnimationFrame(this.tick);
    if (this.video.readyState === !this.video.HAVE_ENOUGH_DATA) {
      return;
    }
    this.ctx.drawImage(this.video, 0, 0, 640, 480);
    this.imageData = this.ctx.getImageData(0, 0, 640, 480);
    _ref = [this.curr_xy, this.prev_xy], this.prev_xy = _ref[0], this.curr_xy = _ref[1];
    _ref1 = [this.curr_img_pyr, this.prev_img_pyr], this.prev_img_pyr = _ref1[0], this.curr_img_pyr = _ref1[1];
    this.grayscale();
    this.equalize_histogram();
    this.draw_boids();
    this.swarm.update_boids();
    return this.optical_flow();
  };

  App.prototype.grayscale = function() {
    return jsfeat.imgproc.grayscale(this.imageData.data, this.curr_img_pyr.data[0].data);
  };

  App.prototype.equalize_histogram = function() {
    return jsfeat.imgproc.equalize_histogram(this.curr_img_pyr.data[0].data, this.curr_img_pyr.data[0].data);
  };

  App.prototype.add_tracking_points = function() {
    var canvasHeight, canvasWidth, x, y, _i, _j;
    if (this.point_count > 50) {
      return;
    }
    canvasWidth = this.canvas.width;
    canvasHeight = this.canvas.height;
    for (x = _i = 0; _i <= 10; x = ++_i) {
      for (y = _j = 0; _j <= 10; y = ++_j) {
        this.add_tracking_point(canvasWidth / 10 * x, canvasWidth / 10 * y);
      }
    }
  };

  App.prototype.add_tracking_point = function(x, y) {
    this.curr_xy[this.point_count << 1] = x;
    this.curr_xy[(this.point_count << 1) + 1] = y;
    return this.point_count++;
  };

  App.prototype.optical_flow = function() {
    this.curr_img_pyr.build(this.curr_img_pyr.data[0], true);
    jsfeat.optical_flow_lk.track(this.prev_img_pyr, this.curr_img_pyr, this.prev_xy, this.curr_xy, this.point_count, this.options.win_size, this.options.max_iterations, this.point_status, this.options.epsilon, this.options.min_eigen);
    this.prune_oflow_points();
    return this.add_tracking_points();
  };

  App.prototype.prune_oflow_points = function() {
    var i, j, n;
    n = this.point_count;
    i = 0;
    j = 0;
    while (i < n) {
      if (this.point_status[i] === 1) {
        if (j < i) {
          this.curr_xy[j << 1] = this.curr_xy[i << 1];
          this.curr_xy[(j << 1) + 1] = this.curr_xy[(i << 1) + 1];
        }
        this.draw_circle(this.curr_xy[j << 1], this.curr_xy[(j << 1) + 1]);
        ++j;
      }
      ++i;
    }
    this.point_count = j;
  };

  App.prototype.draw_circle = function(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI * 2, true);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  App.prototype.draw_boids = function() {
    var i, x, y, _i, _ref;
    this.ctx.fillStyle = "rgb(255,0,0)";
    this.ctx.strokeStyle = "rgb(255,0,0)";
    for (i = _i = 0, _ref = this.swarm.size - 1; _i <= _ref; i = _i += 1) {
      x = this.swarm.boids[i].x;
      y = this.swarm.boids[i].y;
      this.draw_circle(x, y);
    }
    this.ctx.fillStyle = "rgb(0,255,0)";
    this.ctx.strokeStyle = "rgb(0,255,0)";
  };

  return App;

})();

$(function() {
  return window.app = new App();
});

$(window).unload(function() {
  return window.app.unload();
});

Vector = (function() {
  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype.scale = function(v) {
    this.x *= v;
    this.y *= v;
  };

  Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.add = function(that) {
    this.x += that.x;
    this.y += that.y;
  };

  Vector.prototype.subtract = function(that) {
    this.x -= that.x;
    this.y -= that.y;
  };

  return Vector;

})();

Point = (function(_super) {
  __extends(Point, _super);

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.squaredDistanceTo = function(that) {
    return Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2);
  };

  return Point;

})(Vector);

Swarm = (function() {
  Swarm.prototype.SQ_REPEL_RADIUS = 20 * 20;

  Swarm.prototype.V_LIM = 5;

  Swarm.prototype.CENTRE_INFLUENCE = 1 / 1000;

  Swarm.prototype.MATCH_INFLUENCE = 1 / 40;

  Swarm.prototype.TEND_TO_INFLUENCE = 1 / 100000;

  Swarm.prototype.REPEL_INFLUENCE = 1 / 100;

  Swarm.prototype.GRID_WIDTH = 20;

  Swarm.prototype.SQ_NEIGHBOUR_SEARCH_DIST = 30 * 30;

  Swarm.prototype.MAX_NEIGHBOURS = 30;

  Swarm.prototype.WRAP_RADIUS = 40;

  Swarm.prototype.EDGE_FORCE = 0.25;

  function Swarm(size, width, height) {
    this.size = size;
    this.boids = this.initialiseBoids(width, height);
    this.focus_point = new Point(0, 0);
    this.width = width;
    this.height = height;
  }

  Swarm.prototype.initialiseBoids = function(width, height) {
    var b, boids, x, y, _i, _ref;
    boids = [];
    for (b = _i = 0, _ref = this.size - 1; _i <= _ref; b = _i += 1) {
      x = Math.random() * width;
      y = Math.random() * height;
      boids[b] = new Boid(x, y);
    }
    return boids;
  };

  Swarm.prototype.setFocus = function(x, y) {
    this.focus_point.x = x;
    return this.focus_point.y = y;
  };

  Swarm.prototype.distanceMetric = function(a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  };

  Swarm.prototype.update_boids = function() {
    var avVelocities, boid, centre, forces, kdtree, n, neighbours, repel, _i, _j, _len, _len1, _ref;
    kdtree = new kdTree(this.boids, this.distanceMetric, ["x", "y"]);
    _ref = this.boids;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      boid = _ref[_i];
      centre = new Vector(0, 0);
      repel = new Vector(0, 0);
      avVelocities = new Vector(0, 0);
      neighbours = kdtree.nearest(boid, this.MAX_NEIGHBOURS, this.SQ_NEIGHBOUR_SEARCH_DIST);
      for (_j = 0, _len1 = neighbours.length; _j < _len1; _j++) {
        n = neighbours[_j];
        centre.add(n[0]);
        if (boid.squaredDistanceTo(n[0]) < this.SQ_REPEL_RADIUS) {
          repel.add({
            x: boid.x - n[0].x,
            y: boid.y - n[0].y
          });
        }
        avVelocities.add(n[0].velocity);
      }
      centre.scale(1 / neighbours.length);
      avVelocities.scale(1 / neighbours.length);
      forces = [];
      boid.velocity.add({
        x: (centre.x - boid.x) * this.CENTRE_INFLUENCE,
        y: (centre.y - boid.y) * this.CENTRE_INFLUENCE
      });
      repel.scale(this.REPEL_INFLUENCE);
      boid.velocity.add(repel);
      boid.velocity.add({
        x: (avVelocities.x - boid.velocity.x) * this.MATCH_INFLUENCE,
        y: (avVelocities.y - boid.velocity.y) * this.MATCH_INFLUENCE
      });
      boid.velocity.add(this.tendToFocus(boid));
      boid.add(boid.velocity);
      this.wrapPosition(boid);
      this.limitVelocity(boid);
    }
  };

  Swarm.prototype.limitVelocity = function(boid) {
    var mag;
    mag = boid.velocity.magnitude();
    if (mag > this.V_LIM) {
      return boid.velocity.scale(this.V_LIM / mag);
    }
  };

  Swarm.prototype.calculateAverages = function(list) {
    var v, vectors, _i, _len;
    vectors = [new Vector(0, 0), new Vector(0, 0)];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      v = list[_i];
      vectors[0].add(v[0]);
      vectors[1].add(v[0].velocity);
    }
    return vectors;
  };

  Swarm.prototype.tendToFocus = function(boid) {
    var vector;
    vector = {
      x: (this.focus_point.x - boid.x) * this.TEND_TO_INFLUENCE,
      y: (this.focus_point.y - boid.y) * this.TEND_TO_INFLUENCE
    };
    return vector;
  };

  Swarm.prototype.wrapPosition = function(boid) {
    if (boid.x > this.width - this.WRAP_RADIUS) {
      boid.velocity.x -= this.EDGE_FORCE;
    }
    if (boid.y > this.height - this.WRAP_RADIUS) {
      boid.velocity.y -= this.EDGE_FORCE;
    }
    if (boid.x < this.WRAP_RADIUS) {
      boid.velocity.x += this.EDGE_FORCE;
    }
    if (boid.y < this.WRAP_RADIUS) {
      return boid.velocity.y += this.EDGE_FORCE;
    }
  };

  Swarm.prototype.makeRandomVector = function() {
    var v, x, y;
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    v = new Vector(x, y);
    v.scale(this.V_LIM / v.magnitude());
    return v;
  };

  return Swarm;

})();
