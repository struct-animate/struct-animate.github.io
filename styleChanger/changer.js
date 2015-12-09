/* Style Changer */


jQuery(document).ready(function(){

	/* Color Scheme */
	jQuery('#stlChanger .hdrStBgs .hdrCols span').click(function(){
		var hdrCol = jQuery(this).attr('title');
		
		jQuery('#stlChanger .hdrStBgs .hdrCols span').removeClass('current');
		jQuery(this).addClass('current');
		
		jQuery('#stlChanger').find('#cFontWColor1').css({backgroundColor:'#' + hdrCol});
			jQuery('#cFontStyleWColor1').text('a, .color_3,.post footer .published,.post .entry-title a:hover,.post.format-link .entry-title a,.cmsmsLike:hover span,.portfolio_inner .entry-title a:hover {color:#' + hdrCol + ';}');
			jQuery('#cFontStyleWColor2').text('.cmsmsLike:hover, .resp_navigation.active,.widget_custom_popular_portfolio_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li.active a, .widget_custom_popular_portfolio_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li:hover a,.widget_custom_testimonials_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li.active a, .widget_custom_testimonials_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li:hover a, .tp-bullets.simplebullets .bullet:hover, .tp-bullets.simplebullets .bullet.selected, #slide_top, ul.cmsms_slides_nav li.active a, ul.cmsms_slides_nav li:hover a, span.dropcap2, .tog:hover .cmsms_plus, .tog.current .cmsms_plus, .tour li.current .cmsms_plus, .tour li a:hover .cmsms_plus, .cmsms_comments, .wp-pagenavi > span.current, .wp-pagenavi a:hover, .portfolio_inner .hover_effect, a.cmsms_close_video:hover {background-color:#' + hdrCol + ';}');
			jQuery('#cFontStyleWColor3').text('input[type="text"]:focus, textarea:focus, select:focus, #bottom input:focus, #bottom textarea:focus, #bottom select:focus,.tabs > li a.current, .wp-pagenavi > span.current,.wp-pagenavi a:hover, .responsibe_block_inner {border-color:#' + hdrCol + ';}');
		return false;
	});
	
	/* Color Scheme */
	jQuery('#stlChanger #cFontWColor1').parent('a').ColorPicker({
		onChange:function(hsb, hex, rgb){
			jQuery('#stlChanger').find('#cFontWColor1').css({backgroundColor:'#' + hex});
			jQuery('#cFontStyleWColor1').text('a, .color_3,.post footer .published,.post .entry-title a:hover,.post.format-link .entry-title a,.cmsmsLike:hover span,.portfolio_inner .entry-title a:hover {color:#' + hex + ';}');
			jQuery('#cFontStyleWColor2').text('.cmsmsLike:hover, .resp_navigation.active,.widget_custom_popular_portfolio_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li.active a, .widget_custom_popular_portfolio_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li:hover a,.widget_custom_testimonials_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li.active a, .widget_custom_testimonials_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li:hover a, .tp-bullets.simplebullets .bullet:hover, .tp-bullets.simplebullets .bullet.selected, #slide_top, ul.cmsms_slides_nav li.active a, ul.cmsms_slides_nav li:hover a, span.dropcap2, .tog:hover .cmsms_plus, .tog.current .cmsms_plus, .tour li.current .cmsms_plus, .tour li a:hover .cmsms_plus, .cmsms_comments, .wp-pagenavi > span.current, .wp-pagenavi a:hover, .portfolio_inner .hover_effect, a.cmsms_close_video:hover {background-color:#' + hex + ';}');
			jQuery('#cFontStyleWColor3').text('input[type="text"]:focus, textarea:focus, select:focus, #bottom input:focus, #bottom textarea:focus, #bottom select:focus,.tabs > li a.current, .wp-pagenavi > span.current,.wp-pagenavi a:hover, .responsibe_block_inner {border-color:#' + hex + ';}');
		},
		onSubmit:function(hsb, hex, rgb, el){
			jQuery('#cFontStyleWColor1').text('a, .color_3,.post footer .published,.post .entry-title a:hover,.post.format-link .entry-title a,.cmsmsLike:hover span,.portfolio_inner .entry-title a:hover {color:#' + hex + ';}');
			jQuery('#cFontStyleWColor2').text('.cmsmsLike:hover, .resp_navigation.active,.widget_custom_popular_portfolio_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li.active a, .widget_custom_popular_portfolio_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li:hover a,.widget_custom_testimonials_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li.active a, .widget_custom_testimonials_entries .cmsms_content_slider_parent ul.cmsms_slides_nav li:hover a, .tp-bullets.simplebullets .bullet:hover, .tp-bullets.simplebullets .bullet.selected, #slide_top, ul.cmsms_slides_nav li.active a, ul.cmsms_slides_nav li:hover a, span.dropcap2, .tog:hover .cmsms_plus, .tog.current .cmsms_plus, .tour li.current .cmsms_plus, .tour li a:hover .cmsms_plus, .cmsms_comments, .wp-pagenavi > span.current, .wp-pagenavi a:hover, .portfolio_inner .hover_effect, a.cmsms_close_video:hover {background-color:#' + hex + ';}');
			jQuery('#cFontStyleWColor3').text('input[type="text"]:focus, textarea:focus, select:focus, #bottom input:focus, #bottom textarea:focus, #bottom select:focus,.tabs > li a.current, .wp-pagenavi > span.current,.wp-pagenavi a:hover, .responsibe_block_inner {border-color:#' + hex + ';}');
			jQuery(el).find('#cFontWColor1').css({backgroundColor:'#' + hex});
			jQuery(el).find('#cFontWColor1').attr({title:hex});
			jQuery(el).ColorPickerHide();
		},
		onBeforeShow:function(){
			jQuery(this).ColorPickerSetColor(jQuery('#stlChanger').find('#cFontWColor1').attr('title'));
		}
	});

	/* Background Color */
	jQuery('#stlChanger #cFontWColor4').parent('a').ColorPicker({
		onChange:function(hsb, hex, rgb){
			jQuery('body').removeAttr('style');
			jQuery('#stlChanger').find('#cFontWColor4').css({backgroundColor:'#' + hex});
			jQuery('#cFontStyleWColor4').text('body {background:#' + hex + ';}');
		},
		onSubmit:function(hsb, hex, rgb, el){
			jQuery('body').removeAttr('style');
			jQuery('#cFontStyleWColor4').text('body {background:#' + hex + ';}');
			jQuery(el).find('#cFontWColor4').css({background:'#' + hex});
			jQuery(el).find('#cFontWColor4').attr({title:hex});
			jQuery(el).ColorPickerHide();
		},
		onBeforeShow:function(){
			jQuery(this).ColorPickerSetColor(jQuery('#stlChanger').find('#cFontWColor4').attr('title'));
		}
	});

	
	if (jQuery(window).height() < 750){ jQuery('#stlChanger').css({position:'absolute'}); }

	
	/* Style Changer Autohide */
	jQuery('.chBut').parent().delay(1000).animate({left:'-120px'}, 500, function(){
		jQuery(this).find('.chBut').next('.chBody').css({display:'none'});
		jQuery(this).find('.chBut').addClass('closed');
	}); 
	
	
	/* Style Changer Toggle */
	jQuery('.chBut').click(function(){
		if (jQuery(this).hasClass('closed')){
			jQuery(this).next('.chBody').css({display:'block'}).parent().animate({left:0}, 500, function(){
				jQuery(this).find('.chBut').removeClass('closed');
			});
		} else {
			jQuery(this).parent().animate({left:'-120px'}, 500, function(){
				jQuery(this).find('.chBut').next('.chBody').css({display:'none'});
				jQuery(this).find('.chBut').addClass('closed');
			});
		}
		
		return false;
	});
	

	jQuery('#stlChanger .stBgs a').click(function(){
		var bgBgCol = jQuery(this).attr('href');
		jQuery('#stlChanger .stBgs a').removeClass('current');
		jQuery('body').css({backgroundColor:'#ffffff'});
		jQuery(this).addClass('current');
		jQuery('body').css({backgroundImage:'url(' + bgBgCol + ')'});
		if (jQuery(this).hasClass('bg_t')){
			jQuery('body').css({backgroundRepeat:'repeat-x', backgroundPosition:'50% 0', backgroundAttachment:'scroll'});
		} else {
			jQuery('body').css({backgroundRepeat:'repeat', backgroundPosition:'50% 0', backgroundAttachment:'fixed'});
		}
		return false;
	});
	
	
	/* Window Resize Function */
	jQuery(window).resize(function(){
		if (jQuery(window).height() < 750){
			jQuery('#stlChanger').css({position:'absolute'});
		} else {
			jQuery('#stlChanger').css({position:'fixed'});
		}
	});
	
});
