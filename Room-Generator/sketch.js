var rows, cols;
const tileSize = 20;
var MIN_ROOM_SIZE = 2;
var MAX_ROOM_SIZE = 5;
var MAX_ROOMS = 2;

// Holds all drawn tiles in the area
var tiles = [];
// Holds all usable tiles for room creation
var usables = [];

var rooms = [];

// Test room
var troom;



function setup()
{

    createCanvas(640,480);

    // Calculate Area tile-dimensions based on canvas dimensions
    cols = floor(width/tileSize);
    rows = floor(height/tileSize);

    //Pouplate the area with unused tiles
    for(var j = 0; j < rows; j++)
    {
        for (var i = 0; i < cols; i++)
        {
            tiles.push(new Tile(i,j));

            usables.push(i + j * (cols));
        }
    }


    /* Remove the tiles which can't be used to make a room
    ** That means the bottom and left tile strips
    */
    for(var i = 0; i < rows-1; i++)
    {
        usables.splice(usables.indexOf(cols-1 + i*cols),1);
    }
    for(var i = 0; i < cols; i++)
    {
        usables.splice(usables.indexOf(i  + (rows)* cols),1);

    }

    // Create the first room
    for(var i = 0; i < MAX_ROOMS; i++){
        CreateRoom(i);
    }


}


function draw()
{
    background(0);
    
    // Draw every tile
    for(var i = 0; i < tiles.length;i++)
    {
        tiles[i].draw();
    }
}



function CreateRoom(iteration)
{
    // Pick a tile from the usables
    var tilepos = usables[int(random(usables.length-1))];
    var pickedTile = tiles[tilepos];

    console.log(tilepos,pickedTile);
    console.log("Hi, Guy!");
    pickedTile.used = true;

    // Calculate distance from bounds
    var distance2r = cols - pickedTile.x;
    var distance2d = rows - pickedTile.y;
    console.log(distance2r,distance2d);

    // Calculate Max room Width
    var maxrs = CalculateRoomSize(distance2r);
    var maxds = CalculateRoomSize(distance2d);
    console.log(maxrs,maxds);

    // Set the previously calculated dimensions
    var roomWidth  = int(random(2,maxrs));
    var roomHeight = int(random(2,maxds));

    // troom = new Room([],roomWidth,roomHeight);

    rooms.push(new Room([],roomWidth,roomHeight));
    // Add rectangle denoted by roomWidth and roomHeight to room
    for(var i = 0; i < roomWidth; i++)
    {
        for(var j = 0; j < roomHeight; j++)
        {

            rooms[iteration].tileList.push(tiles[(pickedTile.x + i) + (pickedTile.y + j)*cols]);
        }
    }

    // After the creation of a new room we need to remove the unusable tiles around it
    var delTile = tiles[pickedTile.x-1 + (pickedTile.y - 1) * cols];

    for(var i = 0; i < rooms[iteration].roomWidth + 1; i++)
    {
        usables.splice(usables.indexOf(delTile.x + i + delTile.y * cols),1);
    }

    for(var i = 0; i < rooms[iteration].roomHeight + 1; i++)
    {
        usables.splice(usables.indexOf(delTile.x + (delTile.y + i) * cols),1);
    }

    rooms[iteration].init();
}

// Calculates the maximum room dimension for a particular Tile coordinate
function CalculateRoomSize(distance)
{
    if(distance >= MAX_ROOM_SIZE)
    {
        return MAX_ROOM_SIZE;
    }
    else
    {
        return distance;
    }
}


function Tile(x,y)
{
    this.x = x;
    this.y = y;
    this.used = false;

    this.draw = function()
    {
        strokeWeight(0.5);
        if(this.used == false)
        {
            fill(200, 69, 69);
        }
        else
        {
            fill(100, 255, 100);
        }
        rect(this.x * tileSize,this.y * tileSize, tileSize,tileSize);
    }

}
function Room(tileList = [],roomWidth,roomHeight)
{
    this.tileList = tileList;
    this.roomWidth = roomWidth;
    this.roomHeight = roomHeight;




    this.init = function()
    {
        for(var i = 0;i < tileList.length; i++)
        {
            tileList[i].used = true;
        }
    }
}
