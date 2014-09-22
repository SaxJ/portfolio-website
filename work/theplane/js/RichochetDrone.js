/**
 *@author Saxon Jensen
 */

RichochetDrone.prototype = new createjs.Bitmap("images/richochet_drone.png");

function RichochetDrone(x, y) {
    this.x = x;
    this.y = y;
    this.SPEED = 16;
    this.active = true;
    this.health = 20;
    this.ROT_SPEED = 10;
    this.damage = 15;
    this.rotation = Math.round(Math.random() * 360);
    this.dx = Math.cos((Math.PI / 180) * this.rotation);
    this.dy = Math.sin((Math.PI / 180) * this.rotation);

    this.regX = 15;
    this.regY = 15;
    this.radius = 15;
}

RichochetDrone.prototype.update = function () {
    var nx = this.x + this.dx * this.SPEED;
    var ny = this.y + this.dy * this.SPEED;

    if (nx < 0 || nx > Game.canvas.width) {
        this.dx = -this.dx;
        this.rotation = (180 / Math.PI) * Math.atan2(this.dy, this.dx);
    }
    if (ny < 0 || ny > Game.canvas.height) {
        this.dy = -this.dy;
        this.rotation = (180 / Math.PI) * Math.atan2(this.dy, this.dx);
    }
    this.x += this.dx * this.SPEED;
    this.y += this.dy * this.SPEED;

    if (this.health <= 0) {
        this.explode();
        this.active = false;
    }
};

RichochetDrone.prototype.explode = function () {
    for (var i = 0; i < Game.EXPLOSION_COUNT; i++) {
        var p = new Particle(this.x, this.y);
        Game.particleContainer.addChild(p);
    }
};