# h5-common

----------------
&nbsp;&nbsp;&nbsp;&nbsp;前段时间总结完善了一个H5的基础函数库,包括常用的工具函数，及一些小组件，最终用gulp将zepto和common库打包成h5-base.js和h5-base.css大家有兴趣的可以在git上补充，以后的想法是做成像jquery-ui一样可定制生成base库，需要zepto打包zepto,依赖jquery打包jquery等。

## 一、函数列表

> * p2m                        px=>rem的适配
> * getUrlparam           获取url参数
> * getDataUrl              获取图片base64编码
> * judgePlat                判断平台类型
> * isAndroid                判断是否为安卓设备
> * isIOS                      判断是否为IOS设备
> * setCookie               设置cookie
> * getCookie               获取cookie
> * delCookie               删除cookie
> * getPhoneCode       获取手机验证码
> * delayGo                  延迟处理/跳转
> * cutContent              字符串截取
> * toast toast               弹层
> * listenNet                 监听网络状态连接
> * orientation              旋转屏幕后刷新页面
> * confirm                   confirm弹层
> * animArrow             向下滑动指示箭头
> * downloadApp         banner下载
> * rotateTip                横竖屏切换提示
> * shareWx                分享到微信配置

## 二、屏幕适配
### 1.屏幕的适配主要在对应页面初始化时调用p2m完成
```javascript
   /**
   * viewport缩放,px转rem
   * @function p2m
   * @param {designW:设计稿尺寸，一般为640px/750px}
   **/
   MT.p2m = function(designW){
       var resizeNum = 0,
           timer     = null,
           winW      = window.innerWidth,
           screenW   = window.screen.width;
       var resize = function(){
           clearTimeout(timer);
           if(screenW > 414){
             winW = 414;
             MT.TOUCH_START = "click";
             MT.TOUCH_END   = "click";
           }
           document.getElementsByTagName("html")[0].style.fontSize=(winW/designW)*100+"px";
           if(winW>screenW && resizeNum<=10){
               timer = setTimeout(function(){
                   resize(++resizeNum);
               }, 100);
           } else {
               document.getElementsByTagName("body")[0].style.opacity = 1;
           }
       };
       timer = setTimeout(resize, 100);
       window.onresize = resize;
   };
```

### 2.适配过程
> * 从p2m方法可以看出，有个动态参数designW，一般来说设计稿尺寸为640px或750px，这个按照具体情况传对应的参数；
> * 以1rem=100px做适配，我们知道iphone6+的逻辑分辨率为414*736,其他移动设备也大不相同，所以无法做到与设计稿的对应，所以要做一个比率的缩放，即      (winW/designW)*100，rem是以根节点为基准，所以只处理html节点；
> * 因为移动端viewport的宽度平常大于设备宽度，所以以这个为判定条件之一，为什么要计算10次呢，是因为一次在低配手机上可能会适配失败；
> * 对于pc端的兼容，当设备尺寸大于414时，文档默认414宽度，touch事件变更成click事件；

## 三、调用方法

### 1.meta设置
一般H5页面我们禁止缩放
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">

### 2.body的默认opacity
默认为0，适配完成后设为1，避免适配过程中的闪屏现象；

### 3.初始化调用适配方法
> * 在页面初始化时，需调用MT.p2m方法完成屏幕适配;
> * 如需调用其他方法，也用“MT.方法名”去调用;

## 四、DEMO
download后，预览index.html
