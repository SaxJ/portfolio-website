/**
 * Creates a graphics object that will be used as the bitmap displayed by all particle objects.
 * @extends Particle
 * @returns {Shape}
 */
ParticleOrange.getGraphics = function () {
    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(255, 204, 0));
    g.beginFill(createjs.Graphics.getRGB(255, 204, 0));
    g.drawCircle(0, 0, 2);

    var shape = new createjs.Shape(g);
    return shape;
};

ParticleOrange.prototype = ParticleOrange.getGraphics();
/**
 * @class Represents an particle of an orange hue.
 * @param {type} x The spawn x co-ord.
 * @param {type} y The spawn y co-ord
 * @returns {ParticleOrange}
 */
function ParticleOrange(x, y) {
    /**
     * The factor to multiply velocity unit vector by.
     * @private
     * @constant
     * @type Number
     */
    this.SPEED_FACTOR = Math.round(Math.random() * 10) + 5;
    /**
     * The rate at which transparency decreases.
     * @private
     * @constant
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
     * True if particle is 'alive' and updateable.
     * @public
     * @type Boolean
     */
    this.active = true;
    /**
     * Current x co-ord
     * @public
     * @type Number
     */
    this.x = x;
    /**
     * Current x co-ord
     * @public
     * @type Number
     */
    this.y = y;

    var a = Math.random() * 360;
    a = (Math.PI / 180) * a;
    /**
     * Unit velocity x component.
     * @private
     * @type Number
     */
    this.dx = this.SPEED_FACTOR * Math.cos(a);
    /**
     * Unit velocity x component.
     * @private
     * @type Number
     */
    this.dy = this.SPEED_FACTOR * Math.sin(a);
}
/**
 * Called by the global ticker to update the particle state.
 * @public
 * @augments OrangeParticle
 * @returns {undefined}
 */
ParticleOrange.prototype.update = function () {
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
