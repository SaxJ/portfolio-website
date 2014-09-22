/**
 * @namespace Holds functions relating to the manipulation of the HTML DOM.
 * @author Saxon Jensen <saxon.jensen@hotmail.com>
 */
var HTML = {
    /**
     * Toggles the display of the death menu, showing the latest score, and the record score.
     * @static
     * @public
     * @param {Boolean} hide If true, pause menu is forced to be hidden. If false or undefined, normal toggle behaviour.
     * @returns {undefined}
     */
    toggleDeathMenu: function(hide) {
        var div = document.getElementById("deathMenu");

        document.getElementById("currentKills").innerHTML = "Your Score: " + Game.kills;
        document.getElementById("recordKills").innerHTML = "Record Score: " + SaveSystem.read(1);

        var disp = div.style.display;
        if (hide) {
            div.style.display = "none";
            return;
        }

        if (disp === "none" || disp === "") {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    },
    /**
     * Toggles the display of the pause menu, showing elements used to change graphics dettings.
     * @public
     * @static
     * @returns {undefined}
     */
    togglePauseMenu: function() {
        var a = document.getElementById("pauseMenu").style.display;
        console.log(a);

        if (a === "none" || a === "") {
            document.getElementById("pauseMenu").style.display = "block";
        } else {
            document.getElementById("pauseMenu").style.display = "none";
        }
    },
    /**
     * Starts the game anew, hiding the death menu if it is shown when the button this is listening to is clicked.
     * @static
     * @public
     * @returns {undefined}
     */
    startGameListener: function() {
        HTML.toggleDeathMenu(true);
        document.getElementById("startMenu").style.display = "none";
        Game.start(document.getElementById("gameCanvas"));
    },
    
    loadCompleteHandle: function() {
        document.getElementById("loadStatus").innerHTML = "Done";
        document.getElementById("startGameButton").style.display = "block";
    },
            
    loadProgressHandle: function() {
        document.getElementById("loadStatus").innerHTML = Math.round(Preloader.preload.progress * 100) + "%";
    }
};