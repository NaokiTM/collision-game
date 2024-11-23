// a constructor for a box class 
function Cloud(x, y, width, height, imageSource) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = '#FFFFFF';
    this.image = null; 
    this.movestep = 8;

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