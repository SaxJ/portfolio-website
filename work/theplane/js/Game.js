/**
 * @description Game namespace keeping the current game state.
 * @namespace Namespace containing variables and objects relating to the games current state.
 * @author Saxon Jensen saxon.jensen@hotmail.com
 */
var Game = {
    // object containers
    /**
     * @description Constains particle objects.
     * @public
     * @type Container
     */
    particleContainer: new createjs.Container(),
    /**
     * 
     * @type Container
     * @public
     * @description Contains enemy objects
     */
    enemyContainer: new createjs.Container(),
    /**
     * 
     * @type Container
     * @public
     * @description Contains bullet objects
     */
    bulletContainer: new createjs.Container(),
    /**
     * 
     * @type Container
     * @public
     * @description Contains effect objects
     */
    effectsContainer: new createjs.Container(),
    /**
     * 
     * @type Container
     * @public
     * @description Contains powerup objects
     */
    powerupContainer: new createjs.Container(),
    /**
     * 
     * @type Container
     */
    boostContainer: new createjs.Container(),
    // player object
    /**
     * @public
     * @type Player
     * @description The object that the player has control over.
     */
    player: new Player(),
    // game canvas properties
    /**
     * @private
     * @type Stage
     * @description The base container that links directly to the canvas. Contains all objects.
     */
    stage: null,
    /**
     * @private
     * @deprecated Canvas dimensions are used instead.
     * @type Rectangle
     * @description Represents the bounding rectangle of the stage.
     */
    bounds: null,
    /**
     * @public
     * @type DOMCanvas
     * @description The DOM canvas element that is used to display the game.
     */
    canvas: null,
    // configurable options.
    /**
     * @public
     * @static
     * @type Number 
     * @description The number of particles to spawn on explosion.
     */
    EXPLOSION_COUNT: 30,
    /**
     * @public
     * @static
     * @type Number
     * @description The maximum number of effects allowed on stage at one time.
     */
    EFFECT_CAP: 10,
    /**
     * @public
     * @static
     * @type Number
     * @description The maximum number of enemies allowed on stage at one time.
     */
    ENEMY_CAP: 10,
    /**
     * @public
     * @static
     * @type Number
     * @description The number of kills executed in the current game.
     */
    kills: 0,
    /**
     * @public
     * @static
     * @description The number of frames a boost may be active.
     * @type Number
     */
    BOOST_DURATION: 60,
    world: new World(10, 10),
    /**
     * @function
     * @static
     * @public
     * @description Begins the game, initialising and creating containing objects and the player object.
     * @param {DOMCanvas} canvas
     * @returns {undefined}
     */
    start: function(canvas) {
        // setup stage and canvas bounds
        Game.stage = new createjs.Stage(canvas);
        Game.canvas = canvas;
        Game.bounds = new createjs.Rectangle();
        Game.bounds.width = canvas.width;
        Game.bounds.height = canvas.height;

        // create a new character object
        Game.world = new World(10, 10);
        Game.player = new Player();
        Game.player.setGlobalPosition(Game.world.spawn);

        // create the stage background.
        var background = new createjs.Bitmap("images/grid.png");

        // add elements to stage
        Game.stage.addChild(background);
        Game.stage.addChild(Game.particleContainer);
        Game.stage.addChild(Game.bulletContainer);
        Game.stage.addChild(Game.enemyContainer);
        Game.stage.addChild(Game.effectsContainer);
        Game.stage.addChild(Game.powerupContainer);
        Game.stage.addChild(Game.boostContainer);
        Game.stage.addChild(Game.player);

        // set up event listeners
        document.addEventListener('keydown', GameLoop.keyDown);
        document.addEventListener('keyup', GameLoop.keyUp);

        // setup the ticker.
        createjs.Ticker.setFPS(30);
        createjs.Ticker.setPaused(false);
        createjs.Ticker.addListener(GameLoop);
    },
    /**
     * Filters the canvas with a gaussian filter to blur everything, adding a nice effect.
     * @deprecated Impacts frame rate way too much.
     * @returns {undefined}
     */
    filter: function() {
        var stageClone = Game.stage.clone();
        var margins = Game.blurFilter.getBounds();
        stageClone.filters = [Game.blurFilter];
        stageClone.cache(margins.x, margins.y, Game.canvas.width + margins.width, Game.canvas.height + margins.height);
        stageClone.updateCache();
    },
    /**
     * @static
     * @public
     * @function
     * @description Removes all elements from the canvas.
     * @returns {undefined}
     */
    clear: function() {
        Game.particleContainer.removeAllChildren();
        Game.enemyContainer.removeAllChildren();
        Game.bulletContainer.removeAllChildren();
        Game.effectsContainer.removeAllChildren();
        Game.powerupContainer.removeAllChildren();
        Game.boostContainer.removeAllChildren();
        Game.stage.removeAllChildren();
        Game.stage.update();
    },
    /**
     * Checks if which of the current score and record score is greater, and stores the greater in local storage.
     * @private
     * @static
     * @returns {undefined}
     */
    saveScore: function() {
        var savedScore = SaveSystem.read(1);
        if (savedScore === null || Game.kills > savedScore) {
            SaveSystem.save(Game.kills, 1);
        }
    },
    /**
     * Finishes the game and removes objects from the stage. Should only be called on player death.
     * @public
     * @static
     * @returns {undefined}
     */
    finish: function() {
        Game.saveScore();
        HTML.toggleDeathMenu();
        Game.clear();
        Game.kills = 0;
        createjs.Ticker.setPaused(true);
    }
};