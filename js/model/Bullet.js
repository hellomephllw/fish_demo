/**
 * Created by Administrator on 2016/3/21.
 */
/**子弹*/
function Bullet(name, width, height, x, y, degree, speed, score) {
    /**名称*/
    this.name = name;
    /**宽高*/
    this.width = width;
    this.height = height;
    /**横纵坐标*/
    this.x = x;
    this.y = y;
    /**偏转角度*/
    this.degree = degree;
    /**子弹速度*/
    this.speed = speed;
    /**子弹需要的分数*/
    this.score = score;
    /**记录变化前的所有数据*/
    this.recordHistoryData = {x: this.x, y: this.y, degree: this.degree};
}
/**绘制子弹*/
Bullet.prototype.paint = function(cacheCtx, bulletImageEle) {
    //计算参数
    var x = fishUtil.convertToNumber(this.x - this.width / 2),
        y = fishUtil.convertToNumber(this.y - this.height / 2),
        width = this.width,
        height = this.height;
    //保存状态
    cacheCtx.save();
    //改变方向
    cacheCtx.translate(this.x, this.y);
    cacheCtx.rotate(this.degree);
    cacheCtx.translate(-this.x, -this.y);
    //绘制
    cacheCtx.drawImage(bulletImageEle, x, y, width, height);
    cacheCtx.restore();
}
/**清除子弹*/
Bullet.prototype.clear = function(bulletCanvasCtx) {
    //计算参数
    var x = fishUtil.convertToNumber(this.recordHistoryData.x - this.width / 2),
        y = fishUtil.convertToNumber(this.recordHistoryData.y - this.height / 2),
        width = this.width,
        height = this.height;
    //保存状态
    bulletCanvasCtx.save();
    //改变方向
    bulletCanvasCtx.translate(this.recordHistoryData.x, this.recordHistoryData.y);
    bulletCanvasCtx.rotate(this.degree);//子弹不能使用历史角度
    bulletCanvasCtx.translate(-this.recordHistoryData.x, -this.recordHistoryData.y);
    //清除
    bulletCanvasCtx.clearRect(x, y, width + 10, height + 10);
    bulletCanvasCtx.restore();
}
/**向前移动*/
Bullet.prototype.goForward = function() {
    //记录历史坐标
    this.recordHistoryData.x = this.x;
    this.recordHistoryData.y = this.y;
    //获取横纵向速度
    var speedX = this.speed * Math.sin(this.degree);
    var speedY = this.speed * Math.cos(this.degree);
    //移动
    this.x = fishUtil.convertToNumber(this.x + speedX);
    this.y = fishUtil.convertToNumber(this.y - speedY);
}
/**改变方向*/
Bullet.prototype.changeDegree = function(degree) {
    //记录历史角度
    this.recordHistoryData.degree = this.degree;
    //改变角度
    this.degree = degree;
}
/**子弹出界处理*/
Bullet.prototype.outOfBoundary = function() {
    //对角线的一半
    var halfDiagonal = Math.sqrt(this.width * this.width + this.height * this.height) / 2;
    //判断，若满足出界条件，则返回true
    if (this.recordHistoryData.x > 1024 + halfDiagonal ||
        this.recordHistoryData.x < 0 - halfDiagonal ||
        this.recordHistoryData.y < 0 - halfDiagonal ||
        this.recordHistoryData.y > 600 + halfDiagonal) return true;
}