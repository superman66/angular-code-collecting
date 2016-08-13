var ScratchCard = function (config) {
    this.target = config.target;
    this.condition = config.condition || 0.5;
    this.txt = config.txt;  //canvas图层显示的文字
    this.resultTarget = config.resultTarget; //代金券文字所在的元素
    this.value = config.value; //获奖结果
    this.tipTarget = config.tipTarget;
    this.tipText = config.tipText;
    this.isAttended = config.isAttended;
    this.callback = config.callback;
    this.run();
};

ScratchCard.prototype = {
    run: function () {
        //生成canvas
        this.initCanvas();
    },

    initCanvas: function () {
        var that = this;
        var txt = that.txt;
        var tempFn = that.callback;
        var bodyStyle = document.body.style;
        bodyStyle.mozUserSelect = 'none';
        bodyStyle.webkitUserSelect = 'none';
        var img = that.target;
        var resultTarget = that.resultTarget;
        var canvas = document.querySelector('canvas');
        this.canvas = canvas;
        canvas.style.backgroundColor = 'transparent';
        canvas.style.position = 'absolute';
        canvas.width = img.offsetWidth;
        canvas.height = img.offsetHeight;
        var ctx = canvas.getContext('2d');
        var w = img.offsetWidth,
            h = img.offsetHeight;
        var offsetX = canvas.offsetLeft,
            offsetY = canvas.offsetTop;
        var mousedown = false;

        function drawResult(resultTarget) {

        }

        function eventDown(e) {
            e.preventDefault();
            mousedown = true;
        }

        function eventUp(e) {
            e.preventDefault();
            mousedown = false;
            //用于判断是否涂鸦完成，0.1是10%的意思,在涂层的面积小于等于10%时,就弹出窗口,表示刮完了
            var data = ctx.getImageData(0, 0, w, h).data;
            for (var i = 0, j = 0; i < data.length; i += 4) {
                if (data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
                    j++;
                }
            }
            if (j <= w * h * 0.6) {
                tempFn.call();
                that.clearCanvas();
                //移除监听事件
                canvas.removeEventListener('touchmove', eventMove);
                canvas.removeEventListener('touchend', eventUp);
            }
        }

        function eventMove(e) {
            e.preventDefault();
            if (mousedown) {
                if (e.changedTouches) {
                    e = e.changedTouches[e.changedTouches.length - 1];
                }
                var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
                    y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (!that.isAttended) {
            that.drawCanvas(canvas, img, w, h, txt, ctx);
        }

        //您已参加该活动文字显示
        that.tipTarget.innerHTML = that.tipText;
        that.tipTarget.style.position = 'absolute';
        that.tipTarget.style.fontSize = '12px';
        that.tipTarget.style.zIndex = '8';
        that.tipTarget.style.left = img.offsetLeft + 'px';
        that.tipTarget.style.top = img.offsetTop + 'px';
        that.tipTarget.style.marginLeft = 5 + 'px';
        that.tipTarget.style.marginTop = 5 + 'px';

        that.resultTarget.innerHTML = that.value;
        that.resultTarget.style.position = 'absolute';
        that.resultTarget.style.fontSize = '18px';
        that.resultTarget.style.zIndex = '8';
        that.resultTarget.style.left = (img.offsetLeft + img.offsetWidth / 2) + 'px';
        that.resultTarget.style.top = (img.offsetTop + img.offsetHeight / 2) + 'px';
        that.resultTarget.style.marginLeft = -(that.resultTarget.offsetWidth / 2) + 'px';
        that.resultTarget.style.marginTop = -(that.resultTarget.offsetHeight / 2) + 'px';
        that.resultTarget.style.color = '#f6173e';

        if (!that.isAttended) {
            canvas.addEventListener('touchstart', eventDown);
            canvas.addEventListener('touchend', eventUp);
            canvas.addEventListener('touchmove', eventMove);
            canvas.addEventListener('mousedown', eventDown);
            canvas.addEventListener('mouseup', eventUp);
            canvas.addEventListener('mousemove', eventMove);
        }
    },

    drawCanvas: function (canvas, img, w, h, txt, ctx) {
        canvas.style.position = 'absolute';
        canvas.style.left = img.offsetLeft + 'px';
        canvas.style.top = img.offsetTop + 'px';
        canvas.width = img.offsetWidth;
        canvas.height = img.offsetHeight;
        canvas.style.zIndex = '10';
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "#777777";
        ctx.font = "20px 微软雅黑";
        ctx.textAlign = "center";
        ctx.fillText(txt, canvas.width / 2, canvas.height / 1.7);
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#CCCACB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        layer(ctx);
        ctx.globalCompositeOperation = 'destination-out';
        function layer(ctx) {
            ctx.fillStyle = 'gray';
            ctx.fillRect(0, 0, w, h);
        }
    },

    clearCanvas: function () {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

var scratchCard = new ScratchCard({
    target: document.querySelector('#card_result'), //目标图片
    condition: 0.5, //刮开的多少面积后返回回调函数并清除画布
    txt: '刮开此图层',   //画布上显示的文字
    callback: function () { //回调函数
        alert('中奖了');
    }
})