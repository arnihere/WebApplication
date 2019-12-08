var script = document.createElement('script');
var canvas = document.getElementById("c");
var context = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
context.fillStyle = 'rgb(200,200,200)';
context.fillRect(0,0,width,height);
var rectangles = [];
var circles = [];
var selected = 0;
var pairs = [];
var allPairs = [];

function square(x){
    return x*x;
}

function Circle(x,y,size,color){
    this.x = x;
    this.y = y;
    this.size = size;
    this.selected = false;
    this.color = color;
    
}
Circle.prototype.draw = function(){
    context.beginPath();
    context.strokeStyle = 'rgb(255,255,255)';
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
}
function Rectangle(x,y,color,width,height){
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
}
let curX;
let curY;
let pressed = false;

document.onmousemove = function(e) {
  curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

canvas.onmousedown = function() {
  pressed = true;
};

canvas.onmouseup = function() {
  pressed = false;
}
Rectangle.prototype.draw = function(){
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
}

var drawLine = (a,b,c,d) =>{
    context.beginPath();
    context.moveTo(a,b);
    context.lineTo(c,d);
    context.lineWidth = 1;

    context.strokeStyle = 'rgb(170,170,170)';
    context.stroke();

}
rectangles.push(new Rectangle(100,100,'rgb(170,170,170)',100,100));
rectangles.push(new Rectangle(300,100,'rgb(170,170,170)',100,100));
rectangles[0].draw();
rectangles[1].draw();
circles.push(new Circle(105,105,3,'rgb(200,200,200)'));
circles.push(new Circle(195,105,3,'rgb(200,200,200)'));
circles.push(new Circle(305,105,3,'rgb(200,200,200)'));
circles.push(new Circle(395,105,3,'rgb(200,200,200)'));
for (var i = 0; i < circles.length; i++){
    circles[i].draw();
}
var prevCurX = curX;
var prevCurY = curY;
function draw() {
    if (pressed){
        
        context.fillStyle = 'rgb(200,200,200)';
        context.fillRect(0,0,width,height);
        for (var i = 0; i < 2; i++){
            var rect = rectangles[i];
            if (prevCurX >= rect.x && prevCurX <= rect.x + rect.width){
                if (prevCurY >= rect.y && prevCurY <= rect.y + rect.height){
                    if (Math.sqrt(square(prevCurX - circles[2*i].x) + square(prevCurY - circles[2*i].y)) <= circles[2*i].size){
                        circles[2*i].selected = true;
                        circles[2*i].color = "blue";
                    }
                    if (Math.sqrt(square(prevCurX - circles[2*i + 1].x) + square(prevCurY - circles[2*i + 1].y)) <= circles[2*i + 1].size){
                        circles[2*i+1].selected = true;
                        circles[2*i+1].color = "blue";
                    }
                    if (circles[0].selected || circles[1].selected || circles[2].selected || circles[3].selected){                    
                        for (var m = 0; m < circles.length; m++){
                            if (circles[m].selected){
                                if (!pairs.includes(circles[m])){
                                    pairs.push(circles[m]);
                                }
                            }
                        }
                    }
                    else{
                        rect.x = rect.x + (curX - prevCurX);
                        rect.y = rect.y + (curY - prevCurY);
                        for (var j = 2 * i; j < 2 * i + 2; j++){
                            circles[j].x = circles[j].x + (curX - prevCurX);
                            circles[j].y = circles[j].y + (curY - prevCurY);
                        }
                    }
                }
            }
            
            rect.draw();
            if (pairs.length == 2){
                allPairs.push(pairs[0]);
                allPairs.push(pairs[1]);
            }
            for (var h = 0; h + 1 < allPairs.length; h = h + 2){
                drawLine(allPairs[h].x, allPairs[h].y, allPairs[h+1].x, allPairs[h+1].y);
            }

        }

    }else{
        for (var k = 0; k < circles.length; k++){
            circles[k].selected = false;
            circles[k].color = 'rgb(200,200,200)';
        }
        
    }
    pairs = [];
    circles[0].draw();
    circles[1].draw();
    circles[2].draw();
    circles[3].draw();
    prevCurX = curX;
    prevCurY = curY;
    requestAnimationFrame(draw);
}

draw();