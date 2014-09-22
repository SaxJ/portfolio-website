/* File Created: February 23, 2012 */

function Game(prob) {
    console.log("New game made");
    this.grid = new Array(Game.GRID_SIZE);
    this.nextGrid = new Array(Game.GRID_SIZE);

    for (var i = 0; i < this.grid.length; i++) {
        this.grid[i] = new Array(Game.GRID_SIZE);
        this.nextGrid[i] = new Array(Game.GRID_SIZE);
        for (var j = 0; j < Game.GRID_SIZE; j++) {
            var r = Math.random();
            this.grid[i][j] = (r <= prob);
            this.nextGrid[i][j] = (r <= prob);
        }
    }

    //this.grid[7][5] = true;
    //this.grid[7][6] = true;
    //this.grid[7][7] = true;
}

Game.GRID_SIZE = 50;

Game.prototype.getAdjacent = function (i, j) {
    var count = 0;
    var ip = (i + 1) % Game.GRID_SIZE;
    var im = (Game.GRID_SIZE + i - 1) % Game.GRID_SIZE;
    var jp = (j + 1) % Game.GRID_SIZE;
    var jm = (Game.GRID_SIZE + j - 1) % Game.GRID_SIZE;

    if (this.grid[im][jm]) count++;
    if (this.grid[im][j]) count++;
    if (this.grid[im][jp]) count++;
    if (this.grid[i][jm]) count++;
    if (this.grid[i][jp]) count++;
    if (this.grid[ip][jm]) count++;
    if (this.grid[ip][j]) count++;
    if (this.grid[ip][jp]) count++;
    //console.log("Adjacent = " + count);
    return count;
}

Game.prototype.updateWorld = function () {
    //console.log("updating");
    for (var i = 0; i < Game.GRID_SIZE; i++) {
        for (var j = 0; j < Game.GRID_SIZE; j++) {
            var n = this.getAdjacent(i, j);

            if (n <= 1 || n >= 4) { this.nextGrid[i][j] = false; }
            if (n == 2) { this.nextGrid[i][j] = this.grid[i][j]; }
            if (n == 3) { this.nextGrid[i][j] = true; }
        }
    }

    var swap;
    swap = this.grid;
    this.grid = this.nextGrid;
    this.nextGrid = swap;
}

