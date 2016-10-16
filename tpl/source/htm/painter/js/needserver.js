/**
 * Created by Yc on 2016/6/3.
 */
(function (doc,win) {
    var location = win.location,port=8080,
        url = location.protocol+'//'+'202.119.104.195'+':'+port+'/imgAPI/';

    function common(jsp,cb,more) {
        paint.images.forEach(ele=>{
            var d = paint.getImageData(ele.x,ele.y,ele.width,ele.height);
            var pt = createCanvas(d.width, d.height);
            pt.putImageData(d,0,0);
            $.ajax({
                method:'POST',
                data:$.extend({
                    img:pt.canvas.toDataURL()
                },more),
                url: url+jsp
            }).done(function (nd) {
                pt.putImageData(new ImageData(new Uint8ClampedArray(JSON.parse(nd)),d.width,d.height),0,0);
                cb(pt.canvas);
            })
        })
    }

    S = {
        blur : function () {
            common('blur.jsp',function (canvas) {
                $('#msg-content').append("<div style='clear: left;'></div>").append(canvas)
            });
        },
        restore : function () {
            common('restore.jsp',function (canvas) {
                $('#msg-content').append("<div style='clear: left;'></div>").append(canvas)
            });
        },
        bound : function () {
            common('bound.jsp',function (canvas) {
                $('#msg-content').append("<div style='clear: left;'></div>").append(canvas)
            });
        },
        roberts : function () {
            var i = prompt("输入阈值: (30-100)",30);
            common('roberts.jsp',function (canvas) {
                $('#msg-content').append("<div style='clear: left;'></div>").append(canvas)
            },{v:i});
        }
    }
})(document,window)