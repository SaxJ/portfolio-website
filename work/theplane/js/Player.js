Player.prototype = new createjs.Bitmap("images/player.png");

/**
 * @class Represents the player of the game.
 * @author Saxon Jensen <saxon.jensen@hotmail.com>
 * @returns {Player}
 * @extends Bitmap
 */
function Player() {
    // position variables
    this.x = 50;
    this.y = 50;
    this.regX = 20;
    this.regY = 20;
    this.globalX = 0;
    this.globalY = 0;

    // movement physics variables
    this.dx = 0;
    this.dy = 0;
    this.accelFactor = 1;
    this.maxSpeed = 20;
    this.SPRAY_SIZE = 30;
    this.frictionReciprocal = 10;

    // rotation physics variables
    this.rotSpeed = 0;
    this.maxRotSpeed = 12;
    this.rotAccel = 2;
    this.rotFrictionFactor = 2;

    // player game-related variables
    this.health = 100;
    this.level = 1;
    this.fireTime = 0;
    this.bulletScale = 1;
    this.isBlind = false;
    this.SIGHT_RANGE = 100;
}
/**
 * Updates the player state.
 * @augments Player
 * @public
 * @returns {undefined}
 */
Player.prototype.update = function() {
    //increment action timers and counters
    this.fireTime++;
    this.rotation = this.rotation % 360;

    // action functions
    this.calcMovement();
    this.generateSpray();
    this.rotate();
    this.fire();
};
/**
 * Checks the time since a bullet was last fired, and spawns a bullet object with a volicity in the direction the player is facing.
 * @private
 * @augments Player
 * @returns {undefined}
 */
Player.prototype.fire = function() {
    if (this.fireTime > 10 && GameLoop.space_down) {
        var angle = this.rotation * (Math.PI / 180);
        var dy = Math.sin(angle);
        var dx = Math.cos(angle);

        var b = new Bullet(this.x, this.y, dx, dy, this.bulletScale);

        // add the bullet to the stage
        Game.bulletContainer.addChild(b);
        this.fireTime = 0;
    }
};
/**
 * Generates a random cluster of particles with a randomised velocity in the opposite direction to the player.
 * @returns {undefined}
 * @private
 * @augments Player
 */
Player.prototype.generateSpray = function() {
    if (!(GameLoop.w_down || GameLoop.s_down))
        return;
    for (var i = 0; i < this.SPRAY_SIZE; i++) {
        // angle of the spray can vary by at most by 20 degrees
        var angleChange = Math.random() * 90;

        // randomly select 1 or -1 to add or subtract the angle change from the current rotation.
        var addSubChange = 1;
        if (Math.random() < 0.5) {
            addSubChange *= -1;
        }

        // calculate dx and dy from angle.
        var angle = (this.rotation + addSubChange * angleChange) * (Math.PI / 180);
        var dx = -Math.cos(angle);
        var dy = -Math.sin(angle);
        var s = new Spray(this.x, this.y, dx, dy);
        Game.particleContainer.addChild(s);
    }
};
/**
 * Calculates accelleration and velocity components based on the rotation and current velocity of the player.
 * @returns {undefined}
 * @augments Player
 * @private
 */
Player.prototype.calcMovement = function() {
    var dx = 0;
    var dy = 0;
    if (GameLoop.w_down || GameLoop.s_down) {
        var angle = this.rotation * (Math.PI / 180);
        var f = 1;
        if (GameLoop.s_down) {
            f = -1;
        }

        dx = Math.cos(angle) * this.accelFactor * f;
        dy = Math.sin(angle) * this.accelFactor * f;

        this.dx += dx;
        this.dy += dy;
    } else {
        this.dx -= this.dx / this.frictionReciprocal;
        this.dy -= this.dy / this.frictionReciprocal;
    }
    if (this.dx > this.maxSpeed)
        this.dx = this.maxSpeed;
    if (this.dy > this.maxSpeed)
        this.dy = this.maxSpeed;

    var nx = this.x + this.dx;
    var ny = this.y + this.dy;

    if (!(nx > Game.canvas.width || nx < 0)) {
        this.x += this.dx;
    }
    if (!(ny > Game.canvas.height || ny < 0)) {
        this.y += this.dy;
    }
};
/**
 * Increments the players rotation based on the keys pressed.
 * @returns {undefined}
 * @private
 * @augments Player
 */
Player.prototype.rotate = function() {
    if (!(GameLoop.a_down || GameLoop.d_down)) {
        this.rotSpeed = this.rotSpeed / this.rotFrictionFactor;
    } else if (Math.abs(this.rotSpeed) < this.maxRotSpeed) {
        if (GameLoop.d_down)
            this.rotSpeed += this.rotAccel;
        if (GameLoop.a_down)
            this.rotSpeed -= this.rotAccel;
    }
    this.rotation += this.rotSpeed;
};
/**
 * Returns an alpha value corresponding to the player level of sight to the specified object.
 * @augments Player
 * @public
 * @param {DisplayObject} obj
 * @returns {Number}
 */
Player.prototype.sight = function (obj) {
    var dist = (this.x - obj.x) * (this.x - obj.x) + (this.y - obj.y) * (this.y - obj.y);
    var alpha = (this.SIGHT_RANGE * this.SIGHT_RANGE) / dist;
    if (dist <= (this.SIGHT_RANGE * this.SIGHT_RANGE)) {
        alpha = 1;
    }
    return alpha;
};

Player.prototype.setGlobalPosition = function(pos) {
    this.globalX = pos.px;
    this.globalY = pos.py;
};