Enemy.prototype = new createjs.Bitmap("images/drone.png");
/**
 *@author Saxon Jensen saxon.jensen@hotmail.com
 *@type Enemy
 *@description Represents a simple enemy that will follow the player.
 *@argument {Number} x The starting x co-ord.
 *@argument {Number} y The starting y co-ord.
 */
function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.SPEED = 10;
    this.active = true;
    this.health = 10;
    this.ROT_SPEED = 10;
    this.damage = 10;

    this.regX = 15;
    this.regY = 15;
    this.radius = 15;
}
/**
 * The function called by the ticker to update this objects state.
 * @public
 * @augments Enemy
 * @returns {undefined}
 */
Enemy.prototype.update = function() {
    var dx = Game.player.x - this.x;
    var dy = Game.player.y - this.y;

    var mag = Math.sqrt(dx * dx + dy * dy);

    dx = dx / mag;
    dy = dy / mag;

    this.rotation += this.ROT_SPEED;
    this.x += dx * this.SPEED;
    this.y += dy * this.SPEED;

    if (this.health <= 0) {
        this.explode();
        this.active = false;
    }
};
/**
 * Spawns the number of particles described in the Game namespace at the enemys' current position.
 * @private
 * @returns {undefined}
 */
Enemy.prototype.explode = function() {
    for (var i = 0; i < Game.EXPLOSION_COUNT; i++) {
        var p = new Particle(this.x, this.y);
        Game.particleContainer.addChild(p);
    }
};