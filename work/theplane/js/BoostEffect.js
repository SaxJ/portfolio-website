/**
 * @class Represents a timed effect on the game.
 * @returns {BoostEffect}
 */
function BoostEffect() {
    // execute start function
    var rand = Math.round(Math.random() * (BoostUtil.BoostFunctions.length - 1));
    BoostUtil.BoostFunctions[rand].start();
    
    this.life = 0;
    this.finish = BoostUtil.BoostFunctions[rand].end;
}