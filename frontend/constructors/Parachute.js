export default class Parachute {

    //constructor for cloud class
    constructor(x, y, width, height, imageSource, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = '#FFFFFF';
        this.image = null; 
        this.movestep = 8;  //speed at which the clouds move across the screen
        this.ctx = ctx

        //define bounding area
        this.top = this.y + 20
        this.bottom = (this.y + this.height) - 20
        this.left = this.x + 20
        this.right = (this.x + this.width) - 20

        //replace later for proper async function if i have time.
        if (imageSource) {
            this.image = new Image(); 
            this.image.src = imageSource;

            this.image.onload = () => {
                this.draw(ctx); 
            };
        }
    }

    //change bounding area - left and right only because the clouds only move horizontally
    updateBounds = function() {
        this.left = this.x + 20
        this.right = this.x + this.width - 20
    }

    move = function(canvasWidth) {
        this.x += this.movestep;

        // Reverse direction if it hits the canvas boundaries
        if (this.x <= 0 || this.x + this.width >= canvasWidth) {
            this.movestep = -this.movestep; // Reverse direction
        }
    }

    draw = function (ctx) {
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
