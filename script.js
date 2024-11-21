   // Original by Hannah Dee
        // modified by Edel Sherratt Nov. 2017 to use a namespace
        // modified by Edel Sherratt October 2021 to provide more guidance for studying the code,
        // and to use clearRect() to clear the canvas
        // modified again by Edel Sherratt October 2022 to include touch as well as mouse/touchpad interaction, to improve some identifiers (e.g. canvas1 is now called collisions_canv) and to change how the game starts
        // modified by Chris Loftus October 2024 to simplify the calculation for playerbox.x and playerbox.y. Original
        // is commented out. Seems to work fine with simpler form. Also changed "var" to "let". Also made
        // collision_game an arrow function, as an example of this syntactic sugar and called explicitly.

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
            const canv = document.getElementById("collisions_canv");
            const ctx = canv.getContext("2d");

            // let's have a red box to represent the player
            let playerbox = new Box(100,100,20,20,"#f00");

            // let's add an event listener to the canvas - this will call the function
            // seen_mouse_motion: whenever the mouse moves, we're going to use this to move the red box
            canv.addEventListener("mousemove", seen_mouse_motion, false);
            canv.addEventListener("touchstart",seen_touch_start, false);
            canv.addEventListener("touchmove",seen_touch_motion, false);
            // canv.addEventListener("touchend",seenend, false);

            function seen_mouse_motion(e) {
                // if the mouse moves over the canvas
                // this function will be called - we can then 
                // update the red box's location on the canvas
                // from the mouse_event 
                // and the canvas bounding rectangle

                let bounding_box = canv.getBoundingClientRect();
                playerbox.x = (e.clientX - (bounding_box.left + (bounding_box.width - canv.width) / 2 ));
                playerbox.y = (e.clientY - (bounding_box.top + (bounding_box.height - canv.height) / 2 ));
                //playerbox.x = (e.clientX-bounding_box.left); *
                                        //(canv.width/bounding_box.width);
                //playerbox.y = (e.clientY-bounding_box.top); *
                                        //(canv.height/bounding_box.height);
            }

            function seen_touch_start(e) {
                e.preventDefault()
            }
            function seen_touch_motion(e) {
                // if there is a touch movement over the canvas
                // this function will be called - we can then 
                // update the red box's location on the canvas
                // from the touch event 
                // and the canvas bounding rectangle

                let bounding_box=canv.getBoundingClientRect();
                playerbox.x=(e.targetTouches[e.targetTouches.length-1].clientX - (bounding_box.left + (bounding_box.width - canv.width) / 2 ));
                playerbox.y=(e.targetTouches[e.targetTouches.length-1].clientY - (bounding_box.top + (bounding_box.height - canv.height) / 2 ));
                //playerbox.x=(e.targetTouches[e.targetTouches.length-1].clientX-bounding_box.left);// *
                                    //(canv.width/bounding_box.width);
                //playerbox.y=(e.targetTouches[e.targetTouches.length-1].clientY-bounding_box.top);// *
                                        //(canv.height/bounding_box.height);
            }

            function game_loop() {
                // this is called every 50ms and is basically a 
                // frame-redraw-game-animation loop

                // first thing to do each frame is clear the canvas
                ctx.clearRect(0, 0, canv.width, canv.height);

                // This is where you could draw your obstacles and
                // perhaps check for collisions

                playerbox.draw(ctx); // (re)draw the player box
                
                // update the collisions count
                document.getElementById("p1").innerHTML = collisions_count;
            }

            function start_game() {

                // write some code here to add some boxes to the boxes array

                // set up an interval timer to call game_loop every 50 ms
                // return the value of the interval timer so we can stop it later
                return setInterval(game_loop, 50);
            }            

            // probably have something to do when we're finished
            function stop_game() {
                // add something here - like a game-over pop-up or something more interesting
                clearInterval(game_id)
            }

            // start the game, save the id of the interval timer so we can stop it later
            const game_id = start_game()
        }(); // Run the namespace so that it initialises and run the game. Having
        // a namespace will allow access to the stop_game function from HTML...