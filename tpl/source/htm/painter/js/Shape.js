/**
/**
 * Created by Yc on 2016/3/1.
 * Created by Yc on 2016/3/1.
 */
Shape = {
    Point: function (x, y) {
        this.x = x;
        this.y = y;
        this.distance = function (p) {
            p = p?p:new Shape.Point(0,0);
            return Math.sqrt(Math.pow(p.x-this.x,2)+Math.pow(p.y-this.y,2));
        };
        this.move = function(x,y){
            this.x+=offsetX;this.y+=offsetY;
        };
        this.draw = function (paint, color, linewidth) {
            this.color = color?color:this.color;
            this.linewidth = linewidth?linewidth:this.linewidth;
            paint.strokeStyle = this.color ? this.color : 'black';
            paint.lineWidth = this.linewidth!=null ? this.linewidth : 1;
            paint.beginPath();
            paint.moveTo(this.x, this.y);
            paint.lineTo(this.x + 1, this.y + 1);
            paint.stroke();
            paint.save();
            return this;
        }
    },
    Line: function (p1, p2) {
        this.sp = p1;
        this.ep = p2;
        //this.color;this.linewidth;
        this.move = function(offsetX,offsetY){
            this.sp.x+=offsetX;this.sp.y+=offsetY;
            this.ep.x+=offsetX;this.ep.y+=offsetY;
        };
        this.isIn = function (point) {
            var x = point.x, y = point.y;
            var size = this.linewidth?this.linewidth:1;
            if((y-this.sp.y)*(x-this.ep.x)==(y-this.ep.y)*(x-this.sp.x))
                return true;
           /* for(var v=1;v<=size;v++){
                if((y+v-this.sp.y)*(x+v-this.ep.x)==(y+v-this.ep.y)*(x+v-this.sp.x)
                    ||(y-v-this.sp.y)*(x-v-this.ep.x)==(y-v-this.ep.y)*(x-v-this.sp.x)
                    ||(y+v-this.sp.y)*(x-v-this.ep.x)==(y+v-this.ep.y)*(x-v-this.sp.x)
                    ||(y-v-this.sp.y)*(x+v-this.ep.x)==(y-v-this.ep.y)*(x+v-this.sp.x))
                    return true;
            }*/
            return false;
        };

        this.draw = function (paint, color, linewidth) {
            this.color = color?color:this.color;
            this.linewidth = linewidth!=null?linewidth:this.linewidth;
            color = this.color; linewidth = this.linewidth;
            var ep = this.ep, sp = this.sp,
                dX = ep.x - sp.x,
                dY = ep.y - sp.y,
                a = sp.y - ep.y,
                b = ep.x - sp.x;
            if (Math.abs(dX) >= Math.abs(dY)) {
                if (dX >= 0 && dY >= 0) {
                    var d = b + 2 * a, d1 = 2 * a, d2 = 2 * (a + b);
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x + 1, y = sp.y; x < ep.x; x++) {
                        if (d >= 0) d = d + d1;
                        else {
                            y++;
                            d = d + d2;
                        }
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }
                }
                else if (dX >= 0 && dY <= 0) {
                    var d = -b + a << 1, d1 = (a - b) << 1, d2 = a << 1;
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x + 1, y = sp.y; x < ep.x; x++) {
                        if (d >= 0) {
                            y--;
                            d = d + d1;
                        }
                        else d = d + d2;
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }
                }
                else if (dX <= 0 && dY <= 0) {
                    var d = -b - 2 * a, d1 = -2 * a, d2 = -2 * (a + b);
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x - 1, y = sp.y; x > ep.x; x--) {
                        if (d >= 0) d = d + d1;
                        else {
                            y--;
                            d = d + d2;
                        }
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }
                }
                else {
                    var d = b - 2 * a, d1 = 2 * (b - a), d2 = -2 * a;
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x - 1, y = sp.y; x > ep.x; x--) {
                        if (d >= 0) {
                            y++;
                            d = d + d1;
                        }
                        else d = d + d2;
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }
                }
            }
            else {
                if (dX >= 0 && dY >= 0) {
                    var d = a + 2 * b, d1 = 2 * (a + b), d2 = 2 * b;
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x, y = sp.y + 1; y < ep.y; y++) {
                        if (d >= 0) {
                            x++;
                            d = d + d1;
                        }
                        else {
                            d = d + d2;
                        }
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }
                }
                else if (dX >= 0 && dY <= 0) {
                    var d = a - 2 * b, d1 = -2 * b, d2 = 2 * (a - b);
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x, y = sp.y - 1; y > ep.y; y--) {
                        if (d >= 0)      d = d + d1;
                        else {
                            x++;
                            d = d + d2;
                        }
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }

                }
                else if (dX <= 0 && dY <= 0) {
                    var d = -a - 2 * b, d1 = -2 * (a + b), d2 = -2 * b;
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x, y = sp.y - 1; y > ep.y; y--) {
                        if (d >= 0) {
                            x--;
                            d = d + d1;
                        }
                        else               d = d + d2;
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }

                }
                else {
                    var d = -a + 2 * b, d1 = 2 * b, d2 = 2 * (b - a);
                    new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                    for (var x = sp.x, y = sp.y + 1; y < ep.y; y++) {
                        if (d >= 0)           d = d + d1;
                        else {
                            x--;
                            d = d + d2;
                        }
                        new Shape.Point(x, y).draw(paint, color, linewidth);
                    }
                }
            }
            return this;
        }
    },
    Circle: function (cp, r) {
        this.cp = cp;
        this.r = r;
        this.move = function(offsetX,offsetY){
            this.cp.x+=offsetX;this.cp.y+=offsetY;
        };
        //this.color;this.linewidth;
        this.isIn = function (point) {
            var x = point.x, y = point.y;
            return (x-this.cp.x)*(x-this.cp.x)+(y-this.cp.y)*(y-this.cp.y)<=this.r*this.r;
        };
        
        this.dfsFill = function (paint,p,color,isam) {
            isam = isam || false;
            var stack = [p],hashmap = {},container=[];
            while (stack.length !== 0){
                p = stack.pop();
                if(isam)
                    container.push(p);
                else
                    p.draw(paint,color);
                [new Shape.Point(p.x,p.y-1), new Shape.Point(p.x-1,p.y), new Shape.Point(p.x,p.y+1), new Shape.Point(p.x+1,p.y)]
                    .forEach(ele=>{
                        if(this.isIn(ele) && !hashmap[ele]) {
                            stack.push(ele);
                            hashmap[ele] = hashmap[ele]+1 || 0;
                        }
                    });
            }
            console.log(hashmap);
            if(isam) {
                var animate = requestAnimationFrame;
                animate(function () {
                    if (!container.length) return;
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    animate(arguments.callee);
                })
            }
        };
        this.bfsFill = function (paint,p,color,isam) {
            isam = isam || false;
            var queue = [p],hashmap = {},container=[];
            while (queue.length !== 0){
                p = queue.shift();
                if(isam)
                    container.push(p);
                else
                    p.draw(paint,color);
                [new Shape.Point(p.x,p.y-1), new Shape.Point(p.x-1,p.y), new Shape.Point(p.x,p.y+1), new Shape.Point(p.x+1,p.y)]
                    .forEach(ele=>{
                        if(this.isIn(ele) && !hashmap[ele]) {
                            queue.push(ele);
                            hashmap[ele] = hashmap[ele]+1 || 0;
                        }
                    });
            }
            console.log(hashmap);
            if(isam) {
                var animate = requestAnimationFrame;
                animate(function () {
                    if (!container.length) return;
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    container.shift().draw(paint, color);container.shift().draw(paint, color);
                    animate(arguments.callee);
                })
            }
        }
        this.draw = function (paint, color, linewidth) {
            this.color = color?color:this.color;
            this.linewidth = linewidth?linewidth:this.linewidth;
            color = this.color; linewidth = this.linewidth;
            //console.log(color);
            var r = this.r, cp = this.cp,
                d = 1 - r, p = new Shape.Point(0, r);
            while (p.x <= p.y) {
                new Shape.Point(cp.x + p.x, cp.y + p.y).draw(paint, color, linewidth);
                new Shape.Point(cp.x + p.x, cp.y - p.y).draw(paint, color, linewidth);
                new Shape.Point(cp.x - p.x, cp.y + p.y).draw(paint, color, linewidth);
                new Shape.Point(cp.x - p.x, cp.y - p.y).draw(paint, color, linewidth);
                new Shape.Point(cp.x + p.y, cp.y + p.x).draw(paint, color, linewidth);
                new Shape.Point(cp.x + p.y, cp.y - p.x).draw(paint, color, linewidth);
                new Shape.Point(cp.x - p.y, cp.y + p.x).draw(paint, color, linewidth);
                new Shape.Point(cp.x - p.y, cp.y - p.x).draw(paint, color, linewidth);
                p.x++;
                if (d < 0) d = d + 2 * p.x + 1;
                else {
                    p.y--;
                    d = d + 2 * p.x - 2 * p.y + 1;
                }
            }
            return this;
        }
    },
    Path: function (points) {
        this.ps = points;
        this.move = function(offsetX,offsetY){
            for(var i = 0;i<this.ps.length;i++){
                this.ps[i].x+=offsetX;
                this.ps[i].y+=offsetY;
            }
        };
        this.isIn = function (point) {
            var p = this.ps[0];
            for(var i=1;i<this.ps.length;i++){
                if(new Shape.Line(p,this.ps[i]).isIn(point))
                    return true;
                p = this.ps[i];
            }
            return false;
        };
        //this.color;this.linewidth;
        this.draw = function (paint,color,linewidth) {
            this.color = color?color:this.color;
            this.linewidth = linewidth?linewidth:this.linewidth;
            color = this.color; linewidth = this.linewidth;
            //console.log(color);
            var arr = this.ps;
            if(arr.length==0)  return;
            paint.beginPath();
            paint.strokeStyle = color ? color : 'black';
            paint.lineWidth = linewidth ? linewidth : 1;
            paint.moveTo(arr[0].x,arr[0].y);
            for(var i =1;i<arr.length;i++){
                paint.lineTo(arr[i].x,arr[i].y);
            }
            paint.stroke();
            return this;
        }
    }
}
Shape.Point.prototype.toString = function () {
    return this.x+','+this.y;
}
Image = function (x,y,width,height) {
    this.x=x,this.y=y,this.width=width,this.height=height;
}

