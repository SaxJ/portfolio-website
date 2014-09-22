/**
 *A world generator, generating a random maze of rooms.
 *@author Saxon Jensen <saxon.jensen@hotmail.com>
 *@constructs
 *@param {Number} size The size of the world. Square world size x size will be generated.
 *@param {Number} steps The number of rooms in the random maze.
 */
function World(size, steps) {
    this.grid = new Array(size);
    this.roomList = new Array();
    for (var i = 0; i < size; i++) {
        this.grid[i] = new Array(size);
    }
    
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            this.grid[i][j] = 0;
        }
    }
    
    this.randomWalk(steps);
    this.createExit();
    this.spawn = null;
    this.createSpawn();
}

/**
 * @description Creates an exit tile, marked with integer '2', randomly in the maps availiable rooms.
 * @augments World
 * @returns {undefined}
 */
World.prototype.createExit = function() {
    var r = Math.round(Math.random() * this.roomList.length);
    var point = this.roomList[r];
    this.grid[point.px][point.py] = 4;
};

World.prototype.createSpawn = function() {
    var r = Math.round(Math.random() * this.roomList.length);
    var point = this.roomList[r];
    this.grid[point.px][point.py] = 2;
    this.spawn = point;
};

/**
 * 
 * @param {Number} steps The number of steps in the random walk.
 * @description Randomly walks through the generated world, marking rooms it visits as availiable rooms.
 * @augments World
 * @returns {undefined}
 */
World.prototype.randomWalk = function(steps) {
    var start = Math.round(this.grid.length / 2);
    this.grid[start][start] = 1;
    
    var x = y = start;
    for (var i = 0; i < steps; i++) {
        var r = Math.random();
        if (r < 0.25) {
            x++;
        } else if (r >= 0.25 && r < 0.5) {
            y--;
        } else if (r >= 0.5 && r < 0.75) {
            x--;
        } else {
            y++;
        }

        if (this.grid[x][y] !== 1) {
            this.roomList.push({ px: x, py: y });
            this.grid[x][y] = 1;
            i--;
        }
    }
};

/**
 * @description Prints the World to the console.
 * @augments World
 * @returns {undefined}
 */
World.prototype.printWorld = function() {
    for (var i= 0; i < this.grid.length; i++) {
        var line = "";
        for (var j = 0; j < this.grid.length; j++) {
            line = line + "," +  this.grid[i][j];
        }
        console.log(line);
    }
};

World.prototype.getSpawn = function() {
    return this.spawn;
};