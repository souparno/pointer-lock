// when the document is loaded, setup the listeners for the two canvas elements
$(document).ready(function () {
    setupPointerLock();
});

// Configure all the pointer lock stuff
function setupPointerLock() {

    // register the callback when a pointerlock event occurs
    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);

    // when element is clicked, we're going to request a
    // pointerlock
    $("#pointerLock").click(function () {
        var canvas = $("#pointerLock").get()[0];
        canvas.requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;


        // Ask the browser to lock the pointer)
        canvas.requestPointerLock();
    });
};


// called when the pointer lock has changed. Here we check whether the
// pointerlock was initiated on the element we want.
function changeCallback(e) {
    var canvas = $("#pointerLock").get()[0];
    if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {

        // we've got a pointerlock for our element, add a mouselistener
        document.addEventListener("mousemove", moveCallback, false);
    } else {

        // pointer lock is no longer active, remove the callback
        document.removeEventListener("mousemove", moveCallback, false);

        // and reset the entry coordinates
        entryCoordinates = {x: -1, y: -1};
    }
};


// handles an event on the canvas for the pointerlock example
var entryCoordinates = {x: -1, y: -1};
function moveCallback(e) {

    var canvas = $("#pointerLock").get()[0];
    var ctx = canvas.getContext('2d');

    // if we enter this for the first time, get the initial position
    if (entryCoordinates.x === -1) {
        entryCoordinates = getPosition(canvas, e);
    }


    //get a reference to the canvas
    var movementX = e.movementX ||
            e.mozMovementX ||
            e.webkitMovementX ||
            0;

    var movementY = e.movementY ||
            e.mozMovementY ||
            e.webkitMovementY ||
            0;


    // calculate the new coordinates where we should draw the ship
    entryCoordinates.x = entryCoordinates.x + movementX;
    entryCoordinates.y = entryCoordinates.y + movementY;

    if (entryCoordinates.x > $('#pointerLock').width() - 65) {
        entryCoordinates.x = $('#pointerLock').width() - 65;
    } else if (entryCoordinates.x < 0) {
        entryCoordinates.x = 0;
    }

    if (entryCoordinates.y > $('#pointerLock').height() - 85) {
        entryCoordinates.y = $('#pointerLock').height() - 85;
    } else if (entryCoordinates.y < 0) {
        entryCoordinates.y = 0;
    }


    // determine the direction
    var direction = 0;
    if (movementX > 0) {
        direction = 1;
    } else if (movementX < 0) {
        direction = -1;
    }

    // clear and render the spaceship
    ctx.clearRect(0, 0, 400, 400);
    generateStars(ctx);
    showShip(entryCoordinates.x, entryCoordinates.y, direction, ctx);
}


// Render a ship at the specified position. The direction determines how to render the ship
// based on a sprite sheet. The sprite was taken frome here:
// http://atomicrobotdesign.com/blog/web-development/how-to-use-sprite-sheets-with-html5-canvas/
sprites = new Image();
sprites.src = 'ships2.png';
function showShip(ship_x, ship_y, direction, ctx) {

    //    srcX = 83;
    if (direction === -1) {
        srcX = 156;
    } else if (direction === 1) {
        srcX = 83;
    } else if (direction === 0) {
        srcX = 10;
    }


    // 10 is normal  156 is left
    srcY = 0;
    ship_w = 65;
    ship_h = 85;

    ctx.drawImage(sprites, srcX, srcY, ship_w, ship_h, ship_x, ship_y, ship_w, ship_h);
}

// generate a set of random stars for the canvas.
function generateStars(ctx) {
    for (var i = 0; i < 50; i++) {

        x = Math.random() * 400;
        y = Math.random() * 400;
        radius = Math.random() * 3;

        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
}


// Returns a position based on a mouseevent on a canvas. Based on code
// from here: http://miloq.blogspot.nl/2011/05/coordinates-mouse-click-canvas.html
function getPosition(canvas, event) {
    var x = new Number();
    var y = new Number();

    if (event.x !== undefined && event.y !== undefined) {
        x = event.x;
        y = event.y;
    }
    else // Firefox method to get the position
    {
        x = event.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    return {x: x, y: y};
}
