String.prototype.format=function(){for(var b=[],a=0;a<arguments.length-0;a++)b[a]=arguments[a+0];return this.replace(/{(\d+)}/g,function(c,a){return typeof b[a]!="undefined"?b[a]:c})};$.extend({getUrlVars:function(){for(var d={},a,c=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),b=0;b<c.length;b++){a=c[b].split("=");d[a[0]]=a[1]}return d},getUrlVar:function(a){return $.getUrlVars()[a]}});(function(a){a.fn.autoNumber=function(h){var c=a.extend({limit:25,regColor:"#208000",warnColor:"#f02020"},h),b=this,g=0;if(typeof b.val()!="undefined"&&b.val())g=parseInt(b.val().length);var d=b.attr("id")+"_counter",e=20;b.after('<span id="'+d+'" style="cursor:default; opacity:0.05; text-align:center; font-weight:bold; width:'+e+"px; height:"+e+"px; line-height:"+e+"px; display:inline-block; margin:2px 3px; font-size:11px; background-color:"+c.regColor+"; border-radius:"+e/2+'px; box-shadow:0px 0px 2px rgba(0,0,0,0.5); color:white;">&nbsp;</span>');a("#"+d).hide();function f(){var f=0;if(typeof b.val()!="undefined"&&b.val())f=parseInt(b.val().length);var e=a("#"+d);if(f>c.limit){e.attr("title","The length exceed the limit for this field");e.css("background-color",c.warnColor);e.css("opacity","0.8")}else{var g=.05+f/c.limit*.8;e.attr("title","You have "+(c.limit-f)+" char remaining ("+f+" of "+c.limit+")");e.css("background-color",c.regColor);e.css("opacity",g)}e.text(f)}b.keyup(f);b.blur(function(){a("#"+d).fadeOut(500)});b.focus(function(){f();a("#"+d).fadeIn(1e3)})}})(jQuery);function updateSpacer(){var d=52,a=0,b=$(".adsSection");if(b!=null&&typeof b!=undefined){a=b.height();if(a>0)a+=10}var c=$(window).height()-a-($(".body").height()+$(".header").height())-$(".footer").height()-d;c!=$("#spacer").height()&&$("#spacer").css("height",""+c+"px")}function getTransitionEvent(){var a,c=document.createElement("fakeelement"),b={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(a in b)if(c.style[a]!==undefined)return b[a]}function consoleLog(a){typeof console!="undefined"&&console&&console.log&&console.log(a)}function filterAlpha(a){if(a.keyCode==46||a.keyCode==8||a.keyCode==9||a.keyCode==27||a.keyCode==13||a.keyCode==65&&a.ctrlKey===true||a.keyCode>=35&&a.keyCode<=39)return;else(a.shiftKey||(a.keyCode<48||a.keyCode>57)&&(a.keyCode<96||a.keyCode>105))&&a.preventDefault()}String.prototype.hashCode=function(){var a=0;if(this.length==0)return a;_.each(this,function(b){a=(a<<5)-a+b.charCodeAt(0);a=a&a});return a};String.prototype.replaceAll=function(b,c,a){return this.replace(new RegExp(b.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,function(a){return"\\"+a}),"g"+(a?"i":"")),c)};String.prototype.selectorEscape=function(){return String(this)?String(this).replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,"\\$&"):""};String.prototype.htmlEscape=function(){return String(this)?jQuery("<div />").text(String(this)).html():""};String.prototype.htmlUnescape=function(){return String(this)?jQuery("<div />").html(String(this)).text():""};function cleanHTMLAttr(a){return a!=null?a.replace(/'/g,"&#39;"):""}function parseAjaxResp(b,a,j,i,h,g,f){var e=$(b).find("s2c\\:Status").text();if(!e||e.length==0)e=$(b).find("Status").text();if(e=="OK"){if(a){a.html(j);a.addClass(i);a.removeClass(h);a.removeClass("inputInvisible")}if(g){var d=$(b).find("s2c\\:Data").text();if(!d||d.length==0)d=$(b).find("Data").text();g(d)}return true}else{var c=$(b).find("s2c\\:Data").text();if(!c||c.length==0)c=$(b).find("Data").text();if(a){a.html(c);a.addClass(h);a.removeClass(i);a.removeClass("inputInvisible")}f&&f(c);return false}}function sendAjaxReq(h,g,b,i,e,f,d,c,a){$.ajax({url:h,type:"POST",data:g,dataType:"xml",cache:false}).done(function(g,h,f){parseAjaxResp(g,b,i,e,d,function(a){c&&c!=undefined&&c(a)},function(b){a&&a!=undefined&&a(f,b)})}).fail(function(c){if(b){b.html(f);b.addClass(d);b.removeClass(e);b.removeClass("inputInvisible")}a&&a!=undefined&&a(c,f)})}function sendGetAjaxReq(d,a,c,b){$.ajax({url:d,type:"GET",dataType:"json",cache:false,success:c,error:function(e,d,c){if(b)b(e,a+" - "+d,c);else a&&a.length>0&&alert(a)}})}function sendGetXMLAjaxReq(d,a,c,b){$.ajax({url:d,type:"GET",dataType:"xml",cache:false,success:c,error:function(e,d,c){if(b)b(e,a+" - "+d,c);else a&&a.length>0&&alert(a)}})}function sendGetHtmlReq(d,a,c,b){$.ajax({url:d,type:"GET",cache:false,success:c,error:function(e,d,c){if(b)b(e,a+" - "+d,c);else a&&a.length>0&&alert(a)}})}function sendPostAjaxReq(e,d,a,c,b){$.ajax({url:e,type:"POST",data:d,cache:false,success:c,error:function(e,d,c){if(b)b(e,d,c);else a&&a.length>0&&alert(a)}})}function deleteSnippet(b,a){var c="/Editor/Delete?snippetId="+b+"&fromPage=@fromPage";sendPostAjaxReq(c,null,"Cannot delete snippet",a,function(){alert("Cannot delete snippet")})}function shareSnippet(e,d,f,b,c){var a="/Explore/Share?snippetId="+e+"&toGroup="+d;if(c)a+="&unpublish=true";sendPostAjaxReq(a,null,"Cannot publish snippet",b,function(c,a){alert(a)})}function rateSnippet(b,c,d,a){getSnippetVote(b,function(f){if(f==c){a&&a(null,"Seems that you already voted this snippet!","");return}var e="/Explore/Vote?snippetId="+b+"&rating="+c;sendAjaxReq(e,null,null,"Cannot vote this snippet","","","",d,function(c,d,b){a&&a(c,d,b)})},a)}function getSnippetVote(d,b,a){var c="/Explore/GetSnippetVoteForCurUser?snippetId="+d;sendGetXMLAjaxReq(c,"",function(c){parseAjaxResp(c,null,"","","",function(c){var a=parseInt(c);b(a)},function(b){a&&a(null,"Cannot retrieve the vote of the snippet",b)})},a)}function getAllChannels(c,b,a){sendGetAjaxReq("/Group/GetAllChannels?start="+c+"&count="+b,"Cannot retrieve channels",a)}function getSubscribedChannels(c,b,a){sendGetAjaxReq("/Group/GetJoinedChannels?start="+c+"&count="+b,"Cannot retrieve channels",a)}function followChannel(c,d,b,a){if(d)sendAjaxReq("/Channel/UnFollow","channelID="+c,null,"","","","",b,a);else sendAjaxReq("/Channel/Follow","channelID="+c,null,"","","","",b,a)}function unpublishSnippet(c,b,a){sendAjaxReq("/Channel/Unpublish","snippetID="+c+"&channelID="+b,null,"","","","",a,function(){alert("Cannot unpublish this snippet")})}function publishSnippet(e,d,a,c){var b=d.join(","),f="snippetID="+e+"&channelsIDs="+b;sendAjaxReq("/Snippets/Publish",f,null,"","","","",a,c)}function paintNumber(a){return a>999999?(a/1e6).toFixed(2).toString()+"M":a>999?(a/1e3).toFixed(2).toString()+"k":a.toFixed(0).toString()}function followBtnAction(a){var c=a.data("channelId"),b=a.data("isfollowing");followChannel(c,b,function(){var e=$("#value"+c),d=-100;if(e)d=e.data("memberscount");if(b){a.html("Follow");a.prop("title","Follow");d--}else{a.html("Unfollow");a.prop("title","Unfollow");d++}e.html(paintNumber(d));e.data("memberscount",d);e.prop("title",d);a.data("isfollowing",!b)},function(){alert("An error occurred in the last operation. Please, retry in a while!")})}function selectPanel(b,c){for(var a=0;a<b.length;a++)if(b[a]==c)$("#"+b[a]+"_link").addClass("current");else $("#"+b[a]+"_link").removeClass("current");for(var a=0;a<b.length;a++)if(b[a]==c)$("#"+b[a]+"_panel").fadeIn();else $("#"+b[a]+"_panel").hide();if(location.hash!=c)location.hash=c;setTimeout(function(){return updateSpacer()},500)}function setupResizingControl(){$(window).resize(function(){setTimeout(function(){return updateSpacer()},200);typeof window.s2cPageResize==="function"&&setTimeout(function(){window.s2cPageResize()},1e3)});setTimeout(function(){return updateSpacer()},500)}function setDeleteClick(b,a){b.click(function(){var b=$(this).data("snippetId");confirm(a+" ("+b+") ?")==true&&deleteSnippet(b,function(){window.location.href="/"})})}function getParameterByName(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var c=new RegExp("[\\?&]"+a+"=([^&#]*)"),b=c.exec(location.search);return b==null?"":decodeURIComponent(b[1].replace(/\+/g," "))}function searchBtn(){var a=encodeURIComponent($("#quickSearchTxt").val());if(a.length>0)a="q="+a;if(location.pathname.indexOf("/Ranking/Users")==0)window.location.href="/Ranking/Users?"+a;else if(location.pathname.indexOf("/Ranking/Properties")==0){var b=getParameterByName("propName"),c="/Ranking/Properties?"+a;if(b&&b!="")c+="&propName="+b;window.location.href=c}else if(location.pathname.indexOf("/Channel")==0)window.location.href="/Channel/Search?"+a;else if(location.pathname.indexOf("/Explore")==0&&location.pathname.indexOf("/Explore/Ask")!=0)window.location.href=location.protocol+"//"+location.host+location.pathname+"?"+a;else window.location.href="/Explore/Public?"+a}function allPagesInitialize(a){setDeleteClick($("#deleteBt"),a.confirmDeleteMsg);$(".title").click(function(){window.location.href="/Explore"});$("body").click(function(){$(".ui-menu").menu().hide();$(".dropMenuContainer").removeClass("menuSelected")});null!=window.s2cPageReady&&window.s2cPageReady();$(".author").click(function(){var b=$(this).data("userId");if(b&&b!="undefined"){var a=$(this).data("username"),c="/User/Profile/"+b;if(a&&a!="undefined")c+="/"+a;window.location.href=c}});setupResizingControl()}function getSnipCode(a){return $('.code[data-snippet-id="'+a+'"]')}function getSnipItem(a){return $('.snippetInfo[data-snippet-id="'+a+'"]')}function getSnipName(a){return $('.name[data-snippet-id="'+a+'"]')}function getSnipFrame(a){return $('.snippetInfoFrame[data-snippet-id="'+a+'"]')}