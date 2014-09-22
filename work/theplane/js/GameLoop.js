/**
 * @author Saxon Jensen saxon.jensen@hotmail.com
 * @namespace Contains functions and variables relating to the updating of the current fame state.
 */
var GameLoop = {
    // key event variables
    /**
     * True if the W key is down, false otherwise.
     * @private
     * @static
     * @type Boolean|Boolean|Boolean
     */
    w_down: false,
    /**
     * True if A key is down, false otherwise.
     * @type Boolean|Boolean|Boolean
     * @private
     * @static
     */
    a_down: false,
    /**
     * True if S key is down, false otherwise.
     * @type Boolean|Boolean|Boolean
     * @private
     * @static
     */
    s_down: false,
    /**
     * True if D key is down, false otherwise.
     * @type Boolean|Boolean|Boolean
     * @private
     * @static
     */
    d_down: false,
    /**
     * True if SPACE key is down, false otherwise.
     * @type Boolean|Boolean|Boolean
     * @private
     * @static
     */
    space_down: false,
    // timers
    /**
     * The number of frames to elapse between enemy spawns, in frames.
     * @type Number
     * @static
     * @private
     */
    enemyDelay: 90,
    /**
     * The number of frames that has elapsed since the last enemy spawn, in frames.
     * @type Number|Number
     * @static
     * @private
     */
    enemyTimer: 0,
    /**
     * The number of frames to elapse between background effect spawns, in frames.
     * @type Number
     * @private
     * @static
     */
    effectDelay: 20,
    /**
     * The number of frames that have passes since the last background spawn.
     * @type Number|Number
     * @private
     * @static
     */
    effectTimer: 0,
    /**
     * The number of frames to pass between powerup spawns.
     * @type Number
     * @private
     * @static
     */
    powerupDelay: 240,
    /**
     * The number of frames that have passed since the last powerup spawn.
     * @type Number|Number
     * @private
     * @static
     */
    powerupTimer: 0,
    /**
     * The list of active boost objects.
     * @private
     * @static
     * @type Array
     */
    boostList: new Array(),
    /**
     * The delay between boost spawns
     * @type Number
     */
    boostDelay: 400,
    /**
     * The time since last boost spawn.
     * @type Number
     */
    boostTime: 0,
    /**
     * 
     * @description The core tick function, responsible for updating all game objects.
     * @static
     * @private
     */
    tick: function() {
        Game.player.update();
        GameLoop.updateBullets();
        GameLoop.updateEnemies();
        GameLoop.updateParticles();
        GameLoop.updateEffects();
        GameLoop.updatePowerups();
        GameLoop.checkPlayerHit();
        GameLoop.checkBulletHit();
        GameLoop.updateBoost();

        if (Game.player.health <= 0) {
            Game.finish();
        }
        Game.stage.update();
    },
    /**
     * Randomly generates an x and y co-ordinate along one of the 4 edges of the playing field.
     * @returns {x: Number, y: Number}
     * @private
     * @static
     */
    randomEdge: function() {
        var r = Math.random();
        if (r < 0.25) {
            return {x: 0, y: Math.round(Math.random() * Game.canvas.height)};
        } else if (r >= 0.25 && r < 0.5) {
            return {x: Game.canvas.width, y: Math.round(Math.random() * Game.canvas.height)};
        } else if (r >= 0.5 && r < 0.75) {
            return {x: Math.round(Math.random() * Game.canvas.width), y: 0};
        } else {
            return {x: Math.round(Math.random() * Game.canvas.width), y: Game.canvas.height};
        }
    },
    /**
     * @description Updates all enemy objects, and spawns them at the interval specified in GameLoop.enemyDelay.
     * @returns {undefined}
     * @static
     * @private
     */
    updateEnemies: function() {
        GameLoop.enemyTimer++;
        var n = Game.enemyContainer.getNumChildren();

        // add enemy if the time is right.
        if (GameLoop.enemyTimer > GameLoop.enemyDelay && n < Game.ENEMY_CAP) {
            GameLoop.enemyTimer = 0;

            var enemy = null;
            var r = Math.random();
            var pos = GameLoop.randomEdge();
            if (r > 0.25 && r < 0.5) {
                enemy = new Skirter(pos.x, pos.y);
            } else if (r >= 0.5 && r < 0.75) {
                enemy = new RichochetDrone(pos.x, pos.y);
            } else {
                enemy = new Enemy(pos.x, pos.y);
            }
            Game.enemyContainer.addChild(enemy);
        }

        for (var i = 0; i < Game.enemyContainer.getNumChildren(); i++) {
            var e = Game.enemyContainer.getChildAt(i);
            e.update();

            // check player sight range
            if (Game.player.isBlind) {
                e.alpha = Game.player.sight(e);
            }

            if (!e.active) {
                Game.enemyContainer.removeChildAt(i);
                Game.kills++;
            }
        }
    },
    /**
     * @description Updates all particle objects.
     * @static
     * @private
     * @returns {undefined}
     */
    updateParticles: function() {
        var n = Game.particleContainer.getNumChildren();
        for (var i = 0; i < Game.particleContainer.getNumChildren(); i++) {
            var p = Game.particleContainer.getChildAt(i);
            p.update();

            // check player sight range
            if (Game.player.isBlind) {
                p.alpha = Game.player.sight(p);
            }
            if (!p.active) {
                Game.particleContainer.removeChildAt(i);
            }
        }
    },
    /**
     * 
     * @returns {undefined}
     * @description Updates all bullet objects.
     * @static
     * @private
     */
    updateBullets: function() {
        var n = Game.bulletContainer.getNumChildren();
        for (var i = 0; i < Game.bulletContainer.getNumChildren(); i++) {
            var b = Game.bulletContainer.getChildAt(i);
            b.update();

            // check player sight range
            if (Game.player.isBlind) {
                b.alpha = Game.player.sight(b);
            }

            if (!b.active) {
                b.explode();
                Game.bulletContainer.removeChildAt(i);
            }
        }
    },
    /**
     * 
     * @returns {undefined}
     * @static
     * @private
     * @description Updates all powerup objects.
     */
    updatePowerups: function() {
        GameLoop.powerupTimer++;
        if (GameLoop.powerupTimer >= GameLoop.powerupDelay) {
            var rx = Math.round(Math.random() * Game.canvas.width);
            var ry = Math.round(Math.random() * Game.canvas.height);
            var p = new BulletPowerup(rx, ry);
            Game.powerupContainer.addChild(p);
            GameLoop.powerupTimer = 0;
        }

        var n = Game.powerupContainer.getNumChildren();
        for (var i = 0; i < Game.powerupContainer.getNumChildren(); i++) {
            var pu = Game.powerupContainer.getChildAt(i);
            pu.update();

            // check player sight range
            if (Game.player.isBlind) {
                pu.alpha = Game.player.sight(pu);
            }

            if (pu.hit()) {
                pu.explode();
                Game.powerupContainer.removeChildAt(i);
            }
        }
    },
    /**
     * 
     * @param {mouseEvent} e The mouse event being handled by this function.
     * @returns {undefined}
     * @static
     * @private
     * @description A handler for the key down event.
     */
    keyDown: function(e) {
        e = e || window.event;

        switch (e.keyCode) {
            case KeyMap.A:
                GameLoop.a_down = true;
                break;
            case KeyMap.W:
                GameLoop.w_down = true;
                break;
            case KeyMap.S:
                GameLoop.s_down = true;
                break;
            case KeyMap.D:
                GameLoop.d_down = true;
                break;
            case KeyMap.SPACE:
                GameLoop.space_down = true;
                break;
            case KeyMap.P:
                GameLoop.togglePause();
                break;
            default:
                // do nothing
        }
    },
    /**
     * 
     * @param {MouseEvent} e The MouseEvent object being handled by this function.
     * @returns {undefined}
     * @event
     * @description The handler for the keyUp event.
     */
    keyUp: function(e) {
        e = e || window.event;

        switch (e.keyCode) {
            case KeyMap.A:
                GameLoop.a_down = false;
                break;
            case KeyMap.W:
                GameLoop.w_down = false;
                break;
            case KeyMap.S:
                GameLoop.s_down = false;
                break;
            case KeyMap.D:
                GameLoop.d_down = false;
                break;
            case KeyMap.SPACE:
                GameLoop.space_down = false;
                break;
            default:
                // do nothing
        }
    },
    /**
     * 
     * @param {type} e The mouse event
     * @returns {Object} An object having a public x and y field.
     * @description Returns a mouse co-ord relative to the canvas.
     * @deprecated No longer used.
     */
    relMouseCoords: function(e) {
        var cx;
        var cy;
        var gCanvasElement = e.target;
        if (e.pageX || e.pageY) {
            cx = e.pageX;
            cy = e.pageY;
        }
        else {
            cx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            cy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        cx -= gCanvasElement.offsetLeft;
        cy -= gCanvasElement.offsetTop;

        return {x: cx, y: cy};
    },
    /**
     * 
     * @returns {undefined}
     * @description Updates all background effect objects.
     * @static
     * @private
     */
    updateEffects: function() {
        GameLoop.effectTimer++;
        var n = Game.effectsContainer.getNumChildren();
        if (GameLoop.effectTimer === GameLoop.effectDelay && n < Game.EFFECT_CAP) {
            GameLoop.effectTimer = 0;
            var e = new Effect();
            Game.effectsContainer.addChild(e);
        }

        for (var i = 0; i < Game.effectsContainer.getNumChildren(); i++) {
            var e = Game.effectsContainer.getChildAt(i);
            e.update();

            // check player sight range
            if (Game.player.isBlind) {
                e.alpha = Game.player.sight(e);
            }

            if (!e.active)
                Game.effectsContainer.removeChildAt(i);
        }
    },
    /**
     * 
     * @returns {undefined}
     * @private
     * @static
     * @description Toggles the ticker between a paused and unpaused state, whilst also displaying a HTML overlay on pause.
     */
    togglePause: function() {
        createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
        HTML.togglePauseMenu();
    },
    /**
     * 
     * @returns {undefined}
     * @description Checks if the player has collided with any enemy objects.
     * @static
     * @private
     */
    checkPlayerHit: function() {
        var p = Game.player;
        var n = Game.enemyContainer.getNumChildren();
        for (var i = 0; i < n; i++) {
            var e = Game.enemyContainer.getChildAt(i);
            var dist = (p.x - e.x) * (p.x - e.x) + (p.y - e.y) * (p.y - e.y);
            if (dist < 1000) {
                p.health -= e.damage;
                document.getElementById("healthDisplay").innerHTML = p.health;
                e.explode();
                e.active = false;
            }
        }
    },
    /**
     * 
     * @returns {undefined}
     * @description Checks if bullet objects have collided with anything.
     * @static
     * @private
     */
    checkBulletHit: function() {
        var nb = Game.bulletContainer.getNumChildren();
        for (var i = 0; i < nb; i++) {
            var b = Game.bulletContainer.getChildAt(i);
            var ne = Game.enemyContainer.getNumChildren();
            for (var j = 0; j < ne; j++) {
                var e = Game.enemyContainer.getChildAt(j);
                var dist = (b.x - e.x) * (b.x - e.x) + (b.y - e.y) * (b.y - e.y);
                var rad = (b.radius + e.radius) * (b.radius + e.radius);
                if (dist <= rad) {
                    b.explode();
                    e.explode();
                    b.active = false;
                    e.health -= b.damage;
                }
            }
        }
    },
    updateBoost: function() {
        GameLoop.boostTime++;
        if (GameLoop.boostTime >= GameLoop.boostDelay) {
            var rx = Math.round(Math.random() * Game.canvas.width);
            var ry = Math.round(Math.random() * Game.canvas.height);
            var p = new Boost(rx, ry);
            Game.powerupContainer.addChild(p);
            GameLoop.boostTime = 0;
        }

        for (var i = 0; i < Game.boostContainer.getNumChildren(); i++) {
            var pu = Game.boostContainer.getChildAt(i);
            pu.update();

            // check player sight range
            if (Game.player.isBlind) {
                pu.alpha = Game.player.sight(pu);
            }

            if (pu.hit()) {
                pu.explode();
                Game.boostContainer.removeChildAt(i);
            }
        }
        //update the boost list now
        GameLoop.updateBoostList();
    },
    updateBoostList: function() {
        for (var i = 0; i < GameLoop.boostList.length; i++) {
            GameLoop.boostList[i].life++;
            if (GameLoop.boostList[i].life >= Game.BOOST_DURATION) {
                var effect = GameLoop.boostList[i];
                GameLoop.boostList.splice(i, 1);
                effect.finish();
            }
        }
    }


};