Powerup.prototype = new createjs.Bitmap("images/gear.png");
/**
 * @class The base class of powerups. Powerups are objects that modify the game behaviour in some way until player death. Are always good.
 * @param {type} x The x co-ord of the spawn location.
 * @param {type} y The y co-ord of the spawn location.
 * @returns {Powerup}
 */
function Powerup(x, y) {
    this.ROT_SPEED = 5;
    this.x = x;
    this.y = y;
    this.regX = 20;
    this.regY = 20;
    console.log("PU SPawned");
}
/**
 * Called by the global ticker to update this objects state.
 * @augments Powerup
 * @public
 * @returns {undefined}
 */
Powerup.prototype.update = function () {
    this.rotation += this.ROT_SPEED;
};
/**
 * Spawns a number of particles defined in Game at this objects location.
 * @augments Powerup
 * @public
 * @returns {undefined}
 */
Powerup.prototype.explode = function () {
    for (var i = 0; i < Game.EXPLOSION_COUNT; i++) {
        var p = new ParticleOrange(this.x, this.y);
        Game.particleContainer.addChild(p);
    }
};
/**
 * The function called when the powerup is collected. Sub classes of powerup will implement this method.
 * @private
 * @augments Powerup
 * @returns {undefined}
 */
Powerup.prototype.action = function () {
    //do nothing
};
/**
 * Returns true if this object is hit by the player, false otherwise.
 * @public
 * @augments Powerup
 * @returns {Boolean}
 */
Powerup.prototype.hit = function () {
    var p = Game.player;
    var d = (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y);
    if (d < 500) {
        this.action();
    }
    return (d < 500);
};