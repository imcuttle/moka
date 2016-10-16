/**
 * Created by Yc on 2016/4/19.
 */
function randomInt(bound){
    return Math.floor(Math.random()*bound);
}






Algorithm = {
    //http://blog.csdn.net/jia20003/article/details/8119563
    //http://hello-wangfeng.iteye.com/blog/1717150
    average: function (imgData) {
        var data = imgData.data, w = imgData.width, h = imgData.height;
        var histogramR = [],
            histogramG = [],
            histogramB = [];
        for(var i=0; i<data.length; i+=4){
            histogramR[data[i]] = histogramR[data[i]]+1 || 1;
            histogramG[data[i+1]] = histogramG[data[i+1]]+1 || 1;
            histogramB[data[i+2]] = histogramB[data[i+2]]+1 || 1;
        }
        //直方图均衡化
        function getRate(grayHis,total,index) {
            var s = 0;
            for(var i=0;i<index;i++){
                var v = grayHis[i]||0;
                s+=(v/total);
            }
            return Math.floor(s*255);
        }
        var total = w*h,
            newHisR = [],
            newHisG = [],
            newHisB = [];
        for(i=0; i<256; i++){
            newHisR[i] = getRate(histogramR,total,i);
            newHisG[i] = getRate(histogramG,total,i);
            newHisB[i] = getRate(histogramB,total,i);
        }
        console.log([histogramR,histogramG,histogramB],[newHisR,newHisG,newHisB]);
        for(i=0; i<h; i++){
            for(var j=0; j<w; j++){
                var v = (i*w+j)<<2;
                data[v] = newHisR[data[v]];
                data[v+1]=newHisG[data[v+1]];
                data[v+1]=newHisB[data[v+2]];
            }
        }
        return imgData;
    },
    kMeans : function(imgData){
        var data = imgData.data, w = imgData.width, h = imgData.height;
        var clusters = (function getRandomClusters(k){
            var rlt = [];
            while(k-->0)
                rlt.push([randomInt(256),randomInt(256),randomInt(256)]);
            return rlt;
        })(3);
        function getRGBDistance(clu,rgb){
            return parseInt(Math.sqrt(Math.pow(rgb[0]-clu[0],2)+Math.pow(rgb[1]-clu[1],2),Math.pow(rgb[2]-clu[2],2)).toFixed(0));
        }
        function getCenterCluster(rgbs){
            var sumr= 0,sumg= 0,sumb=0;
            for(var i in rgbs){
                sumr+=rgbs[i][0];sumg+=rgbs[i][1];sumb+=rgbs[i][2];
            }
            return [parseInt((sumr/rgbs.length).toFixed(0)),
                parseInt((sumg/rgbs.length).toFixed(0)),
                parseInt((sumb/rgbs.length).toFixed(0))]
        }
        var forNewClus = new Array(clusters.length),forNewData = new Array(clusters.length);
        while(true) {
            for(var i=0;i<forNewClus.length;i++) {
                forNewClus[i] = [];
                forNewData[i] = [];
            }
            for (var i = 0; i < data.length; i += 4) {
                var myCluIndex, minDist = Number.MAX_VALUE, rgb = [data[i], data[i + 1], data[i + 2]];
                for (var j = 0; j < clusters.length; j++) {
                    var dist = getRGBDistance(clusters[j], rgb);
                    if (dist < minDist) {
                        myCluIndex = j;
                        minDist = dist;
                    }
                }
                forNewData[myCluIndex].push(i);
                forNewClus[myCluIndex].push(rgb);
            }
            var isUpdate=false;
            for(var i=0;i<forNewClus.length;i++) {
                if(forNewClus[i].length==0)
                    continue;
                var c = getCenterCluster(forNewClus[i]);
                if(c[0]!=clusters[i][0]||c[1]!=clusters[i][1]||c[2]!=clusters[i][2]) {
                    clusters[i] = c;
                    isUpdate = true;
                }
            }
            if(!isUpdate)
                break;
        }
        for(var i=0;i<forNewData.length;i++) {
            for(var j=0;j<forNewClus[i].length;j++){
                var val = forNewData[i][j];
                data[val] = clusters[i][0];
                data[val+1] = clusters[i][1];
                data[val+2] = clusters[i][1];
            }
        }
        console.log(forNewClus,clusters);
        return {c:clusters,md:imgData};
    }
}

onmessage = function (evt) {
    console.log('Do ',evt);
    var d = evt.data;
    if(!d.tag)
        postMessage(Algorithm.kMeans(d));
    else{
        switch (d.tag){
            case 'average': postMessage(Algorithm.average(d.data)); break;
        }
    }
}