BulletPowerup.prototype = new Powerup(5, 5);

/**
 * @author Saxon Jensen <saxon.jensen@hotmail.com>
 * @param {Number} x The x co-ord spawn location.
 * @param {Number} y The y co-ord spawn location.
 * @returns {BulletPowerup}
 * @class Represents a powerup cabable of increasing the hit radius of the players bullets.
 * @extends Powerup
 */
function BulletPowerup(x, y) {
    /**
     * Current position x co-ord.
     * @type Number
     */
    this.x = x;
    /**
     * Current position y co-ord.
     * @type Number
     */
    this.y = y;
}

/**
 * @description Defines the action a powerup makes on the game. This powerup changes the size of the players bullets.
 * @public
 * @augments BulletPowerup
 * @returns {undefined}
 */
BulletPowerup.prototype.action = function() {
    Game.player.bulletScale += 0.5;
};