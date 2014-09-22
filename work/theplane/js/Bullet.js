Bullet.prototype = new createjs.Bitmap("images/bullet.png");

/**
 * @class Represents a bullet able to inflict damage on enemies.
 * @author Saxon Jensen <saxon.jensen@hotmail.com>
 * @description Represents a bullet projected by the player. Travels in straight lines and is destroyed on collision with game borders.
 * @param {Number} x The spawning x co-ord.
 * @param {Number} y The spawning y co-ord.
 * @param {Number} vx The unit velocity x component.
 * @param {Number} vy The unit velocity y component.
 * @param {Number} scale The factor to scale the bullet radius by.
 * @returns {Bullet}
 */
function Bullet(x, y, vx, vy, scale) {
    // physics variables
    /**
     * The factor to multiplay the velocity unit vector by.
     * @type Number
     * @private
     */
    this.SPEED_FACTOR = 20;
    /**
     * The number of particles to spawn on a bullet explosion.
     * @private
     * @deprecated Game namespace now contains explosion size.
     * @type Number
     */
    this.EXPLOSION_SIZE = 40;
    
    // position variables
    /**
     * X co-ord of bullet.
     * @private
     * @type Number
     */
    this.x = x;
    /**
     * Y co-ord of bullet.
     * @private
     * @type Number
     */
    this.y = y;
    /**
     * Velocity x-component.
     * @private
     * @type Number
     */
    this.dx = this.SPEED_FACTOR * vx;
    /**
     * Velocity y-component.
     * @private
     * @type Number
     */
    this.dy = this.SPEED_FACTOR * vy;
    /**
     * X co-ord of the registry point of the object relative to bitmap top-left corner.
     * @private
     * @type Number
     */
    this.regX = 6;
    /**
     * X co-ord of the registry point of the object relative to bitmap top-left corner.
     * @private
     * @type Number
     */
    this.regY = 3;
    
    // rotation variables
    /**
     * The rotation of the bullet based on the bullets velocity.
     * @type Number
     * @private
     */
    this.rotation = (180 / Math.PI) * Math.atan2(vy, vx);
    
    // bullet game state variables
    /**
     * Represents if bullet is alive to be updated or not.
     * @type Boolean
     * @public
     */
    this.active = true;
    /**
     * The amount of health the bullet takes away from enemies it collides with.
     * @constant
     * @public
     * @type Number
     */
    this.damage = 10;
    /**
     * The amount to scale the bullet by.
     * @constant
     * @public
     * @type Number
     */
    this.scaleY = scale;
    /**
     * The hit radius of the bullet.
     * @constant
     * @public
     * @type Number
     */
    this.radius = 6 * scale;
}

/**
 * @augments Bullet
 * @description Updates the state of the bullet on frame tick.
 * @private
 * @returns {undefined}
 */
Bullet.prototype.update = function() {
    var nx = this.x + this.dx;
    var ny = this.y + this.dy;
    
    if (nx < 0 || nx > Game.canvas.width || ny < 0 || ny > Game.canvas.height) {
        this.active = false;
    } else {
        this.x = nx;
        this.y = ny;
    }
};

/**
 * @description Spawns an EXPLOSION_SIZE amount of particle objects at the bullets current position.
 * @augments Bullet
 * @public
 * @returns {undefined}
 */
Bullet.prototype.explode = function() {
    for (var i = 0; i < Game.EXPLOSION_COUNT; i++) {
        var p = new Particle(this.x, this.y);
        Game.particleContainer.addChild(p);
    }
};