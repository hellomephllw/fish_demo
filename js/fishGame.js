/**
 * Created by Administrator on 2016/3/16.
 */
//立即执行，避免全局污染
(function() {
    var fishGame = {
        /**初始化*/
        init: function() {
            this.initPage();
            this.initEvent();
            this.initWidget();
        },
        /**初始化页面*/
        initPage: function() {
            //获取所有canvas
            this.getAllCanvas();
            //画面板
            this.paintPanel();
            //加载所有模板
            this.loadAllTemplates();
            //加载完所有图片
            this.loadAllImages(afterLoadHandler);
            //图片加载完毕之后执行的程序
            function afterLoadHandler() {
                //生成炮台
                fishGame.generateCannon();
                //刷新积分面板
                fishGame.flushPanel();
                //动画处理，循环体
                fishGame.animationDeal(function(cacheJson) {
                    //判断是否暂停
                    if (fishGame.stop) return ;
                    //生成鱼
                    fishGame.generateFishes();
                    //鱼的所有动作
                    fishGame.fishAction();
                    //大炮的动作
                    fishGame.cannonAction();
                    //子弹的动作
                    fishGame.bulletAction();
                    //碰撞处理
                    fishGame.impactDeal(function(fish, bullet) {
                        //炸弹爆炸时刻
                        fishGame.displayNet(fish, bullet);
                    });
                    //死鱼的动作
                    fishGame.deadFishAction(function(fish) {
                        //出现金币
                        fishGame.displayCoin(fish);
                        //出现分数
                        fishGame.displayScore(fish);
                        //玩家得分
                        fishGame.playerScoring(fish.score);
                        //面板加分
                        fishGame.flushPanel();
                    });
                    //网的动作
                    fishGame.netAction();
                    //金币的动作
                    fishGame.coinAction();
                    //分数动作
                    fishGame.scoreAction();
                    //绘制动画到缓存
                    fishGame.paintInCache(cacheJson);
                    //局部清除真实画布
                    fishGame.clearRealCanvasCtx();
                });
            }
        },
        /**初始化页面事件*/
        initEvent: function() {
            //发射炮弹
            this.fireBulletsEvent();
            //暂停事件
            this.stopGameEvent();
            //重新开始
            this.restartGameEvent();
        },
        /**初始化页面组件*/
        initWidget: function() {
        },
        /**计数器（控制时间的）*/
        count: 0,
        /**个人总得分*/
        totalScore: 10000,
        /**鱼canvas*/
        fishCanvas: null,
        fishCanvasCtx: null,
        /**子弹canvas*/
        bulletCanvas: null,
        bulletCanvasCtx: null,
        /**面板canvas*/
        panelCanvas: null,
        panelCanvasCtx: null,
        /**炮台canvas*/
        cannonCanvas: null,
        cannonCanvasCtx: null,
        /**鱼的集合*/
        fishes: [],
        /**死鱼的集合*/
        deadFishes: [],
        /**鱼模板集合*/
        fishTemplates: [],
        /**鱼的的图片*/
        fishImageEles: [],
        /**炮台*/
        cannon: null,
        /**大炮的图片*/
        cannonImageEles: [],
        /**炮台模板集合*/
        cannonTemplates: [],
        /**当前炮台所属模板*/
        cannonTemplatesIndex: 0,
        /**子弹的模板集合*/
        bulletTemplates: [],
        /**发射的子弹集合*/
        bullets: [],
        /**子弹的图片的集合*/
        bulletImageEles: [],
        /**网的模板集合*/
        netTemplates: [],
        /**网的图片集合*/
        netImageEles: [],
        /**网的集合*/
        nets: [],
        /**金币模板集合*/
        coinTemplates: [],
        /**金币图片集合*/
        coinImageEles: [],
        /**金币集合*/
        coins: [],
        /**得分模板*/
        scoreTemplates: [],
        /**得分图片集合*/
        scoreImageEles: [],
        /**得分集合*/
        scores: [],
        /**面板总得分模板*/
        totalScoreTemplates: [],
        /**面板总得分分数*/
        totalScoreImageEles: [],
        /**暂停状态变量*/
        stop: false,
        /**获取所有画布*/
        getAllCanvas: function() {
            //获取鱼的canvas
            this.fishCanvas = document.getElementById("fishCanvas");
            this.fishCanvasCtx = this.fishCanvas.getContext("2d");
            //获取子弹的canvas
            this.bulletCanvas = document.getElementById("bulletCanvas");
            this.bulletCanvasCtx = this.bulletCanvas.getContext("2d");
            //获取面板所在的canvas
            this.panelCanvas = document.getElementById("panelCanvas");
            this.panelCanvasCtx = this.panelCanvas.getContext("2d");
            //获取面板所在的canvas
            this.cannonCanvas = document.getElementById("cannonCanvas");
            this.cannonCanvasCtx = this.cannonCanvas.getContext("2d");
        },
        /**画面板*/
        paintPanel: function() {
            var panelImage = new Image();
            panelImage.src = "/fishDemo/images/bottom-bar.png";
            panelImage.onload = function() {
                fishGame.panelCanvasCtx.drawImage(panelImage, 85, 530, 765, 72);
            }
        },
        /**加载所有的模板*/
        loadAllTemplates: function() {
            //加载鱼的模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/fishTemplates.json",
                success: function(data) {
                    fishGame.fishTemplates = data;
                }
            });
            //加载炮台的模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/cannonTemplates.json",
                success: function(data) {
                    fishGame.cannonTemplates = data;
                }
            });
            //加载子弹的模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/bulletTemplates.json",
                success: function(data) {
                    fishGame.bulletTemplates = data;
                }
            });
            //加载网的模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/netTemplates.json",
                success: function(data) {
                    fishGame.netTemplates = data;
                }
            });
            //加载金币的模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/coinTemplates.json",
                success: function(data) {
                    fishGame.coinTemplates = data;
                }
            });
            //加载得分的模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/scoreTemplates.json",
                success: function(data) {
                    fishGame.scoreTemplates = data;
                }
            });
            //加载面板分数模板
            edison.ajax({
                async: false,
                url: "/fishDemo/config/totalScoreTemplates.json",
                success: function(data) {
                    fishGame.totalScoreTemplates = data;
                }
            });
        },
        /**加载所有的图片*/
        loadAllImages: function(afterLoadHandler) {
            loadSingleImage(0);
            //加载单个图片
            function loadSingleImage(index) {
                var wholeTemplates = fishGame.fishTemplates.concat(
                                    fishGame.cannonTemplates.concat(
                                    fishGame.bulletTemplates.concat(
                                    fishGame.netTemplates.concat(
                                    fishGame.coinTemplates.concat(
                                    fishGame.scoreTemplates.concat(
                                    fishGame.totalScoreTemplates))))));//获取所有的模板
                var imageEle = new Image();//生成一个图片节点
                imageEle.src = wholeTemplates[index].path;//给图片节点加上路径，获取图片
                imageEle.templateName = wholeTemplates[index].name;
                imageEle.type = wholeTemplates[index].type;
                //图片加载好之后，执行此函数
                imageEle.onload = function() {//异步
                    //把该图片节点加入数组
                    if (imageEle.type === "fish") fishGame.fishImageEles.push(imageEle);
                    else if (imageEle.type === "cannon") fishGame.cannonImageEles.push(imageEle);
                    else if (imageEle.type === "bullet") fishGame.bulletImageEles.push(imageEle);
                    else if (imageEle.type === "net") fishGame.netImageEles.push(imageEle);
                    else if (imageEle.type === "coin") fishGame.coinImageEles.push(imageEle);
                    else if (imageEle.type === "score") fishGame.scoreImageEles.push(imageEle);
                    else if (imageEle.type === "totalScore") fishGame.totalScoreImageEles.push(imageEle);
                    //结束递归的判断
                    if (index === wholeTemplates.length - 1) {
                        afterLoadHandler();
                        return ;
                    }
                    ++index;//累加
                    loadSingleImage(index);//递归
                }
            }
        },
        /**处理动画*/
        animationDeal: function(callback) {
            requestAnimationFrame(function() {
                //归零处理
                fishGame.count = fishGame.count > 600000 ? 0 : fishGame.count + 1;
                //获取缓存
                var fishCacheCanvas = document.createElement("canvas");//鱼的缓存
                fishCacheCanvas.width = this.fishCanvas.width;
                fishCacheCanvas.height = this.fishCanvas.height;
                var fishCacheCanvasCtx = fishCacheCanvas.getContext("2d");
                var cannonCacheCanvas = document.createElement("canvas");//炮台的缓存
                cannonCacheCanvas.width = this.fishCanvas.width;
                cannonCacheCanvas.height = this.fishCanvas.height;
                var cannonCacheCanvasCtx = cannonCacheCanvas.getContext("2d");
                var bulletCacheCanvas = document.createElement("canvas");//子弹的缓存
                bulletCacheCanvas.width = this.fishCanvas.width;
                bulletCacheCanvas.height = this.fishCanvas.height;
                var bulletCacheCanvasCtx = bulletCacheCanvas.getContext("2d");

                //执行回调函数
                var cacheJson = {
                    fishCacheCanvas: fishCacheCanvas,
                    fishCacheCanvasCtx : fishCacheCanvasCtx,
                    cannonCacheCanvas: cannonCacheCanvas,
                    cannonCacheCanvasCtx: cannonCacheCanvasCtx,
                    bulletCacheCanvas: bulletCacheCanvas,
                    bulletCacheCanvasCtx: bulletCacheCanvasCtx
                };
                callback(cacheJson);

                //缓存放入真实
                fishGame.fishCanvasCtx.drawImage(cacheJson.fishCacheCanvas, 0, 0, cacheJson.fishCacheCanvas.width, cacheJson.fishCacheCanvas.height);
                fishGame.bulletCanvasCtx.drawImage(cacheJson.bulletCacheCanvas, 0, 0, cacheJson.bulletCacheCanvas.width, cacheJson.bulletCacheCanvas.height);
                fishGame.cannonCanvasCtx.drawImage(cacheJson.cannonCacheCanvas, 0, 0, cacheJson.cannonCacheCanvas.width, cacheJson.cannonCacheCanvas.height);

                //循环
                requestAnimationFrame(arguments.callee);
            });
        },
        /**把绘制人物角色到到缓存中*/
        paintInCache: function(cacheJson) {
            //在缓存中绘制每一只鱼
            for (var i = 0; i < this.fishes.length; ++i) {
                var fish = this.fishes[i];
                //让每一只鱼找到对应的图片
                for (var j = 0; j < this.fishImageEles.length; ++j) {
                    var fishImageEle = this.fishImageEles[j];
                    //绘制
                    if (fish.name == fishImageEle.templateName) {
                        fish.paint(cacheJson.fishCacheCanvasCtx, fishImageEle);//调用绘制方法
                        break;
                    }
                }
            }
            //在缓存中绘制炮台
            var cannon = this.cannon;
            //找到炮台对应的图片
            for (i = 0; i < this.cannonImageEles.length; ++i) {
                if (cannon.name === this.cannonImageEles[i].templateName) {
                    cannon.paint(cacheJson.cannonCacheCanvasCtx, this.cannonImageEles[i]);//调用炮台绘制方法
                    break;
                }
            }
            //在缓存中绘制子弹
            for (i = 0; i < this.bullets.length; ++i) {
                var bullet = this.bullets[i];
                //找到子弹对应的图片
                for (j = 0; j < this.bulletImageEles.length; ++j) {
                    var bulletImage = this.bulletImageEles[j];
                    if (bulletImage.templateName === bullet.name) {
                        bullet.paint(cacheJson.bulletCacheCanvasCtx, bulletImage);//绘制子弹
                        break;
                    }
                }
            }
            //在缓存中绘制死鱼
            for (i = 0; i < this.deadFishes.length; ++i) {
                var deadFish = this.deadFishes[i];
                //让每一只鱼找到对应的图片
                for (j = 0; j < this.fishImageEles.length; ++j) {
                    var fishImageEle = this.fishImageEles[j];
                    //绘制
                    if (deadFish.name == fishImageEle.templateName) {
                        deadFish.paint(cacheJson.fishCacheCanvasCtx, fishImageEle);//调用绘制方法
                        break;
                    }
                }
            }
            //在缓存中绘制网
            for (i = 0; i < this.nets.length; ++i) {
                var net = this.nets[i];
                for (j = 0; j < this.netImageEles.length; ++j) {
                    var netImageEle = this.netImageEles[j];
                    if (netImageEle.templateName === net.name) {
                        net.paint(cacheJson.bulletCacheCanvasCtx, netImageEle);//调用绘制方法
                        break;
                    }
                }
            }
            //在缓存中绘制金币
            for (i = 0; i < this.coins.length; ++i) {
                var coin = this.coins[i];
                for (j = 0; j < this.coinImageEles.length; ++j) {
                    var coinImageEle = this.coinImageEles[j];
                    if (coinImageEle.templateName === coin.name) {
                        coin.paint(cacheJson.fishCacheCanvasCtx, coinImageEle);
                        break;
                    }
                }
            }
            //在缓存中绘制得分
            for (i = 0; i < this.scores.length; ++i) {
                var score = this.scores[i];
                for (j = 0; j < this.scoreImageEles.length; ++j) {
                    var scoreImageEle = this.scoreImageEles[j];
                    if (score.name === scoreImageEle.templateName) {
                        score.paint(cacheJson.fishCacheCanvasCtx, scoreImageEle);
                        break;
                    }
                }
            }
        },
        /**清除所有任务角色*/
        clearRealCanvasCtx: function() {
            //清除每只小鱼
            for (var i = 0; i < this.fishes.length; ++i) {
                var fish = this.fishes[i];
                fish.clear(this.fishCanvasCtx);//调用清除方法
            }
            //清除大炮
            this.cannon.clear(this.cannonCanvasCtx);
            //清除子弹
            for (i = 0; i < this.bullets.length; ++i) {
                var bullet = this.bullets[i];
                bullet.clear(this.bulletCanvasCtx);//调用清除方法
            }
            //清除死鱼
            for (i = 0; i < this.deadFishes.length; ++i) {
                var deadFish = this.deadFishes[i];
                deadFish.clear(this.fishCanvasCtx);
            }
            //清除网
            for (i = 0; i < this.nets.length; ++i) {
                var net = this.nets[i];
                net.clear(this.bulletCanvasCtx);
            }
            //清除金币
            for (i = 0; i < this.coins.length; ++i) {
                var coin = this.coins[i];
                coin.clear(this.fishCanvasCtx);
            }
            //清除得分
            for (i = 0; i < this.scores.length; ++i) {
                var score = this.scores[i];
                score.clear(this.fishCanvasCtx);
            }
        },
        /**创建鱼*/
        generateFishes: function() {
            for (var i = 0; i < this.fishTemplates.length; ++i) {
                //根据权重来判断是否能够生成鱼
                if (0 === this.count % this.fishTemplates[i].weight) {
                    //初始化属性
                    var fishTemplate = this.fishTemplates[i];
                    var width = fishUtil.convertToNumber(fishTemplate.width);
                    var height = fishUtil.convertToNumber(fishTemplate.height);
                    var swingParams = JSON.parse(fishTemplate.swingParams);
                    var goDieSwingParams = JSON.parse(fishTemplate.goDieSwingParams);
                    var weight = fishUtil.convertToNumber(fishTemplate.generateWeight);
                    var name = fishTemplate.name;
                    var speed = fishUtil.convertToNumber(fishTemplate.speed);
                    var score = fishUtil.convertToNumber(fishTemplate.score);
                    //初始化鱼的喜好
                    var hobby = Fish.hobbyGoBottom;
                    var randomNum = Math.random();
                    if (randomNum > 0.67) hobby = Fish.hobbyGoMiddle;
                    else if (randomNum > 0.33) hobby = Fish.hobbyGoTop;
                    //鱼从某一边生成
                    var generateFrom = Math.random() > 0.5 ? Fish.generateFromLeft : Fish.generateFromRight;
                    //初始化角度
                    var degree = fishUtil.convertToNumber(generateFrom == Fish.generateFromLeft ? 0 : Math.PI);
                    //初始化横纵坐标
                    var x = fishUtil.convertToNumber(generateFrom == Fish.generateFromLeft ? -(width / 2) : 1024 + width / 2);
                    var y = fishUtil.convertToNumber(Math.random() * 200 + 200);

                    //生成对象
                    var fish = new Fish(name, width, height, speed, x, y, swingParams, goDieSwingParams, weight, hobby, generateFrom, degree, score);
                    //加入到数组
                    this.fishes.push(fish);
                }
            }
        },
        /**鱼的所有动作*/
        fishAction: function() {
            for (var i = 0; i < this.fishes.length; ++i) {
                //获取鱼
                var fish = this.fishes[i];
                //鱼摆摆
                if (fishGame.count * 10 % 60 === 0) fish.swing();
                //改变角度
                if (fishGame.count * 5 % 60 === 0) fish.changeDegree();
                //鱼向前游动
                fish.swimForward();
                //出界处理
                if (fish.outOfBoundary()) this.fishes.splice(i, 1);
            }
        },
        /**生成炮台*/
        generateCannon: function() {
            var cannonTemplate = this.cannonTemplates[this.cannonTemplatesIndex];
            var name = cannonTemplate.name,
                width = cannonTemplate.width,
                height = cannonTemplate.height,
                x = cannonTemplate.x,
                y = cannonTemplate.y,
                degree = 0;
            this.cannon = new Cannon(name, width, height, x, y, degree);
        },
        /**发射炮弹*/
        fireBulletsEvent: function() {
            var cannonCanvasEle = document.getElementById("cannonCanvas");
            cannonCanvasEle.onclick = function(event) {
                event = event || window.event;
                var offsetX = event.offsetX;
                var offsetY = event.offsetY;
                //转向
                fishGame.cannon.changeDegree(offsetX, offsetY);
                //如果炮台已上膛，则可以打出子弹
                if (fishGame.cannon.bullet != null) {
                    //打出子弹
                    var bullet = fishGame.cannon.fire();
                    //打出子弹后扣分
                    fishGame.totalScore -= bullet.score;
                    //刷新计分板
                    fishGame.flushPanel();
                    //把打出的子弹加入到数组
                    fishGame.bullets.push(bullet);
                }
            }
        },
        /**大炮的动作*/
        cannonAction: function() {
            var bulletTemplate = null;
            var cannonNum = this.cannon.name.slice(6);//获取炮台名称上的数字
            for (var i = 0; i < this.bulletTemplates.length; ++i) {
                //找到炮台对应的子弹
                if (this.bulletTemplates[i].name === "bullet" + cannonNum) {
                    bulletTemplate = this.bulletTemplates[i];
                    //根据子弹的模板去生成子弹
                    this.cannon.generateBullet(bulletTemplate);
                    break;
                }
            }
        },
        /**子弹的动作*/
        bulletAction: function() {
            for (var i = 0; i < this.bullets.length; ++i) {
                var bullet = this.bullets[i];
                //子弹移动
                bullet.goForward();
                //出界处理
                if (bullet.outOfBoundary()) this.bullets.splice(i, 1);
            }
        },
        /**碰撞处理*/
        impactDeal: function(callback) {
            for (var i = 0; i < this.bullets.length; ++i) {
                var bullet = this.bullets[i];
                for (var j = 0; j < this.fishes.length; ++j) {
                    var fish = this.fishes[j];
                    var centerDistance = Math.sqrt((fish.x - bullet.x) * (fish.x - bullet.x) + (fish.y - bullet.y) * (fish.y - bullet.y));//圆心距
                    var sumOfRadius = fish.height / 2 + bullet.height / 2;//半径和
                    if (centerDistance <= sumOfRadius) {//满足碰撞条件
                        //黎明前的黄昏
                        callback(fish, bullet);
                        //擦掉鱼和子弹
                        bullet.clear(this.bulletCanvasCtx);
                        fish.clear(this.fishCanvasCtx);
                        //把鱼加入死鱼数组
                        this.deadFishes.push(fish);
                        fish.isDead = true;
                        //鱼死网破
                        this.bullets.splice(i, 1);
                        this.fishes.splice(j, 1);
                        --i;
                        --j;
                        break;
                    }
                }
            }
        },
        /**鱼死的时候*/
        deadFishAction: function(callback) {
            if (this.count * 10 % 60 === 0)
                for (var i = 0; i < this.deadFishes.length; ++i) {
                    var deadFish = this.deadFishes[i];
                    //让死鱼去死
                    if (deadFish.goDie()) {//如果真正死掉
                        this.deadFishes[i].clear(this.fishCanvasCtx);
                        this.deadFishes.splice(i, 1);
                        --i;
                        callback(deadFish);
                    }
                }
        },
        /**撒网*/
        displayNet: function(fish, bullet) {
            //确定网的名字
            var name = "web" + bullet.name.slice(6);
            for (var i = 0; i < this.netTemplates.length; ++i) {
                var netTemplate = this.netTemplates[i];
                var netTempalteName = netTemplate.name;
                //选择对应的网的模板
                if (netTempalteName === name) {
                    //初始化参数
                    var width = netTemplate.width;
                    var height = netTemplate.height;
                    var x = bullet.x;
                    var y = bullet.y;
                    //生成新的网
                    var net = new Net(name, width, height, x, y);
                    //把网放入数组
                    this.nets.push(net);
                    break;
                }
            }
        },
        /**网的动作*/
        netAction: function() {
            for (var i = 0; i < this.nets.length; ++i) {
                var net = this.nets[i];
                var isExist = net.existTime();//计时，并判断网是否存在
                net.scaleIncrease();
                if (!isExist) {
                    net.clear(this.bulletCanvasCtx);
                    this.nets.splice(i, 1);
                    --i;
                }
            }
        },
        /**出现金币*/
        displayCoin: function(fish) {
            var coinName = "coin1";//默认为银币
            if (fish.score >= 10) coinName = "coin2";//超过10为金币
            //找到金币对应模板
            for (var i = 0; i < this.coinTemplates.length; ++i) {
                var coinTemplate = this.coinTemplates[i];
                if (coinTemplate.name === coinName) {
                    //初始化参数
                    var width = fishUtil.convertToNumber(coinTemplate.width);
                    var height = fishUtil.convertToNumber(coinTemplate.height);
                    var x = fish.x;
                    var y = fish.y;
                    var speed = fishUtil.convertToNumber(coinTemplate.speed);
                    var swingSpanLength = fishUtil.convertToNumber(coinTemplate.swingSpanLength);
                    var swingSpanAmount = fishUtil.convertToNumber(coinTemplate.swingSpanAmount);
                    //生成金币
                    var coin = new Coin(coinName, width, height, x, y, speed, swingSpanLength, swingSpanAmount);
                    //加入金币到数组
                    this.coins.push(coin);
                    break;
                }
            }
        },
        /**金币的动作*/
        coinAction: function() {
            for (var i = 0; i < this.coins.length; ++i) {
                var coin = this.coins[i];
                if (this.count * 20 % 60 === 0) coin.swing();//金币摆动
                coin.move();//金币移动
                if (coin.landDestination()) {//金币消失判断
                    this.coins.splice(i, 1);
                    --i;
                }
            }
        },
        /**分数动作*/
        displayScore: function(fish) {
            //获取分数模板
            var scoreTemplate = this.scoreTemplates[0];
            //获取鱼的分数
            var fishScore = fish.score;
            //初始化参数
            var name = scoreTemplate.name;
            var width = fishUtil.convertToNumber(scoreTemplate.width);
            var height = fishUtil.convertToNumber(scoreTemplate.height);
            var x = fishUtil.convertToNumber(fish.x);
            var y = fishUtil.convertToNumber(fish.y);
            var speed = fishUtil.convertToNumber(scoreTemplate.speed);
            //生成分数
            var score = new Score(name, width, height, x, y, fishScore, speed);
            //把分数加入数组
            this.scores.push(score);
        },
        /**玩家得分*/
        playerScoring: function(score) {
            this.totalScore += score;
        },
        /**面板加分*/
        flushPanel: function() {
            //获取面板显示的分数模板和图片
            var totalScoreTemplate = this.totalScoreTemplates[0];
            var totalScoreImageEle = this.totalScoreImageEles[0];
            //初始化面板所显示的分数
            var totalScore = this.totalScore + "";
            for (var i = totalScore.length; i < 6; ++i) {
                totalScore = "0" + totalScore;
            }
            //初始化参数
            var width = fishUtil.convertToNumber(totalScoreTemplate.width);
            var height = fishUtil.convertToNumber(totalScoreTemplate.height);
            var totalScorePositionX = 105;//总分的左边距
            var totalScorePositionY = 575;//总分的上边距
            var numWidth = 23;//每个数字的间隔
            //清空面板
            this.cannonCanvasCtx.clearRect(totalScorePositionX, totalScorePositionY, numWidth * 6 + totalScorePositionX, height);
            //绘制面板数字
            for (i = 0; i < totalScore.length; ++i) {
                var num = Math.round(totalScore[i]);
                var cutX = 0;
                var cutY = (9 - num) * 24;
                var x = numWidth * i + totalScorePositionX;
                var y = totalScorePositionY;
                this.cannonCanvasCtx.drawImage(totalScoreImageEle, cutX, cutY, width, height, x, y, width, height);
            }
        },
        /**分数的动作*/
        scoreAction: function() {
            for (var i = 0; i < this.scores.length; ++i) {
                var score = this.scores[i];
                score.float();//分数浮动
                var isExist = score.existTime();//判断得分是否应该显示
                //删掉应该消失的得分
                if (!isExist) {
                    score.clear(this.fishCanvasCtx);
                    this.scores.splice(i, 1);
                    --i;
                }
            }
        },
        /**暂停事件*/
        stopGameEvent: function() {
            var stopEle = document.getElementById("stop");
            stopEle.onclick = function() {
                fishGame.stop = true;
            }
        },
        /**重新开始事件*/
        restartGameEvent: function() {
            var restartEle = document.getElementById("restart");
            restartEle.onclick = function() {
                fishGame.stop = false;
            }
        }
    }
    //入口
    fishGame.init();
})();