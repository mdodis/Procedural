var rows, cols;
const tileSize = 20;
var MIN_ROOM_SIZE = 2;
var MAX_ROOM_SIZE = 5;

var tiles = [];
var usables = [];
var troom;



function setup()
{
    createCanvas(640,480);
    cols = width/tileSize;
    rows = height/tileSize;

    //Pouplate the area with unused tiles
    for (var i = 0; i < cols; i++)
    {
        for(var j = 0; j < cols; j++)
        {
            tiles.push(new Tile(i,j));

            usables.push( i * cols + j);
        }
    }


    /* Remove the tiles which can't be used to make a room
    ** That means the bottom and left tile strips
    */
    for(var i = 0; i < cols; i++)
    {
        usables.splice(usables.indexOf(cols * cols + i),1);
    }


    for(var i = 0; i < cols; i++)
    {
        usables.splice(usables.indexOf(i * cols + rows-1),1);
    }

    CreateRoom(0);


}


function draw()
{
    background(0);
    for(var i = 0; i < tiles.length-1;i++)
    {
        tiles[i].draw();
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
            fill(255, 69, 69);
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


function CreateRoom(iteration)
{
    if (iteration == 0)
    {
        var tilepos = usables[int(random(usables.length-1))];
        var pickedTile = tiles[tilepos];
        console.log(tilepos,pickedTile);
        pickedTile.used = true;

        // Calculate distance from bounds
        var distance2r = cols-1 - pickedTile.x;
        var distance2d = rows-1 - pickedTile.y;
        console.log(distance2r,distance2d);

        // Calculate Max room Width
        var maxrs = CalculateRoomSize(distance2r);
        var maxds = CalculateRoomSize(distance2d);
        console.log(maxrs,maxds);

        
        var roomWidth  = int(random(2,maxrs));
        var roomHeight = int(random(2,maxds));
        troom = new Room([],roomWidth,roomHeight);

        for(var j = 0; j < roomHeight; j++)
        {
            for(var i = 0; i < roomWidth; i++)
            {
                //tiles[(picked.x + i) * cols + (picked.y + j)].used = true;
                troom.tileList.push(tiles[(pickedTile.x + i) * cols + (pickedTile.y + j)]);
            }
        }

        troom.init();
    }
}

function CalculateRoomSize(distance)
{
    if(distance >= MAX_ROOM_SIZE)
    {
        return MAX_ROOM_SIZE;
    }
    else
    {
        return MAX_ROOM_SIZE-distance;
    }
}
