const collision_game = function() { // use a function to hide the identifiers used in the collision game
    // let's set up a canvas and a canvas context so we can draw stuff
    const canv = document.getElementById("game_canvas");
    const ctx = canv.getContext("2d");

    canv.width = 1000;  // Example width
    canv.height = 500;  // Example height


    let collisionCount = 0; // holds the number of collisions so far
    let clouds = []; // array to hold the things we might collide with

    // a constructor for a box class 
    function Box(x, y, width, height, colour, imageSource) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.image = null; 
        this.direction = 'right'; // Default direction

        //replace later for proper async function if i have time.
        if (imageSource) {
            this.image = new Image(); 
            this.image.src = imageSource;

            this.image.onload = () => {
                this.draw(ctx); 
            };
        }

        this.draw = function (ctx) {
            ctx.save();
            if (this.image && this.image.complete) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                //if an image isn't provided, or doesn't load, replace with a colour
                ctx.fillStyle = this.colour;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        };
    }

        // a constructor for a box class 
    function Cloud(x, y, width, height, imageSource) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = '#FFFFFF';
        this.image = null; 
        this.movestep = 8;

        //replace later for proper async function if i have time.
        if (imageSource) {
            this.image = new Image(); 
            this.image.src = imageSource;

            this.image.onload = () => {
                this.draw(ctx); 
            };
        }

        this.move = function(canvasWidth) {
            this.x += this.movestep;

            // Reverse direction if it hits the canvas boundaries
            if (this.x <= 0 || this.x + this.width >= canvasWidth) {
                this.movestep = -this.movestep; // Reverse direction
            }
        }

        this.draw = function (ctx) {
            ctx.save();
            if (this.image && this.image.complete) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                //if an image isn't provided, or doesn't load, replace with a colour
                ctx.fillStyle = this.colour;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        };
    }

    // image to represent the player
    let playerbox = new Box(0, 0, 20, 20, '#000000', 'frontend/images/plane-right.png');

    // creates and stores the new obstacles
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * canv.width; // Random x position
        let y = 50 + (i * 100)  //each cloud is placed 100 pixels below another
        let width = 40;
        let height = 40;
        let imageSource = 'frontend/images/cloud.png'; // No image for now
    
        // Create an obstacle and push it to the array
        clouds.push(new Cloud(x, y, width, height, imageSource));
    }


    //listens for keypresses
    document.addEventListener('keydown', (event) => {
        const moveInterval = 10;
        event.preventDefault()  //prevents page scrolling when using arrow keys


        //event.code ensures that the physical key is taken into account instead of the users programmed key settings
        switch (event.code) {
            case 'ArrowUp': // Move up
                if (playerbox.y > 0) {
                    playerbox.y -= moveInterval;
                    playerbox.image.src = 'frontend/images/plane-up.png'
                    playerbox.draw(ctx)
                }
                break;

            case 'ArrowDown': // Move down
                if (playerbox.y + playerbox.height < canv.height) {
                    playerbox.y += moveInterval;
                    playerbox.image.src = 'frontend/images/plane-down.png'
                    playerbox.draw(ctx)
                }
                break;

            case 'ArrowLeft': // Move left
                if (playerbox.x > 0) {
                    playerbox.x -= moveInterval;
                    playerbox.image.src = 'frontend/images/plane-left.png'
                    playerbox.draw(ctx)
                }
                break;

            case 'ArrowRight': // Move right
                if (playerbox.x + playerbox.width < canv.width) {
                    playerbox.x += moveInterval;
                    playerbox.image.src = 'frontend/images/plane-right.png'
                    playerbox.draw(ctx)
                }
                break;
        }
    })

    //called when the playerbox collides into an obstacle:
    function collision() {
        if (collisionCount >= 3) {
            stop_game()
        } else {
            collisionCount++
        }
    }

    function game_loop() {

        //clears the canvas to be redrawn later
        ctx.clearRect(0, 0, canv.width, canv.height);
        playerbox.draw(ctx); //(re)draw the player box

        for (let i = 0; i < clouds.length; i++) {
            clouds[i].move(canv.width); // Update position
            clouds[i].draw(ctx); // Draw obstacle
        }

        for (let j = 0; j < 5; j++) {
            if (clouds[j].x == playerbox.x && clouds[j].y == playerbox.y) {
                collision()
            }
        }
        

        // This is where you could draw your obstacles and
        // perhaps check for collisions

        
        // update the collisions count
        document.getElementById("obstacle_counter").innerHTML = "Lives left: " + (3 - collisionCount);
    }

    function start_game() {

        // write some code here to add some boxes to the boxes array

        // set up an interval timer to call game_loop every 50 ms
        // return the value of the interval timer so we can stop it later
        return setInterval(game_loop, 50);  //resets every 50ms
    }            

    function stop_game() {
        // add something here - like a game-over pop-up or something more interesting
        clearInterval(game_id)
    }

    // start the game, save the id of the interval timer so we can stop it later
    const game_id = start_game()
}(); // Run the namespace so that it initialises and run the game. Having
// a namespace will allow access to the stop_game function from HTML...