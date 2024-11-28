# Air rescue game

## Overview:

This is a game where the player controls an aeroplane sprite, and must avoid running into too many clouds, whilst collecting all parachutes (passengers that fell out of the plane) The scoring of the game is determined by how fast the player can collect all collectable items. If the player runs into more than 3 clouds, then the game is over and there is no score returned. 

## Online deployment:

- I have published the game at the following URL (This is from a public repo - check whether hosting from a public repo before submission deadline is allowed)
- https://naokitm.github.io/collision-game/

## Software requirements:

- Any modern browser that supports ES6 features

## How to play: 

Simply use the arrow keys on your computer to move the sprite around, and hold to move continuously in one direction. Instructions are also repeated again on the welcome screen once a username is submitted in the homepage.

## Development process: 

Initially, I wanted to have a collision based game, using a vehicle of some kind to drive from one end of the canvas to another without hitting obstacles. This then evolved into a plane flying around, picking up passengers that fell out of the plane, whilst avoiding clouds. I thought that the idea was rather comical, and also becomes quite difficult to play when trying to pick up collectables whilst avoiding obstacles

As of now, The leaderboard for storing times persistently is not working, and only the temporary leaderboard is working, which stores the users times until the page is refreshed and a new session is started. 

## Attributions: 

### Plane sprite:
- The plane sprite image was taken from: https://uxwing.com/aeroplane-icon/
- This image doesn't require any attribution for personal or commercial use.
- I copied the image 3 more times and changed their orientation using the drawing tool on linux (https://maoschanz.github.io/drawing/)

### Cloud obstacles: 
- The cloud obstacles were obtained from: https://www.flaticon.com/free-icon/cloud_616682?term=cloud&related_id=616682 
- This required attribution for personal/commercial use, by adding a link at the bottom of my page. 

### Parachute obstacles:
- Parachute icons are from the same source as the cloud icons, and therefore have the same usage guidelines (attribution by adding a link to the icons in my site)
-link to source: https://www.flaticon.com/free-icon/parachuting_2827053?term=parachute&page=1&position=2&origin=tag&related_id=2827053

### Attribution for fonts used: 

-I used the 'Jaro' google font. It uses the SIL open font license, which means that bundling the font as part of my code (i.e. using physical .ttf or .otf files), requires credit. However, simply embedding the font within my code doesn't count as physical redistribution, and therefore doesn't require any attribution. 
- Link to the font specimen: https://fonts.google.com/specimen/Jaro

## replicating the game: 

- Edit your .env file to make your DB_SECRETS_PATH point to the location of your db_secrets.php, which should contain variables to be able to create a connection to your database (such as the hostname, username and database password). 
- You will need git to be installed on your computer, to ensure that the code can be cloned onto your own device. 

### Attributions and credit for my code:

- I used the code from the practical session 4 slides (collision detection) to use for my intersects() function in game.js
- I used chatGPT 4o mini and 4o for: 
    - the logic for reversing direction in the move function for Parachute and Cloud classes
    - conditional logic for out-of-bounds checking in the listenForKeyPress() function
    - .style.display property to dynamically change how HTML elements are displayed in javascript 
    - usage of encodeURIComponent to escape special characters when passing data from javascript to PHP when using the await javascript function to pass variables to updateServerLeaderboard() in PHP
    - for implementing json_encode to send error messages if either the database connection fails at any point
