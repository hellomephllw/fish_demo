/**
 * Created by Administrator on 2016/3/21.
 */
/**炮台*/
function Cannon(name, width, height, x, y, degree) {
    /**名称*/
    this.name= name;
    /**宽高*/
    this.width = width;
    this.height = height;
    /**横纵坐标*/
    this.x = x;
    this.y = y;
    /**旋转角度*/
    this.degree = degree;
    /**大炮开炮时蠕动的参数*/
    this.wriggleParams = [{x: 0, y: 0}];
    this.wriggleParamsPosition = 0;
    /**子弹*/
    this.bullet = null;
    this.generateBulletCounter = 59;
    /**记录变化前的所有数据*/
    this.recordHistoryData = {x: this.x, y: this.y, degree: this.degree};
}
/**生成子弹*/
Cannon.prototype.generateBullet = function(bulletTempalte) {
    ++this.generateBulletCounter;
    if (this.generateBulletCounter % 30 === 0) {//判断过一秒
        if (this.bullet === null) {//炮筒是否上膛
            //初始化子弹参数
            var name = bulletTempalte.name,
                width = fishUtil.convertToNumber(bulletTempalte.width),
                height = fishUtil.convertToNumber(bulletTempalte.height),
                x = fishUtil.convertToNumber(this.x),
                y = fishUtil.convertToNumber(this.y),
                degree = this.degree,
                speed = 10,
                score = fishUtil.convertToNumber(bulletTempalte.score);
            //生成子弹
            var bullet = new Bullet(name, width, height, x, y, degree, speed, score);
            //上膛
            this.bullet = bullet;
        }
        this.generateBulletCounter = 0;//保证运行区间为0-30
    }
}
/**发射子弹*/
Cannon.prototype.fire = function() {
    var bullet = this.bullet;
    //和炮台解除关系
    this.bullet = null;
    //计数器清零
    this.generateBulletCounter = 0;

    return bullet;
}
/**改变炮台角度*/
Cannon.prototype.changeDegree = function(offsetX, offsetY) {
    if (offsetY > this.y) return ;
    var xDistance = offsetX - this.x;
    var yDistance = this.y - offsetY;
    //记录历史角度
    this.recordHistoryData.degree = this.degree;
    //获取旋转度数
    this.degree = fishUtil.convertToNumber(Math.atan(xDistance / yDistance));
    //子弹改变角度
    if (this.bullet != null) this.bullet.changeDegree(this.degree);
}
/**绘制炮台*/
Cannon.prototype.paint = function(cacheCtx, cannonImageEle) {
    //计算参数
    var cutX = 0,
        cutY = this.wriggleParams[this.wriggleParamsPosition].y,
        cutWidth = this.width,
        cutHeight = this.height,
        x = this.x - this.width / 2,
        y = this.y - this.height / 2,
        width = this.width,
        height = this.height;
    //保存状态
    cacheCtx.save();
    //改变方向
    cacheCtx.translate(this.x, this.y);
    cacheCtx.rotate(this.degree);
    cacheCtx.translate(-this.x, -this.y);
    //绘制
    cacheCtx.drawImage(cannonImageEle, cutX, cutY, cutWidth, cutHeight, x, y, width, height);
    cacheCtx.restore();
}
/**清除炮台*/
Cannon.prototype.clear = function(cannonCanvasCtx) {
    //计算参数
    var x = this.recordHistoryData.x - this.width / 2,
        y = this.recordHistoryData.y - this.height / 2,
        width = this.width,
        height = this.height;
    //保存状态
    cannonCanvasCtx.save();
    //改变方向
    cannonCanvasCtx.translate(this.recordHistoryData.x, this.recordHistoryData.y);
    cannonCanvasCtx.rotate(this.recordHistoryData.degree);
    cannonCanvasCtx.translate(-this.recordHistoryData.x, -this.recordHistoryData.y);
    //清除
    cannonCanvasCtx.clearRect(x, y - 2, width, height);
    cannonCanvasCtx.restore();
    //清除之前的一次之后，便改变历史角度
    this.recordHistoryData.degree = this.degree;
}