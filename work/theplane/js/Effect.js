Effect.prototype = new createjs.Bitmap("images/effect-horizontal.png");

/**
 * @augments Saxon Jensen <saxon.jensen@hotmail.com>
 * @class Represents a background effect that does not interact with the game mechanics at all.
 * @extends Bitmap
 * @returns {Effect}
 */
function Effect() {
    /**
     * The speed of the effect.
     * @private
     * @constant
     * @type Number
     */
    this.speed = Math.random() * 15 + 20;
    /**
     * If the effect is alive to be updated or not.
     * @private
     * @type Boolean
     */
    this.active = true;
    /**
     * An enum represnting the direction the effect will travel. "D" = down, "U" = up, "R" = right, "L" = left.
     * @private
     * @constant
     * @type String
     */
    this.dir = "D";
    /**
     * The transparency of the effect.
     * @constant
     * @private
     * @type Number
     */
    this.alpha = 0.3;
    /**
     * The factor to scale the y-axis of this bitmap by.
     * @private
     * @constant
     * @type Number
     */
    this.scaleY = Math.random();
    /**
     * The factor to scale the x-axis of this bitmap by.
     * @private
     * @constant
     * @type Number
     */
    this.scaleX = Math.random() * 2.5;

    // create random effect direction
    var r = Math.random();
    if (r < 0.25) {
        this.dir = "U";
        this.rotation = -90;
    } else if (r >= 0.25 && r < 0.5) {
        this.dir = "D";
        this.rotation = 90;
    } else if (r >= 0.5 && r < 0.75) {
        this.dir = "L";
        this.rotation = 180;
    } else {
        this.dir = "R";
    }

    if (this.dir === "R") {
        this.x = Game.canvas.width + 210;
        this.y = Math.round(Math.random() * Game.canvas.height);
    } else if (this.dir === "U") {
        this.x = Math.round(Game.canvas.width * Math.random());
        this.y = -210;
    } else if (this.dir === "D") {
        this.y = Game.canvas.height + 210;
        this.x = Math.round(Game.canvas.width * Math.random());
    } else {
        this.x = -210;
        this.y = Math.round(Game.canvas.height * Math.random());
    }

}
/**
 * This is the function called by the ticker to update the position of this effect.
 * @public
 * @augments Effect
 * @returns {undefined}
 */
Effect.prototype.update = function() {
    if (this.dir === "U") {
        this.y += this.speed;
    } else if (this.dir === "D") {
        this.y -= this.speed;
    } else if (this.dir === "L") {
        this.x += this.speed;
    } else {
        this.x -= this.speed;
    }

    if (this.x < -200 || this.x > Game.canvas.width + 200 || this.y < -200 || this.y > Game.canvas.height + 200) {
        this.active = false;
    }
};