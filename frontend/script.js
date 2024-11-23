const collision_game = function() { // use a function to hide the identifiers used in the collision game
    // let's set up a canvas and a canvas context so we can draw stuff
    const canv = document.getElementById("game_canvas");
    const ctx = canv.getContext("2d");

    let collisionCount = 0; // holds the number of collisions so far
    let clouds = []; // array to hold the things we might collide with
    let game_id;
    let playerSprite;

    canv.width = 1000;
    canv.height = 500; 

    // a constructor for a box class 
    function Sprite(x, y, width, height, colour, imageSource) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.image = null; 
        this.direction = 'right'; // Default direction

        //define bounding area
        this.top = this.y
        this.bottom = this.y + this.height
        this.left = this.x
        this.right = this.x + this.width

        //update bounding area
        this.updateBounds = function() {
            this.top = this.y
            this.bottom = this.y + this.height
            this.left = this.x
            this.right = this.x + this.width

        }

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

        //define bounding area
        this.top = this.y
        this.bottom = this.y + this.height
        this.left = this.x
        this.right = this.x + this.width

        //change bounding area
        this.updateBounds = function() {
            this.left = this.x
            this.right = this.x + this.width
        }

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

    //function to determine if 2 objects intersect (player and obstacle in this case)
    function intersects(obj1, obj2) {
        if (obj1.bottom < obj2.top ||
            obj1.top > obj2.bottom ||
            obj1.right < obj2.left ||
            obj1.left > obj2.right ) {
            return false;
        } else {
            return true;
        }
    }





    //called when the playerSprite collides into an obstacle:
    function collision() {
        if (collisionCount >= 3) {
            stop_game()
        } else {
            collisionCount++
        }
    }




    function game_loop() {

        playerSprite.updateBounds()
        playerSprite.draw(ctx)

        //clears the canvas to be redrawn later
        ctx.clearRect(0, 0, canv.width, canv.height);
        playerSprite.draw(ctx); //(re)draw the player box

        for (let i = 0; i < clouds.length; i++) {
            clouds[i].move(canv.width); // Update position
            clouds[i].updateBounds()
            clouds[i].draw(ctx); // Draw obstacle
        }

        //replace with logic to check for intersections of hitboxes
        for (let j = 0; j < 5; j++) {
            if (intersects(playerSprite, clouds[j])) {
                collision()
            }
        }
        
        // update the collisions count
        document.getElementById("obstacle_counter").innerHTML = "Lives left: " + (3 - collisionCount);
    }







    function start_game() {

        //listens for keypresses
        document.addEventListener('keydown', (event) => {
            const moveInterval = 15;
            event.preventDefault()  //prevents page scrolling when using arrow keys


            //event.code ensures that the physical key is taken into account instead of the users programmed key settings
            switch (event.code) {
                case 'ArrowUp': // Move up
                    if (playerSprite.y > 0) {
                        playerSprite.y -= moveInterval;
                        playerSprite.image.src = 'frontend/images/plane-up.png'
                    }
                    break;

                case 'ArrowDown': // Move down
                    if (playerSprite.y + playerSprite.height < canv.height) {
                        playerSprite.y += moveInterval;
                        playerSprite.image.src = 'frontend/images/plane-down.png'
                    }
                    break;

                case 'ArrowLeft': // Move left
                    if (playerSprite.x > 0) {
                        playerSprite.x -= moveInterval;
                        playerSprite.image.src = 'frontend/images/plane-left.png'
                    }
                    break;

                case 'ArrowRight': // Move right
                    if (playerSprite.x + playerSprite.width < canv.width) {
                        playerSprite.x += moveInterval;
                        playerSprite.image.src = 'frontend/images/plane-right.png'
                    }
                    break;
            }
        })

        playerSprite = new Sprite(0, 0, 20, 20, '#000000', 'frontend/images/plane-right.png');

        for (let i = 0; i < 5; i++) {
            let x = Math.random() * canv.width; // Random x position
            let y = 50 + (i * 100)  //each cloud is placed 100 pixels below another
            let width = 40;
            let height = 40;
            let imageSource = 'frontend/images/cloud.png';

            // Create an obstacle and push it to the array
            clouds.push(new Cloud(x, y, width, height, imageSource));
        }

        return setInterval(game_loop, 50);  //resets every 50ms
    }            







    function stop_game() {
        clearInterval(game_id)
        //add end screen here
    }


    

    // start the game
    start_game()
}();