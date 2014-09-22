/**
 * 
 * @namespace A namespace containing implementations of possible boost effects.
 * @constant
 * @static
 */
var BoostUtil = {
    BoostFunctions: [
        {
            start: function() {
                Game.player.isBlind = true;
            },
            end: function() {
                Game.player.isBlind = false;
            },
            name: "Blind"
        },
                
        {
            start: function() {
                Game.player.frictionReciprocal = 5;
                Game.player.rotFrictionFactor = 4;
            },
            end: function() {
                Game.player.frictionReciprocal = 10;
                Game.player.rotFrictionFactor = 2;
            },
            name: "Sticky"
        }
    ]
};
