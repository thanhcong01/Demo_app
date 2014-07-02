if (typeof oneall === 'undefined') {
	throw new Error('[ONEALL SOCIAL API] The base library has not been found');
}

/* Setup URIs */
oneall.user_settings = oneall.user_settings || {};

/* Bookmark URI */
oneall.user_settings.get_sharing_bookmark_uri = function () {
	return 'http://snip2code.api.oneall.com/socialize/sharing/bookmark/';
};

/* Counters URI */
oneall.user_settings.get_sharing_counters_uri = function () {
	return 'http://snip2code.api.oneall.com/socialize/sharing/counters.js';
};


/* ===================================================== */
/* ONEALL SHARING API */
/* ===================================================== */
var oa_social_sharing = function () {

	/* Counter instance */
	this.counter = function (id, key, num_times_used, num_times_used_next){
		this.id = id;
		this.key = key;
		this.num_times_used = (typeof num_times_used !== 'undefined' ? num_times_used : 0);
		this.num_times_used_next = (typeof num_times_used_next !== 'undefined' ? num_times_used_next : (parseInt(this.num_times_used, 10) + 1));
	};
	
	/* Update counter */
	this.update_counters = function (page_url, counters) {	
		var j, k, l, m, target_url, container_element, container_elements, button_element, button_elements, txt_element, txt_elements, counter;
		
		page_url = page_url.replace(/\s+|\/+$/,"");
		container_elements = oneall.tools.get_elements_by_class_name('oas_box');
		if (typeof container_elements === 'object' && container_elements.length > 0) {
			for (j = 0; j < container_elements.length; j = j + 1) {		
				container_element = container_elements[j];				
				if (container_element.getAttribute('data-processed') !== '1'){
					
					target_url = container_element.getAttribute('data-url');					
					target_url = target_url.replace(/\s+|\/+$/,"");
					
					if (target_url === page_url){				
						for (k = 0; k < counters.length; k = k + 1){							
							counter = counters[k];				
							button_elements = oneall.tools.get_elements_by_class_name('oas_btn_' + counter.key, container_element);		
								if (typeof button_elements === 'object' && button_elements.length > 0) {
									for (m = 0; m < button_elements.length; m = m + 1) {
										button_element = button_elements[m];													
										txt_elements = oneall.tools.get_elements_by_class_name('oas_btn_count_txt', button_element);
										for (l = 0; l < txt_elements.length; l = l + 1) {
											txt_element = txt_elements[l];							
											txt_element.innerHTML = counter.num_times_used;
											txt_element.setAttribute('data-next-count', counter.num_times_used_next);
										}
								}							
							}
						}
						container_element.setAttribute('data-processed', 1);
					}								
				}
			}
		}
	};
	
	/* Sharing method list */
	this.sharing_methods = function () {
		this.list = [];
	};
		
	/* Sharing method instance */
	this.sharing_method = function (id, type, name, name_button, name_key) {
		this.id = id;
		this.type = type;
		this.name = name;
		this.name_button = name_button;
		this.name_key = name_key;
	};		

	/* Sharing method list \ Get method by key */
	this.sharing_methods.get_method_by_name_key = function (name_key) {
		var i;
		for (i = 0; i < this.list.length; i = i + 1){
			if (this.list[i].name_key.toLowerCase() === name_key.toLowerCase()){
				return this.list[i];
			}
		}
		return false;
	};	

	/* Setup the current page */
	this.setup = function () {
		var  i, j, k, tmp, metas, theme_keys, saring_images, sharing_url, sharing_url_is_default, sharing_title, sharing_title_is_default, sharing_summary, sharing_options, sharing_method, json_style, html_style, html_query, tag, expr, i, j,k, button_element, button_element_id, button_elements, container_element, container_classes, container_elements, container_name, container_names;

		/* BuildIn Themes */
		theme_keys = ['btns_s', 'btns_m', 'btns_l', 'count_v', 'count_h'];
		
		/* Check if we a OneAll sharing box */
		container_elements = oneall.tools.get_elements_by_class_name('oas_box');			
			
		/* Class benath the oas_box classes */
		container_classes = [];
		
		/* Read meta tags */		
		
		/*
		var metas = document.getElementsByTagName('meta'); 

	   for (i=0; i<metas.length; i++) { 
	      if (metas[i].getAttribute("property") == "og:title") { 
	         return metas[i].getAttribute("content"); 
	      } 
	   } 
		*/
		
		
		/* Yes we have a least one */
		if (typeof container_elements === 'object' && container_elements.length > 0) {										
			
			/* Add base stylesheet */
			oneall.tools.include_file('http://public.oneallcdn.com/css/api/socialize/sharing/v1/base.css', 'css', true);	
				
			/* Loop through oneall sharing boxes */
			for (j = 0; j < container_elements.length; j = j + 1) {
					
				/* Get one box */
				container_element = container_elements[j];	
				
				/* Build a list of found classes */
				container_classes = container_classes.concat(container_element.className.split(/\s+/));
				
				/* Extract the container name */
				container_name = '';				
				
				/* Loop trough themes and compare with container classes */
				k = 0;				
				while (k < theme_keys.length && container_name.length == 0){
					i = 0;
					while (i < container_classes.length && container_name.length == 0){							
						if ('oas_box_' + theme_keys[k] == container_classes[i]){
							container_name = theme_keys[k];
						}						
						i = i + 1;
					}					
					k = k + 1;
				}		
								
				/* Title */				
				tmp = container_element.getAttribute('data-title');
				if (typeof tmp === 'string' && tmp.length > 0){
					sharing_title = tmp;
					sharing_title_is_default = false;
				} else {
					sharing_title = document.title;
					sharing_title_is_default = true;											
					container_element.setAttribute('data-title', sharing_title);	
				} 
				
				/* Link */ 
				tmp = container_element.getAttribute('data-url');		
				if (typeof tmp === 'string' && tmp.length > 0){
					sharing_url = tmp;
					sharing_url_is_default = false;					
				} else {
					sharing_url = document.URL;
					sharing_url_is_default = true;						
					container_element.setAttribute('data-url', sharing_url);	
				} 
																	
				/* Summary */ 
				tmp = container_element.getAttribute('data-summary');							
				if (typeof tmp === 'string'){
					sharing_summary = tmp;				
				} else {
					sharing_summary = '';
				}
					
				/* Images */ 
				tmp = container_element.getAttribute('data-images');							
				if (typeof tmp === 'string'){
					sharing_images = tmp;				
				} else {
					sharing_images = '';
				}
				
					
				/* Options */
				sharing_options = container_element.getAttribute('data-opt');		

				/* Check if container has nested buttons */					
				button_elements = oneall.tools.get_elements_by_class_name('oas_btn', container_element);	
				
				/* Yes, the contain has nested buttons */
				if (typeof button_elements === 'object' && button_elements.length > 0) {
					
					/* Add script to update counters */
					if (container_name === 'count_v' || container_name === 'count_h'){
						/* r is to force the browser to reload the counters on each page */
						oneall.tools.include_file(oneall.user_settings.get_sharing_counters_uri() + '?page_url=' + encodeURIComponent(sharing_url) + '&r='+  (Math.floor ( Math.random ( ) * 10000 + 10001)), 'js', true);
					}

					/* Loop through nested buttons */
					for (k = 0; k < button_elements.length; k = k + 1) {
						
						/* Get the buttons elements */
						button_element = button_elements[k];			
						button_element_id = 'oa_bpk_' + (Math.floor ( Math.random ( ) * 1000 + 1));
							
												
						/* Extract Custom Button Properties (Per default they are providers by the parent container) */
						
						/* Title */
						tmp = button_element.getAttribute('data-title');						
						if (typeof tmp === 'string'){
							sharing_title = tmp;
							sharing_title_is_default = false;
						}
							
						/* Link */ 
						tmp = button_element.getAttribute('data-url');							
						if (typeof tmp === 'string'){
							sharing_url = tmp;
							sharing_url_is_default = false;
						}
												
						/* Summary */ 
						tmp = button_element.getAttribute('data-summary');							
						if (typeof tmp === 'string'){
							sharing_summary = tmp;				
						} 
							
						/* Image */ 
						tmp = button_element.getAttribute('data-images');							
						if (typeof tmp === 'string'){
							sharing_images = tmp;				
						} 							
						
						/* Extract sharing method key */
						expr = button_element.className.match(/oas_btn_([a-z_]+)/i);
						
						if ((expr instanceof Array) && (expr.length === 2)) {

							/* Load sharing method */
							sharing_method = this.sharing_methods.get_method_by_name_key (expr[1]);
							if (sharing_method !== false){										
								switch (sharing_method.name_key)
								{
									case 'facebook_like_but':
							
										/* HTML Style */
										html_style = "border:none;overflow:hidden;"; 
											
										/* HTML Query */
										html_query = 'font=arial&show_faces=false&width=90&action=like';
											
										/* Add URL - Facebook always needs this tags */
										html_query += '&href=' + encodeURIComponent(sharing_url);											
							
										switch (container_name){
											case 'btns_s':			
												html_query += '&layout=button_count';
												html_style += 'height:16px;width:80px;';
												break;

											case 'btns_m':
												html_query += '&layout=button_count';
													html_style += 'height:22px;width:80px;';
													break;

												case 'btns_l':
													html_query += '&layout=button_count';
													html_style += 'height:32px;width:80px;';
													break;

												case 'count_h':
													html_query += '&layout=button_count';
													html_style += 'height:22px;width:80px';
													break;

												case 'count_v':
													html_query += '&layout=box_count';
													html_style += 'height:65px;width:50px';
													break;																
											}

											button_element.innerHTML = '<iframe src="//www.facebook.com/plugins/like.php?'+html_query+'" scrolling="no" frameborder="0" style="'+html_style+'" allowTransparency="true"></iframe>';
											break;

										case 'twitter_tweet_but':
																
											/* HTML Container */
											html_style = '';
											
											/* Add URL */
											if (sharing_url_is_default === false){
												html_style += ' data-url="' + sharing_url + '"';
											}

											/* Add Title */
											if (sharing_title_is_default === false){
												html_style += ' data-text="' + sharing_title + '"';
											}
											
											switch (container_name){
												case 'btns_s':			
													html_style += ' data-size="small" data-count="none"';
													break;

												case 'btns_m':
													html_style += ' data-size="medium" data-count="none"';
													break;

												case 'btns_l':
													html_style += ' data-size="large" data-count="none"';
													break;

												case 'count_h':
													html_style += ' data-count="horizontal"';
													break;

												case 'count_v':
													html_style += ' data-count="vertical"';
													break;																					
											}

											button_element.innerHTML = '<a href="https://twitter.com/share" class="twitter-share-button"'+html_style+'>Tweet</a>';
											
											if (typeof twttr !== 'undefined') {
												twttr.widgets.load();
											} else {												
												oneall.tools.include_file('//platform.twitter.com/widgets.js', 'js');
											}
											
											break;

										case 'google_plus_one_but':										
											html_style = '';
											json_style = {};
											
											/* Add URL */
											if (sharing_url_is_default === false){
												html_style += ' data-href="' + sharing_url + '"';
												json_style.href = sharing_url;
											}										
											
											switch (container_name){
												case 'btns_s':
													html_style += ' data-size="small" data-annotation="none"';
													json_style.size = 'small';
													json_style.annotation = 'none';
													break;

												case 'btns_m':
													html_style += ' data-size="medium" data-annotation="none"';		
													json_style.size = 'medium';
													json_style.annotation = 'none';
													break;

												case 'btns_l':
													html_style += ' data-annotation="none"';
													json_style.annotation = 'none';
													break;

												case 'count_h':
													html_style += ' data-size="medium"';
													json_style.size = 'medium';
													break; 

												case 'count_v':
													html_style += ' data-size="tall"';
													json_style.size = 'tall';
													break;														
											}

											
											button_element.innerHTML = '<div id="' + button_element_id + '" class="g-plusone"' + html_style + '></div>';
																										
											if (typeof gapi !== 'undefined') {
												 gapi.plusone.render(button_element_id, json_style);
											} else {												
												oneall.tools.include_file('//apis.google.com/js/plusone.js', 'js', true);
											}											
											
											break;

										case 'vkontakte_share_but':											
											oneall.tools.include_file('//vk.com/js/api/share.js', 'js', true);
											
											switch (container_name){
												case 'btns_s':
													html_style = 'round_nocount';
													break;

												case 'btns_m':
													html_style = 'round_nocount';
													break;

												case 'btns_l':
													html_style = 'round_nocount';
													break;

												case 'count_h':
													html_style = 'round';
													break;

												case 'count_v':
													html_style = 'round_nocount';
													break;														
											}
											
											
											var id = 'vk_' +(Math.floor ( Math.random ( ) * 1000 + 1));
											var container = document.createElement('div');
											container.setAttribute('id', id);											
											
											button_element.appendChild(container);
												
												
											function wait_for_vkontakte(){
											  if(typeof VK == "undefined"){											 
											    window.setTimeout(wait_for_vkontakte,150);
											  }
											  else{									
											  	document.getElementById(id).innerHTML = VK.Share.button(false,{'type': html_style, 'text': "Share"});
											  }
											}
											wait_for_vkontakte();
							
											
											break;
											
										case 'linkedin_share_but':	
																						
											/* HTML Style */
											html_style = '';
											
											/* Add URL */
											if (sharing_url_is_default === false){
												html_style += ' data-url="' + sharing_url + '"';
											}

											switch (container_name){
												case 'count_h':
													html_style += 'data-counter="right"';
													break;

												case 'count_v':
													html_style += 'data-counter="top"';
													break;																						
											}

											button_element.innerHTML = '<script type="IN/Share"' + html_style + '></script>';		
											
											if (typeof (IN) != 'undefined') {
												IN.parse();
											} else {
												oneall.tools.include_file('//platform.linkedin.com/in.js', 'js', true);
											}											
											
											break;

										default:

											switch (container_name){
												case 'btns_s':
													button_element.innerHTML = '<span class="oas_btn_ico"></span>';
													break;

												case 'btns_m':
													button_element.innerHTML = '<span class="oas_btn_ico"></span>';
													break;

												case 'btns_l':
													button_element.innerHTML = '<span class="oas_btn_ico"></span>';
													break;

												case 'count_h':
													button_element.innerHTML = '<span class="oas_btn_brd"><span class="oas_btn_ico"></span><span class="oas_btn_txt">'+sharing_method.name_button+'</span></span><span class="oas_btn_count"><span class="oas_btn_count_txt">0</span></span>';
													break;

												case 'count_v':
													button_element.innerHTML = '<span class="oas_btn_count"><span class="oas_btn_count_txt">0</span></span><span class="oas_btn_brd"><span class="oas_btn_ico"></span><span class="oas_btn_txt">'+sharing_method.name_button+'</span></span>';	
													break;

												default:
													tag = '';
												break;												
											}																				
										

										// Add OnClick Event
										button_element.onclick = (function(service, url, title, summary, images, options) {
											return function() {

												/* Update Counter */
												button_elements = oneall.tools.get_elements_by_class_name('oas_btn_count_txt', this);
												for (k = 0; k < button_elements.length; k = k + 1) {
													button_element = button_elements[k];							
													button_element.innerHTML = button_element.getAttribute('data-next-count');
												}

												/* Show bookmark url */
												if (service == 'email') {
													 window.location.href = "mailto:?subject=" + title + "&body=" + summary;													
												} else {
													var uri = oneall.user_settings.get_sharing_bookmark_uri() + "?share_with=" + service + "&page_url=" + encodeURIComponent(url) + "&page_images=" + encodeURIComponent(images) + "&page_summary=" + encodeURIComponent(summary) + "&page_title=" + encodeURIComponent(title) + "&options=" + encodeURIComponent(options);
													window.open(uri, "_blank");
												}
											};
										}(sharing_method.name_key, sharing_url, sharing_title, sharing_summary, sharing_images, sharing_options));

										break;
									}
								}
							}
						}
					}
				}					
			
				/* Loop through classes */
				for (i = 0; i < container_classes.length; i = i + 1) {					
					/* Loop through build in themes */
					for (j = 0; j < theme_keys.length; j = j + 1) {
						/* Check if a class corresponds to our themes */
						if (container_classes[i] == ('oas_box_' +  theme_keys[j])) {	
							oneall.tools.include_file('http://public.oneallcdn.com/css/api/socialize/sharing/v1/' + theme_keys[j] + '.css', 'css', true);
						}
					}					
				}			
			}
		
	};
};


(function () {	
	var social_sharing_plugin = new oa_social_sharing();	
	social_sharing_plugin.sharing_methods.list = [		new social_sharing_plugin.sharing_method(1, 'addon', 'Facebook Like Button', 'Facebook', 'facebook_like_but'),
		new social_sharing_plugin.sharing_method(3, 'service', 'Facebook', 'Facebook', 'facebook'),
		new social_sharing_plugin.sharing_method(4, 'service', 'Twitter', 'Twitter', 'twitter'),
		new social_sharing_plugin.sharing_method(6, 'service', 'LinkedIn', 'LinkedIn', 'linkedin'),
		new social_sharing_plugin.sharing_method(7, 'service', 'Google Bookmarks', 'Google', 'google_bookmarks'),
		new social_sharing_plugin.sharing_method(8, 'addon', 'Twitter Tweet Button', 'Twitter', 'twitter_tweet_but'),
		new social_sharing_plugin.sharing_method(9, 'addon', 'Google +1 Button', 'Google', 'google_plus_one_but'),
		new social_sharing_plugin.sharing_method(10, 'addon', 'LinkedIn Share Button', 'LinkedIn', 'linkedin_share_but'),
		new social_sharing_plugin.sharing_method(11, 'service', 'Delicious', 'Delicious', 'delicious'),
		new social_sharing_plugin.sharing_method(12, 'service', 'Digg', 'Digg', 'digg'),
		new social_sharing_plugin.sharing_method(14, 'service', 'StumbleUpon', 'StumbleUpon', 'stumbleupon'),
		new social_sharing_plugin.sharing_method(15, 'service', 'Reddit', 'Reddit', 'reddit'),
		new social_sharing_plugin.sharing_method(16, 'service', 'Tumblr', 'Tumblr', 'tumblr'),
		new social_sharing_plugin.sharing_method(18, 'service', 'VKontakte', 'В Контакте', 'vkontakte'),
		new social_sharing_plugin.sharing_method(20, 'addon', 'VKontakte Share Button', 'В Контакте', 'vkontakte_share_but'),
		new social_sharing_plugin.sharing_method(22, 'service', 'Pinterest', 'Pinterest', 'pinterest'),
		new social_sharing_plugin.sharing_method(24, 'service', 'Google Plus', 'Google', 'google_plus'),
		new social_sharing_plugin.sharing_method(26, 'service', 'Email', 'Email', 'email')];	
	social_sharing_plugin.setup();
}());