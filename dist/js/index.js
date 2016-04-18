$(function(){
  //屏幕适配
  MT.screenAdapt(640);
  MT.listenNet();
  MT('平台' + MT.judgePlat());
});
