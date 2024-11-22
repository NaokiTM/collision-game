        const collision_game = function() { // use a function to hide the identifiers used in the collision game

            // a constructor for a box class 
            function Box(x, y, width, height, colour) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.colour = colour;
                this.draw = function (ctx) { // a method
                    ctx.save();
                    ctx.fillStyle = this.colour;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.restore();
                }
            }

            // let's have a couple of shared variables.
            let collisions_count = 0; // holds the number of collisions so far
            let boxes = []; // array to hold the things we might collide with

            // let's set up a canvas and a canvas context so we can draw stuff
            const canv = document.getElementById("game_canvas");
            const ctx = canv.getContext("2d");

            // let's have a red box to represent the player
            let playerbox = new Box(0,0,20,20,"#f00");

            //listens for keypresses
            document.addEventListener('keydown', (event) => {
                const moveInterval = 10;

                //event.code ensures that the physical key is taken into account instead of the users programmed key settings

                switch (event.code) {
                    case 'ArrowUp': // Move up
                        if (playerbox.y > 0) playerbox.y -= moveInterval;
                        break;
                    case 'ArrowDown': // Move down
                        if (playerbox.y + playerbox.height < canv.height) playerbox.y += moveInterval;
                        break;
                    case 'ArrowLeft': // Move left
                        if (playerbox.x > 0) playerbox.x -= moveInterval;
                        break;
                    case 'ArrowRight': // Move right
                        if (playerbox.x + playerbox.width < canv.width) playerbox.x += moveInterval;
                        break;
                }
            })

            //called when the playerbox collides into an obstacle:
            function collides() {
                stop_game()
            }


            function game_loop() {

                //clears the canvas to be redrawn later
                ctx.clearRect(0, 0, canv.width, canv.height);
                playerbox.draw(ctx); //(re)draw the player box

                // This is where you could draw your obstacles and
                // perhaps check for collisions

                
                // update the collisions count
                document.getElementById("p1").innerHTML = "Total collisions so far " + collisions_count;
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