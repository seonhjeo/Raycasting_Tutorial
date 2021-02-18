const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180);

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

// Map class
class Map {
    // contructor : special method which creates and initializes object in class
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }
    // Map rendering function
    render() {
        for (var i = 0; i < MAP_NUM_ROWS; i++) {
            for (var j = 0; j < MAP_NUM_COLS; j++) {
                var tileX = j * TILE_SIZE; 
                var tileY = i * TILE_SIZE;
                var tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
                stroke("#222");
                fill(tileColor);
                rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    // check if there's a wall in the position (x, y)
    hasWallAt(x, y) {
        // Math.floor() function changes float to integer
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_WIDTH) {
            return true;
        }
        var mapGridIndexX = Math.floor(x / TILE_SIZE);
        var mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] != 0;
    }
}

class Player {
    constructor(){
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3;
        this.turnDirection = 0; // -1 if left, +1 if right;
        this.walkDirection = 0; // -1 if back, +1 if front;
        this.rotationAngle = (Math.PI / 2);
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180);
    }
    // Player rendering function
    render() {
        fill("red");
        circle(this.x, this.y, this.radius);
        stroke("red");
        line(this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * 30,
            this.y + Math.sin(this.rotationAngle) * 30
        );
    }
    // update player position based on turnDirection and walkDirection
    update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;

        var movestep = this.walkDirection * this.moveSpeed;

        var newplayerX = this.x + Math.cos(this.rotationAngle) * movestep;
        var newplayerY = this.y + Math.sin(this.rotationAngle) * movestep;

        // only set new player position if it is not colliding with the map walls
        if (!grid.hasWallAt(newplayerX, newplayerY)) {
            this.x = newplayerX;
            this.y = newplayerY;
        }
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = rayAngle;
    }
    render() {
        stroke("rgba(255, 0, 0, 0.3)");
        line(
            player.x,
            player.y,
            player.x + Math.cos(this.rayAngle) * 30,
            player.y + Math.sin(this.rayAngle) * 30
        );
    }
}

var grid = new Map();                               // declare new map
var player = new Player();                          // declare new player
var rays = [];                                      // declare rays

// TODO : Set variables when key pressed
function keyPressed() {
    if (keyCode == UP_ARROW) {
        player.walkDirection = +1;
    }
    else if (keyCode == DOWN_ARROW) {
        player.walkDirection = -1;
    }
    else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = +1;
    }
    else if (keyCode == LEFT_ARROW) {
        player.turnDirection = -1;
    }
}

// TODO : Set variables when key released
function keyReleased() {
    if (keyCode == UP_ARROW) {
        player.walkDirection = 0;
    }
    else if (keyCode == DOWN_ARROW) {
        player.walkDirection = 0;
    }
    else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = 0;
    }
    else if (keyCode == LEFT_ARROW) {
        player.turnDirection = 0;
    }
}

function castAllRays() {
    var columnId = 0;
    // start first ray subtracting half of the FOV
    var rayAngle = player.rotationAngle - (FOV_ANGLE / 2);
    rays = [];
    // loop all columns casting the rays
    //for (var i = 0; i < NUM_RAYS; i++) {
    for (var i = 0; i < 1; i++) {
        var ray = new Ray(rayAngle);
        // ray.cast();...
        rays.push(ray);
        rayAngle += FOV_ANGLE / NUM_RAYS;
        columnId++;
    }
}

// TODO : Initialize all objects
function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

// TODO : update all game objects before we render the next frame
function update() {
    player.update();
    castAllRays();
}

// TODO : render all objects frame by frame
function draw() {
    update();

    grid.render();
    for (ray of rays) {
        ray.render();
    }
    player.render();
}
