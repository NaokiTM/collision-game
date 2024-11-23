// a constructor for a box class 
function Obstacle(x, y, width, height, colour, imageSource) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.image = null; 

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