// guaguale 与 picToBiger 函数中的pointX和pointY需要在函数调用前设值。
function guaguale(oCover, color, width, height) {
  // 刮刮乐 从原点(0,0)开始涂层，此处涂抹半径是40，形状圆形
  var pointR = 40;
  var ctx = oCover.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height); // 涂层
  ctx.globalCompositeOperation = "destination-out";
  // 手指涂写事件--留意鼠标坐标
  oCover.addEventListener("mousemove", function(e) {
    ctx.arc(e.clientX - pointX, e.clientY - pointY, pointR, 0, 2 * Math.PI);
    ctx.fill();
  });
}



function picToBiger(nodeOrigin, oMask, oLargerPic, nodeOriginWidth, nodeOriginHeight,
  maskW, maskH, times) {
  nodeOrigin.onmousemove = function(ev) {
    var e = ev || window.event;
    var offsetX = e.clientX - pointX; // 会闪屏，mask左上角的横坐标
    var offsetY = e.clientY - pointY; // 会闪屏，mask左上角的纵坐标
    var offNum = 6; // 因为加了个放大镜手柄，所以有了偏移值offNum。

    if (offsetX <= maskW + offNum) { // 当鼠标靠左边缘时，要限制鼠标距离左边框的距离，距离定为mask中鼠标到mask左边的距离
      offsetX = maskW + offNum;
    }
    if (offsetY <= maskH + offNum) { // 当鼠标靠上边缘时，要限制鼠标距离上边框的距离
      offsetY = maskH + offNum;
    }
    if (offsetX >= (nodeOriginWidth - offNum * 2)) { // 当鼠标靠右边缘时，要鼠标距离左边框的距离，以此限制鼠标
      offsetX = (nodeOriginWidth - offNum * 2);
    }
    if (offsetY >= (nodeOriginHeight - offNum * 2)) { // 当鼠标靠下边缘时，要鼠标距离上边框的距离，以此限制鼠标
      offsetY = (nodeOriginHeight - offNum * 2);
    }
    var l = (offsetX - maskW - offNum) * times + "px";
    var t = (offsetY - maskH - offNum) * times + "px";
    oMask.style.left = offsetX - maskW - offNum + "px";
    oMask.style.top = offsetY - maskH - offNum + "px";
    oLargerPic.style.left = "-" + l;
    oLargerPic.style.top = "-" + t;
  }
}


function flowerTree(otree, oflower) {

  var cxt = oflower.getContext("2d");
  var rootTop = 408; //树起点
  var flowerList = []; //花瓣列表
  var flowerColor = "rgba(255,192,203,.3)"; //花色
  var flowerColorDeep = "rgba(241,158,194,.5)"; //花色深
  var fallList = []; //飘落花瓣列表
  var g = 0.01; //重力加速度
  var gWind = 0.005; //风力加速度
  var limitSpeedY = 1; //速度上限
  var limitSpeedX = 1; //速度上限


  function drawTree(x, y, deg, step) {
    var deg1 = step % 2 == 0 ? 0.1 : -0.1;
    var x1 = x + Math.cos(deg + deg1) * (step + 4) * 0.8; //以步长来判断枝干长度 x轴偏移大一些
    var y1 = y + Math.sin(deg + deg1) * (step - 1) * 0.8; //以步长来判断枝干长度 Y轴压缩一些

    if (step < 3 || (step < 23 && Math.random() > 0.1)) {
      //末梢位置 画花瓣
      var color = [flowerColorDeep, flowerColor, flowerColor][Math.round(Math.random() + 0.2)];
      var r = 2 + Math.random() * 2
      flowerList.push({
        x: x,
        y: y,
        sx: (Math.random() - 0.5),
        sy: 0,
        color: color,
        r: r,
        deg: deg
      }); //保存下画花瓣的位置
    }
    step--;
    if (step > 0) {
      drawTree(x1, y1, deg, step);
      if (step % 3 == 1 && step > 0 && step < 30)
        drawTree(x1, y1, deg + 0.2 + 0.3 * Math.random(), Math.round(step / 1.13)); //右分叉
      if (step % 3 == 0 && step > 0 && step < 30)
        drawTree(x1, y1, deg - 0.2 - 0.3 * Math.random(), Math.round(step / 1.13)); //左分叉
    }
  }

  drawTree(360 / 2, rootTop, -Math.PI / 2, 32, 1); //执行

  var len = flowerList.length;

  function step() {
    if (Math.random() > 0.3) fallList.push(flowerList[Math.floor(Math.random() * len)]); //随机取出一个，花瓣复制到飘落花瓣的列表中
    cxt.clearRect(0, 0, 360, 408);
    for (var i = 0; i < fallList.length; i++) {
      if (fallList[i].sy < limitSpeedY) fallList[i].sy += g;
      fallList[i].sx += gWind;
      fallList[i].x += fallList[i].sx;
      fallList[i].y += fallList[i].sy;
      if (fallList[i].y > rootTop) { //飘到树根的花瓣移除
        fallList.splice(i, 1);
        i--;
        continue;
      }
      cxt.beginPath();
      cxt.fillStyle = fallList[i].color;
      fallList[i].deg += fallList[i].sx * 0.05; //跟速度相关的旋转花瓣
      cxt.arc(fallList[i].x, fallList[i].y, fallList[i].r, fallList[i].deg, fallList[i].deg + Math.PI * 1.3);
      cxt.fill();
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function grayPicture(ctxCover, picPen, height) {
  var image = new Image(); // 不能采用document.getElementById("")方式获取DOM元素，会失效
  image.src = "./images/forframe.jpg";
  image.onload = function() {
    var ow = image.width;
    var oh = image.height;
    picPen.drawImage(image, 0, 0, ow, oh, 0, 0, height * ow / oh, height);
    var pixels = picPen.getImageData(0, 0, height * ow / oh, height);
    var pixeldata = pixels.data;
    var len = pixeldata.length;
    for (var i = 0; i < len; i += 4) {
      var gray = parseInt(pixels.data[i] * 0.3 + pixels.data[i + 1] * 0.59 + pixels.data[i + 2] *
        0.11);
      pixels.data[i] = gray;
      pixels.data[i + 1] = gray;
      pixels.data[i + 2] = gray;
    }
    picPen.putImageData(pixels, 0, 0);
    coverClip(ctxCover, height, image, ow, oh);  // 剪切层实现
  }
}

function coverClip(oCover, height, oimage, ow, oh) {
  // 特意剪裁某张图(复用该图)，不具有通用性
  var ctxcNext = oCover.getContext("2d");
  ctxcNext.drawImage(oimage, 0, 0, ow, oh, 0, 0, height * ow / oh, height);
  var bottomPixels = ctxcNext.getImageData(0, 0, height * ow / oh, height);
  ctxcNext.putImageData(bottomPixels, 0, 0);
  ctxcNext.clearRect(0, 0, 360, 296);
  ctxcNext.clearRect(208, 280, 120, 70);
  ctxcNext.clearRect(180, 290, 60, 28);
  ctxcNext.clearRect(0, 280, 150, 50);
  ctxcNext.clearRect(0, 330, 120, 30);
  ctxcNext.clearRect(320, 280, 40, 70);
  ctxcNext.clearRect(310, 350, 10, 10);
  ctxcNext.clearRect(330, 340, 10, 24);
  ctxcNext.clearRect(340, 350, 20, 6);
  for (let j = 0; j < 30; j++) {
    ctxcNext.clearRect(0, 356 + 4 * j, 360, 2);
  }
}
