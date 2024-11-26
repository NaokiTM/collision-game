import Sprite from "./constructors/Sprite.js";
import Cloud from "./constructors/Cloud.js";
import Parachute from "./constructors/Parachute.js";

function game () {

    // let's set up a canvas and a canvas context so we can draw stuff
    const canv = document.getElementById("gameCanvas");
    const ctx = canv.getContext("2d");

    let cloudCollisionCount = 0; // holds the number of collisions so far
    let parachuteCollisionCount = 0;

    let clouds = []; // array to hold the things we might collide with
    let parachutes = []
    let gameId = null;
    let playerSprite;
    let collisionFlag = false;
    let preventDefaultFlag = false;
    let gameEnded = false;

    let timeStarted
    let timeEnded

    //sets the canvas to take up the entire viewport
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;

    const userFormButton = document.getElementById("userFormButton")
    const leaderboard = document.getElementById("leaderboardContainer")
    const userForm = document.getElementById("userForm")

    //waits for username form submit button to be clicked, then displays the welcome message and canvas. 
    function userFormButtonListener(event) {
        event.preventDefault()  //prevents page scrolling when using arrow keys
        preventDefaultFlag = true;

        const footer = document.querySelector("footer")

        let playerUsername = userForm.elements["username"].value
    
        if (playerUsername.length > 14) {
            alert("Username cannot be longer than 14 characters")
            userForm.elements["username"].value = "";
        } else {
            leaderboard.style.display = "none"
            userForm.style.display = "none";
            footer.style.display = "none"
            canv.style.display = "block";

            welcome()
        }   
    }

    userFormButton.addEventListener('click', userFormButtonListener)

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
    function updateCloudCollisionCount() {
        if (!gameEnded) {
            cloudCollisionCount++
            if (cloudCollisionCount == 3) {
                stopGame("lost")
            }
        }
    }

    function updateParachuteCollisionCount() {
        if (!gameEnded) {
            parachuteCollisionCount++
            if (parachuteCollisionCount == 5) {
                stopGame("won")
            }
        } 
    }

    function checkForCloudCollisions() {

        //updates position of clouds, then updates each ones boundaries, then draws the clouds in their new position
        for (let i = 0; i < clouds.length; i++) {
            clouds[i].move(canv.width);
            clouds[i].updateBounds()
            clouds[i].draw(ctx);
        }

        if (collisionFlag == false) {  //player is no longer intersecting with the obstacle
            for (let j = 0; j < clouds.length; j++) {
                if (intersects(playerSprite, clouds[j])) {
                    updateCloudCollisionCount()
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

    function checkForParachuteCollisions() {
        for (let i = 0; i < parachutes.length; i++) {
            parachutes[i].move(canv.width);
            parachutes[i].updateBounds()
            parachutes[i].draw(ctx);
        }

        for (let j = 0; j < parachutes.length; j++) {
            if (intersects(playerSprite, parachutes[j])) {
                updateParachuteCollisionCount()
                parachutes.splice(j, 1)  //removes the collided item, signifying the player has collected it
            }
        }
    }

    function drawHeartsLeft() {
        if (!gameEnded) {
            let livesLeft = 3 - cloudCollisionCount
            ctx.save()

            const heart = new Image()
            heart.src = "frontend/images/heart.png"

            for (let i = 0; i <= livesLeft; i++) {
                let step = i * 50  //each heart is placed 50 pixels further to the left of the previous
                ctx.drawImage(heart, canv.width - step, 0, 50, 50)  //drawn in the top right corner of the canvas
            }
        }
    }

    function listenForKeyPress(event) {
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
    }






    function backToMenuListener(event) {

        const userForm = document.getElementById("userForm")
        const footer = document.querySelector("footer")

        leaderboard.style.display = 'block'
        userForm.style.display = "flex";
        footer.style.display = "flex"
        canv.style.display = "none";
    }





    function welcome() {
        //removing the listener for moving from the menu to the welcome screen
        userForm.removeEventListener('click', userFormButtonListener)

        //welcome screen here
        ctx.font = "50px Arial";
        ctx.textAlign = "center";  //horizontal centering
        ctx.textBaseline = "middle";  //vertical centering
        ctx.fillText("Welcome to my flying game!", canv.width / 2, canv.height / 4)

        ctx.font = "30px Arial";
        ctx.fillText("Your objective is to avoid cloud obstacles,",  canv.width / 2, (canv.height / 3) + 50)
        ctx.fillText("and pick up all available collectibles",  canv.width / 2, (canv.height / 3) + 80)
        ctx.fillText("in the shortest amount of time possible", canv.width / 2, (canv.height / 3) + 110)
        ctx.fillText("Use arrow keys to move around",  canv.width / 2, (canv.height / 3) + 160)


        ctx.font = "40px Arial"
        ctx.fillText("press any key to start!",  canv.width / 2, (canv.height * 2 / 3))

        let gameStarted = false;

        function gameStartListener() {
            if (!gameStarted) {
                gameStarted = true;
                document.removeEventListener("keydown", gameStartListener); 
                startGame();
            }
        }

        document.addEventListener("keydown", gameStartListener)
    }








    function startGame() {
        const noOfClouds = 10  //any more than 10 pushes clouds down so no longer visible - fix later
        const noOfParachutes = 5

        // listenForKeyPress()
        document.addEventListener('keydown', listenForKeyPress)

        playerSprite = new Sprite(0, 0, 27, 27, '#000000', 'frontend/images/plane-right.png', ctx);

        for (let i = 0; i < noOfClouds; i++) {
            let width = 70;
            let height = 70;
            let x = Math.random() * (canv.width - width); // Random x position (accounting for the width of each obstacle)
            let y = 50 + (i * ((canv.height - 50) / noOfClouds));  //spaces clouds out evenly, whilst leaving top 50 pixels of the canvas empty
            let imageSource = 'frontend/images/cloud.png';

            // Create an obstacle and push it to the array
            clouds.push(new Cloud(x, y, width, height, imageSource, ctx));
        }

        for (let i = 0; i < noOfParachutes; i++) {
            let width = 70;
            let height = 70;
            let x = Math.random() * (canv.width - width); // Random x position
            let y = 50 + (i * ((canv.height - 50) / noOfParachutes));
            let imageSource = 'frontend/images/parachute.png';

            // Create an obstacle and push it to the array
            parachutes.push(new Parachute(x, y, width, height, imageSource, ctx));
        }

        timeStarted = Date.now()

        gameId = setInterval(gameLoop, 50);
        return gameId //resets every 50ms
    }            


    function gameLoop() {
        //clears the canvas before redrawing new position
        ctx.clearRect(0, 0, canv.width, canv.height);

        //update coordinates of player hitbox, and redraw the player
        playerSprite.updateBounds()
        playerSprite.draw(ctx); 

        checkForCloudCollisions()
        checkForParachuteCollisions()
        drawHeartsLeft()
    }

    function stopGame(wonOrLost) {
        gameEnded = true
        clearInterval(gameId)
        gameId = null;
        ctx.clearRect(0, 0, canv.width, canv.height);
        document.removeEventListener("keydown", listenForKeyPress)

        cloudCollisionCount = 0
        parachuteCollisionCount = 0
        clouds = []
        parachutes = []

        ctx.clearRect(0, 0, canv.width, canv.height);

        if (wonOrLost == "won") {
            //game won, time is saved
            timeEnded = Date.now()
            const timeScore = (timeEnded - timeStarted) / 1000 //in seconds
            console.log("your time was: " + timeScore)

            timeStarted = 0;
            timeEnded = 0;

            ctx.font = "50px Arial";
            ctx.textAlign = "center";  //horizontal centering
            ctx.textBaseline = "middle";  //vertical centering
            ctx.fillText("You won!", canv.width / 2, canv.height / 4)
    
            ctx.font = "30px Arial";
            ctx.fillText("Your time was " + timeScore,  canv.width / 2, (canv.height / 3) + 50)

        } else if (wonOrLost == "lost") {
            //game lost, time not saved
            timeStarted = 0;
            timeEnded = 0;

            ctx.font = "50px Arial";
            ctx.textAlign = "center";  //horizontal centering
            ctx.textBaseline = "middle";  //vertical centering
            ctx.fillText("You lost!", canv.width / 2, canv.height / 4)

        }

        ctx.font = "30px Arial";
        ctx.fillText("Press any key to go back to menu and review leaderboards",  canv.width / 2, (canv.height / 3) + 160)
        
        document.addEventListener('keydown', backToMenuListener)
    }
};

game()