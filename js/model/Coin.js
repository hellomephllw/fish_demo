/**
 * Created by Administrator on 2016/3/23.
 */
/**金币*/
function Coin(name, width, height, x, y, speed, swingSpanLength, swingSpanAmount) {
    /**金币名称*/
    this.name = name;
    /**宽高*/
    this.width = width;
    this.height = height;
    /**横纵坐标*/
    this.x = x;
    this.y = y;
    /**金币移速*/
    this.speed = speed;
    /**摆动参数*/
    this.swingSpanLength = swingSpanLength;
    this.swingSpanAmount = swingSpanAmount;
    this.swingSpanCounter = 0;
    /**记录历史数据*/
    this.recordHistoryData = {x: this.x, y: this.y};
}
/**绘制金币*/
Coin.prototype.paint = function(cacheCtx, coinImageEle) {
    //计算参数
    var cutX = fishUtil.convertToNumber(0),
        cutY = fishUtil.convertToNumber(this.swingSpanLength * this.swingSpanCounter),
        cutWidth = fishUtil.convertToNumber(this.width),
        cutHeight = fishUtil.convertToNumber(this.height),
        x = fishUtil.convertToNumber(this.x - this.width / 2),
        y = fishUtil.convertToNumber(this.y - this.height / 2),
        width = this.width,
        height = this.height;
    //绘制
    cacheCtx.drawImage(coinImageEle, cutX, cutY, cutWidth, cutHeight, x, y, width, height);
}
/**清除金币*/
Coin.prototype.clear = function(coinCanvasCtx) {
    //计算参数
    var x = fishUtil.convertToNumber(this.recordHistoryData.x - this.width / 2),
        y = fishUtil.convertToNumber(this.recordHistoryData.y - this.height / 2),
        width = this.width,
        height = this.height;
    //清除
    coinCanvasCtx.clearRect(x, y, width, height);
}
/**金币摆动*/
Coin.prototype.swing = function() {
    ++this.swingSpanCounter;
    if (this.swingSpanCounter >= this.swingSpanAmount) {
        this.swingSpanCounter = 0;
    }
}
/**金币移动*/
Coin.prototype.move = function() {
    //记录历史数据
    this.recordHistoryData.x = this.x;
    this.recordHistoryData.y = this.y;
    //终点坐标
    var destination = {x: 150, y: 600};
    //获取金币偏离终点的角度
    var theta = Math.atan((destination.x - this.x) / (destination.y - this.y));
    //横纵轴方向速度
    var speedX = this.speed * Math.sin(theta);
    var speedY = this.speed * Math.cos(theta);
    //确定坐标
    this.x = fishUtil.convertToNumber(this.x + speedX);
    this.y = fishUtil.convertToNumber(this.y + speedY);
}
/**金币抵达终点判断*/
Coin.prototype.landDestination = function() {
    //终点坐标
    var destination = {x: 150, y: 600};
    if (this.y > 600) return true;
    return false;
}