const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let textInput = 'KEDI ❤ MATOU'


const mouse = {
    x: null,
    y: null,
    radius: 150
}
window.addEventListener('touchmove', (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;    
});
ctx.font = '50px Verdana';
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0.3, 'blue');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(0.7, 'orange');

let textWidth = ctx.measureText(textInput).width;
ctx.fillStyle = gradient;
ctx.fillText(textInput, (canvas.width/2 - textWidth/2), (canvas.height/2));

const textCoordinates = ctx.getImageData(0,0,canvas.width, canvas.height);

class Particle {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = 5;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = Math.random() * 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < Math.random() * 100){
            this.x -= directionX * 10;
            this.y -= directionY * 10;

        } else {
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/100;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/100;
            }
        }
    }
}

function init(){
    particleArray = [];
    for(let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for(let x = 0, x2 = textCoordinates.width; x < x2; x++){
           if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x;
                let positionY = y;
                particleArray.push(new Particle(positionX, positionY));
           }
        }
    }
}


init();

function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();

    }
    requestAnimationFrame(animate);
}
animate();