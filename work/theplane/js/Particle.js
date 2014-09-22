/**
 * Creates a graphics object that will be used as the bitmap displayed by all particle objects.
 * @extends Particle
 * @returns {Shape}
 */
Particle.getGraphics = function() {
    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(17, 250, 91));
    g.beginFill(createjs.Graphics.getRGB(17, 250, 91));
    g.drawCircle(0, 0, 2);

    var shape = new createjs.Shape(g);
    return shape;
};

Particle.prototype = Particle.getGraphics();
/**
 * @class Represents a particle effect that will not interact with surrounding objects.
 * @param {Number} x Spawn x co-ord.
 * @param {Number} y Spawn y co-ord.
 * @returns {Particle}
 */
function Particle(x, y) {
    /**
     * The randomised speed factor to multiply unit velocity vector by.
     * @constant
     * @private
     * @type Number
     */
    this.SPEED_FACTOR = Math.round(Math.random() * 10) + 5;
    /**
     * The rate at which the bullet becomes completely invisible, between 0 and 1.
     * @constant
     * @private
     * @type Number
     */
    this.FADE_SPEED = 0.05;
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
    /**
     * True if the particle is 'alive' to be updated.
     * @public
     * @type Boolean
     */
    this.active = true;

    /**
     * X co-ord of particle.
     * @public
     * @type Number
     */
    this.x = x;
    /**
     * Y co-ord of particle.
     * @public
     * @type Number
     */
    this.y = y;

    var a = Math.random() * 360;
    a = (Math.PI / 180) * a;
    /**
     * X component of unit velocity mult by speed factor.
     * @private
     * @type Number
     */
    this.dx = this.SPEED_FACTOR * Math.cos(a);

    /**
     * Y component of unit velocity mult by speed factor.
     * @private
     * @type Number
     */
    this.dy = this.SPEED_FACTOR * Math.sin(a);
}
/**
 * Called by the global ticker to update this particle state.
 * @public
 * @augments Particle
 * @returns {undefined}
 */
Particle.prototype.update = function() {
    this.alpha -= this.FADE_SPEED;
    var c = createjs.Ticker.getTicks();
    if ((c - this.SPAWN_TIME) >= this.FADE_FRAMES) {
        this.active = false;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > Game.canvas.width)
        this.dx = -this.dx;
    if (this.y < 0 || this.y > Game.canvas.height)
        this.dy = -this.dy;
};
