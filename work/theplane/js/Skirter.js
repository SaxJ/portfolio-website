/// <reference path="Utility.js" />
/// <reference path="Game.js" />
/**
 *@author Saxon Jensen
 */

Skirter.prototype = new createjs.Bitmap("images/skirter.png");

function Skirter(x, y) {
    this.x = x;
    this.y = y;
    this.SPEED = 10;
    this.active = true;
    this.health = 30;
    this.ROT_SPEED = 25;
    this.damage = 40;
    this.directionDelay = 45;
    this.directionTimer = 0;
    this.dx = 0;
    this.dy = 0;

    this.regX = 15;
    this.regY = 15;
    this.radius = 15;
}

Skirter.prototype.update = function () {
    // update direction change timer
    this.directionTimer++;

    //change direction if timer is ready
    if (this.directionTimer >= this.directionDelay) {
        var f1 = Utility.randomNegative();
        var f2 = Utility.randomNegative();
        this.dx = f1 * Math.random();
        this.dy = f2 * Math.random();
        this.directionTimer = 0;
    }
    this.rotation += this.ROT_SPEED;

    var nx = this.x + this.dx * this.SPEED;
    var ny = this.y + this.dy * this.SPEED;

    // check if the new position is going to move the object out of the canvas.
    if (!(nx < 0 || nx > Game.canvas.width)) {
        this.x = nx;
    }
    if (!(ny < 0 || ny > Game.canvas.height)) {
        this.y = ny;
    }

    // check if enemy is dead
    if (this.health <= 0) {
        this.explode();
        this.active = false;
    }
};

Skirter.prototype.explode = function () {
    for (var i = 0; i < Game.EXPLOSION_COUNT; i++) {
        var p = new Particle(this.x, this.y);
        Game.particleContainer.addChild(p);
    }
};