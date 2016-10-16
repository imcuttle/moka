/**
 * Created by Yc on 2016/3/1.
 */

window.onload = function () {
    
    function randomInt(bound){
        return Math.floor(Math.random()*bound);
    }
    function randomColorStr(){
        return 'rgb('+[randomInt(256),randomInt(256),randomInt(256)].join(',')+')';
    }
    var first = true;

    var colorList = document.getElementById('color-list');
    (function (n) {
        for(var i = 0;i<n; i++) {
            var t = document.createElement('div');
            t.className = 'item rect';
            if(i==0)
                t.className+=' active';
            t.style.backgroundColor = randomColorStr();
            t.setAttribute('role','color-item');
            colorList.appendChild(t);
        }
        var t = document.createElement('div');
        t.style.clear='left';
        colorList.appendChild(t);
    })(30);
    var saveFile = function(data, filename){
        var save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;

        save_link.click()
    };
    canvas = document.getElementById('canvas');
    $(window).on('resize', function () {
        canvas.width=$('.painter-container').width();
    })
    $(window).resize()
    paint = canvas.getContext('2d');
    paint.data={Paths:[], Lines:[], Circles:[]};
    //paint.color='white';
    //paint.fillRect(0,0,paint.canvas.width,paint.canvas.height);

    paint.points =[],paint.images =[];
    function reBindClick() {
        $('[role$=item]').off('click').click(function () {
            $(this).parent().children('.active').removeClass('active');
            $(this).addClass('active')
            var role = $(this).attr('role').replace(/-.*/,'');
            if(role=='color') {
                paint.color = $(this).css('background-color');
                paint.opType=null;
                $('[role=opType-item]').removeClass('active');
            }
            else if(role=='opType')
                paint.opType = $(this).attr('value');
            else {
                eval("paint." + role + "=$(this).text();");
                paint.opType=null;
                $('[role=opType-item]').removeClass('active');
            }
        });
    }
    reBindClick()
    createCanvas = function (w,h){
        var c = document.createElement('canvas');
        c.width=w, c.height=h;
        return c.getContext('2d');
    }
    $('.active').each(function (i) {
        switch (i){
            case 0: paint.color=$(this).css('background-color'); break;
            case 1: paint.lineWidth=$(this).text(); break;
            case 2: paint.shapeType=$(this).text(); break;
            case 3: paint.opType=$(this).attr('value'); break;
        }
    });
    
    $('#canvas').on('mousedown', function (e) {
        if(paint.opType!=null) return;
        paint.points=[];
        if(paint.moveImgIndex!=null) return;
        var x = e.offsetX, y = e.offsetY;
        if(paint.shapeType=='Pen')  return;
        paint.downPoint = new Shape.Point(x,y);
        paint.prevBg=paint.getImageData(0,0,paint.canvas.width,paint.canvas.height);
    }).on('mouseup', function (e) {
        if(paint.opType!=null) return;
        if(paint.moveImgIndex!=null) return;
        if(paint.shapeType=='Pen'){
            if(paint.points.length!=0) {
                paint.data.Paths.unshift(new Shape.Path(paint.points).draw(paint, paint.color, paint.lineWidth))
                paint.points=[];
            }
            return;
        }
        if(!paint.downPoint) return;
        var x = e.offsetX, y = e.offsetY, arg;
        switch (paint.shapeType){
            case 'Line':arg=new Shape.Point(x,y);break;
            case 'Circle':arg=paint.downPoint.distance(new Shape.Point(x,y));break;
        }
        if(paint.prevBg) {
            paint.clearRect(0,0,paint.canvas.width,paint.canvas.height);
            paint.putImageData(paint.prevBg, 0, 0);
        }
        eval("paint.data."+paint.shapeType+"s.unshift(new Shape."+paint.shapeType+"(paint.downPoint,arg).draw(paint,paint.color,paint.lineWidth));")

        paint.prevBg=paint.getImageData(0,0,paint.canvas.width,paint.canvas.height);
        //paint.prevBg=paint.getImageData(0,0,paint.canvas.width,paint.canvas.height);
    }).on('mousemove',function (e) {
        if(paint.opType!=null) return;
        if(paint.moveImgIndex!=null) return;
        if(e.buttons==1) {
            var x = e.offsetX, y = e.offsetY;
            if (paint.shapeType == 'Pen') {
                paint.points.push(new Shape.Point(x, y));
                new Shape.Path(paint.points).draw(paint, paint.color, paint.lineWidth);
            }else{
                var arg; paint.movePoint = new Shape.Point(x,y);
                switch (paint.shapeType){
                    case 'Line':arg=paint.movePoint;break;
                    case 'Circle':arg=paint.downPoint.distance(paint.movePoint);break;
                }
                paint.clearRect(0,0,paint.canvas.width,paint.canvas.height);
                paint.putImageData(paint.prevBg,0,0);
                eval("new Shape."+paint.shapeType+"(paint.downPoint,arg).draw(paint,paint.color,paint.lineWidth)")
            }
        }
    })
    var Console=$('#console');
    Console.log = function (text) {
        $(this).append('<p>'+text+'</p>').scroll($(this).prop('scrollHeight'));
    };
    bfsFillHandle = function (animate) {
        $(paint.canvas).on('click',function (e) {
            $(this).off('click',arguments.callee);
            var p = new Shape.Point(e.offsetX,e.offsetY),
                v = Tool.getInFirstShape(p);
            if(v && v.bfsFill){
                v.bfsFill(paint,p,paint.color,animate);
            }
            $('[role=opType-item]').removeClass('active');
            paint.opType = null;
        })
    }
    dfsFillHandle = function (animate) {
        $(paint.canvas).on('click',function (e) {
            $(this).off('click',arguments.callee);
            var p = new Shape.Point(e.offsetX,e.offsetY),
                v = Tool.getInFirstShape(p);
            if(v && v.dfsFill){
                v.dfsFill(paint,p,paint.color,animate);
            }
            $('[role=opType-item]').removeClass('active');
            paint.opType = null;
        })
    }
    dragMoveHandle = function () {
        var f1 = function(e){
            var x = e.offsetX, y = e.offsetY;
            var v = Tool.getInFirstShape(new Shape.Point(x,y));
            //debugger;
            if(v){
                var f2 = function (e2) {
                    if(e2.buttons==1){
                        var offsetx = e2.offsetX-x, offsety = e2.offsetY-y;
                        x=e2.offsetX; y = e2.offsetY;
                        v.move(offsetx,offsety);
                        Tool.refresh();
                    }
                },f3 = function (e3) {
                    var offsetx = e3.offsetX-x, offsety = e3.offsetY-y;
                    v.move(offsetx,offsety);
                    Tool.refresh();
                    // e3.stopPropagation();
                    $(this).off('mousemove',f2).off('mouseup',f3);
                };
                $(paint.canvas).on('mousemove',f2).on('mouseup',f3).off('mousedown',f1);
            }else {
                $('[role=opType-item]').removeClass('active');
                paint.opType = null;
            }
        }
        $(paint.canvas).on('mousedown',f1)
    }
    kMenusHandle = function () {
        paint.images.forEach(function (ele) {
            var d = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            var worker = new Worker("js/algothim.js");
            worker.postMessage(d);
            worker.onmessage = function (ext) {
                console.log('Main ',ext);
                var clusters = ext.data.c,
                    imgd = ext.data.md,
                    html='';
                for(var i in clusters)
                    html+="<div style='float: left;margin:5px 10px 5px;height: 20px;width: 100px;background-color: rgb("+clusters[i].join(',')+")'></div>";

                var pt = createCanvas(imgd.width, imgd.height);
                pt.putImageData(imgd,0,0);
                $('#msg-content').append(html+"<div style='clear: left;'></div>").append(pt.canvas);
            }

        })
    }



    Tool = {
        getInFirstShape : function(p){
            var f = function(d){
                for(var i =0;i< d.length;i++){
                    if(d[i].isIn(p))
                        return d[i];
                }
                return false;
            };
            var r;
            for(var d in paint.data)
                if((r=f(paint.data[d]))!=false)
                    return r;
        },
        refresh : function () {
            paint.clearRect(0,0,paint.canvas.width,paint.canvas.height);
            for(var i =0;i<paint.data.Paths.length;i++)
                paint.data.Paths[i].draw(paint);
            for(var i =0;i<paint.data.Lines.length;i++)
                paint.data.Lines[i].draw(paint);
            for(var i =0;i<paint.data.Circles.length;i++)
                paint.data.Circles[i].draw(paint);
        }
    }




    imageHandle = function () {
        var f = $('#image-file')[0];
        f.click();
        f.onchange= function () {
            if(!f.files[0]) return;
            if(!f.files[0].type || !/image\/.*/i.test(f.files[0].type))
                alert('Please choose a picture.');
            else{
                var fr = new FileReader();
                fr.onload = function () {
                    $('#canvas').click(function (e) {
                        $(this).off('click');
                        var x = e.offsetX,y= e.offsetY;
                        paint.drawImage(img,x,y);
                        paint.images.push(new Image(x,y,img.width,img.height));
                        //rgb
                        var imgData = paint.getImageData(x,y,img.width,img.height),
                            map = (function (limit,n) {
                                var a={},t=Math.floor(limit/n);
                                a.keySet=[];
                                for(var i=0;i<n;i++) {
                                    var v = i*t;
                                    var key = [v,v+t-1].join('~');
                                    a.keySet.push(key);
                                    a[key]=0;
                                }
                                return a;
                            })(256,8);
                        var t = 256/8
                        for (var i=0;i<imgData.data.length;i+=4) {
                            var value = Math.floor((imgData.data[i+0]+imgData.data[i+1]+imgData.data[i+2])/3);
                            var index = Math.floor(value/t),v=index* t, key =[v,v+t-1].join('~');
                            map[key] = map[key]+1;
                        }
                        var str='';
                        for(var i in map.keySet){
                            var key = map.keySet[i];
                            str+= key +' -> '+map[key]+'<br>'
                        }
                        $('#msg-content').html(str);
                    });
                    var img = document.getElementById('img-container');
                    img.src=this.result;
                    $.ajax({
                        method:'post',
                        url:'getImg.jsp',
                        data: this.result,
                        contentType: f.files[0].type
                    })
                    console.log(this.result);
                    if(first) {
                        alert('please click a point in painter as a begin point.');
                        first=false;
                    }
                }
                fr.readAsDataURL(f.files[0]);
                //fr.readAsBinaryString(f.files[0]);
            }
        }
    };
    averHandle = function () {
        if(!paint.images) return;
        paint.images.forEach(ele => {
            var d = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            var worker = new Worker("js/algothim.js");
            
            worker.postMessage({tag:'average',data:d});
            worker.onmessage = function (ext) {
                console.log('average ',ext);
                var pt = createCanvas(d.width, d.height);
                pt.putImageData(ext.data,0,0);
                $('#msg-content').append("<div style='clear: left;'></div>").append(pt.canvas);
            }
        });
    }
    alphaHandle = function () {
        setImageAlpha = function(index,alph){
            if(paint.images && paint.images.length>index ) {
                var image = paint.images[index],
                    img = paint.getImageData(image.x,image.y,image.width,image.height);
                for(var i=0;i<img.data.length;i+=4){
                    img.data[i+3] = alph;
                }
                paint.save();
                paint.putImageData(img,image.x,image.y);
                paint.restore();
            }
        };
        var alph;
        while((alph=parseInt(prompt('please set images alpha. (0~255)',120)))>255 || alph<0);
        for(var i=0;i<paint.images.length;i++)
            setImageAlpha(i,alph);
    };

    clearImages = function () {
        removeImage = function (index) {
            if(paint.images && paint.images.length>index ) {
                var image = paint.images[index];
                paint.save();
                paint.clearRect(image.x, image.y, image.width, image.height);
                paint.restore();
            }
        }
        for(var i=0 ;i<paint.images.length;i++)
            removeImage(i);
        paint.images = []
    };
    imgSelectHandle = function () {
        if(paint.images.length==0)
            alert('please import your image firstly.');
        else{
            alert('please click your image to download.');
            $('#canvas').click(function (e) {
                var _t=$(this);
                var x= e.offsetX, y = e.offsetY;
                for(var i =0 ;i<paint.images.length;i++){
                    var ele = paint.images[i];
                    if(x>=ele.x&&x<=ele.x+ele.width && y>=ele.y&&y<=ele.y+ele.height){
                        _t.off('click');
                        var data = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
                        var can = createCanvas(ele.width,ele.height);
                        can.putImageData(data,0,0,0,0,data.width,data.height);
                        saveFile(can.canvas.toDataURL(),'download.png');
                        return;
                    }
                }
                alert('please click your image to download.');
            });
        }
    };
    
    textHandle = function () {
        alert('please click to add text');
        $('#canvas').click(function (e) {
            $(this).off('click');
            var x= e.offsetX, y = e.offsetY;
            var text,size;
            if(!(text=prompt('please input text'))) return;
            if(!(size=prompt('please input size of text'))) return;
            paint.font=size+"px Arial";
            paint.strokeText(text,x,y);

        });
    }
    imgGrayHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            for (var i=0;i<imgData.data.length;i+=4) {
                var r = imgData.data[i],g=imgData.data[i+1],b = imgData.data[i+2];
                var value = r*0.3+g*0.59+b*0.11;//Math.floor((imgData.data[i+0]+imgData.data[i+1]+imgData.data[i+2])/3);
                imgData.data[i]=imgData.data[i+1]=imgData.data[i+2]=value;
            }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    };
    blackHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            for (var i=0;i<imgData.data.length;i+=4) {
                var r = imgData.data[i],g=imgData.data[i+1],b = imgData.data[i+2];
                var grey = r*0.3+g*0.59+b*0.11
                imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = grey>125 ? 255 : 0;
            }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    }
    blurHandle = function (){
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x, ele.y, ele.width, ele.height);
            var blurR = 3, totalnum = (2 * blurR + 1) * (2 * blurR + 1);
            for (var i = blurR; i < ele.height - blurR; i++)
                for (var j = blurR; j < ele.width - blurR; j++) {
                    var totalr = 0, totalg = 0, totalb = 0;
                    for (var dx = -blurR; dx <= blurR; dx++)
                        for (var dy = -blurR; dy <= blurR; dy++) {
                            var x = i + dx
                            var y = j + dy
                            var p = (x * ele.width + y)*4;
                            totalr += imgData.data[p + 0]
                            totalg += imgData.data[p + 1]
                            totalb += imgData.data[p + 2]
                        }
                    var p = (i*ele.width + j)*4;
                    imgData.data[p+0] = totalr / totalnum;
                    imgData.data[p+1] = totalg / totalnum;
                    imgData.data[p+2] = totalb / totalnum;
                }
            paint.putImageData(imgData,ele.x,ele.y);
        });
    };
    mosaicHandle = function (){
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x, ele.y, ele.width, ele.height);
            var size = 16
            var totalnum = size*size;
            for( var i = 0 ; i < ele.height ; i += size )
                for( var j = 0 ; j < ele.width ; j += size ){
                    var totalr = 0 , totalg = 0 , totalb = 0
                    for( var dx = 0 ; dx < size ; dx ++ )
                        for( var dy = 0 ; dy < size ; dy ++ ){
                            var x = i + dx;
                            var y = j + dy;
                            var p = x*ele.width + y
                            totalr += imgData.data[p*4+0]
                            totalg += imgData.data[p*4+1]
                            totalb += imgData.data[p*4+2]
                        }
                    var p = i*ele.width+j
                    var resr = totalr / totalnum
                    var resg = totalg / totalnum
                    var resb = totalb / totalnum;
                    for( var dx = 0 ; dx < size ; dx ++ )
                        for( var dy = 0 ; dy < size ; dy ++ ){
                            var x = i + dx
                            var y = j + dy
                            var p = x*ele.width + y
                            imgData.data[p*4+0] = resr
                            imgData.data[p*4+1] = resg
                            imgData.data[p*4+2] = resb
                        }
                }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    }

    hgHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            for (var i=0;i<imgData.data.length;i+=4) {
                imgData.data[i] = 255-imgData.data[i];
                imgData.data[i+1] = 255-imgData.data[i+1];
                imgData.data[i+2] = 255-imgData.data[i+2];
            }
            paint.putImageData(imgData,ele.x,ele.y);
        })
    };
    function ConvolutionMatrix(input, matrix, divisor, offset) {
        // 创建一个输出的 imageData 对象
        var output = document.createElement("canvas")
            .getContext('2d').createImageData(input);
        var w = input.width, h = input.height;
        var iD = input.data, oD = output.data;
        var m = matrix;
        // 对除了边缘的点之外的内部点的 RGB 进行操作，透明度在最后都设为 255
        for (var y = 1; y < h - 1; y += 1) {
            for (var x = 1; x < w - 1; x += 1) {
                for (var c = 0; c < 3; c += 1) {
                    var i = (y * w + x) * 4 + c;
                    oD[i] = offset
                        + (m[0] * iD[i - w * 4 - 4] + m[1] * iD[i - w * 4] + m[2] * iD[i - w * 4 + 4]
                        + m[3] * iD[i - 4] + m[4] * iD[i] + m[5] * iD[i + 4]
                        + m[6] * iD[i + w * 4 - 4] + m[7] * iD[i + w * 4] + m[8] * iD[i + w * 4 + 4])
                        / divisor;
                    oD[(y * w + x) * 4 + 3] = 255; // 设置透明度
                }
            }
        }
        return output;
    };
    cameoHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            paint.putImageData(ConvolutionMatrix(imgData,[-6,3,0,-3,-1,3,0,3,6],1,0),ele.x,ele.y);
        })
    }
    antiHandle = function () {
        paint.images.forEach(function (ele) {
            var imgData = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            paint.putImageData(ConvolutionMatrix(imgData,[0,0,0,0,1,0,0,0,0],-1,255),ele.x,ele.y);
        })
    };
    downloadHandle = function () {
        saveFile(paint.canvas.toDataURL(),'painter.png');
    }
};