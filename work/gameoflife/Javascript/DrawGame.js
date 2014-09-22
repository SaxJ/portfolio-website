/// <reference path="Game.js" />
/// <reference path="easel - 4.0.js" />
/* File Created: February 24, 2012 */
var stage;
var bounds;
var cells;
var game;
var populationDensity = 0.1;
var liveColor = Graphics.getRGB(139, 2, 194, 1);

function activateCell(i, j) {
    if (Ticker.getPaused()) {
        game.grid[i][j] = !game.grid[i][j];

        if (game.grid[i][j]) {
            cells[i][j].alpha = 1;
        } else {
            cells[i][j].alpha = 0;
        }
        stage.update();
    }
}

function getClickLocation(e) {
    var x;
    var y;

    var canvas = document.getElementById("gameCanvas");
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    //convert to cell co-ordinates
    var width = Math.round(bounds.width / Game.GRID_SIZE);
    var i = Math.floor(x / width);
    var j = Math.floor(y / width);
    activateCell(i, j);
    //alert("(" + i + ", " + j + ")");
}

function init() {
    var canvas = document.getElementById("gameCanvas");

    canvas.addEventListener('click', getClickLocation, false);

    stage = new Stage(canvas);
    stage.mouseEnabled = true;
    game = new Game(populationDensity);

    bounds = new Rectangle();
    bounds.width = canvas.width;
    bounds.height = canvas.height;

    var g = new Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(Graphics.getRGB(255, 255, 255, 1));
    var width = Math.round(bounds.width / Game.GRID_SIZE);
    g.beginFill(liveColor); //replaced with liveColor
    g.rect(0, 0, width, width);

    cells = new Array(Game.GRID_SIZE);
    for (var i = 0; i < Game.GRID_SIZE; i++) {
        cells[i] = new Array(Game.GRID_SIZE);
        for (var j = 0; j < Game.GRID_SIZE; j++) {
            cells[i][j] = new Shape(g);
            cells[i][j].x = i * width;
            cells[i][j].y = j * width;
            if (game.grid[i][j]) {
                cells[i][j].alpha = 1;
            } else {
                cells[i][j].alpha = 0;
            }
            cells[i][j].onClick = function (e) { activateCell(i, j); }
            stage.addChild(cells[i][j]);
        }
    }

    stage.update();

    var speed = document.getElementById("speedSlider").value;
    Ticker.setFPS(speed);
    Ticker.addListener(this);
    Ticker.setPaused(true);
}

function tick() {
    game.updateWorld();
    console.log("tick");
    for (var i = 0; i < Game.GRID_SIZE; i++) {
        for (var j = 0; j < Game.GRID_SIZE; j++) {
            if (game.grid[i][j]) {
                cells[i][j].alpha = 1;
            } else {
                cells[i][j].alpha = 0;
            }
        }
    }
    stage.update();
}

function togglePause() {
    Ticker.setPaused(!Ticker.getPaused());
}

function hideControls() {
    document.getElementById("gameControls").style.display = "none";
}

function showControls() {
    document.getElementById("gameControls").style.display = "inline";
}

function setDensity(d) {
    populationDensity = d;
}

function resetGame() {
    stage.removeAllChildren();
    init();
}

function setDeadColor() {
    var r = document.getElementById("deadRed").value;
    var g = document.getElementById("deadGreen").value;
    var b = document.getElementById("deadBlue").value;

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    document.getElementById("gameCanvas").style.backgroundColor = color;
}

function setLiveColor() {
    var r = document.getElementById("liveR").value;
    var g = document.getElementById("liveG").value;
    var b = document.getElementById("liveB").value;

    liveColor = Graphics.getRGB(r, g, b, 1);
}

function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}