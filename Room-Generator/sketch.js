/**-Procedural Generation algorithm in P5.js
 **- Author: Michael Dodis
 **- License: MIT
 **- Documentation: Handwritten(probably in online docs by now)
 **- This room generaton implements random room placing, and afterwards
 **- connecting them together.
 **/


var rows;
var cols;
var tileSize = 20;

// Max room dimensions
var MIN_ROOM_SIZE = 2;
var MAX_ROOM_SIZE = 6;
// Max number of rooms
var MAX_ROOMS = 3;
var roomsInput;
var maxRoomSizeInput;
var tileSizeInput;
// Holds all drawn tiles in the area
let tiles = [];
// Holds all usable tiles for room creation
let usables = [];
// Contains all room objects created by the CreateRoom() function.
let rooms = [];


let restartButton;

function setup() {

    createCanvas(640, 480);
    setupInput();
    // Calculate Area tile-dimensions based on canvas dimensions
/*    cols = floor(width / tileSize);
    rows = floor(height / tileSize);*/
    BuildArea();

    restartButton = createButton('Rebuild');
    restartButton.mousePressed(RebuildArea);
}


function draw() {
    background(0);

    // Draw every tile
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].draw();
    }

}


function CreateRoom(iteration) {
    // Pick a tile from the usables
    var tilepos = usables[int(random(usables.length - 1))];
    var pickedTile = tiles[tilepos];

    pickedTile.used = true;

    // Calculate distance from bounds
    var distance2r = cols - pickedTile.x;
    var distance2d = rows - pickedTile.y;

    //--DEBUG--//
    console.log(distance2r, distance2d);
    //---------//

    // Calculate Max room Width
    var maxrs = CalculateRoomSize(distance2r);
    var maxds = CalculateRoomSize(distance2d);

    //--DEBUG--//
    console.log(maxrs, maxds);
    //---------//


    var allowWidth = maxrs;
    var allowHeight = maxds;

    // Calculates for overlapping rooms

    /*
    ** TO-DO: Document progress in book
    */
    if (iteration > 0) {
        for (var i = 0; i < MAX_ROOM_SIZE; i++) {
            for (var j = 0; j < MAX_ROOM_SIZE; j++) {

                // Always check if tile exists, otherwise there's a change it'll throw a null exception
                if (tiles[i + pickedTile.x + (j + pickedTile.y) * cols] != null) {

                    if (tiles[i + pickedTile.x + (j + pickedTile.y) * cols].used == true) {
                        var target = tiles[i + pickedTile.x + (j + pickedTile.y) * cols];
                        allowWidth = maxrs - Math.abs(target.x - pickedTile.x) + 1;
                        allowHeight = maxds - Math.abs(target.y - pickedTile.y) + 1;
                    }
                }
            }
        }
    }

    // Set the previously calculated dimensions
    var roomWidth = int(random(2, allowWidth));
    var roomHeight = int(random(2, allowHeight));

    rooms.push(new Room([], roomWidth, roomHeight));

    // Add rectangle denoted by roomWidth and roomHeight to room
    for (var i = 0; i < roomWidth; i++) {
        for (var j = 0; j < roomHeight; j++) {
            rooms[iteration].tileList.push(tiles[(pickedTile.x + i) + (pickedTile.y + j) * cols]);
        }
    }

    // After the creation of a new room we need to remove the unusable tiles around it
    PopRoomBorder(pickedTile, rooms[iteration]);

    // After all the overlap and tile management init the room
    rooms[iteration].init();
}

// Calculates the maximum room dimension for a particular Tile coordinate
function CalculateRoomSize(distance) {

    if (distance >= MAX_ROOM_SIZE) {

        return MAX_ROOM_SIZE;

    } else {

        return distance;
    }
}


function Tile(x, y) {
    this.x = x;
    this.y = y;
    this.used = false;


    this.draw = function() {
        strokeWeight(0.5);

        if (this.used == false) {
            fill(200, 69, 69);

            // GUI
            if(isMouseOver(this.x*tileSize,this.y*tileSize)){
                fill(200, 141, 141);
            }
        } else {
            fill(100, 255, 100);

            // GUI
            if(isMouseOver(this.x*tileSize,this.y*tileSize)){
                fill(215, 255, 215);
            }

        }

        rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    }

}

function isMouseOver(tx,ty){
    if(mouseX >= tx && mouseX <= tx + tileSize && mouseY >= ty && mouseY <= ty + tileSize){
        return true;
    }
}

function Room(tileList = [], roomWidth, roomHeight) {
    this.tileList = tileList;
    this.roomWidth = roomWidth;
    this.roomHeight = roomHeight;

    this.init = function() {
        for (var i = 0; i < tileList.length; i++) {
            tileList[i].used = true;

        }
    }
}

// Deletes the surrounding tiles from the useables array
function PopRoomBorder(pickedTile, room) {

    var delTile = tiles[pickedTile.x - 1 + (pickedTile.y - 1) * cols];

    if (delTile != null) {

        // Deletes top border of the room
        for (var i = 0; i < room.roomWidth + 1; i++) {

            if (usables.indexOf(delTile.x + i + delTile.y * cols) != null) {

                usables.splice(usables.indexOf(delTile.x + i + delTile.y * cols), 1);
            }
        }

        // Deletes left border of the room
        for (var i = 0; i < room.roomHeight + 1; i++) {

            if (usables.indexOf(delTile.x + (delTile.y + i) * cols) != null) {

                usables.splice(usables.indexOf(delTile.x + (delTile.y + i) * cols), 1);
            }
        }


        // For bottom border
        if(tiles[delTile.x + (delTile.y + room.roomHeight + 1) * cols] != null){

            delTile = tiles[delTile.x + (delTile.y + room.roomHeight + 1) * cols];

            for (var i = 0; i < room.roomWidth; i++) {

                if(usables.indexOf(delTile.x + i + delTile.y * cols) != null){

                    usables.splice(usables.indexOf(delTile.x + i + delTile.y * cols), 1);

                }
            }
        }

        // For left border
        if(tiles[delTile.x + room.roomWidth + 1 + delTile.y * cols] != null){

            delTile = tiles[delTile.x + room.roomWidth + 1 + delTile.y * cols];

            for (var i = 0; i < room.roomHeight; i++) {

                if (usables.indexOf(delTile.x + (delTile.y - i )*cols) != null) {
                    usables.splice(usables.indexOf(delTile.x + (delTile.y - i )*cols), 1);


                }
            }
        }

    }

}


function ClearEverything(){
    tiles.splice(0,tiles.length);
    usables.splice(0,usables.length);
    rooms.splice(0,rooms.length);

}

// No need to state the obvious here
function BuildArea(){
//Pouplate the area with unused tiles
    tileSize = int(tileSizeInput.value());
    MAX_ROOM_SIZE = int(maxRoomSizeInput.value());
    MAX_ROOMS = int(roomsInput.value());

    cols = floor(width / tileSize);
    rows = floor(height / tileSize);

    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
            tiles.push(new Tile(i, j));
            usables.push(i + j * (cols));
        }
    }


    /*
     ** Remove the tiles which can't be used to make a room
     ** That means the bottom and left tile strips
     */
    for (var i = 0; i < rows - 1; i++) {
        usables.splice(usables.indexOf(cols - 1 + i * cols), 1);
    }
    for (var i = 0; i < cols; i++) {
        usables.splice(usables.indexOf(i + (rows) * cols), 1);

    }

    // Create all the rooms; also pass the iteration into the function
    for (var i = 0; i < MAX_ROOMS; i++) {
        CreateRoom(i);
    }
    CreateCorridors();

}

function RebuildArea(){
    ClearEverything();
    BuildArea();
}


// Creates all corridors connecting each room
// May NOT be called multiple times
function CreateCorridors(){

    for(let r = 0; r < rooms.length - 1 ; r++){

        let cTile= GetRndOuterTile(rooms[r]);
        let tTile =  GetRndOuterTile(rooms[r + 1]);

        var diff = Math.abs(cTile.y - tTile.y);
        var dir = -cTile.y + tTile.y;
        console.log("Y,Difference: ",diff, "Dir: ", dir);

        // Allign on the y axis first
        for(let i = 1; i < diff + 1 ; i++){

            // cTile.y < tTile.y
            if(dir > 0){
                if(tiles[cTile.x + (cTile.y + i)*cols] != null)
                {
                    if(tiles[cTile.x + (cTile.y + i)*cols].used != true){
                        tiles[cTile.x + (cTile.y + i)*cols].used = true;
                    }
                }
            }else if(dir < 0){
                if(tiles[cTile.x + (cTile.y - i)*cols] != null)
                {
                    if(tiles[cTile.x + (cTile.y - i)*cols].used != true){
                        tiles[cTile.x + (cTile.y - i)*cols].used = true;
                    }
                }
            }
        }
        var lastDir = dir;
        var lastDiff = diff;
        // Complete on the X axis at last
        var diff = Math.abs(cTile.x - tTile.x);
        var dir = -cTile.x + tTile.x;
        console.log("X,Difference: ",diff, "Dir: ", dir);

        for(let i = 1; i < diff + 1; i++){
            // to the right
            if(dir > 0){
                if(tiles[cTile.x + i + (cTile.y + lastDir)*cols] != null){
                    if(tiles[cTile.x + i + (cTile.y + lastDir)*cols].used != true){
                        tiles[cTile.x + i + (cTile.y + lastDir)*cols].used = true;
                    }
                }
            }else if(dir < 0){
                if(tiles[cTile.x - i + (cTile.y + lastDir)*cols] != null){
                    if(tiles[cTile.x - i + (cTile.y + lastDir)*cols].used != true){
                        tiles[cTile.x - i + (cTile.y + lastDir)*cols].used = true;
                    }
                }
            }
        }
    }
}
function GetRndOuterTile(room){
    // Get list of outer tiles
    return room.tileList[int(random(0,room.tileList.length-1))];
}

function setupInput(){
    createP('Number of rooms:');
    roomsInput = createInput(MAX_ROOMS);
    createP('Max size of room:');
    maxRoomSizeInput = createInput(MAX_ROOM_SIZE);
    createP('Size of tile:');
    tileSizeInput = createInput(tileSize);
}
