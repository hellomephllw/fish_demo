/**
 * Created by Administrator on 2016/3/22.
 */
/**网*/
function Net(name, width, height, x, y) {
    /**名字*/
    this.name = name;
    /**宽高*/
    this.width = width;
    this.height = height;
    /**横纵坐标*/
    this.x = x;
    this.y = y;
    /**存活计时器*/
    this.counter = 0;
    /**缩放尺寸*/
    this.scale = 0.5;
}
/**绘制网*/
Net.prototype.paint = function(cacheCtx, netImageEle) {
    //计算参数
    var x = fishUtil.convertToNumber(((this.x - this.width / 2) + (1 - this.scale) * 0.5 * this.width) / this.scale),
        y = fishUtil.convertToNumber(((this.y - this.height / 2) + (1 - this.scale) * 0.5 * this.height) / this.scale),
        width = this.width,
        height = this.height;
    cacheCtx.save();
    //放大
    cacheCtx.scale(this.scale, this.scale);
    //绘制
    cacheCtx.drawImage(netImageEle, x, y, width, height);
    cacheCtx.restore();
}
/**清除网*/
Net.prototype.clear = function(bulletCanvasCtx) {
    //计算参数
    var x = fishUtil.convertToNumber(this.x - this.width / 2),
        y = fishUtil.convertToNumber(this.y - this.height / 2),
        width = this.width,
        height = this.height;
    //清除
    bulletCanvasCtx.clearRect(x, y, width + 10, height + 10);
}
/**存活计时*/
Net.prototype.existTime = function() {
    //没过0.5秒网消失
    if (this.counter === 30) return false;
    //累计时间，60次为1s
    ++this.counter;
    return true;
}
/**渔网放大*/
Net.prototype.scaleIncrease = function() {
    var scaleVal = fishUtil.convertToNumber(0.5 + 0.5 * this.counter / 30);
    this.scale = scaleVal;
}