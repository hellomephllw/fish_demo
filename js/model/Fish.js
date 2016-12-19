/**
 * Created by Administrator on 2016/3/16.
 */
/**鱼类*/
function Fish(name, width, height, speed, x, y, swingParams, goDieSwingParams, generateWeight, hobby, generateFrom, degree, score) {
    /*鱼种类名称*/
    this.name = name;
    /**宽高*/
    this.width = width;
    this.height = height;
    /**速度*/
    this.speed = speed;
    /**摆动参数*/
    this.swingParams = swingParams;
    this.swingParamsPosition = 0;
    /**鱼死亡摆动*/
    this.goDieSwingParams = goDieSwingParams;
    this.goDieSwingParamsPosition = 0;
    /**横纵坐标*/
    this.x = x;
    this.y = y;
    /**
     * 生成鱼的权重
     * 值越大权重越小，代表每次生成更少的鱼
     * */
    this.generateWeight = generateWeight;
    /**角度*/
    this.degree = degree;
    /**喜好*/
    this.hobby = hobby;
    /**从某一边出来*/
    this.generateFrom = generateFrom;
    /**记录变化前的所有数据*/
    this.recordHistoryData = {x: this.x, y: this.y, degree: this.degree};
    /**鱼是否死掉*/
    this.isDead = false;
    /**鱼的分数*/
    this.score = score;
}
/**静态变量：鱼的喜好*/
Fish.hobbyGoTop = "gotop";//往上游
Fish.hobbyGoMiddle = "gomiddle";//往中游
Fish.hobbyGoBottom = "gobottom";//往下游
/**静态变量：从某处生成*/
Fish.generateFromLeft = "left";//从左边出生
Fish.generateFromRight = "right";//从右边出生
/**摆动*/
Fish.prototype.swing = function() {
    //切换动画
    ++this.swingParamsPosition;
    //清零
    if (this.swingParamsPosition == this.swingParams.length) this.swingParamsPosition = 0;
}
/**改变角度*/
Fish.prototype.changeDegree = function() {
    if (Math.random() > 0.5) {//增加随机性
        //获取本次应该改变的角度
        var randomNum = Math.random();//确定随机数
        var changeDegree = fishUtil.convertToNumber(1 / 180 * Math.PI);//默认值，往下走
        if (this.hobby === Fish.hobbyGoTop) {//喜欢走上
            if (randomNum > 0.4) changeDegree = -changeDegree;//往上走
            else if (randomNum > 0.2) changeDegree = 0;//走中间
        } else if (this.hobby === Fish.hobbyGoMiddle) {//喜欢走中
            if (randomNum > 0.8) changeDegree = 0;//走中间
            else if (randomNum > 0.2) changeDegree = -changeDegree;//走上
        }
        //如果超过90度或-90度，不能改变
        if (this.generateFrom == Fish.generateFromLeft &&
            (this.degree + changeDegree >= Math.PI / 2 || this.degree + changeDegree <= -Math.PI / 2)) return ;
        else if (this.generateFrom == Fish.generateFromRight &&
            (this.degree + changeDegree >= Math.PI / 2 * 3 || this.degree + changeDegree <= Math.PI / 2)) return ;
        //记录当前数据
        this.recordHistoryData.degree = this.degree;
        //小于90度时，改变角度
        this.degree += changeDegree;
    }
}
/**向前游动*/
Fish.prototype.swimForward = function() {
    //记录当前数据
    this.recordHistoryData.x = this.x;
    this.recordHistoryData.y = this.y;
    //移动
    this.x = fishUtil.convertToNumber(this.x + this.speed * Math.cos(this.degree));
    this.y = fishUtil.convertToNumber(this.y + this.speed * Math.sin(this.degree));
}
/**出界判断*/
Fish.prototype.outOfBoundary = function() {
    //对角线的一半
    var halfDiagonal = Math.sqrt(this.width * this.width + this.height * this.height) / 2;
    //判断，若满足出界条件，则返回true
    if (this.x > 1024 + halfDiagonal ||
           this.x < 0 - halfDiagonal ||
           this.y < 0 - halfDiagonal ||
           this.y > 600 + halfDiagonal) return true;
}
/**绘制鱼*/
Fish.prototype.paint = function(cacheCtx, fishImageEle) {
    //计算参数
    var cutX = 0,
        cutY = this.isDead ? this.goDieSwingParams[this.goDieSwingParamsPosition].y : this.swingParams[this.swingParamsPosition].y,
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
    cacheCtx.drawImage(fishImageEle, cutX, cutY, cutWidth, cutHeight, x, y, width, height);
    cacheCtx.restore();
}
/**清除鱼*/
Fish.prototype.clear = function(fishCanvasCtx) {
    //确定中心点
    var positionX = this.recordHistoryData.x;
    var positionY = this.recordHistoryData.y;
    var degree = this.recordHistoryData.degree;
    if (this.isDead) {//如果是死鱼
        positionX = this.x;
        positionY = this.y;
        var degree = this.degree;
    }
    //计算参数
    var x = positionX - this.width / 2,
        y = positionY - this.height / 2,
        width = this.width,
        height = this.height;
    //保存状态
    fishCanvasCtx.save();
    //改变方向
    fishCanvasCtx.translate(positionX, positionY);
    fishCanvasCtx.rotate(degree);
    fishCanvasCtx.translate(-positionX, -positionY);
    //清除
    fishCanvasCtx.clearRect(x, y, width, height);
    fishCanvasCtx.restore();
}
/**鱼摆摆死亡*/
Fish.prototype.goDie = function() {
    ++this.goDieSwingParamsPosition;//让鱼摆动
    if (this.goDieSwingParamsPosition === this.goDieSwingParams.length) return true;//让鱼消失
}