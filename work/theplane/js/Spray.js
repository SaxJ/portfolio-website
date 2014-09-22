/**
 *@author Saxon Jensen saxon.jensen@outlook.com
 */

Spray.getGraphics = function () {
    var green = Math.round(Math.random() * 255);
    var blue = Math.round(Math.random() * 255);
    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(17, green, blue));
    g.beginFill(createjs.Graphics.getRGB(17, green, blue));
    g.drawCircle(0, 0, 1);
    var shape = new createjs.Shape(g);
    return shape;
};

Spray.prototype = Spray.getGraphics();

function Spray(x, y, vx, vy) {
    this.SPEED_FACTOR = Math.round(Math.random() * 2);
    this.FADE_SPEED = 0.05;
    this.active = true;

    this.x = x;
    this.y = y;

    this.dx = this.SPEED_FACTOR * vx;
    this.dy = this.SPEED_FACTOR * vy;
    
    /**
     * The number of frames for the particle to be in existance.
     * @constant
     * @private
     * @type Number
     */
    this.FADE_FRAMES = Math.round(1 / this.FADE_SPEED);
    /**
     * The time at which the particle spawned.
     * @constant
     * @private
     * @constant
     * @type Number
     */
    this.SPAWN_TIME = createjs.Ticker.getTicks();
}

Spray.prototype.update = function () {
    this.alpha -= this.FADE_SPEED;
    var c = createjs.Ticker.getTicks();
    if ((c - this.SPAWN_TIME) >= this.FADE_FRAMES) {
        this.active = false;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > Game.canvas.width) this.dx = -this.dx;
    if (this.y < 0 || this.y > Game.canvas.height) this.dy = -this.dy;
};
