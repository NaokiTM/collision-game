// a constructor for a box class 
export default class Sprite {

    constructor(x, y, width, height, colour, imageSource, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.image = null; 
        this.direction = 'right'; // Default direction
        this.ctx = ctx
    
        //define bounding area
        this.top = this.y
        this.bottom = this.y + this.height
        this.left = this.x
        this.right = this.x + this.width

        //replace later for proper async function if i have time.
        if (imageSource) {
            this.image = new Image(); 
            this.image.src = imageSource;

            this.image.onload = () => {
                this.draw(ctx); 
            };
        }

    }

    //update bounding area
    updateBounds = function() {
        this.top = this.y
        this.bottom = this.y + this.height
        this.left = this.x
        this.right = this.x + this.width

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
