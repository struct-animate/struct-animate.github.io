/**
 * @package Site Template
 * @subpackage Willbridge HTML
 * @since Willbridge HTML 1.0
 * 
 * Template Scripts
 * Created by CMSMasters
 * 
 */

/*
 * Responsive Content Slider v1.0.1 - jQuery Content Slider
 * 
 * (c) Copyright Steven "cmsmasters" Masters
 * http://cmsmastrs.net/
 * For sale on ThemeForest.net
 */


(function(a){a.fn.cmsmsResponsiveContentSlider=function(b){var c={sliderWidth:1e3,sliderHeight:500,animationSpeed:500,animationEffect:"slide",animationEasing:"easeInOutExpo",pauseTime:5e3,activeSlide:1,touchControls:true,pauseOnHover:true,arrowNavigation:true,arrowNavigationHover:false,slidesNavigation:true,slidesNavigationHover:false,afterSliderLoad:function(){},beforeSlideChange:function(){},afterSlideChange:function(){}},d=this,e=d.wrap('<div class="cmsms_content_slider_parent" />').parent(),f=undefined,g={};g={init:function(){g.options=a.extend({},c,b);g.el=d;g.vars={};g.vars.oldSlide=undefined;g.vars.newSlide=undefined;g.vars.active_sl_numb=g.options.activeSlide==="random"?0:Number(g.options.activeSlide-1);g.vars.ifWNumber=typeof g.options.sliderWidth==="number"?true:false;g.vars.ifHNumber=typeof g.options.sliderHeight==="number"?true:false;g.vars.autoHeight=g.options.sliderHeight==="auto"?true:false;g.vars.inPause=true;g.vars.inAnimation=true;g.vars.mouseClicked=false;if(g.options.pauseTime!==0){g.vars.countdown=Math.round(g.options.pauseTime/50);g.vars.countMax=Math.round(g.options.pauseTime/50)}else{g.vars.countdown=-1;g.vars.countMax=-1}if(!g.vars.autoHeight){e.css({height:g.options.sliderHeight})}g.setSliderVars();g.preloadSlider()},setSliderVars:function(){g.vars.sliderWidth=g.vars.ifWNumber?g.options.sliderWidth+"px":g.options.sliderWidth;g.vars.sliderHeight=g.vars.ifHNumber?g.options.sliderHeight+"px":g.options.sliderHeight;g.vars.slides=g.el.find(">li");g.vars.sl_count=g.vars.slides.length;g.vars.first_sl=g.vars.slides.first();g.vars.last_sl=g.vars.slides.eq(g.vars.sl_count-1)},preloadSlider:function(){var b=g.vars.slides.find("img:eq(0)"),c=b.length;if(b.length>0){b.each(function(){var b=new Image,d=a(this).attr("src");b.src=d;a(this).addClass("cmsms_img");var e=setInterval(function(){if(isImageOk(b)||isImageOk(b)==="stop"){clearInterval(e);c-=1;if(c===0){g.buildSlider();g.buildControls();g.attachEvents();g.afterSliderLoad()}}},50)})}else{g.buildSlider();g.buildControls();g.attachEvents();g.afterSliderLoad()}},buildSlider:function(){g.vars.slides.addClass("cmsmsContentSlide").css({left:g.vars.sliderWidth});if(g.options.activeSlide==="random"){g.vars.active_sl_numb=parseInt(Math.random()*g.vars.sl_count)}g.el.css({background:"none"});e.css({width:g.vars.sliderWidth,padding:0,opacity:0});if(g.vars.autoHeight){g.vars.slides.css({height:"auto"});g.setSlideHeight(g.vars.slides.eq(g.vars.active_sl_numb),false)}g.vars.slides.eq(g.vars.active_sl_numb).css({left:0,zIndex:2}).addClass("active");e.animate({opacity:1},g.options.animationSpeed/2,g.options.animationEasing);g.vars.inPause=false;g.vars.inAnimation=false},buildControls:function(){if(g.options.slidesNavigation){e.append('<ul class="cmsms_slides_nav" />');g.vars.slidesNav=e.find("ul.cmsms_slides_nav");if(g.options.slidesNavigationHover){g.vars.slidesNav.css({opacity:0})}for(var a=0;a<g.vars.sl_count;a+=1){g.vars.slidesNav.append('<li><a href="#">'+(a+1)+"</a></li>")}g.vars.slidesNav.find(">li").eq(g.vars.active_sl_numb).addClass("active");g.vars.slidesNavButton=g.vars.slidesNav.find(">li>a")}if(g.options.arrowNavigation){e.parent().prepend('<a href="#" class="cmsms_content_prev_slide"><span /></a>'+'<a href="#" class="cmsms_content_next_slide"><span /></a>');g.vars.prevSlideButton=e.parent().find(".cmsms_content_prev_slide");g.vars.nextSlideButton=e.parent().find(".cmsms_content_next_slide");if(g.options.arrowNavigationHover){g.vars.prevSlideButton.css({left:"-100px",opacity:0});g.vars.nextSlideButton.css({right:"-100px",opacity:0})}}},attachEvents:function(){if(g.options.touchControls){g.vars.slides.bind("mousedown",function(a){g.mouseDoun(a);return false});g.vars.slides.bind("mousemove",function(a){g.mouseMove(a);return false});g.vars.slides.bind("mouseup",function(){g.mouseUp();return false});e.bind("mouseleave",function(){if(!g.vars.mouseClicked){return}g.mouseUp();return false})}if(g.options.arrowNavigation){g.vars.nextSlideButton.bind("click",function(){g.nextSlide();return false});g.vars.prevSlideButton.bind("click",function(){g.prevSlide();return false})}if(g.options.slidesNavigation){g.vars.slidesNavButton.bind("click",function(){if(a(this).parent().is(".active")){return false}else{g.slideChoose(a(this).parent().index())}return false})}if(g.options.pauseOnHover){e.bind("mouseenter",function(){g.vars.inPause=true}).bind("mouseleave",function(){g.vars.inPause=false})}if(g.options.slidesNavigation&&g.options.slidesNavigationHover){e.bind("mouseenter",function(){g.vars.slidesNav.css({opacity:1})}).bind("mouseleave",function(){g.vars.slidesNav.css({opacity:0})})}if(g.options.arrowNavigation&&g.options.arrowNavigationHover){e.bind("mouseenter",function(){g.vars.prevSlideButton.stop().animate({left:"10px",opacity:1},g.options.animationSpeed,g.options.animationEasing);g.vars.nextSlideButton.stop().animate({right:"10px",opacity:1},g.options.animationSpeed,g.options.animationEasing)}).bind("mouseleave",function(){g.vars.prevSlideButton.stop().animate({left:"-100px",opacity:0},g.options.animationSpeed,g.options.animationEasing);g.vars.nextSlideButton.stop().animate({right:"-100px",opacity:0},g.options.animationSpeed,g.options.animationEasing)})}if(g.vars.autoHeight){a(window).bind("resize",function(){if(g.vars.active_sl===undefined){g.getSlVars()}g.setSlideHeight(g.vars.active_sl,false)})}f=setInterval(function(){g.timerController()},50)},getSlVars:function(){g.vars.active_sl=g.el.find(">li.active")},setSlideHeight:function(a,b){if(b){e.animate({height:a[0].scrollHeight+"px"},g.options.animationSpeed,g.options.animationEasing)}else{e.css({height:a[0].scrollHeight+"px"})}},navActiveSl:function(a,b){g.vars.slidesNav.find(">li").eq(a.index()).removeClass("active");g.vars.slidesNav.find(">li").eq(b.index()).addClass("active")},setTimer:function(){g.vars.inPause=false;if(g.options.pauseTime!==0){g.vars.countdown=Math.round(g.options.pauseTime/50);g.vars.countMax=Math.round(g.options.pauseTime/50)}else{g.vars.countdown=-1;g.vars.countMax=-1}},nextSlide:function(){if(g.vars.inAnimation||g.vars.sl_count<2){return false}else{g.vars.inAnimation=true}g.getSlVars();g.setTimer();g.beforeSlideChange();g.vars.oldSlide=g.vars.active_sl;g.vars.newSlide=g.vars.active_sl.index()<g.vars.sl_count-1?g.vars.active_sl.next():g.vars.first_sl;if(g.options.slidesNavigation){g.navActiveSl(g.vars.oldSlide,g.vars.newSlide)}if(g.vars.autoHeight){g.setSlideHeight(g.vars.newSlide,true)}if(g.options.animationEffect==="slide"){g.vars.oldSlide.removeClass("active").animate({left:"-"+g.vars.sliderWidth},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({left:g.vars.sliderWidth,zIndex:1})});g.vars.newSlide.addClass("active").css({zIndex:3}).animate({left:g.vars.ifWNumber?0:"0%"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:2});g.vars.inAnimation=false;g.afterSlideChange()})}else if(g.options.animationEffect==="fade"){g.fadeSlide(g.vars.oldSlide,g.vars.newSlide,true)}},prevSlide:function(){if(g.vars.inAnimation||g.vars.sl_count<2){return false}else{g.vars.inAnimation=true}g.getSlVars();g.setTimer();g.beforeSlideChange();g.vars.oldSlide=g.vars.active_sl;g.vars.newSlide=g.vars.active_sl.index()>0?g.vars.active_sl.prev():g.vars.last_sl;if(g.options.slidesNavigation){g.navActiveSl(g.vars.oldSlide,g.vars.newSlide)}if(g.vars.autoHeight){g.setSlideHeight(g.vars.newSlide,true)}if(g.options.animationEffect==="slide"){g.vars.oldSlide.removeClass("active").animate({left:g.vars.sliderWidth},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:1})});g.vars.newSlide.addClass("active").css({left:"-"+g.vars.sliderWidth,zIndex:3}).animate({left:g.vars.ifWNumber?0:"0%"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:2});g.vars.inAnimation=false;g.afterSlideChange()})}else if(g.options.animationEffect==="fade"){g.fadeSlide(g.vars.oldSlide,g.vars.newSlide,false)}},slideChoose:function(b){if(g.vars.inAnimation){return false}else{g.vars.inAnimation=true}g.getSlVars();g.setTimer();g.beforeSlideChange();g.vars.oldSlide=g.vars.active_sl;g.vars.newSlide=g.vars.slides.eq(b);if(g.options.slidesNavigation){g.navActiveSl(g.vars.oldSlide,g.vars.newSlide)}if(g.vars.autoHeight){g.setSlideHeight(g.vars.newSlide,true)}if(g.vars.active_sl.index()<g.vars.newSlide.index()){if(g.options.animationEffect==="slide"){g.vars.oldSlide.removeClass("active").animate({left:"-"+g.vars.sliderWidth},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({left:g.vars.sliderWidth,zIndex:1})});g.vars.newSlide.addClass("active").css({zIndex:3}).animate({left:g.vars.ifWNumber?0:"0%"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:2});g.vars.inAnimation=false;g.afterSlideChange()})}else if(g.options.animationEffect==="fade"){g.fadeSlide(g.vars.oldSlide,g.vars.newSlide,true)}}else{if(g.options.animationEffect==="slide"){g.vars.oldSlide.removeClass("active").animate({left:g.vars.sliderWidth},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:1})});g.vars.newSlide.addClass("active").css({left:"-"+g.vars.sliderWidth,zIndex:3}).animate({left:g.vars.ifWNumber?0:"0%"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:2});g.vars.inAnimation=false;g.afterSlideChange()})}else if(g.options.animationEffect==="fade"){g.fadeSlide(g.vars.oldSlide,g.vars.newSlide,false)}}},fadeSlide:function(b,c,d){c.css({left:0});if(d){b.removeClass("active").animate({left:"-"+g.vars.sliderWidth,opacity:0},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({left:g.vars.sliderWidth,opacity:1,zIndex:1});c.addClass("active").css({zIndex:2});g.vars.inAnimation=false;g.afterSlideChange()})}else{b.removeClass("active").animate({left:g.vars.sliderWidth,opacity:0},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({opacity:1,zIndex:1});c.addClass("active").css({zIndex:2});g.vars.inAnimation=false;g.afterSlideChange()})}},mouseDoun:function(a){if(g.vars.inAnimation||g.vars.pj_count<2){return false}else{g.vars.inAnimation=true;g.vars.inPause=true;g.vars.mouseClicked=true;g.vars.startPosX=a.clientX;g.vars.xIndex=0;if(!g.vars.ifWNumber){g.vars.sliderPxWidth=e.width()}else{g.vars.sliderPxWidth=g.options.sliderWidth}g.getSlVars();g.vars.next_sl=g.vars.active_sl.index()!==g.vars.sl_count-1?g.vars.active_sl.next():g.vars.first_sl;g.vars.prev_sl=g.vars.active_sl.index()!==0?g.vars.active_sl.prev():g.vars.last_sl}},mouseMove:function(a){if(!g.vars.mouseClicked){return}g.vars.finishPosX=a.clientX;g.vars.xIndex=Math.round(g.vars.finishPosX-g.vars.startPosX);if(g.options.animationEffect==="slide"){g.vars.active_sl.css({left:g.vars.xIndex+"px"})}else if(g.options.animationEffect==="fade"){g.vars.active_sl.css({left:g.vars.xIndex+"px",opacity:1-(Math.abs(g.vars.xIndex)/Math.round(g.vars.sliderPxWidth*.75)).toFixed(2)})}if(g.vars.xIndex<0){if(g.options.animationEffect==="slide"){g.vars.next_sl.css({left:g.vars.sliderPxWidth+g.vars.xIndex+"px",zIndex:3})}else if(g.options.animationEffect==="fade"){if(g.vars.prevTouch){g.vars.prevTouch=false;g.vars.touchTarget.css({left:g.vars.sliderPxWidth+"px"})}if(!g.vars.nextTouch){g.vars.nextTouch=true}if(g.vars.active_sl.index()!==g.vars.sl_count-1){g.vars.touchTarget=g.vars.active_sl.next()}else{g.vars.touchTarget=g.vars.first_sl}g.vars.touchTarget.css({left:0})}}else if(g.vars.xIndex>0){if(g.options.animationEffect==="slide"){g.vars.prev_sl.css({left:-g.vars.sliderPxWidth+g.vars.xIndex+"px",zIndex:3})}else if(g.options.animationEffect==="fade"){if(g.vars.nextTouch){g.vars.nextTouch=false;g.vars.touchTarget.css({left:g.vars.sliderPxWidth+"px"})}if(!g.vars.prevTouch){g.vars.prevTouch=true}if(g.vars.active_sl.index()!==0){g.vars.touchTarget=g.vars.active_sl.prev()}else{g.vars.touchTarget=g.vars.last_sl}g.vars.touchTarget.css({left:0})}}},mouseUp:function(){if(!g.vars.mouseClicked){return}g.vars.mouseClicked=false;if(g.vars.xIndex<0){if(g.vars.xIndex<-75){g.beforeSlideChange();if(g.options.slidesNavigation){g.navActiveSl(g.vars.active_sl,g.vars.next_sl)}if(g.vars.autoHeight){g.setSlideHeight(g.vars.next_sl,true)}if(g.options.animationEffect==="slide"){if(g.vars.sl_count>2){g.vars.prev_sl.css({left:g.vars.sliderPxWidth+"px",zIndex:1})}g.vars.active_sl.removeClass("active").animate({left:"-"+g.vars.sliderPxWidth+"px"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({left:g.vars.sliderPxWidth+"px",zIndex:1})});g.vars.next_sl.addClass("active").animate({left:0},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:2});g.vars.inAnimation=false;g.setTimer();g.afterSlideChange()})}else if(g.options.animationEffect==="fade"){if(g.vars.sl_count>2){g.vars.prev_sl.css({left:g.vars.sliderPxWidth+"px",opacity:1,zIndex:1})}g.vars.active_sl.removeClass("active").animate({left:"-"+g.vars.sliderPxWidth+"px"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({left:g.vars.sliderPxWidth+"px",opacity:1,zIndex:1});g.vars.next_sl.addClass("active").css({zIndex:2});g.vars.inAnimation=false;g.setTimer();g.afterSlideChange()})}}else{if(g.options.animationEffect==="slide"){if(g.vars.sl_count>2){g.vars.prev_sl.css({left:g.vars.sliderPxWidth+"px",zIndex:1})}g.vars.active_sl.animate({left:0},g.options.animationSpeed,g.options.animationEasing);g.vars.next_sl.animate({left:g.vars.sliderPxWidth+"px"},g.options.animationSpeed,g.options.animationEasing,function(){g.vars.inAnimation=false;g.vars.inPause=false})}else if(g.options.animationEffect==="fade"){if(g.vars.sl_count>2){g.vars.prev_sl.css({left:g.vars.sliderPxWidth+"px",opacity:1,zIndex:1})}g.vars.active_sl.animate({left:0,opacity:1},g.options.animationSpeed,g.options.animationEasing,function(){g.vars.next_sl.css({left:g.vars.sliderPxWidth+"px"});g.vars.inAnimation=false;g.vars.inPause=false})}}}else if(g.vars.xIndex>=0){if(g.vars.xIndex>75){g.beforeSlideChange();if(g.options.slidesNavigation){g.navActiveSl(g.vars.active_sl,g.vars.prev_sl)}if(g.vars.autoHeight){g.setSlideHeight(g.vars.prev_sl,true)}if(g.options.animationEffect==="slide"){if(g.vars.sl_count>2){g.vars.next_sl.css({left:g.vars.sliderPxWidth+"px",zIndex:1})}g.vars.active_sl.removeClass("active").animate({left:g.vars.sliderPxWidth+"px"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:1})});g.vars.prev_sl.addClass("active").animate({left:0},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({zIndex:2});g.vars.inAnimation=false;g.setTimer();g.afterSlideChange()})}else if(g.options.animationEffect==="fade"){if(g.vars.sl_count>2){g.vars.next_sl.css({left:g.vars.sliderPxWidth+"px",opacity:1,zIndex:1})}g.vars.active_sl.removeClass("active").animate({left:g.vars.sliderPxWidth+"px"},g.options.animationSpeed,g.options.animationEasing,function(){a(this).css({opacity:1,zIndex:1});g.vars.prev_sl.addClass("active").css({zIndex:2});g.vars.inAnimation=false;g.setTimer();g.afterSlideChange()})}}else{if(g.options.animationEffect==="slide"){if(g.vars.sl_count>2){g.vars.next_sl.css({left:g.vars.sliderPxWidth+"px",zIndex:1})}if(g.vars.xIndex!==0){g.vars.active_sl.animate({left:0},g.options.animationSpeed,g.options.animationEasing);g.vars.prev_sl.animate({left:"-"+g.vars.sliderPxWidth+"px"},g.options.animationSpeed,g.options.animationEasing,function(){g.vars.inAnimation=false;g.vars.inPause=false})}else{g.vars.inAnimation=false;g.vars.inPause=false}}else if(g.options.animationEffect==="fade"){if(g.vars.sl_count>2){g.vars.next_sl.css({left:g.vars.sliderPxWidth+"px",opacity:1,zIndex:1})}if(g.vars.xIndex!==0){g.vars.active_sl.animate({left:0,opacity:1},g.options.animationSpeed,g.options.animationEasing,function(){g.vars.prev_sl.css({left:g.vars.sliderPxWidth+"px"});g.vars.inAnimation=false;g.vars.inPause=false})}else{g.vars.inAnimation=false;g.vars.inPause=false}}}}},timerController:function(){if(g.vars.inPause||g.vars.countdown<0){return}if(g.vars.countdown===0){g.nextSlide()}g.vars.countdown-=1},afterSliderLoad:function(){g.options.afterSliderLoad()},beforeSlideChange:function(){g.options.beforeSlideChange()},afterSlideChange:function(){g.options.afterSlideChange()}};g.init()}})(jQuery);



/* UItoTop jQuery Plugin 1.2 | Matt Varone | http://www.mattvarone.com/web-design/uitotop-jquery-plugin */
(function($){$.fn.UItoTop=function(options){var defaults={text:'To Top',min:200,inDelay:600,outDelay:400,containerID:'toTop',containerHoverID:'toTopHover',scrollSpeed:1200,easingType:'linear'},settings=$.extend(defaults,options),containerIDhash='#'+settings.containerID,containerHoverIDHash='#'+settings.containerHoverID;$('body').append('<a href="#" id="'+settings.containerID+'">'+settings.text+'</a>');$(containerIDhash).hide().on('click.UItoTop',function(){$('html, body').animate({scrollTop:0},settings.scrollSpeed,settings.easingType);$('#'+settings.containerHoverID,this).stop().animate({'opacity':0},settings.inDelay,settings.easingType);return false;}).prepend('<span id="'+settings.containerHoverID+'"></span>').hover(function(){$(containerHoverIDHash,this).stop().animate({'opacity':1},600,'linear');},function(){$(containerHoverIDHash,this).stop().animate({'opacity':0},700,'linear');});$(window).scroll(function(){var sd=$(window).scrollTop();if(typeof document.body.style.maxHeight==="undefined"){$(containerIDhash).css({'position':'absolute','top':sd+$(window).height()-50});}
if(sd>settings.min)
$(containerIDhash).fadeIn(settings.inDelay);else
$(containerIDhash).fadeOut(settings.Outdelay);});};})(jQuery);

jQuery(document).ready(function() {
	/* Scroll to top */
	jQuery().UItoTop({ 
		containerID: 'slide_top',
		containerHoverID : 'slide_top_hover', 
		easingType: 'easeOutQuart' 
	});					
});



/* Social Icons Script */
(function($){$.fn.socicons=function(c){var d={icons:'digg,stumbleupon,delicious,facebook,yahoo',imagesurl:'images/',imageformat:'png',light:true,targetblank:true,shorturl:''};var e=$.extend({},d,c);var f=this;var g=e.targetblank?'target="_blank"':'';var h=e.icons.split(',');for(key in h){var j=h[key];var k=socformat[h[key]];if(k!=undefined){k=k.replace('{TITLE}',urlencode(socicons_title()));k=k.replace('{URL}',urlencode(socicons_url()));k=k.replace('{SHORTURL}',urlencode(socicons_shorturl()));k=k.replace('{KEYWORDS}',urlencode(socicons_metawords()));k=k.replace('{DESCRIPTION}',urlencode(socicons_metadescript()));var l='<a '+g+' href="'+k+'" class="socicons_icon" title="'+j+'"><img src="'+e.imagesurl+j+'.'+e.imageformat+'" alt="'+j+'" /></a>';this.append(l)}}if(e.light){this.find('.socicons_icon').bind('mouseover',function(){$(this).siblings().stop().animate({'opacity':0.3},500)});this.find('.socicons_icon').bind('mouseout',function(){$(this).siblings().stop().animate({'opacity':1},500)})}var m;function socicons_metawords(){if(n==undefined){metaCollection=document.getElementsByTagName('meta');for(i=0;i<metaCollection.length;i++){nameAttribute=metaCollection[i].name.search(/keywords/);if(nameAttribute!=-1){m=metaCollection[i].content;return m}}}else{return m}}var n;function socicons_metadescript(){if(n==undefined){metaCollection=document.getElementsByTagName('meta');for(i=0;i<metaCollection.length;i++){nameAttribute=metaCollection[i].name.search(/description/);if(nameAttribute!=-1){n=metaCollection[i].content;return n}}}else{return n}}function socicons_title(){return document.title}function socicons_url(){var a=document.location.href;return a}function socicons_shorturl(){if(e.shorturl==''){return socicons_url()}else{return e.shorturl}}function urlencode(a){if(a==undefined){return''}return a.replace(/\s/g,'%20').replace('+','%2B').replace('/%20/g','+').replace('*','%2A').replace('/','%2F').replace('@','%40')}function light(a,b){if(b){a.style.opacity=1;a.childNodes[0].style.filter='progid:DXImageTransform.Microsoft.Alpha(opacity=100);'}else{a.style.opacity=light_opacity/100;a.style.filter='alpha(opacity=20)';a.childNodes[0].style.filter='progid:DXImageTransform.Microsoft.Alpha(opacity='+light_opacity+');'}}return this}})(jQuery);

var socformat = Array();

socformat['nujij'] = 'http://nujij.nl/jij.lynkx?t={TITLE}&u={URL}&b={DESCRIPTION}'
socformat['ekudos'] = 'http://www.ekudos.nl/artikel/nieuw?url={URL}&title={TITLE}&desc={DESCRIPTION}';
socformat['digg'] = 'http://digg.com/submit?phase=2&url={URL}&title={TITLE}';
socformat['linkedin'] = 'http://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&summary={DESCRIPTION}&source=';
socformat['sphere'] = 'http://www.sphere.com/search?q=sphereit:{URL}';
socformat['technorati'] = 'http://www.technorati.com/faves?add={URL}';
socformat['delicious'] = 'http://del.icio.us/post?url={URL}&title={TITLE}';
socformat['furl'] = 'http://furl.net/storeIt.jsp?u={URL}&t={TITLE}';
socformat['netscape'] = 'http://www.netscape.com/submit/?U={URL}&T={TITLE}';
socformat['yahoo'] = 'http://myweb2.search.yahoo.com/myresults/bookmarklet?u={URL}&t={TITLE}';
socformat['google'] = 'http://www.google.com/bookmarks/mark?op=edit&bkmk={URL}&title={TITLE}';
socformat['newsvine'] = 'http://www.newsvine.com/_wine/save?u={URL}&h={TITLE}';
socformat['reddit'] = 'http://reddit.com/submit?url={URL}&title={TITLE}';
socformat['blogmarks'] = 'http://blogmarks.net/my/new.php?mini=1&url={URL}&title={TITLE}';
socformat['magnolia'] = 'http://ma.gnolia.com/bookmarklet/add?url={URL}&title={TITLE}';
socformat['live'] = 'https://favorites.live.com/quickadd.aspx?marklet=1&mkt=en-us&url={URL}&title={TITLE}&top=1';
socformat['tailrank'] = 'http://tailrank.com/share/?link_href={URL}&title={TITLE}';
socformat['facebook'] = 'http://www.facebook.com/share.php?u={URL}';
socformat['twitter'] = 'http://twitter.com/?status={TITLE}%20-%20{SHORTURL}';
socformat['stumbleupon'] = 'http://www.stumbleupon.com/submit?url={URL}&title={TITLE}';
socformat['bligg'] = 'http://www.bligg.nl/submit.php?url={URL}';
socformat['symbaloo'] = 'http://www.symbaloo.com/en/add/url={URL}&title={TITLE}';
socformat['misterwong'] = 'http://www.mister-wong.com/add_url/?bm_url={URL}&bm_title={TITLE}&bm_comment=&bm_tags={KEYWORDS}';
socformat['buzz']	= 'http://www.google.com/reader/link?url={URL}&title={TITLE}&snippet={DESCRIPTION}&srcURL={URL}&srcTitle={TITLE}';
socformat['myspace'] = 'http://www.myspace.com/Modules/PostTo/Pages/?u={URL}';
socformat['mail']	= 'mailto:to@email.com?SUBJECT={TITLE}&BODY={DESCRIPTION}-{URL}';
socformat['googleplus']	= 'https://m.google.com/app/plus/x/?v=compose&content={TITLE}-{URL}';

jQuery(document).ready(function() { 
	/* Social Icons Run */
	(function ($) { 
		$('.cmsms_social').socicons( { 
			icons : 'nujij,linkedin,ekudos,digg,sphere,technorati,delicious,furl,netscape,yahoo,google,newsvine,reddit,blogmarks,magnolia,live,tailrank,facebook,twitter,stumbleupon,bligg,symbaloo,misterwong,mail,googleplus', 
			imagesurl : 'images/share_icons/' 
		} );
	} )(jQuery);
	
	
	
	/* Navigation Drop */
	$(window).scroll(function () { 
		var sT = $(window).scrollTop();
		
		if (sT > 220) { 
			if ($('.nav_wrap_inner').addClass('navi_scrolled').is(':animated')) {
				return false;
			} else {
				$('.nav_wrap_inner').addClass('navi_scrolled').animate( { 
					top : 0,
					opacity : 1 
				}, 500);
			}
		} else { 
			$('.nav_wrap_inner').removeClass('navi_scrolled').stop().attr( { style : '' } );
		}
	} );
	
	
	
	/* Social Icons Toggle */
	(function ($) { 
		$('a.cmsms_share').toggle(function () { 
			$(this).parent().find('.cmsms_social').show('slow');
			
			return false;
		} , function () { 
			$(this).parent().find('.cmsms_social').hide('slow');
			
			return false;
		} );
	} )(jQuery);
	
	
	
	/* PrettyPhoto Lighbox */
	(function ($) { 
		$('a[rel^="prettyPhoto"]').prettyPhoto( { 
			animation_speed : 'slow', 
			show_title : false, 
			deeplinking : false, 
			social_tools : '' 
		} );
	} )(jQuery);
	
	
	
	/* Mobile Devices Navigation Script */
	(function ($) { 
		$('a.resp_navigation').bind('click', function () { 
			if ($(this).hasClass('active')) {
				$('#navigation').slideUp('fast');
				
				$('#navigation ul').css( { display : 'none' } );
				$(this).removeClass('active');
			} else {
				$('#navigation').slideDown('fast');
				
				$(this).addClass('active');
			}
			
			return false;
		} );
		
		$('#navigation li a').bind('click', function () { 
			if ($('a.resp_navigation').is(':visible')) {
				if ($(this).next().is('ul')) {
					if ($(this).next().is(':visible')) {
						$(this).next().slideUp('fast');
						
						$(this).next().find('ul').css( { display : 'none' } );
					} else {
						$(this).parent().parent().find('ul').slideUp('fast');
						$(this).next().slideDown('fast');
					}
					
					return false;
				}
			}
		} );
		
		$(window).bind('resize', function () { 
			if ($(this).width() > 540) {
				$('a.resp_navigation').removeClass('active');
				
				$('#navigation').removeAttr('style');
				$('#navigation ul').removeAttr('style');
			}
		} );
	} )(jQuery);
	
	
	
	/* Popular, Latest and Related Posts */
	(function ($) { 
		$('.related_posts ul li a').click(function (e) { 
			var rposts = $(this).parent().parent().parent(), 
				index = $(this).parent().index();
			
			rposts.find('ul').find('a').removeClass('current');
			$(this).addClass('current');
			
			rposts.find('div.related_posts_content').not('div.related_posts_content:eq(' + index + ')').slideUp();
			rposts.find('div.related_posts_content:eq(' + index + ')').slideDown();
			
			e.preventDefault();
		} );
	} )(jQuery);
	
	
	
	/* Toggle */
	(function ($) { 
		$('.togg a.tog').click(function (i) { 
			var dropDown = $(this).parent().find('.tab_content');
			
			$(this).parent().find('.tab_content').not(dropDown).slideUp();
			
			if ($(this).hasClass('current')) { 
				$(this).removeClass('current');
			} else { 
				$(this).addClass('current');
			}
			
			dropDown.stop(false, true).slideToggle().css( { display : 'block' } );
			
			i.preventDefault();
		} );
	} )(jQuery);
	
	
	
	/* Accordion */
	(function ($) { 
		$('.accordion a.tog').click(function (j) { 
			var dropDown = $(this).parent().find('.tab_content');
			
			$(this).parent().parent().find('.tab_content').not(dropDown).slideUp();
			
			if ($(this).hasClass('current')) { 
				$(this).removeClass('current');
			} else { 
				$(this).parent().parent().find('.tog').removeClass('current');
				$(this).addClass('current');
			}
			
			dropDown.stop(false, true).slideToggle().css( { display : 'block' } );
			
			j.preventDefault();
		} );
	} )(jQuery);
	
	
	
	/* Tabs */
	(function ($) { 
		$('.tab ul.tabs li:first-child a').addClass('current');
		$('.tab .tab_content div.tabs_tab:first-child').show();
		
		$('.tab ul.tabs li a').click(function (g) { 
			var tab = $(this).parent().parent().parent(), 
				index = $(this).parent().index();
			
			tab.find('ul.tabs').find('a').removeClass('current');
			$(this).addClass('current');
			
			tab.find('.tab_content').find('div.tabs_tab').not('div.tabs_tab:eq(' + index + ')').slideUp();
			tab.find('.tab_content').find('div.tabs_tab:eq(' + index + ')').slideDown();
			
			g.preventDefault();
		} );
	} )(jQuery);
	
	
	
	/* Tour */
	(function ($) { 
		$('.tour_content ul.tour li:first-child').addClass('current');
		$('.tour_content div.tour_box:first').show();
		
		$('.tour_content ul.tour li a').click(function (f) { 
			var tour = $(this).parent().parent().parent().parent(), 
				index = $('ul.tour li').index($(this).parent());
			
			tour.find('ul.tour').find('li').removeClass('current');
			$(this).parent().addClass('current');
			
			tour.find('div.tour_box').not('div.tour_box:eq(' + index + ')').slideUp();
			tour.find('div.tour_box:eq(' + index + ')').slideDown();
			
			f.preventDefault();
		} );
	} )(jQuery);
	
	
	
	/* Image Preloader */
	(function ($) { 
		var images = jQuery('.preloader img'), 
			max = images.length, 
			img = new Image(), 
			curr = 1;
		
		jQuery('.preloader').each(function () { 
			jQuery('<span class="image_container_img" />').prependTo(jQuery(this));
		} );
		
		images.remove();
		
		if (max > 0) { 
			loadImage(0, max);
		} else if ($('#middle .pj_sort').find('.p_options_block').html() !== null) { 
			loadSorting();
		}
		
		function loadImage(index, max) { 
			if (index < max) { 
				$('<span id="img' + (index + 1) + '" class="p_img_container" />').each(function () { 
					$(this).prependTo($('.preloader .image_container_img').eq(index));
				} );
				
				var img = new Image(), 
					curr = $('#img' + (index + 1));
				
				$(img).load(function () { 
					$(curr).append(this).append('<span class="image_rollover"><span></span></span>');
					
					$(this).parent().parent().parent().css( { backgroundImage : 'none' } );
					
					$(this).animate( { opacity : 1 }, 500, 'easeInOutExpo', function () { 
						if ($(this).parent().parent().parent().hasClass('inBlog')) { 
							$(this).parent().parent().parent().css( { 
								height : 'auto', 
								padding : 0 
							} );
						}
					} );
					
					if (index !== (max - 1)) { 
						loadImage(index + 1, max);
					}
				} ).error(function () { 
					$(curr).remove();
					
					loadImage((index + 1), max);
				} ).attr( { 
					src : $(images[index]).attr('src'), 
					title : $(images[index]).attr('title'), 
					alt : $(images[index]).attr('alt') 
				} ).addClass($(images[index]).attr('class'));
				
				if (index === (max - 1) && $('#middle .pj_sort').find('.p_options_block').html() !== null) {
					loadSorting();
				}
			}
		}
		
		function loadSorting() { 
			if ($.browser.msie && $.browser.version < 9) { 
				$('.p_options_loader').css( { display : 'none' } );
				$('.p_options_block').css( { display : 'block' } );
			} else { 
				$('.p_options_loader').fadeOut(200, function () { 
					$(this).css( { display : 'none' } );
				} );
				
				$('.p_options_block').fadeIn(200);
			}
		}
	} )(jQuery);
} );



/* Correct OS & Browser Check */
var ua = navigator.userAgent, 
	checker = { 
		os : { 
			iphone : ua.match(/iPhone/), 
			ipod : ua.match(/iPod/), 
			ipad : ua.match(/iPad/), 
			blackberry : ua.match(/BlackBerry/), 
			android : ua.match(/(Android|Linux armv6l|Linux armv7l)/), 
			linux : ua.match(/Linux/), 
			win : ua.match(/Windows/), 
			mac : ua.match(/Macintosh/) 
		}, 
		ua : { 
			ie : ua.match(/MSIE/), 
			ie6 : ua.match(/MSIE 6.0/), 
			ie7 : ua.match(/MSIE 7.0/), 
			ie8 : ua.match(/MSIE 8.0/), 
			ie9 : ua.match(/MSIE 9.0/), 
			ie10 : ua.match(/MSIE 10.0/), 
			opera : ua.match(/Opera/), 
			firefox : ua.match(/Firefox/), 
			chrome : ua.match(/Chrome/), 
			safari : ua.match(/(Safari|BlackBerry)/) 
		} 
	};



/* Correct Image Load Check */
function isImageOk(img) { 
	if (!img.complete) { 
		return false;
	}
	
	if (typeof img.naturalWidth !== undefined && img.naturalWidth === 0) { 
		return 'stop';
	}
	
	return true;
}



/* Convert Touch Events to Mouse Events Function */
function touchHandler(e) { 
    var first = e.changedTouches[0], 
        type = '', 
		simulatedEvent = undefined;
	
	switch (e.type) { 
        case 'touchstart': 
			type = 'mousedown';
			
			break;
        case 'touchmove': 
			type = 'mousemove';
			
			break;
        case 'touchend': 
			type = 'mouseup';
			
			break;
        case 'touchcancel': 
			type = 'mouseleave';
			
			break;
        default: 
			return;
    }
	
    simulatedEvent = document.createEvent('MouseEvent');
    simulatedEvent.initMouseEvent( 
		type, 
		true, 
		true, 
		window, 
		1, 
		first.screenX, 
		first.screenY, 
		first.clientX, 
		first.clientY, 
		false, 
		false, 
		false, 
		false, 
		0, 
		null 
	);
	
	first.target.dispatchEvent(simulatedEvent);
	
	e.preventDefault();
}


/* Sliders Touch Events Convert Run */
(function ($) { 
	if (!checker.ua.ie6 && !checker.ua.ie7 && !checker.ua.ie8) { 
		document.addEventListener('touchstart', function (e) { 
			if ( 
				$(e.changedTouches[0].target).is('img.cmsms_img') || 
				$(e.changedTouches[0].target).is('ul.responsiveSlider > li') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_pattern') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_video') || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) 
			) { 
				touchHandler(e);
			}
		}, true);
		
		document.addEventListener('touchmove', function (e) { 
			if ( 
				$(e.changedTouches[0].target).is('img.cmsms_img') || 
				$(e.changedTouches[0].target).is('ul.responsiveSlider > li') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_pattern') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_video') || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) 
			) { 
				touchHandler(e);
			}
		}, true);
		
		document.addEventListener('touchend', function (e) { 
			if ( 
				$(e.changedTouches[0].target).is('img.cmsms_img') || 
				$(e.changedTouches[0].target).is('ul.responsiveSlider > li') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_pattern') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_video') || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) 
			) { 
				touchHandler(e);
			}
		}, true);
		
		document.addEventListener('touchcancel', function (e) { 
			if ( 
				$(e.changedTouches[0].target).is('img.cmsms_img') || 
				$(e.changedTouches[0].target).is('ul.responsiveSlider > li') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_pattern') || 
				$(e.changedTouches[0].target).is('div.cmsms_img_video') || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('ul.responsiveSlider > li')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) || 
				($(e.changedTouches[0].target).is(':not(a)') && $(e.changedTouches[0].target).parent().parent().parent().parent().parent().is('li.cmsmsContentSlide.active')) 
			) { 
				touchHandler(e);
			}
		}, true);
	}
} )(jQuery);



(function ($) { 
	if (checker.os.iphone || checker.os.ipod || checker.os.ipad || checker.os.blackberry || checker.os.android) { 
		$('body').addClass('touch_dev'); 
	}
} )(jQuery);

