/* Portfolio Sorting */

jQuery(document).ready(function () { 
	(function ($) { 
		var container = $('section.portfolio_container');
		
		container.isotope( { 
			itemSelector : 'article.portfolio', 
			layoutMode : 'fitRows', 
			resizable : false, 
			getSortData : { 
				p_name : function (el) { 
					return el.find('.entry-title>a').text();
				}, 
				p_date : function (el) { 
					return parseInt(el.find('.meta-date').text());
				} 
			} 
		} );
		
		$('.pj_sort .p_filter a').click(function () { 
			var selector = $(this).attr('data-filter'), 
				text = $(this).text(), 
				filter_el = $(this).parent().parent().parent().find('.p_cat_filter');
			
			$(this).parent().parent().find('>li.current').removeClass('current');
			$(this).parent().addClass('current');
			
			filter_el.attr( { 
				title : text, 
				'data-filter' : selector 
			} ).find('>span>span').text(text);
			
			container.isotope( { filter : selector } );
			
			return false;
		} );
		
		$('.pj_sort .p_sort a').click(function () { 
			var type = $(this).attr('name'), 
				asc = (type === 'p_name') ? true : false, 
				current = ($(this).hasClass('current')) ? true : false, 
				reversed = ($(this).hasClass('reversed')) ? true : false;
			
			if (current) { 
				if (reversed) { 
					$(this).removeClass('reversed');
					
					asc = true;
				} else { 
					$(this).addClass('reversed');
					
					asc = false;
				}
			} else { 
				$(this).parent().find('.current').removeClass('current');
				$(this).parent().find('.reversed').removeClass('reversed');
				
				if (type === 'p_name') { 
					$(this).addClass('current');
				} else { 
					$(this).addClass('current reversed');
				}
			}
			
			container.isotope( { 
				sortBy : type, 
				sortAscending : asc 
			} );
			
			return false;
		} );
		
		$(window).smartresize(function () { 
			var postWidth = container.width();
			
			if (container.hasClass('four_blocks')) { 
				postWidth = container.width() / 4;
			} else if (container.hasClass('three_blocks')) { 
				postWidth = container.width() / 3;
			} else if (container.hasClass('two_blocks')) { 
				postWidth = container.width() / 2;
			}
			
			container.isotope( { 
				fitRows : { columnWidth : postWidth } 
			} );
		} );
	} )(jQuery);
} );
