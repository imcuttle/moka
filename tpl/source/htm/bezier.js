/**
 * Created by Yc on 2016/5/10.
 */


var canvas = document.getElementsByTagName('canvas')[0];

var ctx = canvas.getContext('2d');
CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
    // default interval distance -> 5px
    if (typeof pattern === "undefined") {
        pattern = 5;
    }

    // calculate the delta x and delta y
    var dx = (toX - fromX);
    var dy = (toY - fromY);
    var distance = Math.floor(Math.sqrt(dx*dx + dy*dy));
    var dashlineInteveral = (pattern <= 0) ? distance : (distance/pattern);
    var deltay = (dy/distance) * pattern;
    var deltax = (dx/distance) * pattern;

    // draw dash line
    this.beginPath();
    var f = 1;
    while (dashlineInteveral-->0){
        if(f) {
            this.lineTo(fromX, fromY);
        } else {
            this.moveTo(fromX, fromY);
        }
        fromX += deltax; fromY += deltay; // 增量法
        f = 1-f;
    }
    this.stroke();
};
window.addEventListener('load', function () {
    function rePaint(ignores){
        ctx.save();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(ignores==null){
            cP1.draw();
            cP2.draw();
            sP.draw();
            eP.draw();
        }
        else {
            [sP,cP1,cP2,eP].forEach(el=>{
                if(ignores.indexOf(el)==-1)
                    el.draw();
            });
        }
        drawBezier([sP.p,cP1.p,cP2.p,eP.p]);
        ctx.restore();
    }
    function Pos(x,y){this.x=x;this.y=y;}
    function Circle(p,r){this.p=p;this.r=r;}
    Circle.prototype.draw = function(sty){
        ctx.save();
        ctx.strokeStyle=sty||'blue';
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.restore();
    }
    Circle.prototype.around=function(p){
        return (p.x-this.p.x)*(p.x-this.p.x)+ (p.y-this.p.y)*(p.y-this.p.y)<=this.r*this.r;
    }
    function Rect(p,w,h){this.p=p;this.w=w;this.h=h;};
    Rect.prototype.draw = function (style) {
        ctx.save();
        ctx.strokeStyle=style||'blue';
        var v = this.w>>> 1,t = this.h>>>1;
        ctx.strokeRect(this.p.x-v, this.p.y-t,this.w,this.h);
        ctx.restore();
    }
    Rect.prototype.around = function (p) {
        var v = this.w>>> 1,t = this.h>>>1;
        return p.x>=this.p.x-v && p.x<=this.p.x+v && p.y>=this.p.y-t && p.y<=this.p.y+t;
    }
    function drawBezier(ps){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ps[0].x,ps[0].y);
        ctx.bezierCurveTo(ps[1].x,ps[1].y,ps[2].x,ps[2].y,ps[3].x,ps[3].y);
        ctx.stroke();

        ctx.dashedLineTo(ps[0].x,ps[0].y,ps[1].x,ps[1].y);
        ctx.dashedLineTo(ps[3].x,ps[3].y,ps[2].x,ps[2].y);
        ctx.restore();
    }


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var midP = new Pos(window.innerWidth>>>1,window.innerHeight>>>1),
        sP = new Circle(new Pos(midP.x-100,midP.y-100),4),
        cP1= new Rect(new Pos(midP.x-80,midP.y+10),8,8),
        cP2= new Rect(new Pos(midP.x+80,midP.y+20),8,8),
        eP = new Circle(new Pos(midP.x+100,midP.y+100),4);
    cP1.name = 'cP1';
    cP2.name = 'cP2';

    rePaint();

    canvas.addEventListener('mousedown', function (e1) {
        var p1 = new Pos(e1.offsetX,e1.offsetY),c;
        [sP,cP1,cP2,eP].every(ele=>{
            if(ele.around(p1)){
                c = ele;
                return false;
            }
            return true;
        });
        if(c){
            c.draw('red');
            canvas.addEventListener('mousemove',function (e) {
                this.mousemove = arguments.callee;
                if(e.buttons===1){// left mouse pressed down
                    var pos = new Pos(e.offsetX,e.offsetY);
                    c.p = pos;
                    rePaint([c]);
                    c.draw('red');
                }
            });
        }
    })
    canvas.addEventListener('mouseup', function (e) {
        this.removeEventListener('mousemove',this.mousemove);rePaint();
    });

});
