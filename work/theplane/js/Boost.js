Boost.prototype = new createjs.Bitmap("images/battery.png");

function Boost(x, y) {
    this.ROT_SPEED = 3;
    this.x = x;
    this.y = y;
    this.regX = 20;
    this.regY = 20;
}

Boost.prototype.action = function() {
    var b = new BoostEffect();
    GameLoop.boostList.push(b);
};

/**
 * Returns true if this object is hit by the player, false otherwise.
 * @public
 * @augments Powerup
 * @returns {Boolean}
 */
Boost.prototype.hit = function () {
    var p = Game.player;
    var d = (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y);
    if (d < 500) {
        this.action();
    }
    return (d < 500);
};

/**
 * Called by the global ticker to update this objects state.
 * @augments Powerup
 * @public
 * @returns {undefined}
 */
Boost.prototype.update = function () {
    this.rotation += this.ROT_SPEED;
};
/**
 * Spawns a number of particles defined in Game at this objects location.
 * @augments Powerup
 * @public
 * @returns {undefined}
 */
Boost.prototype.explode = function () {
    for (var i = 0; i < Game.EXPLOSION_COUNT; i++) {
        var p = new ParticleOrange(this.x, this.y);
        Game.particleContainer.addChild(p);
    }
};

