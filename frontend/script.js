const collision_game = function() { // use a function to hide the identifiers used in the collision game
    // let's set up a canvas and a canvas context so we can draw stuff
    const canv = document.getElementById("game_canvas");
    const ctx = canv.getContext("2d");

    let collisionCount = 0; // holds the number of collisions so far
    let clouds = []; // array to hold the things we might collide with
    let game_id;
    let playerSprite;
    let collisionFlag = false;
    let preventDefaultFlag = false;

    //sets the canvas to take up the entire viewport
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;

    //waits for username form submit button to be clicked, then displays the welcome message and canvas. 
    userform_button.addEventListener("click", (event) => {
        event.preventDefault()  //prevents page scrolling when using arrow keys
        preventDefaultFlag = true;

        const userForm = document.getElementById("username_form")
        const footer = document.querySelector("footer")

        let playerUsername = userForm.elements["username"].value
        console.log("the players username is: " + playerUsername)

        userForm.style.display = "none";
        footer.style.display = "none"
        canv.style.display = "block";
        console.log("button clicked")
    })

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
        this.movestep = 8;  //speed at which the clouds move across the screen

        //define bounding area
        this.top = this.y + 20
        this.bottom = (this.y + this.height) - 20
        this.left = this.x + 20
        this.right = (this.x + this.width) - 20

        //change bounding area - left and right only because the clouds only move horizontally
        this.updateBounds = function() {
            this.left = this.x + 20
            this.right = this.x + this.width - 20
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
            collisionFlag = true;
            return true;
        }
    }





    //called when the playerSprite collides into an obstacle:
    function updateCollisionCount() {
        collisionCount++
        if (collisionCount == 3) {
            stop_game()
        }
    }

    function checkForCollisions() {
        //updates position of clouds, then updates each ones boundaries, then draws the clouds in their new position
        for (let i = 0; i < clouds.length; i++) {
            clouds[i].move(canv.width);
            clouds[i].updateBounds()
            clouds[i].draw(ctx);
        }

        if (collisionFlag == false) {  //player is no longer intersecting with the obstacle
            for (let j = 0; j < clouds.length; j++) {
                if (intersects(playerSprite, clouds[j])) {
                    updateCollisionCount()
                    collisionFlag == true
                    break;
                }
            }
        } else if (collisionFlag == true) {  //player is/was intersecting with the obstacle
            let stillColliding = false;
            for (let j = 0; j < clouds.length; j++) {
                if (intersects(playerSprite, clouds[j])) {
                    stillColliding = true;
                    break;
                }
            }

            // Reset the flag once the player is out of collision
            if (!stillColliding) {
                collisionFlag = false;
            }
        }
    }

    function drawHeartsLeft() {
        let livesLeft = 3 - collisionCount
        ctx.save()

        const heart = new Image()
        heart.src = "frontend/images/heart.png"

        for (i = 0; i <= livesLeft; i++) {
            let step = i * 50  //each heart is placed 50 pixels further to the left of the previous
            ctx.drawImage(heart, canv.width - step, 0, 50, 50)  //drawn in the top right corner of the canvas
        }

        ctx.restore()
    }

    function listenForKeyPress() {

        //listens for keypresses
        document.addEventListener('keydown', (event) => {
            const playerMoveInterval = 20;

            if (preventDefaultFlag) {
                event.preventDefault(); // Prevent page scrolling and other default key actions
            }

            //event.code ensures that the physical key is taken into account instead of the users programmed key settings
            switch (event.code) {
                case 'ArrowUp': // Move up
                    if (playerSprite.y > 0) {
                        playerSprite.y -= playerMoveInterval;
                        playerSprite.image.src = 'frontend/images/plane-up.png'
                    }
                    break;

                case 'ArrowDown': // Move down
                    if (playerSprite.y + playerSprite.height < canv.height) {
                        playerSprite.y += playerMoveInterval;
                        playerSprite.image.src = 'frontend/images/plane-down.png'
                    }
                    break;

                case 'ArrowLeft': // Move left
                    if (playerSprite.x > 0) {
                        playerSprite.x -= playerMoveInterval;
                        playerSprite.image.src = 'frontend/images/plane-left.png'
                    }
                    break;

                case 'ArrowRight': // Move right
                    if (playerSprite.x + playerSprite.width < canv.width) {
                        playerSprite.x += playerMoveInterval;
                        playerSprite.image.src = 'frontend/images/plane-right.png'
                    }
                    break;
            }
        })
    }


    function start_game() {
        listenForKeyPress()

        playerSprite = new Sprite(0, 0, 27, 27, '#000000', 'frontend/images/plane-right.png');

        for (let i = 0; i < 5; i++) {
            let x = Math.random() * canv.width; // Random x position
            let y = 50 + (i * 100)  //each cloud is placed 100 pixels below another
            let width = 70;
            let height = 70;
            let imageSource = 'frontend/images/cloud.png';

            // Create an obstacle and push it to the array
            clouds.push(new Cloud(x, y, width, height, imageSource));
        }

        game_id = setInterval(game_loop, 50);
        return game_id //resets every 50ms
    }            


    function game_loop() {
        //clears the canvas before redrawing new position
        ctx.clearRect(0, 0, canv.width, canv.height);

        //update coordinates of player hitbox, and redraw the player
        playerSprite.updateBounds()
        playerSprite.draw(ctx); 

        checkForCollisions()
        drawHeartsLeft()
    }


    function stop_game() {
        clearInterval(game_id)
        ctx.clearRect(0, 0, canv.width, canv.height);
        collisionCount = 0;
        //add end screen here
    }




    // start the game
    start_game()
}();