/**
 * Created by Administrator on 2016/3/23.
 */
/**分数*/
function Score(name, width, height, x, y, score, speed) {
    /**名称*/
    this.name = name;
    /**宽高*/
    this.width = width;
    this.height= height;
    /**横纵坐标*/
    this.x = x;
    this.y = y;
    /**分数*/
    this.score = score;
    /**移速*/
    this.speed = speed;
    /**移动量度*/
    this.counter = 30;
    /**记录历史数据*/
    this.recordHistoryData = {x: this.x, y: this.y};
}
/**绘制分数*/
Score.prototype.paint = function(cacheCtx, scoreImageEle) {
    //计算参数
    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height;
    //分数转型
    var score = this.score + "";
    //确定分数位置
    x = fishUtil.convertToNumber(x - score.length * width / 2);
    y = fishUtil.convertToNumber(y - score.length * height / 2);
    //画乘号
    cacheCtx.drawImage(scoreImageEle, width * 10, 0, width, height, x, y, width, height);
    //画数字
    for (var i = 0; i < score.length; ++i) {
        //计算参数
        var cutX = score[i] * width;
        var cutY = 0;
        x += i * width;
        //绘制
        cacheCtx.drawImage(scoreImageEle, cutX, cutY, width, height, x + width, y, width, height);
    }
}
/**清除分数*/
Score.prototype.clear = function(scoreCanvasCtx) {
    //计算参数
    var x = this.recordHistoryData.x,
        y = this.recordHistoryData.y,
        width = this.width,
        height = this.height;
    //分数转型
    var score = this.score + "";
    //确定分数位置
    x = fishUtil.convertToNumber(x - score.length * width / 2);
    y = fishUtil.convertToNumber(y - score.length * height / 2);
    //确定清除宽度
    width = score.length * width + width;
    //清除
    scoreCanvasCtx.clearRect(x, y, width, height);
}
/**分数浮动*/
Score.prototype.float = function() {
    //记录历史数据
    this.recordHistoryData.y = this.y;
    //移动
    this.y = fishUtil.convertToNumber(this.y - this.speed);
}
/**分数存在时间*/
Score.prototype.existTime = function() {
    --this.counter;
    if (this.counter === 0) return false;
    return true;
}