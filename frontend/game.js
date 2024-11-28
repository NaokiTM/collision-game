import Sprite from "./constructors/Sprite.js";
import Cloud from "./constructors/Cloud.js";
import Parachute from "./constructors/Parachute.js";

function game () {

    const canv = document.getElementById("gameCanvas");
    const ctx = canv.getContext("2d");
    //sets the canvas to take up the entire viewport
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;

    //HTML elements in the DOM
    const userFormButton = document.getElementById("userFormButton")
    const leaderboard = document.getElementById("leaderboardContainer")
    const userForm = document.getElementById("userForm")
    const footer = document.querySelector("footer")

    //game variables 
    let cloudCollisionCount = 0;
    let parachuteCollisionCount = 0;
    let clouds = [];
    let parachutes = []
    let gameId = null;
    let playerSprite;
    let collisionFlag = false;
    let preventDefaultFlag = false;
    let gameStarted = false;
    let gameEnded = false;
    let timeStarted
    let timeEnded
    let usernameToStore  
    let timeToStore


    function resetVariables() {  //resets all the variables at the end of the game
        cloudCollisionCount = 0;
        parachuteCollisionCount = 0;
        clouds = [];
        parachutes = [];
        gameId = null;
        playerSprite = new Sprite(0, 0, 27, 27, '#000000', 'frontend/images/plane-right.png', ctx);
        collisionFlag = false;
        preventDefaultFlag = false;
        gameEnded = false;
        timeStarted = 0;
        timeEnded = 0;
    }

    //listens for when the user to submit the form button
    function userFormButtonListener(event) {
        event.preventDefault()  //prevents page scrolling when using arrow keys
        preventDefaultFlag = true;

        usernameToStore = userForm.elements["username"].value  
    
        //checks if username meets length requirements
        if (usernameToStore.length > 14) {
            alert("Username cannot be longer than 14 characters")
            userForm.elements["username"].value = "";
        } else if (usernameToStore.length <= 0) {
            alert("username field cannot be empty")
            userForm.elements["username"].value = "";
        } else {
            //hides the leaderboard, form and footer elements and displays the canvas, then calls the welcome function
            leaderboard.style.display = "none"
            userForm.style.display = "none";
            footer.style.display = "none"
            canv.style.display = "block";
            welcome()
        }   
    }

    function listenForKeyPress(event) {
        //increasing this will increase the movement interval and therefore speed of the plane 
        const playerMoveInterval = 24;

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

    function gameStartListener() {
        if (!gameStarted) {
            gameStarted = true;
            resetVariables()
            document.removeEventListener("keydown", gameStartListener); 
            startGame();
        }
    }

    function backToMenuListener(event) {
        document.removeEventListener('keydown', backToMenuListener)
        // const userForm = document.getElementById("userForm")
        // const footer = document.querySelector("footer")

        //hides canvas and displays leaderboard, form and footer elements again
        leaderboard.style.display = 'block'
        userForm.style.display = "flex";
        footer.style.display = "flex"
        canv.style.display = "none";
    }




    async function sendScoresToServer() {
        const response = await fetch(`../backend/updateServerLeaderboard.php?username=${encodeURIComponent(usernameToStore)}&timeToStore=${encodeURIComponent(timeToStore)}`)
        return response
    }

    function addToClientLeaderboard() {
        //defining the element in which we will insert the new row
        const clientLeaderboardBody = document.querySelector("#leaderboard tbody")

        //creates new row, and 2 cells for the username and score to add to the row
        const newRow = document.createElement("tr")
        const usernameCell = document.createElement("td")
        const scoreCell = document.createElement("td")

        //adds the username and score from the data argument, into each cell.
        usernameCell.textContent = usernameToStore
        scoreCell.textContent = timeToStore

        //adds the updated cells to the new row
        newRow.appendChild(usernameCell)
        newRow.appendChild(scoreCell)

        //finally adds the new row to the tbody of the leaderboard in index.html
        clientLeaderboardBody.appendChild(newRow)
    }

    //function to determine if 2 objects intersect (player and obstacle in this case)
    function intersects(obj1, obj2) {
        //checks to make sure the edges of each object do not overlap each other
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

    //called when the playerSprite collides into an obstacle to check for a win case
    function updateCloudCollisionCount() {
        if (!gameEnded) {
            cloudCollisionCount++
            if (cloudCollisionCount == 3) {
                stopGame("lost")
            }
        }
    }

    //called when the playerSprite collides with a parachute to check for a losing case
    function updateParachuteCollisionCount() {
        if (!gameEnded) {
            parachuteCollisionCount++
            if (parachuteCollisionCount == 5) {
                stopGame("won")
            }
        } 
    }

    function checkForCloudCollisions() {
        //updates position of clouds, then updates each ones boundary boxes, then draws the clouds in their new position
        for (let i = 0; i < clouds.length; i++) {
            clouds[i].move(canv.width);
            clouds[i].updateBounds()
            clouds[i].draw(ctx);
        }

        /**
         * the if statement underneath checks each clouds boundary box 
         * to see if the users boundary box intersects with any of them,
         * and collisionFlag checks to ensure that the player has 
         * left a clouds boundary box before counting it as a collision in the next game loop 
         */

        if (collisionFlag == false) { 
            for (let j = 0; j < clouds.length; j++) {
                if (intersects(playerSprite, clouds[j])) {
                    updateCloudCollisionCount()
                    collisionFlag == true
                    break;
                }
            }
        } else if (collisionFlag == true) {
            let stillColliding = false;
            for (let j = 0; j < clouds.length; j++) {
                if (intersects(playerSprite, clouds[j])) {
                    stillColliding = true;
                    break;
                }
            }

            //Reset the flag once the player is out of a collision
            if (!stillColliding) {
                collisionFlag = false;
            }
        }
    }

    //This is simpler than the cloud collision function, because parachutes disappear after a collision.
    function checkForParachuteCollisions() {

        //Updates each parachutes position and boundary box, then draws it out
        for (let i = 0; i < parachutes.length; i++) {
            parachutes[i].move(canv.width);
            parachutes[i].updateBounds()
            parachutes[i].draw(ctx);
        }

        //then it checks for an intersection and updates the collision counter if it has intersected
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

            //gets the source of the heart icon 
            const heart = new Image()
            heart.src = "frontend/images/heart.png"

            //draws each heart out next to aech other with a 50 pixel gap to the left of each one
            for (let i = 0; i <= livesLeft; i++) {
                let step = i * 50 
                ctx.drawImage(heart, canv.width - step, 0, 50, 50)  //drawn in the top right corner of the canvas
            }
        }
    }

    function welcome() {
        ctx.clearRect(0, 0, canv.width, canv.height);

        //removing the listener to go back to the menu when a key is pressed
        document.removeEventListener('keydown', backToMenuListener)

        //removing the listener for moving from the menu to the welcome screen
        userForm.removeEventListener('click', userFormButtonListener)

        //welcome screen text displayed here
        ctx.font = '50px "Jaro", sans-serif';
        ctx.textAlign = "center";  //horizontal centering
        ctx.textBaseline = "middle";  //vertical centering
        ctx.fillText("Welcome to my flying game!", canv.width / 2, canv.height / 4)
        ctx.font = '30px "Jaro", sans-serif';
        ctx.fillText("Your objective is to avoid cloud obstacles,",  canv.width / 2, (canv.height / 3) + 50)
        ctx.fillText("and pick up all available collectibles",  canv.width / 2, (canv.height / 3) + 80)
        ctx.fillText("in the shortest amount of time possible", canv.width / 2, (canv.height / 3) + 110)
        ctx.fillText("Use arrow keys to move around",  canv.width / 2, (canv.height / 3) + 160)
        ctx.font = '40px "Jaro", sans-serif';
        ctx.fillText("press any key to start!",  canv.width / 2, (canv.height * 2 / 3))

        //waits for the user to press a key and starts the game. 
        document.addEventListener("keydown", gameStartListener)
    }

    function startGame() {
        //any more than 10 pushes clouds down so no longer visible - not yet fixed
        const noOfClouds = 10 
        const noOfParachutes = 5

        document.addEventListener('keydown', listenForKeyPress)

        playerSprite = new Sprite(0, 0, 27, 27, '#000000', 'frontend/images/plane-right.png', ctx);

                    // Create a cloud obstacle and push it into the array
        for (let i = 0; i < noOfClouds; i++) {
            let width = 70;
            let height = 70;
            let x = Math.random() * (canv.width - width); // Random x position (accounting for the width of each obstacle)
            let y = 50 + (i * ((canv.height - 50) / noOfClouds));  //spaces clouds out evenly, whilst leaving top 50 pixels of the canvas empty
            let imageSource = 'frontend/images/cloud.png';
            clouds.push(new Cloud(x, y, width, height, imageSource, ctx));
        }
        
        //pushes a parachute object to the array
        for (let i = 0; i < noOfParachutes; i++) {
            let width = 70;
            let height = 70;
            let x = Math.random() * (canv.width - width); // Random x position
            let y = 50 + (i * ((canv.height - 50) / noOfParachutes));
            let imageSource = 'frontend/images/parachute.png';
            parachutes.push(new Parachute(x, y, width, height, imageSource, ctx));
        }

        timeStarted = Date.now() //start the timer for the users attempt
        gameId = setInterval(gameLoop, 50) //resets every 50ms
        return gameId
    }

    function gameLoop() {
        //clears the canvas before redrawing new position
        ctx.clearRect(0, 0, canv.width, canv.height);

        //update coordinates of player hitbox, and redraw the player
        playerSprite.updateBounds()
        playerSprite.draw(ctx); 

        //check for collisions, and once collisions are taken into account, draw number of lives remaning accordinly
        checkForCloudCollisions()
        checkForParachuteCollisions()
        drawHeartsLeft()
    }

    function stopGame(wonOrLost) {
        gameEnded = true
        clearInterval(gameId)  //stops the game loop from running
        gameId = null;  
        document.removeEventListener("keydown", listenForKeyPress)

        //for some reason need these here to work even though they are reset in resetvariables()
        cloudCollisionCount = 0
        parachuteCollisionCount = 0
        clouds = []
        parachutes = []

        //clears the canvas to allow for the ending screen text to be written out
        ctx.clearRect(0, 0, canv.width, canv.height);

        if (wonOrLost == "won") { //game won, time is saved (in seconds)
            timeEnded = Date.now()
            timeToStore = (timeEnded - timeStarted) / 1000

            ctx.font = '50px "Jaro", sans-serif';
            ctx.textAlign = "center";  //horizontal centering
            ctx.textBaseline = "middle";  //vertical centering

            ctx.fillText("You won!", canv.width / 2, canv.height / 4)
            ctx.font = '30px "Jaro", sans-serif';  //changing font size for subtitle
            ctx.fillText("Your time was " + timeToStore,  canv.width / 2, (canv.height / 3) + 50)
            
            //send username and times to database, and update the local leaderboard
            sendScoresToServer() 
            addToClientLeaderboard()

        } else if (wonOrLost == "lost") {
            //game lost, time not saved so reset
            timeStarted = 0;
            timeEnded = 0;

            ctx.font = '50px "Jaro", sans-serif';
            ctx.textAlign = "center";  
            ctx.textBaseline = "middle";
            ctx.fillText("You lost!", canv.width / 2, canv.height / 4) 
        }
        ctx.font = '30px "Jaro", sans-serif';
        ctx.fillText("Press any key to go back to menu and review leaderboards",  canv.width / 2, (canv.height / 3) + 160)

        // //listens for the user to press any key to return to the menu 
        document.addEventListener('keydown', backToMenuListener) 
    }
    //starts listening for when the user submits form button to start another game 
    userFormButton.addEventListener('click', userFormButtonListener)  
};

//call the function
game()