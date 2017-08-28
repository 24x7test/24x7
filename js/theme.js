(function($){"use strict";var debounce=function(func,threshold,execAsap){var timeout;return function debounced(){var obj=this,args=arguments;function delayed(){if(!execAsap)func.apply(obj,args);timeout=null;};if(timeout)clearTimeout(timeout);else if(execAsap)func.apply(obj,args);timeout=setTimeout(delayed,threshold||100);};};$.fn['smartresize']=function(fn){return fn?this.bind('resize',debounce(fn)):this.trigger('smartresize');};}).call(this,jQuery);(function($){"use strict";function MenuCollapse(element){this.element=$(element);this.menuItems=$('.menu-item-has-children > a',this.element);this.menuItems.after($('<span class="toggler" />'));this.element.on('click','> .navigator-toggle',this.toggle.bind(this));this.element.on('click','.menu-item-has-children > .toggler',this.toggleItem.bind(this));};MenuCollapse.prototype={toggle:function(e){e.preventDefault();this.element.toggleClass('active');},toggleItem:function(e){e.preventDefault();$(e.target).closest('li').toggleClass('active');}};$.fn.menuCollapse=function(){return this.each(function(){$(this).data('_menuCollapse',new MenuCollapse(this));});};}).call(this,jQuery);(function($){"use strict";var win=$(window);var _defaults={position:'relative',additionOffset:0,updatePosition:function(){}};var StickyHeader=function(element,options){this.nav=$(element);this.options=$.extend(_defaults,options);if($.isFunction(this.options.updatePosition))this.nav.on('updatePosition',this.options.updatePosition.bind(this));this.doStick=function(){var offsetTop=win.scrollTop();this.navOriginOffset=this.nav.data('origin-offset');if(this.navOriginOffset===undefined){this.navOriginOffset=this.nav.offset();this.nav.data('origin-offset',this.navOriginOffset);}var additionOffset=$.isFunction(this.options.additionOffset)?this.options.additionOffset.call(this):parseInt(this.options.additionOffset);if($.isNumeric(additionOffset)&&additionOffset>0){offsetTop=offsetTop+additionOffset;}if(offsetTop>this.navOriginOffset.top){this.nav.addClass('stick');this.nav.trigger('updatePosition',{offsetTop:offsetTop});}else{this.nav.removeClass('stick');this.nav.removeAttr('style');}}
win.on('load scroll resize',this.doStick.bind(this));};$.fn['stickyHeader']=function(options){return this.each(function(){$(this).data('_stickyHeader',new StickyHeader(this,options));});};}).call(this,jQuery);(function($){"use strict";var doc=$(document);function NavSearch(element){this.element=$(element);this.toggler=$('> a:first-child',this.element);this.input=$('input',this.element);doc.on('click',this.hide.bind(this));this.toggler.on('click',this.toggle.bind(this));this.element.on('click',function(e){e.stopPropagation();});this.element.on('keydown',(function(e){if(e.keyCode==27)this.hide();}).bind(this));$.each(['transitionend','oTransitionEnd','webkitTransitionEnd'],(function(index,eventName){$('> .submenu',this.element).on(eventName,(function(){if(this.element.hasClass('active'))this.input.get(0).focus();}).bind(this));}).bind(this));};NavSearch.prototype={toggle:function(e){e.preventDefault();e.stopPropagation();this.element.toggleClass('active');},hide:function(){this.element.removeClass('active');}};$.fn.navSearch=function(options){return this.each(function(){$(this).data('_navSearch',new NavSearch(this,options));});};}).call(this,jQuery);(function($){"use strict";function MasonryLayout(element){this.container=$(element);this.gridContainer=$('.content-inner',element);this.columnCount=2;if($('body').hasClass('blog-three-columns'))this.columnCount=3;if($('body').hasClass('blog-four-columns'))this.columnCount=4;if($('body').hasClass('blog-five-columns'))this.columnCount=5;this.container.on('content-appended',(function(e,data){data.items.imagesLoaded((function(){var frames=data.items.find('iframe');var frameLoaded=0;frames.on('load',(function(){frameLoaded++;if(frameLoaded==frames.length){this.gridContainer.masonry('layout');}}).bind(this));data.items.css('visibility','visible');this.resizeColumns();this.gridContainer.masonry('appended',data.items);}).bind(this));}).bind(this));$(window).on('load',(function(){this.container.imagesLoaded((function(){this.resizeColumns();this.gridContainer.masonry({itemSelector:'.hentry'});}).bind(this));}).bind(this));$(window).smartresize(this.update.bind(this));};MasonryLayout.prototype={resizeColumns:function(){this.gridContainer.removeAttr('style');this.gridContainer.css('position','relative');var containerWidth=this.gridContainer.width(),extraWidth=containerWidth%this.columnCount,columnWidth=Math.round(containerWidth/this.columnCount);$('.hentry',this.gridContainer).css('width',columnWidth);$('.hentry:nth-child('+this.columnCount+')',this.gridContainer).css('width',columnWidth-extraWidth);this.gridContainer.css('width',containerWidth+10);},update:function(){this.resizeColumns();this.gridContainer.masonry('layout');}}
$.fn.masonryLayout=function(options){return this.each(function(){$(this).data('_masonryLayout',new MasonryLayout(this,options));});};}).call(this,jQuery);(function($){"use strict";var _defaults={duration:500,easing:'swing',offset:0,complete:function(){}};function ContentReveal(element,options){this.root=$(element);this.opts=$.extend(_defaults,options);if(element.hash.length>1){var target=$(element.hash);if(target.length>0){this.target=target;this.root.on('click',this.reveal.bind(this));}}};ContentReveal.prototype={reveal:function(evt){evt.preventDefault();$("html, body").animate({scrollTop:this.target.offset().top-this.opts.offset},500,(function(evt){if($.isFunction(this.opts.complete))this.opts.complete.call(this,evt);}).bind(this));}};$.fn.contentReveal=function(options){return this.each(function(){$(this).data('_contentReveal',new ContentReveal(this,options));});}}).call(this,jQuery);(function($){"use strict";var _defaults={},_win=$(window),_doc=$(document);var _targets={};function NavigatorSpy(element,options){this.root=$(element);this.opts=$.extend(_defaults,options);this.collectTargets();this.root.on('_navigatorSpy.targetVisible',this.visible.bind(this));_win.on('scroll',this.update.bind(this));_win.on('resize',this.update.bind(this));_win.on('load',this.update.bind(this));};NavigatorSpy.prototype={update:function(evt){var self=this;$.each(_targets,function(){var offset=this.offset(),scrollTop=_win.scrollTop()+self.opts.offset;offset.bottom=offset.top+this.height()+self.opts.offset;offset.right=offset.left+this.width();if(offset.top<scrollTop&&offset.bottom>scrollTop){self.root.trigger('_navigatorSpy.targetVisible',{target:this});}});},visible:function(evt,data){$('.current-menu-item',this.root).removeClass('current-menu-item');$('a[data-target="'+data.target.attr('id')+'"]',this.root).closest('li').addClass('current-menu-item');},collectTargets:function(){$('a',this.root).each(function(){if(this.href.indexOf(window.location.toString())!==false&&this.hash!=''){var target=$(this.hash),targetId=this.hash.substring(1);if(target.length>0){if(_targets[targetId]===undefined)_targets[targetId]=target;$(this).attr('data-target',targetId);}}});}};$.fn.navigatorSpy=function(options){return this.each(function(){$(this).data('_navigatorSpy',new NavigatorSpy(this,options));});}}).call(this,jQuery);(function($){"use strict";var _defaults={paginator:'',container:'body',infiniteScroll:false,success:function(){}};function Pagination(element,options){this.opts=$.extend(_defaults,options);this.root=$(this.opts.paginator);this.container=$(this.opts.container);this.isLoading=false;this.addEvents();};Pagination.prototype={addEvents:function(){var self=this;this.root.on('click','a',function(e){e.preventDefault();self.loadContent(this.href);});},loadContent:function(url){if(this.isLoading==false){this.isLoading=true;this.root.addClass('loading');$.get(url,(function(response){this.articles=$(this.opts.container,response).children();this.paginator=$(this.opts.paginator,response);var isotope=this.container.data('isotope'),masonry=this.container.data('masonry');if(isotope||masonry){this.articles.css({position:'absolute',visibility:'hidden',opacity:0});this.container.append(this.articles);this.container.imagesLoaded((function(){if(isotope){this.container.isotope('once','layoutComplete',(function(){this.articles.css({visibility:'visible',opacity:1,});this.success();}).bind(this));this.container.isotope('appended',this.articles);this.container.isotope('layout');}else{}this.container.trigger('content-appended',{'items':this.articles});}).bind(this));return;}this.container.append(this.articles);this.success();}).bind(this));}},success:function(){this.root.replaceWith(this.paginator);this.opts.success();this.root=$(this.opts.paginator);this.addEvents();this.isLoading=false;}};$.fn.pagination=function(options){return this.each(function(){$(this).data('_pagination',new Pagination(this,options));});}}).call(this,jQuery);(function($){"use strict";$.fn['projects']=function(){return this.each(function(index,container){$('> .projects-wrap > .projects-items',container).imagesLoaded(function(){$('> .projects-wrap > .projects-items',container).isotope({layoutMode:'packery',itemSelector:'.project',percentPosition:true});$('> .projects-wrap > .projects-filter li[data-filter] a',container).on('click',function(e){e.preventDefault();$('> .projects-wrap > .projects-filter li',container).removeClass('active');$('> .projects-wrap > .projects-items',container).isotope({filter:$(this).parent().attr('data-filter')});$(this).parent().addClass('active');});});});};})(jQuery);(function($){"use strict";var win=$(window);var StickyContent=function(container,options){this.container=$(container);this.options=$.extend({item:'.sticky-content',additionOffset:0},options);this.content=$(this.options.item,container);this.update=function(){var winScrollTop=win.scrollTop(),winScrollBottom=win.scrollTop()+win.height();var containerOffset=this.container.offset(),contentOffset=this.content.offset();containerOffset.bottom=containerOffset.top+this.container.height();contentOffset.bottom=contentOffset.top+this.content.height();if($.isFunction(this.options.additionOffset))winScrollTop+=this.options.additionOffset.call(this);else if($.isNumeric(this.options.additionOffset))winScrollTop+=this.options.additionOffset;this.container.css('position','relative');this.content.css('position','relative');if(this.content.height()<win.height()){var top=winScrollTop-containerOffset.top,maxTop=this.container.height()-this.content.height();if(top>maxTop)top=this.container.height()-this.content.height();else if(top<0)top=0;this.content.css('top',top);}else{if(winScrollBottom>contentOffset.bottom&&winScrollBottom<containerOffset.bottom)this.content.css('top',winScrollBottom-containerOffset.top-this.content.height());else if(winScrollTop<contentOffset.top&&winScrollTop>containerOffset.top)this.content.css('top',winScrollTop-containerOffset.top);else if(winScrollBottom>containerOffset.bottom)this.content.css('top',this.container.height()-this.content.height());else if(winScrollTop<containerOffset.top)this.content.css('top',0);}};win.on('load resize scroll',this.update.bind(this));};$.fn['sticky_content']=function(options){return this.each(function(index,container){if($(container).data('_stickyContentInstance')===undefined)$(container).data('_stickyContentInstance',new StickyContent(container,options));});};})(jQuery);(function($){"use strict";var _initComponents=function(container){if($.fn.fitVids)$('.fitVids',container).fitVids();if($.fn.flexslider){$('.flexslider:not(.wpb_flexslider)',container).each(function(){var slider=$(this),config={animation:'slide',smoothHeight:true};try{config=$.extend(config,JSON.parse('{'+slider.attr('data-slider-config')+'}'));}catch(e){}slider.imagesLoaded(function(){slider.flexslider(config);});});}$('[data-lightbox="nivoLightbox"]',container).nivoLightbox();$('.projects:not(.projects-justified,.projects-carousel)').projects();$('.projects.projects-justified > .projects-wrap > .projects-items').imagesLoaded(function(){$('.projects.projects-justified > .projects-wrap > .projects-items').flexImages({container:'.project',object:'img',rowHeight:360});});$('.project-single.project-content-left.project-content-sticky,\
			.project-single.project-content-right.project-content-sticky').sticky_content({item:'.project-content',additionOffset:function(){return $('#wpadminbar').height()+$('#site-navigator.stick').height()+20;}});};$(function(){var body=$('body');if(_themeConfig.stickyHeader){if(body.hasClass('header-v2')){$('#site-navigator').stickyHeader({position:'fixed',additionOffset:$('#wpadminbar').height()||0});}else{$('#masthead').stickyHeader({updatePosition:function(e,data){this.nav.css({position:'relative',top:data.offsetTop-this.navOriginOffset.top});},additionOffset:$('#wpadminbar').height()||0});}}if(_themeConfig.responsiveMenu){$('.navigator-mobile').menuCollapse();}if(_themeConfig.offCanvas){$(document).on('click','.navigator .off-canvas-toggle > a, .navigator-mobile .off-canvas-toggle > a',function(e){e.preventDefault();$('body').toggleClass('off-canvas-active');});$(document).on('click','#site-off-canvas .close',function(e){e.preventDefault();$('body').removeClass('off-canvas-active');});}if(body.hasClass('blog-masonry')){$('.main-content-wrap').masonryLayout();}if(_themeConfig.onepageNavigator){$('#site-header').imagesLoaded(function(){$('#site-header .navigator a, #site-header .navigator-mobile a').contentReveal({offset:$('#wpadminbar').outerHeight()+$('#site-navigator').outerHeight(),complete:function(evt){$(window).trigger('scroll');}});$('#site-header .navigator, #site-header .navigator-mobile').navigatorSpy({offset:$('#site-navigator').outerHeight()+$('#wpadminbar').outerHeight()+50});});}if(_themeConfig.pagingStyle=='loadmore'){$('.navigation.paging-navigation.loadmore').pagination({paginator:_themeConfig.pagingNavigator,container:_themeConfig.pagingContainer,infiniteScroll:false,success:function(){_initComponents($('#main-content > .main-content-wrap > .content-inner'));}});}$('a.content-reveal').contentReveal();$('.navigator .search-box').navSearch();_initComponents(body);});$(function(){var gotop=$('.goto-top');$('body').imagesLoaded(function(){$.stellar({horizontalScrolling:false});$('body').removeClass('page-loading');});$(document).on('woocommerce-cart-changed',function(e,data){if(parseInt(data.items_count)>0){$('.shopping-cart-items-count').text(data.items_count).removeClass('no-items');}else{$('.shopping-cart-items-count').empty().addClass('no-items');}});$('a',gotop).on('click',function(e){e.preventDefault();$('html, body').animate({scrollTop:0});});$(window).on('scroll',function(){if($(window).scrollTop()>0)$('.goto-top').addClass('active');else
$('.goto-top').removeClass('active');}).on('load',function(){$(window).trigger('scroll');});});}).call(this,jQuery);