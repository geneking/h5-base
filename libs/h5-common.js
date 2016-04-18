

/****************************************
* @author: jinweigang
* @vsersion 1.0

* ---------------函数 列表--------------——
* @screenAdapt       px=>rem的适配
* @getUrlparam       获取url参数
* @getDataUrl        获取图片base64编码
* @judgePlat         判断平台类型
* @isAndroid         判断是否为安卓设备
* @isIOS             判断是否为IOS设备
* @setCookie         设置cookie
* @getCookie         获取cookie
* @delCookie         删除cookie
* @startTimer        定时器
* @delayGo           延迟处理/跳转
* @cutContent        字符串截取
* @toast             toast弹层
* @listenNet         监听网络状态连接
* @confirm           confirm弹层
* @animArrow         向下滑动指示箭头
* @downloadApp       banner下载
* @rotateTip         横竖屏切换提示
* @shareWx           分享到微信配置
*****************************************/

;(function(window, $, undefined){
    window.MT = {};

    /**
    * viewport缩放
    * @function screenAdapt
    * @param {designW:设计稿尺寸，一般为640/750}
    **/
    MT.screenAdapt = function(designW){
        var resizeNum = 0,
            winW = window.innerWidth,
            screenW = window.screen.width;
        var resize = function(){
            winW = screenW>designW ? designW : winW;
            document.getElementsByTagName("html")[0].style.fontSize=winW*(100/designW)+"px";
            if(winW>window.screen.width && resizeNum<=10){
                setTimeout(function(){
                    resize(++resizeNum);
                }, 100);
            } else {
                document.getElementsByTagName("body")[0].style.opacity = 1;
            }
        }
        setTimeout(resize, 100);
        window.onresize = resize;
    };

    /**
    * 获取url参数
    * @function getUrlParam
    * @param {name:url参数名称}
    **/
    MT.getUrlParam = function(href) {
      var href = href || window.location.search,
          reg = /([^?=&]+)(=([^&]*))?/g,
          data = {};
      if (href) {
        encodeURIComponent(href).replace(reg, function($0, $1, $2, $3) {
          data[$1] = $3;
        });
      }
      return data;
    };

    /**
    * 获取图片base64编码，用于图片上传
    * @function getDataUrl
    * @param {file:一般由input change获取, callback:异步读取 需要回调操作}
    **/
    MT.getDataUrl = function(file, callback) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function(e) {
        var image = new Image();

        image.onload = function () {
          var canvas = document.createElement('canvas');
          var imageWidth = this.naturalWidth,
              imageHeight = this.naturalHeight,
              maxWidth = 800,
              maxHeight = 600;
          var ratio = imageWidth / imageHeight;
          if (ratio > 1) {
            imageWidth = (maxWidth > imageWidth) ? imageWidth : maxWidth;
            imageHeight = Math.round(imageWidth / ratio);
            if (imageHeight > maxHeight) {
              imageHeight = maxHeight;
              imageWidth = Math.round(imageHeight * ratio);
            }
          } else {
            imageHeight = (maxHeight > imageHeight) ? imageHeight : maxHeight;
            imageWidth = Math.round(imageHeight * ratio);
            if (imageWidth > maxWidth) {
              imageWidth = maxWidth;
              imageHeight = Math.round(imageWidth / ratio);
            }
          }
          canvas.width = imageWidth;
          canvas.height = imageHeight;
          canvas.getContext('2d').drawImage(this, 0, 0);
          callback(canvas.toDataURL('image/jpeg').substring(23));
        };
        image.src = e.target.result;
      };

    };

    /**
    * 获取url参数
    * @function judgePlat
    **/
    MT.judgePlat = function(){
        var browser   = "other",
            ua        = navigator.userAgent.toLowerCase(),
            android   = /Android|HTC/i.test(ua), /* HTC Flyer平板的UA字符串中不包含Android关键词 */
            ios       =  !android && /iPod|iPad|iPhone/i.test(ua);

        if(/MicroMessenger/i.test(ua)) browser="weixin";
        if(/weibo/i.test(ua))          browser="weibo";
        return browser;
    };

    /**
    * 判断是否为安卓设备
    * @function isAndroid
    **/
    MT.isAndroid = function(){
      /* HTC Flyer平板的UA字符串中不包含Android关键词 */
      return  /Android|HTC/i.test(navigator.userAgent.toLowerCase());
    };

    /**
    * 判断是否为ios设备
    * @function isIOS
    **/
    MT.isIOS = function(){
      return  /iPod|iPad|iPhone/i.test(navigator.userAgent.toLowerCase());
    };

    /**
    * 设置cookie
    * @function setCookie
    * @param {key:cookie名称，value:cookie值，days:过期时间}
    **/
    MT.setCookie = function(key, value, days){
       var expire = new Date(),
           expire = expire.getTime() + days*24*60*60*1000;
       document.cookie = key + "=" + escape(value) + ";expires=" + new Date(expire);
    };

    /**
    * 获取cookie
    * @function getCookie
    * @param {key:cookie名称}
    **/
    MT.getCookie = function(key){
        var reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)"),
            arr = document.cookie.match(reg);
        if(arr != null) return unescape(arr[2]);
        return false;
    };

    /**
    * 删除cookie
    * @function delCookie
    * @param {key:cookie名称}
    **/
    MT.delCookie = function(key){
        MT.setCookie(key,"",-1);
    };

    /**
    * 启动一个定时器
    * @function startTimer
    * @param {dom:按钮dom对象, time:时间s, disabled:置灰类, getCode:获取验证码的方法}
    **/
    MT.startTimer = function(dom, time, disabled, getCode){
        var timer = null,
            count = time,
            disabled = disabled || "";
        dom.on("touchstart", function(){
            if(dom.data("lock")) return;
            if(typeof getCode == 'function'){
              getCode();//发送验证码
            } else {
              MT.toatst('错误:该参数应为函数');
            }
            dom.addClass(disabled).data("lock",true);
            timer = setInterval(function(){
                if (--count > 0) {
                    dom.text("重新发送(" + count + ")");
                } else {
                    dom.removeClass(disabled).text("重新发送").data("lock",false);
                    clearInterval(timer);
                    count = time;
                }
            },1000);
        });
    };

    /**
    * 延迟处理/跳转
    * @function delayGo
    * @param {callback:跳转地址/回调函数, time:延迟时间ms}
    */
    MT.delayGo = function(callback, time){
        var timer = setTimeout(function(){
        	if (typeof callback == 'string') {
        		location.href = callback;
        	} else if(typeof callback == 'function') {
        		callback();
        	}
        	clearTimeout(timer);
        }, time || 1500);
    };

    /**
    * 延迟处理/跳转
    * @function cutContent
    * @param {str:截取字符串, len:截取长度, tag: 标记}
    */
    MT.cutContent = function(str, len, tag){
    	//只是计算字符长度，不区分中英文
    	var newStr = '';
    	if (str.length > len) {
    		newStr = str.substr(0,len);
    	}
    	return newStr + (tag || '...');
    };

    /**
    * 黑色浮层弹窗
    * @function toast
    * @param {text:弹出文案,time:弹窗持续时间 callback:回调函数}
    */
    MT.toast = function(text, time, callback){
        $(".mt-toast").remove();
        $("body").append("<div class='mt-toast'><p>"+text+"</p></div>");
        setTimeout(function(){
            $(".mt-toast").remove();
            if(callback) callback();
        },time || 2000);
    };

    /**
    * 网络断开toast提示
    * @function offLine
    */
    MT.listenNet = function(){
        window.addEventListener("offline",function(){
            MT.toast("网络连接失败,请重试",1000000);
        },false);
        window.addEventListener("online",function(){
            $(".mt-toast").remove();
        },false);
    };

    /**
    * 黑色浮层弹窗
    * @function confirmDialog
    * @param {option:参数配置}
    */
    MT.confirm = function(_option){
        var option = $.extend({
            text: "这里添加提示文案",
            okBtnText: "确定",
            cancelBtnText: "取消",
            okCallback: function(){
                this.close();
            },
            close:function(){
                $(".mt-confirm-dialog").remove();
                $(".mt-mask").remove();
            }
        },_option || {});

        var html = ['<div class="mt-confirm-dialog">',
                        '<p class="text">',option.text,'</p>',
                        '<p><span class="mt-confirm-btn">',option.okBtnText,'</span>',
                        '<span class="mt-cancel-btn">',option.cancelBtnText,'</span></p>',
                    '</div>',
                    '<div class="mt-mask"></div>'].join("");
        $("body").append(html);

        $(".mt-confirm-btn").on("touchstart",function(){
            $(confirmBtn).addClass("touch-btn");
        })
        .on("touchend",function(){
            $(confirmBtn).removeClass("touch-btn");
            option.okCallback();
            option.close();
        });

        $(".mt-cancel-btn").on("touchstart",function(){
            $(".mt-cancel-btn").addClass("mt-touch-btn");
        })
        .on("touchend",function(){
            $(".mt-cancel-btn").removeClass("mt-touch-btn");
            option.close();
        });
    };

    /**
    * 向下指示箭头
    * @function animArrow
    * @param {imgUrl: 箭头图片地址}
    **/
    MT.animArrow = function(imgUrl){
        var img  = imgUrl ? imgUrl : "",
            html = ['<div class="mt-animate-arrow"><img src="',img,'"><div>'].join();
        $("body").append(html);
    };

    /**
    * 底部下载app banner
    * @function downloadApp
    * @param{option对象}
    **/
    MT.downloadApp = function(_option){
        var option = $.extend({
            position: "static",
            height: "1rem",
            wxUrl:"",
            androidUrl:"",
            iosUrl:"",
            imgUrl:""
        },_option || {});
        var html = "",
            plat = MT.judgePlat();

        if(plat == "weixin"){
            option.downloadUrl = wxUrl;
        } else if(plat == "ios"){
            option.downloadUrl = iosUrl;
        } else if(plat == "android"){
            option.downloadUrl = androidUrl;
        }
        html = ['<a class="download-app" style="height:',height,';position:',option.position,
                '" href="',option.downloadUrl,'"><img src="',imgUrl,'"></div>'].join("");
        $("body").append(html);
    };

    /**
    * 横竖屏提示
    * @function rotateTip
    * @param{}
    **/
    MT.rotateTip = function(){
        var timer = setTimeout(function(){
            $("body").append('<div class="mt-mask mt-zindex"><span>请切换至竖屏显示</span></div>');
            clearTimeout(timer);
        },0);
    };

    /**
    * 分享到微信
    * @function shareWx
    * @param{data对象}
    **/
    MT.shareWx = function(data,authUrl){
        var callback = function (data) {
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList:['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo',
                               'chooseImage','previewImage','uploadImage','downloadImage']
            });

            wx.ready(function () {
                var shareData = {
                    title: data.title,
                    desc: data.desc,
                    link: location.href, // 分享链接
                    imgUrl: data.imgUrl,
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    }
                };
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareQQ(shareData);
                wx.onMenuShareWeibo(shareData);
                wx.onMenuShareTimeline(shareData);

                console.log('weixin support set success.');
            });
            wx.error(function (res) {
                //alert(res.errMsg);
            });
        };
        $.ajax({
            url: authUrl,
            dataType: "json",
            data: location.href.split("#")[0],
            success: function (res) {
                callback(res);
            },
            error: function (xhr, type) {
                console.log('xhr:' + xhr + "type:" + type);
                MT.toast("认证接口错误");
            }
        });
    };

})(window, Zepto);
