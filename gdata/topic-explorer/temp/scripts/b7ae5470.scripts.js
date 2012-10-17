"use strict";var topicExplorerApp=angular.module("topicExplorerApp",[]);topicExplorerApp.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),topicExplorerApp.factory("constants",function(){return{IFRAME_API_URL:"//www.youtube.com/iframe_api",GOOGLE_APIS_CLIENT_URL:"https://apis.google.com/js/client.js?onload=",GOOGLE_APIS_CLIENT_CALLBACK:"onClientLoad",OAUTH2_CLIENT_ID:"269758065116.apps.googleusercontent.com",OAUTH2_SCOPES:"https://www.googleapis.com/auth/youtube",API_KEY:"AIzaSyAe112w0RobjC1XtoO3Os3YI6cvMZm9oKk",FREEBASE_API_URL:"https://www.googleapis.com/freebase/v1/search",YOUTUBE_API_SERVICE:"youtube",YOUTUBE_API_VERSION:"v3",FREEBASE_API_MAX_RESULTS:30,FREEBASE_CACHE_MINUTES:1440,YOUTUBE_CACHE_MINUTES:1440,MIN_SCORE:60,MAX_SCORE:100,YOUTUBE_API_MAX_RESULTS:50,DEFAULT_PROFILE_THUMBNAIL:"https://s.ytimg.com/yts/img/no_videos_140-vfl5AhOQY.png",VIDEO_KIND:"youtube#video",CHANNEL_KIND:"youtube#channel",PLAYLIST_KIND:"youtube#playlist",YOUTUBE_VIDEO_PAGE_URL_PREFIX:"http://youtu.be/",YOUTUBE_CHANNEL_PAGE_URL_PREFIX:"http://youtube.com/channel/",YOUTUBE_PLAYLIST_PAGE_URL_PREFIX:"http://www.youtube.com/playlist?list="}}),topicExplorerApp.factory("youtube",["constants",function(a){function b(a,b){return a+JSON.stringify(b)}return function(c){c.path=[a.YOUTUBE_API_SERVICE,a.YOUTUBE_API_VERSION,c.service].join("/");var d=b(c.service,c.params),e=lscache.get(d);if(c.method=="GET"&&e)setTimeout(function(){c.callback(e)},1);else{var f=c.callback;delete c.callback;var g=a.YOUTUBE_CACHE_MINUTES;"cacheTimeoutMinutes"in c&&(g=c.cacheTimeoutMinutes);var h=gapi.client.request(c);h.execute(function(a){c.method=="GET"&&a&&!("error"in a)&&lscache.set(d,a,g),f(a)})}}}]),"use strict",topicExplorerApp.controller("MainCtrl",["$scope","$rootScope","$http","$window","constants","youtube",function(a,b,c,d,e,f){function g(b){a.topicResults=b.result.map(function(a){var b=a.name;a.notable&&a.notable.name&&(b+=" ("+a.notable.name+")");var c=a.score;return c>e.MAX_SCORE&&(c=e.MAX_SCORE),c<e.MIN_SCORE&&(c=e.MIN_SCORE),{name:b,mid:a.mid,style:{"font-size":c+"%",opacity:c/100}}})}function h(a,b){b=b.replace(/^UC/,"UU");var c=a.offsetWidth,d=a.offsetHeight;new YT.Player(a,{width:c,height:d,playerVars:{listType:"playlist",list:b,autoplay:1,controls:2,modestbranding:1,rel:0,showInfo:0}})}function i(a,b){var c=a.offsetWidth,d=a.offsetHeight;new YT.Player(a,{videoId:b,width:c,height:d,playerVars:{autoplay:1,controls:2,modestbranding:1,rel:0,showInfo:0}})}a.searchTerm=e.DEFAULT_SEARCH_TERM,a.topicSearch=function(a){var b=lscache.get(a);if(b)g(b);else{var d=c.jsonp(e.FREEBASE_API_URL,{params:{query:a,key:e.API_KEY,limit:e.FREEBASE_API_MAX_RESULTS,callback:"JSON_CALLBACK"}});d.success(function(b){b.status=="200 OK"&&(lscache.set(a,b,e.FREEBASE_CACHE_MINUTES),g(b))})}},a.topicClicked=function(b){a.channelResults=[],a.playlistResults=[],a.videoResults=[],f({method:"GET",service:"search",params:{topicId:b,part:"snippet",maxResults:e.YOUTUBE_API_MAX_RESULTS,q:a.searchTerm},callback:function(b){a.$apply(function(){var c=[],d=[],f=[];"searchResults"in b&&angular.forEach(b.searchResults,function(a){switch(a.id.kind){case e.VIDEO_KIND:c.push({title:a.snippet.title,thumbnailUrl:a.snippet.thumbnails.high.url,id:a.id.videoId,href:e.YOUTUBE_VIDEO_PAGE_URL_PREFIX+a.id.videoId});break;case e.CHANNEL_KIND:d.push({title:a.snippet.title,thumbnailUrl:a.snippet.thumbnails.high.url,id:a.id.channelId,href:e.YOUTUBE_CHANNEL_PAGE_URL_PREFIX+a.id.channelId});break;case e.PLAYLIST_KIND:f.push({title:a.snippet.title,thumbnailUrl:a.snippet.thumbnails.high.url,id:a.id.playlistId,href:e.YOUTUBE_PLAYLIST_PAGE_URL_PREFIX+a.id.playlistId})}}),a.channelResults=d,a.playlistResults=f,a.videoResults=c})}})},a.addToList=function(a,c,d){var g=b.channelId.replace(/^UC/,c);a.textContent="Adding...",a.disabled=!0,f({method:"POST",service:"playlistItems",params:{part:"snippet"},body:{snippet:{playlistId:g,resourceId:{kind:e.VIDEO_KIND,videoId:d}}},callback:function(b){"error"in b?a.textContent="Error":a.textContent="Added"}})},a.videoClicked=function(a,b){var f=a.parentElement;typeof YT!="undefined"&&typeof YT.Player!="undefined"?i(f,b):(d.onYouTubeIframeAPIReady=function(){i(f,b)},c.jsonp(e.IFRAME_API_URL))},a.listPlayerClicked=function(a,b){var f=a.parentElement;typeof YT!="undefined"&&typeof YT.Player!="undefined"?h(f,b):(d.onYouTubeIframeAPIReady=function(){h(f,b)},c.jsonp(e.IFRAME_API_URL))},a.subscribeClicked=function(a,c){a.textContent="Subscribing...",a.disabled=!0,f({method:"POST",service:"subscriptions",params:{part:"snippet"},body:{snippet:{channelId:b.channelId,resourceId:{kind:e.CHANNEL_KIND,channelId:c}}},callback:function(b){"error"in b?a.textContent="Error":a.textContent="Subscribed"}})}}]),"use strict",topicExplorerApp.controller("UserCtrl",["$scope","$http","$window","constants",function(a,b,c,d){function e(b){a.$apply(function(){b&&!b.error?a.template="views/logged-in.html":a.template="views/logged-out.html"})}a.template="views/logged-out.html",c[d.GOOGLE_APIS_CLIENT_CALLBACK]=function(){gapi.client.setApiKey(d.API_KEY),setTimeout(function(){gapi.auth.authorize({client_id:d.OAUTH2_CLIENT_ID,scope:d.OAUTH2_SCOPES,immediate:!0},e)},1)},a.$on("LoginEvent",function(){gapi.auth.authorize({client_id:d.OAUTH2_CLIENT_ID,scope:d.OAUTH2_SCOPES,immediate:!1},e)}),b.jsonp(d.GOOGLE_APIS_CLIENT_URL+d.GOOGLE_APIS_CLIENT_CALLBACK)}]),"use strict",topicExplorerApp.controller("LoggedInCtrl",["$scope","$rootScope","constants","youtube",function(a,b,c,d){a.thumbnailUrl=c.DEFAULT_PROFILE_THUMBNAIL,d({method:"GET",service:"channels",params:{mine:"",part:"id,snippet"},callback:function(c){a.$apply(function(){a.title=c.channels[0].snippet.title.split(/\W/)[0],a.thumbnailUrl=c.channels[0].snippet.thumbnails.default.url,b.channelId=c.channels[0].id})}})}]);