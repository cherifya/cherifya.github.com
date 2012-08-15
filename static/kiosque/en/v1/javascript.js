if(typeof CHANCE_SLICES==="undefined"){var CHANCE_SLICES=[]}CHANCE_SLICES=CHANCE_SLICES.concat([]);
Kiosque.articleController=SC.ObjectController.create({content:null});Kiosque.articlesController=SC.ArrayController.create({content:null,selection:null,loadArticles:function(){var query,articles=this.get("content");
if(SC.none(articles)){query=SC.Query.local(Kiosque.Article,{orderBy:"publishedDate DESC"});
articles=Kiosque.store.find(query);Kiosque.articlesController.set("content",articles)
}else{articles.refresh()}},loadArticlesFromSource:function(source){var query,feed,articles=this.get("content");
feed=Kiosque.store.find(Kiosque.Feed,source.get("url"));this.set("content",feed.get("articles"))
},selectionDidChange:function(){var selection=this.get("selection");if(selection&&selection.get("length")>0){var article=selection.firstObject();
Kiosque.statechart.sendEvent("openArticle",article)}}.observes("selection")});Kiosque.feedsController=SC.ArrayController.create({loadingData:NO,feedUrls:"http://feeds.arstechnica.com/arstechnica/index".w(),sourcesBinding:"Kiosque.sourcesController.content",maxEntriesPerFeed:45,selection:null,loadFeeds:function(){this.set("loadingData",YES);
var controller=this,feeds=this.get("content");var sources=this.get("sources");if(SC.none(sources)){return
}if(SC.none(feeds)){var query=SC.Query.local(Kiosque.Feed,{feedUrls:sources.getEach("url"),maxEntriesPerFeed:this.get("maxEntriesPerFeed"),queryLoaded:NO,queryLoadedDidChange:function(){var queryLoaded=this.get("queryLoaded");
if(queryLoaded){controller.set("loadingData",NO)}}.observes("queryLoaded")});feeds=Kiosque.store.find(query);
this.set("content",feeds)}else{feeds.refresh()}},loadingDataDidChange:function(){var loadingData=this.get("loadingData");
if(!loadingData){this.invokeLater("hideSpinner",3000)}else{Kiosque.statechart.sendEvent("showSpinner")
}}.observes("loadingData"),hideSpinner:function(){Kiosque.statechart.sendEvent("hideSpinner")
}});Kiosque.preferencesController=SC.ObjectController.create({feeds:function(key,value){var _feeds=this.readPreference("feeds");
if(SC.none(_feeds)||(_feeds.get("length")===0)){this.addFeed([{name:"Tuaw",url:"http://www.tuaw.com/rss.xml"}]);
_feeds=this.readPreference("feeds")}return _feeds}.property(),addFeed:function(feeds){if(SC.none(feeds)){return
}if(SC.typeOf(feeds)!==SC.T_ARRAY){feeds=[feeds]}var _feeds=this.readPreference("feeds");
if(SC.none(_feeds)){_feeds=[]}for(var i=0;i<feeds.get("length");i++){var feed=feeds[i];
_feeds.push(feed)}this.setPreference("feeds",_feeds)},removeFeed:function(feed){if(SC.none(feed)){return
}var _feeds=this.readPreference("feeds");if(SC.none(_feeds)){return}var i,_feed,found;
for(i=0;i<_feeds.length;i++){_feed=_feeds[i];if(_feed.name===feed.name&&_feed.url===feed.url){found=_feed;
break}}if(!SC.none(found)){_feeds.removeObject(found)}this.setPreference("feeds",_feeds)
},resetFeeds:function(){resetCookie("feeds")},setPreference:function(prefName,prefValue){createCookie(prefName,serializeJSObject(prefValue),60)
},readPreference:function(prefName){var prefValue=readCookie(prefName);prefValue=eval(prefValue);
return prefValue}});function createCookie(name,value,days){if(days){var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString()
}else{var expires=""}document.cookie=name+"="+value+expires+"; path=/"}function readCookie(name){var nameEQ=name+"=";
var ca=document.cookie.split(";");for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==" "){c=c.substring(1,c.length)
}if(c.indexOf(nameEQ)===0){var ret=c.substring(nameEQ.length,c.length);return ret
}}return null}function resetCookie(name){createCookie(name,"",-1)}function serializeJSObject(_obj){if(_obj===null){return"null"
}switch(typeof _obj){case"number":case"boolean":case"function":return _obj;case"string":return"'"+_obj+"'";
case"object":var str;if(_obj.constructor===Array||typeof _obj.callee!=="undefined"){str="[";
var i,len=_obj.length;if(len===0){return"[]"}for(i=0;i<len-1;i++){str+=serializeJSObject(_obj[i])+","
}str+=serializeJSObject(_obj[i])+"]"}else{str="{";var key;for(key in _obj){str+=key+":"+serializeJSObject(_obj[key])+","
}str=str.replace(/\,$/,"")+"}"}return str;default:return"UNKNOWN"}}Kiosque.settingsViewController=SC.ObjectController.create({showNewFeedSection:function(sender){var panel=sender.parentView.parentView;
panel.buttonsSection.set("isVisible",NO);panel.newFeedSection.set("isVisible",YES)
},hideNewFeedSection:function(sender){var panel=sender.parentView.parentView;if(SC.none(panel)){panel=sender
}panel.buttonsSection.set("isVisible",YES);panel.newFeedSection.set("isVisible",NO)
},deleteFeed:function(sender){var panel=sender.parentView.parentView;var collectionView=panel.scroll.contentView;
collectionView.deleteSelection()}});Kiosque.sourcesController=SC.ArrayController.create(SC.CollectionViewDelegate,{loadingData:NO,selection:null,loadSources:function(){this.set("loadingData",YES);
var controller=this,feeds=this.get("content");if(SC.none(feeds)){var query=SC.Query.local(Kiosque.RssSource,{orderBy:"name",isEditable:YES,queryLoaded:NO,queryLoadedDidChange:function(){var queryLoaded=this.get("queryLoaded");
if(queryLoaded){controller.set("loadingData",NO)}}.observes("queryLoaded")});feeds=Kiosque.store.find(query);
this.set("content",feeds)}else{feeds.refresh()}},selectionDidChange:function(){var selection=this.get("selection");
if(selection&&selection.get("length")>0){var source=selection.firstObject();SC.Logger.debug("source: %@".fmt(source.get("name")));
Kiosque.statechart.sendEvent("filterSource",source)}}.observes("selection"),showPickerPane:function(sender){var pane=SC.PickerPane.create({layout:{width:500,height:300},contentView:Kiosque.SettingsView.extend({layout:{top:0,left:0,bottom:0,right:0}})});
pane.popup(sender)},addNewFeed:function(sender){var panel=sender.parentView.parentView;
var name=panel.getPath("newFeedSection.nameField.value");var url=panel.getPath("newFeedSection.urlField.value");
if(!SC.empty(name)&&!SC.empty(url)){SC.Logger.debug("add new feed %@, %@".fmt(name,url));
var feed=Kiosque.store.createRecord(Kiosque.RssSource,{name:name,url:url});feed.commitRecord()
}Kiosque.settingsViewController.hideNewFeedSection(panel)},collectionViewDeleteContent:function(view,content,indexes){SC.AlertPane.warn({message:"The RSS source will be permanently removed.",description:"Do you wanna proceed?",caption:null,delegate:this,buttons:[{title:"Delete"},{title:"Cancel"},{title:null}],indexes:indexes})
},deleteRecords:function(indexes){var records=indexes.map(function(idx){var ret=this.objectAt(idx);
return ret},this);records.invoke("destroy").invoke("commitRecord");var selIndex=indexes.get("min")-1;
if(selIndex<0){selIndex=0}SC.Logger.debug("selIndex: %@".fmt(selIndex));var controller=this;
this.invokeLater(function(){controller.selectObject(this.objectAt(selIndex))})},alertPaneDidDismiss:function(pane,status){switch(status){case SC.BUTTON1_STATUS:var indexes=pane.get("indexes");
this.deleteRecords(indexes);break;case SC.BUTTON2_STATUS:break;case SC.BUTTON3_STATUS:break
}}});Kiosque.thumbsController=SC.ArrayController.create({selection:null,nbPagesBinding:"Kiosque.mainPage.mainPane.grid.numberOfPages",gridSelectedPageBinding:"Kiosque.mainPage.mainPane.grid.currentTabIndex",gridSelectedPageDidChange:function(){var gridSelectedPage=this.get("gridSelectedPage");
this.selectObject(this.objectAt(gridSelectedPage))}.observes("gridSelectedPage"),selectionDidChange:function(){var selection=this.get("selection");
var gridSelectedPage=this.get("gridSelectedPage");if(selection&&selection.get("length")>0){var selected=selection.firstObject();
var selectedIndex=selected.get("index");var tabControl=Kiosque.getPath("mainPage.mainPane.grid");
if(tabControl&&(selectedIndex!=gridSelectedPage)){tabControl.navigateToTab(selectedIndex)
}}}.observes("selection"),content:function(){var pages=[],nbPages=this.get("nbPages"),i,item;
for(i=0;i<nbPages;i++){item=SC.Object.create({name:""+(i+1),index:i});pages.push(item)
}return pages}.property("nbPages")});Kiosque.tweetsController=SC.ArrayController.create({content:null,selection:null,selectedUrl:null,maxTweets:10,loadTweets:function(){var query,tweets=this.get("content"),selectedUrl=this.get("selectedUrl");
if(SC.none(selectedUrl)){return}if(!SC.none(tweets)){}query=SC.Query.local(Kiosque.Tweet,{orderBy:"creationDate DESC",articleUrl:selectedUrl,maxTweets:this.get("maxTweets"),conditions:"queryUrl = {selected}",parameters:{selected:selectedUrl}});
tweets=Kiosque.store.find(query);Kiosque.tweetsController.set("content",tweets)}.observes("selectedUrl")});
Kiosque.FeedsDataSource=SC.DataSource.extend({fetchFeed:function(url,max,successCallback){jQuery.ajax({url:document.location.protocol+"//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=%@&q=%@".fmt(max,encodeURIComponent(url)),dataType:"jsonp",context:this,success:successCallback})
},fetch:function(store,query){var dataSource=this;if(query.recordType==Kiosque.Feed){var urls=query.get("feedUrls");
var max=query.get("maxEntriesPerFeed");urls.forEach(function(url){jQuery.ajax({url:document.location.protocol+"//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=%@&q=%@".fmt(max,encodeURIComponent(url)),dataType:"jsonp",context:dataSource,success:function(response){SC.RunLoop.begin();
dataSource.didFetchFeed(response,url,store,query);SC.RunLoop.end()}})});return YES
}else{if(query.recordType==Kiosque.RssSource){var feeds=Kiosque.preferencesController.get("feeds");
store.loadRecords(Kiosque.RssSource,feeds);store.dataSourceDidFetchQuery(query);query.set("queryLoaded",YES);
return YES}else{if(query.recordType==Kiosque.Tweet){var articleUrl=query.get("articleUrl");
var maxTweets=query.get("maxTweets");jQuery.ajax({url:document.location.protocol+"//search.twitter.com/search.json?rpp=%@&q=%@".fmt(maxTweets,encodeURIComponent(articleUrl)),dataType:"jsonp",context:dataSource,success:function(response){SC.RunLoop.begin();
dataSource.didFetchTweets(response,articleUrl,store,query);SC.RunLoop.end()}})}}}return NO
},didFetchFeed:function(response,feedUrl,store,query){SC.Logger.debug("didFetchFeed %@".fmt(feedUrl));
if(response.responseStatus==200){var feed=response.responseData.feed;var entries=feed.entries;
feed.guid=feed.feedUrl;delete feed.entries;var articlesIds=entries.getEach("link");
feed.articles=articlesIds;entries.forEach(function(x){x.guid=x.link;x.feeds=[feed.guid];
x.source=feedUrl});store.loadRecords(Kiosque.Feed,[feed]);store.loadRecords(Kiosque.Article,entries)
}if(!SC.none(query)){var fetchedFeeds=query._fetchedFeeds;if(SC.none(fetchedFeeds)){fetchedFeeds=query._fetchedFeeds=[]
}fetchedFeeds.push(feedUrl);if(fetchedFeeds.get("length")==query.getPath("feedUrls.length")){SC.Logger.debug("All feeds fetched");
store.dataSourceDidFetchQuery(query);query.set("queryLoaded",YES)}}},didFetchTweets:function(response,articleUrl,store,query){SC.Logger.debug("didFetchTweets for %@".fmt(articleUrl));
if("results" in response){var results=response.results;results.forEach(function(x){x.queryUrl=articleUrl
});store.loadRecords(Kiosque.Tweet,results);store.dataSourceDidFetchQuery(query);
query.set("queryLoaded",YES)}},retrieveRecord:function(store,storeKey){return NO},createRecord:function(store,storeKey){if(SC.kindOf(store.recordTypeFor(storeKey),Kiosque.RssSource)){var feed=store.readDataHash(storeKey);
Kiosque.preferencesController.addFeed(feed);store.dataSourceDidComplete(storeKey);
this.fetchFeed(feed.url,45,function(response){SC.RunLoop.begin();this.didFetchFeed(response,feed.url,store);
SC.RunLoop.end()});return YES}return NO},updateRecord:function(store,storeKey){return NO
},destroyRecord:function(store,storeKey){if(SC.kindOf(store.recordTypeFor(storeKey),Kiosque.RssSource)){var feed=store.readDataHash(storeKey);
Kiosque.preferencesController.removeFeed(feed);store.dataSourceDidDestroy(storeKey);
return YES}return NO}});Kiosque.FixturesDataSource=SC.FixturesDataSource.extend({simulateRemoteResponse:YES,latency:500});
Kiosque=SC.Application.create({store:SC.Store.create().from("Kiosque.FeedsDataSource")});
SC.ready(function(){});Kiosque.main=function main(){Kiosque.getPath("mainPage.mainPane").append();
Kiosque.statechart.initStatechart();SC.LOG_TOUCH_EVENTS=NO};Kiosque.initData=function(){Kiosque.feedsController.loadFeeds();
Kiosque.articlesController.loadArticles()};function main(){Kiosque.main()}SC.ExceptionHandler.handleException=function(e){SC.Logger.debug("Exception: %@".fmt(e.message));
return YES};Kiosque.Article=SC.Record.extend({title:SC.Record.attr(String),author:SC.Record.attr(String),snippet:SC.Record.attr(String,{key:"contentSnippet"}),content:SC.Record.attr(String,{key:"content"}),publishedDate:SC.Record.attr(SC.DateTime,{format:"%a, %d %b %Y %H:%M:%S %Z"}),url:SC.Record.attr(String,{key:"link"}),feeds:SC.Record.toMany("Kiosque.Feed",{isMaster:NO,inverse:"articles"}),source:SC.Record.toOne("Kiosque.RssSource"),cover:function(){var content=this.get("content");
var cover=null;var matches=content.match(/src="(.*?)"/);if(matches&&matches.get("length")>=2){cover=matches[1]
}return cover}.property("content").cacheable()});Kiosque.Feed=SC.Record.extend({title:SC.Record.attr(String),description:SC.Record.attr(String),updated:SC.Record.attr(SC.Datetime),articles:SC.Record.toMany("Kiosque.Article",{isMaster:YES,inverse:"feeds"}),feedUrl:SC.Record.attr(SC.String),link:SC.Record.attr(SC.String)});
Kiosque.RssSource=SC.Record.extend({primaryKey:"url",name:SC.Record.attr(String),url:SC.Record.attr(String)});
Kiosque.Tweet=SC.Record.extend({primaryKey:"id_str",user:SC.Record.attr(String,{key:"from_user"}),userId:SC.Record.attr(String,{key:"from_user_id_str"}),userImageUrl:SC.Record.attr(String,{key:"profile_image_url"}),creationDate:SC.Record.attr(SC.DateTime,{key:"created_at",format:"%a, %d %b %Y %H:%M:%S %Z"}),text:SC.Record.attr(String)});
SC.BaseTheme.articleLabelRenderDelegate=SC.RenderDelegate.create({className:"label",render:function(dataSource,context){this.addSizeClassName(dataSource,context);
var toolTip=dataSource.get("toolTip");if(toolTip){context.attr("title",toolTip)}context.addStyle({fontWeight:dataSource.get("fontWeight")||null,textAlign:dataSource.get("textAlign")||null});
context.setClass("ellipsis",dataSource.get("needsEllipsis")||NO);context.setClass("icon",dataSource.get("icon")||NO);
var html=this._htmlForTitleAndIcon(dataSource);context.push(html);dataSource.get("renderState")._lastHTMLForTitleAndIcon=html
},update:function(dataSource,jquery){this.updateSizeClassName(dataSource,jquery);
jquery.css({fontWeight:dataSource.get("fontWeight")||null,textAlign:dataSource.get("textAlign")||null});
var toolTip=dataSource.get("toolTip");if(toolTip){jquery.attr("title",toolTip)}else{jquery.removeAttr("title")
}jquery.setClass("ellipsis",dataSource.get("needsEllipsis")||NO);var html=this._htmlForTitleAndIcon(dataSource);
if(dataSource.get("renderState")._lastHTMLForTitleAndIcon!==html){jquery.html(html);
dataSource.get("renderState")._lastHTMLForTitleAndIcon=html}},_htmlForTitleAndIcon:function(dataSource){var title=dataSource.get("title"),hint=dataSource.get("hint"),escapeHTML=dataSource.get("escapeHTML"),icon=dataSource.get("icon")||"",articleTitle=dataSource.get("articleTitle"),articleAuthor=dataSource.get("articleAuthor"),articleDate=dataSource.get("articleDate"),articleLink=dataSource.get("articleLink");
if(!SC.none(articleDate)){articleDate=articleDate.toTimezone(SC.DateTime.timezone);
articleDate=articleDate.toFormattedString("%A, %b %d, %Y %i:%M %p")}var header='<div class="article-header"><a href="%@" target="_blank"><span class="title">%@</span></a><div class="byline"><span class="author">%@</span><span class="date">%@</span></div></div>'.fmt(articleLink,articleTitle,articleAuthor,articleDate);
if(title&&escapeHTML){title=SC.RenderContext.escapeHTML(title)}if(hint&&!title){if(escapeHTML){hint=SC.RenderContext.escapeHTML(hint)
}title="<span class='sc-hint'>"+hint+"</span>"}if(icon){if(icon.indexOf("/")>=0){icon='<img src="'+icon+'" alt="" class="icon" />'
}else{icon='<img src="'+SC.BLANK_IMAGE_URL+'" alt="" class="icon '+icon+'" />'}}return icon+header+title
}});SC.BaseTheme.centerImageRenderDelegate=SC.RenderDelegate.create({name:"image",render:function(dataSource,context){var image=dataSource.get("image"),imageValue=dataSource.get("imageValue"),type=SC.IMAGE_TYPE_URL,toolTip=dataSource.get("toolTip");
context=context.begin("div");if(imageValue&&type===SC.IMAGE_TYPE_CSS_CLASS){}if(toolTip){context.attr("title",toolTip);
context.attr("alt",toolTip)}context.addStyle(this.imageStyles(dataSource));context=context.end()
},update:function(dataSource,jquery){var image=dataSource.get("image"),imageValue=dataSource.get("imageValue"),toolTip=dataSource.get("toolTip");
jquery=jquery.find("div");if(imageValue){}if(toolTip){jquery.attr("title",toolTip);
jquery.attr("alt",toolTip)}jquery.css(this.imageStyles(dataSource))},imageStyles:function(dataSource){var innerFrame=dataSource.get("innerFrame"),imageValue=dataSource.get("imageValue");
return{position:"absolute",left:Math.round(innerFrame.x),top:Math.round(innerFrame.y),width:Math.round(innerFrame.width),height:Math.round(innerFrame.height),"background-image":"url(%@)".fmt(imageValue),"background-position":"center top","background-size":"cover"}
}});SC.BaseTheme.customCanvasImageRenderDelegate=SC.RenderDelegate.create({render:function(dataSource,context){var html=this._htmlForContent(dataSource);
context.push(html);dataSource.get("renderState")._lastHTML=html},update:function(dataSource,jquery){var html=this._htmlForContent(dataSource);
if(dataSource.get("renderState")._lastHTML!==html){jquery.html(html);dataSource.get("renderState")._lastHTML=html
}var elem=jquery.find("canvas")[0],image=dataSource.get("image"),frame=dataSource.get("frame"),frameWidth=frame.width,frameHeight=frame.height,innerFrame=dataSource.get("innerFrame"),backgroundColor=dataSource.get("fillWithWhite")||YES,renderState=dataSource.get("renderState"),context;
var innerFrameDidChange=![innerFrame.x,innerFrame.y,innerFrame.width,innerFrame.height].isEqual(renderState._lastInnerFrameValues),backgroundDidChange=dataSource.didChangeFor("customCanvasImageRenderDelegate","backgroundColor"),imageDidChange=dataSource.didChangeFor("customCanvasImageRenderDelegate","image")||(image&&image.complete)!==renderState._lastImageComplete;
if(innerFrameDidChange||backgroundDidChange||imageDidChange){if(elem&&elem.getContext){elem.height=frameHeight;
elem.width=frameWidth;context=elem.getContext("2d");context.clearRect(0,0,frameWidth,frameHeight);
var sx=0,sy=0,sw=image.width,sh=image.height,dx=Math.floor(innerFrame.x),dy=Math.floor(innerFrame.y),dw=Math.floor(innerFrame.width),dh=Math.floor(innerFrame.height),cw,ch;
if(sw==1&&sh==1){return}cw=Math.min(sw,dw);ch=cw*sh/(sw*1);if(ch>dh){ch=dh;cw=cw*dh/(sh*1)
}sx=Math.floor((sw-cw)/2);sy=Math.floor((sh-ch)/2);dx=Math.floor((dw-cw)/2);dy=Math.floor((dh-ch)/2);
if(image&&image.complete){if(backgroundColor){context.fillStyle="white";context.fillRect(0,0,frameWidth,frameHeight)
}context.drawImage(image,0,0,sw,sh,dx,dy,cw,ch)}}renderState._lastInnerFrameValues=[innerFrame.x,innerFrame.y,innerFrame.width,innerFrame.height];
renderState._lastImageComplete=image&&image.complete}},_htmlForContent:function(dataSource){var content=dataSource.get("content"),title=content.get("title"),feed=content.getPath("source.name");
var feedHtml,titleHtml,coverHtml;feedHtml='<div class="article-thumb-feed">%@</div>'.fmt(SC.RenderContext.escapeHTML(feed));
titleHtml='<div class="article-thumb-title">%@</div>'.fmt(SC.RenderContext.escapeHTML(title));
coverHtml='<canvas class="article-thumb-cover"></canvas>';return feedHtml+titleHtml+coverHtml
}});SC.BaseTheme.customTweetRenderDelegate=SC.RenderDelegate.create({className:"label",render:function(dataSource,context){this.addSizeClassName(dataSource,context);
var toolTip=dataSource.get("toolTip");if(toolTip){context.attr("title",toolTip)}context.addStyle({fontWeight:dataSource.get("fontWeight")||null,textAlign:dataSource.get("textAlign")||null});
context.setClass("ellipsis",dataSource.get("needsEllipsis")||NO);context.setClass("icon",dataSource.get("icon")||NO);
var html=this._htmlForTitleAndIcon(dataSource);context.push(html);dataSource.get("renderState")._lastHTMLForTitleAndIcon=html
},update:function(dataSource,jquery){this.updateSizeClassName(dataSource,jquery);
jquery.css({fontWeight:dataSource.get("fontWeight")||null,textAlign:dataSource.get("textAlign")||null});
var toolTip=dataSource.get("toolTip");if(toolTip){jquery.attr("title",toolTip)}else{jquery.removeAttr("title")
}jquery.setClass("ellipsis",dataSource.get("needsEllipsis")||NO);var html=this._htmlForTitleAndIcon(dataSource);
if(dataSource.get("renderState")._lastHTMLForTitleAndIcon!==html){jquery.html(html);
dataSource.get("renderState")._lastHTMLForTitleAndIcon=html}},_htmlForTitleAndIcon:function(dataSource){var title=dataSource.get("title"),hint=dataSource.get("hint"),escapeHTML=dataSource.get("escapeHTML"),icon=dataSource.get("icon")||"",tweet=dataSource.get("content"),tweetText=tweet.get("text"),tweetUser=tweet.get("user"),tweetDate=tweet.get("creationDate"),tweetImage=tweet.get("userImageUrl");
if(!SC.none(tweetDate)){tweetDate=tweetDate.toTimezone(SC.DateTime.timezone);tweetDate=tweetDate.toFormattedString("%Y/%m/%d %H:%M:%S")
}var header='<div class="tweet-image"><img src="%@"/></div><div class="tweet-info"><span class="user">%@</span><span class="date">%@</span></div><div class="tweet-text">%@</div>'.fmt(tweetImage,tweetUser,tweetDate,tweetText);
return header}});SC.TEMPLATES.kiosque=SC.Handlebars.compile("<h1>Welcome to SproutCore!</h1>\n");
Kiosque.statechart=SC.Statechart.create({initialState:"feeds",feeds:SC.State.extend({enterState:function(){if(!this._dataLoaded){Kiosque.sourcesController.loadSources();
this.invokeLast("initData");this._dataLoaded=YES}},initData:function(){this.showSpinner();
Kiosque.feedsController.loadFeeds();Kiosque.articlesController.loadArticles()},exitState:function(){},openArticle:function(article){if(SC.none(article)){return
}Kiosque.articleController.set("content",article);this.gotoState("articles")},filterSource:function(source){if(!SC.none(source)){Kiosque.articlesController.loadArticlesFromSource(source)
}},showSpinner:function(){var pane=this.get("loadingPane");if(pane&&pane.get("isPaneAttached")){return
}if(SC.none(pane)){pane=SC.PalettePane.create({classNames:"spinner-panel".w(),layout:{width:70,height:70,centerX:0,centerY:0},contentView:SC.View.extend({layout:{top:0,left:0,bottom:0,right:0},childViews:"imageView".w(),imageView:SC.ImageView.design({layout:{centerX:0,centerY:0,width:24,height:24},value:"/static/kiosque/en/v1/source/resources/images/spinner-black.gif",useCanvas:NO})})})
}pane.append();this.setIfChanged("loadingPane",pane)},hideSpinner:function(){var pane=this.get("loadingPane");
if(pane&&pane.get("isPaneAttached")){pane.remove()}}}),articles:SC.State.extend({enterState:function(){var view=Kiosque.getPath("mainPage.mainPane.article");
view.set("content",Kiosque.articleController.get("content"));var jquery=view.$();
if(view.get("isVisible")===NO){view.set("isVisible",YES)}jquery.addClass("article-visible");
this.set("view",view)},exitState:function(){var view=this.get("view");var jquery=view.$();
jquery.removeClass("article-visible")},close:function(){this.gotoState("feeds")},tweets:function(){SC.Logger.debug("tweets");
var view=this.get("view");var tweetsView=view.get("tweetsView");if(tweetsView.get("isVisible")===NO){tweetsView.set("isVisible",YES)
}var articleUrl=Kiosque.articleController.getPath("content.url");Kiosque.tweetsController.set("selectedUrl",articleUrl);
var jquery=tweetsView.$();jquery.addClass("tweets-visible")},closeTweets:function(){var view=this.get("view");
var tweetsView=view.get("tweetsView");var jquery=tweetsView.$();jquery.removeClass("tweets-visible")
}})});Kiosque.ArrayPage=SC.Object.extend(SC.Array,{masterArray:null,itemsPerPage:null,pageIndex:null,length:function(){var itemsPerPage=this.get("itemsPerPage"),pageIndex=this.get("pageIndex");
if(pageIndex<0||itemsPerPage<0){throw"pageIndex and itemsPerPage must be a positive integer"
}var totalItems=this.getPath("masterArray.length"),nbPages=Math.max(Math.ceil(totalItems*1/itemsPerPage),1);
if(pageIndex<(nbPages-1)){return itemsPerPage}else{if(pageIndex===(nbPages-1)){var _start=pageIndex*itemsPerPage;
return(totalItems-_start)}else{return 0}}}.property("itemsPerPage","pageIndex","*masterArray.length"),objectAt:function(idx){var itemsPerPage=this.get("itemsPerPage"),pageIndex=this.get("pageIndex"),masterArray=this.get("masterArray"),indexInMaster=pageIndex*itemsPerPage+idx,length=this.get("length");
if(SC.none(this.masterArray)){throw"ArrayPage : masterArray is null."}if(pageIndex<0||itemsPerPage<0){throw"ArrayPage: pageIndex and itemsPerPage must be a positive integer"
}if(idx>=length){return null}return masterArray.objectAt(indexInMaster)},replace:function(idx,amt,objects){if(SC.none(this.masterArray)){throw"ArrayPage : masterArray is null."
}var itemsPerPage=this.get("itemsPerPage"),pageIndex=this.get("pageIndex"),masterArray=this.get("masterArray"),indexInMaster=pageIndex*itemsPerPage+idx;
var len=objects?objects.get("length"):0;this.arrayContentWillChange(idx,amt,len);
this.beginPropertyChanges();this.masterArray.replace(indexInMaster,amt,objects);this.enumerableContentDidChange(idx,amt,len-amt);
this.endPropertyChanges();this.arrayContentDidChange(idx,amt,len)},_masterDidChange:function(){this.allPropertiesDidChange()
}.observes("*masterArray.[]"),toString:function(){return"index %@".fmt(this.get("pageIndex"))
}});Kiosque.Theme=SC.AceTheme.create({name:"kiosque"});SC.Theme.addTheme(Kiosque.Theme);
SC.defaultTheme="kiosque";Kiosque.ArticleThumbnailView=SC.ImageView.extend({classNames:"article-thumb".w(),displayProperties:["content"],renderDelegateName:"customCanvasImageRenderDelegate",tagName:"div"});
Kiosque.ImageButtonView=SC.ImageView.extend({action:null,target:null,isActive:NO,isEnabled:YES,init:function(){arguments.callee.base.apply(this,arguments);
this.isEnabledChange()},render:function(context,firstTime){arguments.callee.base.apply(this,arguments);
if(this.get("isActive")){context.addClass("button-active")}else{context.removeClass("button-active")
}if(!this.get("isEnabled")){context.addClass("button-disabled")}else{context.removeClass("button-disabled")
}},isActiveChange:function(){this.set("layerNeedsUpdate",YES)}.observes("isActive"),isEnabledChange:function(){this.set("layerNeedsUpdate",YES)
}.observes("isEnabled"),mouseDown:function(evt){this.touchStart(evt)},mouseUp:function(evt){this.touchEnd(evt)
},touchStart:function(touch){this.set("isActive",YES);return YES},touchEnd:function(touch){this.set("isActive",NO);
if(this.get("isEnabled")){this._runAction()}},_runAction:function(){var action=this.get("action"),target=this.get("target")||null;
if(SC.typeOf(action)==SC.T_FUNCTION){action.call(target)}else{if(action){this.getPath("pane.rootResponder").sendAction(action,target,this,this.get("pane"),null,this)
}}}});require("views/image_button");Kiosque.ArticleView=SC.View.extend({classNames:"article-container".w(),childViews:"header scroll closeButton footer tweetsView".w(),content:null,header:SC.View.design({layout:{top:0,right:10,left:10,height:75},classNames:"article-top".w(),childViews:"title".w(),title:SC.LabelView.design({layout:{centerX:0,centerY:0,height:50,width:300},value:"Kiosque",tagName:"h1"})}),footer:SC.View.design({layout:{bottom:0,right:0,left:0,height:75},classNames:"article-footer".w(),childViews:"tweetsButton".w(),tweetsButton:Kiosque.ImageButtonView.design({layout:{right:21,centerY:0,height:40,width:40},value:"/static/kiosque/en/v1/source/resources/images/twitter.png",action:function(){Kiosque.statechart.sendEvent("tweets")
}})}),scroll:SC.LabelView.design({classNames:"article-content".w(),layout:{top:96,left:21,right:21,bottom:96},valueBinding:"*content.content",escapeHTML:NO,contentBinding:"*parentView.content",articleTitleBinding:"*content.title",articleAuthorBinding:"*content.author",articleDateBinding:"*content.publishedDate",articleLinkBinding:"*content.url",displayProperties:["articleTitle","articleAuthor","articleDate","articleLink"],renderDelegateName:"articleLabelRenderDelegate",shouldAutoResize:NO,widthDidChange:function(){var innerFrame=this.get("measuredSize");
SC.Logger.debug("width: %@".fmt(innerFrame.width))}.observes("measuredSize")}),closeButton:Kiosque.ImageButtonView.design({layout:{left:0,top:0,height:75,width:75},value:"/static/kiosque/en/v1/source/resources/images/back.png",action:function(){Kiosque.statechart.sendEvent("close")
}}),tweetsView:SC.View.design({layout:{right:0,bottom:0,left:0,top:0},isVisible:YES,classNames:"article-tweets".w(),childViews:"wrapper".w(),mouseDown:function(){return YES
},mouseUp:function(){Kiosque.statechart.sendEvent("closeTweets")},touchStart:function(){return this.mouseDown()
},touchEnd:function(){return this.mouseUp()},wrapper:SC.View.design({layout:{left:0,right:0,height:400,bottom:0},classNames:"article-tweets-wrapper".w(),childViews:"headerView tweetsContainer".w(),headerView:SC.View.design({layout:{top:0,right:0,left:0,height:65},classNames:"article-tweets-header".w(),childViews:"titleView closeButton".w(),titleView:SC.LabelView.design({layout:{left:21,centerY:0,height:21,right:60},classNames:"article-tweets-title".w(),value:"Reactions"}),closeButton:Kiosque.ImageButtonView.design({layout:{right:21,centerY:0,height:40,width:40},value:"/static/kiosque/en/v1/source/resources/images/twitter.png",action:function(){Kiosque.statechart.sendEvent("closeTweets")
}})}),tweetsContainer:SC.ScrollView.design({layout:{left:0,right:0,top:65,bottom:0},canScrollVertical:YES,hasVerticalScroller:NO,hasHorizontalScroller:NO,alwaysBounceHorizontal:NO,alwaysBounceVertical:YES,contentView:SC.ListView.design({layout:{top:0,right:0,bottom:0,left:0},classNames:"article-tweets-list".w(),contentBinding:"Kiosque.tweetsController.arrangedObjects",selectionBinding:"Kiosque.tweetsController.selection",rowHeight:70,exampleView:SC.LabelView.design({classNames:"tweet".w(),displayProperties:["content"],renderDelegateName:"customTweetRenderDelegate"})})})})})});
require("views/article_thumbnail_view");Kiosque.ArticlesPageView=SC.GridView.extend({classNames:"articles-grid-page".w(),articlesGrid:null,layout:{top:0,left:0,right:0,bottom:0},content:null,contentValueKeyBinding:"*articlesGrid.contentValueKey",contentIconKey:"*articlesGrid.contentIconKey",selectionBinding:"*articlesGrid.selection",actionBinding:"*articlesGrid.action",targetBinding:"*articlesGrid.target",columnWidthBinding:"*articlesGrid.columnWidth",rowHeightBinding:"*articlesGrid.rowHeight",itemsSpacingBinding:"*articlesGrid.itemsSpacing",orientationBinding:"*articlesGrid.orientation",exampleView:Kiosque.ArticleThumbnailView.design(),canEditContent:NO,canDeleteContent:NO,itemsPerRow:function(){var orientation=this.get("orientation");
if(orientation==SC.HORIZONTAL_ORIENTATION){return 5}else{return 3}}.property("orientation").cacheable(),layoutForContentIndex:function(contentIndex){var rowHeight=this.get("rowHeight")||48,frameWidth=this.get("clippingFrame").width,itemsPerRow=this.get("itemsPerRow"),columnWidth=this.get("columnWidth")||48,spacing=this.get("itemsSpacing")||10,row=Math.floor(contentIndex/itemsPerRow),col=contentIndex-(itemsPerRow*row);
return{left:col*(columnWidth+spacing),top:row*(rowHeight+spacing),height:rowHeight,width:columnWidth}
},_gv_clippingFrameDidChange:function(){}.observes("clippingFrame"),computeLayout:function(){var content=this.get("content"),count=(content)?content.get("length"):0,rowHeight=this.get("rowHeight")||48,columnWidth=this.get("columnWidth")||48,itemsPerRow=this.get("itemsPerRow"),rows=Math.ceil(count/itemsPerRow);
var ret=this._cachedLayoutHash;if(!ret){ret=this._cachedLayoutHash={}}ret.minHeight=rows*rowHeight;
this.calculatedHeight=ret.minHeight;ret.minWidth=itemsPerRow*columnWidth;this.calculatedWidth=ret.minWidth;
return ret},toString:function(){return"page %@".fmt(this.get("content"))}});require("system/array_page");
require("views/articles_page_view");Kiosque.ArticlesGridView=Iweb.TabControlView.extend({content:null,contentValueKey:null,contentIconKey:null,selection:null,action:null,target:null,numberOfPages:0,init:function(){arguments.callee.base.apply(this,arguments)
},classNames:"articles-grid".w(),_pagesPool:[],_pages:[],itemsSpacing:10,pageExampleView:Kiosque.ArticlesPageView,isTabBarVisible:NO,flickingThreshold:0.3,orientation:function(){var f=this.get("frame");
if(f.width>f.height){return SC.HORIZONTAL_ORIENTATION}else{return SC.VERTICAL_ORIENTATION
}}.property("frame").cacheable(),columnWidth:function(){var frame=this.get("frame"),itemsSpacing=this.get("itemsSpacing"),orientation=this.get("orientation");
var itemsPerRow=orientation===SC.HORIZONTAL_ORIENTATION?5:3;var colWidth=(frame.width-(itemsSpacing*(itemsPerRow-1)))/itemsPerRow;
return colWidth}.property("orientation").cacheable(),rowHeight:function(){var frame=this.get("frame"),itemsSpacing=this.get("itemsSpacing"),orientation=this.get("orientation");
var itemsPerCol=orientation===SC.HORIZONTAL_ORIENTATION?2:3;var rowHeight=(frame.height-(itemsSpacing*(itemsPerCol-1)))/itemsPerCol;
return rowHeight}.property("orientation").cacheable(),_contentDidChange:function(){}.observes("content"),itemsPerPage:function(){var orientation=this.get("orientation");
if(orientation==SC.HORIZONTAL_ORIENTATION){return 10}else{return 9}}.property("orientation").cacheable(),_computePages:function(){var itemsPerPage=this.get("itemsPerPage"),totalItems=this.getPath("content.length"),nbPagesNeeded=Math.max(Math.ceil(totalItems*1/itemsPerPage),1),nbPagesCreated=this._pages.get("length"),content=this.get("content"),pageExampleView=this.get("pageExampleView");
var page,i;if(nbPagesNeeded>nbPagesCreated){for(i=nbPagesCreated;i<nbPagesNeeded;
i++){page=this._pagesPool.pop();if(SC.none(page)){page=pageExampleView.design({pageIndex:i,articlesGrid:this,content:Kiosque.ArrayPage.create({masterArray:content,itemsPerPage:itemsPerPage,pageIndex:i})})
}else{page.set("pageIndex",i);page.set("articlesGrid",this);page.set("content",Kiosque.ArrayPage.create({masterArray:content,itemsPerPage:itemsPerPage,pageIndex:i}))
}page=this.addTab(page);this._pages.push(page)}}else{if(nbPagesNeeded<nbPagesCreated){for(i=nbPagesNeeded;
i<nbPagesCreated;i++){page=this._pages.pop();this.removeTab(page);page.set("content",null);
page.set("pageIndex",null);page.set("articlesGrid",null);this._pagesPool.push(page)
}}}this._updatePagesContent();this.navigateToTab(0);this.set("numberOfPages",this._pages.get("length"))
}.observes("*content.length","itemsPerPage"),_updatePagesContent:function(){var itemsPerPage=this.get("itemsPerPage"),totalItems=this.getPath("content.length"),nbPagesCreated=this._pages.get("length"),content=this.get("content");
var i,page,arrayPage;for(i=0;i<nbPagesCreated;i++){page=this._pages[i];arrayPage=Kiosque.ArrayPage.create({masterArray:content,itemsPerPage:itemsPerPage,pageIndex:i});
page.set("content",arrayPage)}}});Kiosque.SettingsView=SC.View.extend({classNames:"settings-panel".w(),childViews:"feedsLabel scroll newFeedSection buttonsSection".w(),feedsLabel:SC.LabelView.design({layout:{top:10,left:10,height:24,width:200},value:"Feeds"}),scroll:SC.ScrollView.design({classNames:"feeds".w(),layout:{top:35,right:10,left:10,height:150},contentView:SC.GridView.design({layout:{top:0,right:0,bottom:0,left:0},contentBinding:"Kiosque.sourcesController",contentValueKey:"name",columnWidth:240,rowHeight:25,canEditContent:YES,canDeleteContent:YES,exampleView:SC.LabelView.design({classNames:"feed-label".w()})})}),newFeedSection:SC.View.design({isVisible:NO,layout:{top:200,left:0,bottom:0,right:0},childViews:"nameLabel urlLabel nameField urlField addButton".w(),nameLabel:SC.LabelView.design({layout:{top:0,left:10,height:20,width:180},value:"Name:"}),urlLabel:SC.LabelView.design({layout:{top:0,left:200,height:20,width:200},value:"Url:"}),nameField:SC.TextFieldView.design({layout:{top:20,left:10,height:25,width:180},hint:"Name...",isPassword:NO,isTextArea:NO}),urlField:SC.TextFieldView.design({layout:{top:20,left:200,height:25,right:10},hint:"Url...",isPassword:NO,isTextArea:NO}),addButton:SC.ButtonView.design({layout:{bottom:10,right:10,height:24,width:100},title:"Add Feed",action:"addNewFeed",target:"Kiosque.sourcesController"})}),buttonsSection:SC.View.design({layout:{top:200,left:0,bottom:0,right:0},childViews:"newFeedButton deleteButton".w(),newFeedButton:SC.ButtonView.design({layout:{top:10,left:145,height:30,width:100},title:"New Feed",action:"showNewFeedSection",target:"Kiosque.settingsViewController",controlSize:SC.HUGE_CONTROL_SIZE}),deleteButton:SC.ButtonView.design({layout:{top:10,left:255,height:30,width:100},title:"Delete Feed",action:"deleteFeed",target:"Kiosque.settingsViewController",controlSize:SC.HUGE_CONTROL_SIZE})})});
require("views/articles_grid_view");require("views/article_view");require("views/image_button");
Kiosque.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"header grid footer article".w(),header:SC.View.design({layout:{top:0,right:0,left:0,height:120},classNames:"header".w(),childViews:"title feeds".w(),title:SC.LabelView.design({layout:{left:48,centerY:0,height:75,width:250},value:"Kiosque",tagName:"h1"}),feeds:SC.GridView.design({classNames:"feeds-view".w(),layout:{left:300,centerY:0,right:48,height:100},maxWidth:1024,contentValueKey:"name",contentBinding:"Kiosque.sourcesController.arrangedObjects",selectionBinding:"Kiosque.sourcesController.selection",columnWidth:150,rowHeight:50,canEditContent:NO,canDeleteContent:NO,exampleView:SC.LabelView.design({classNames:"feed-title".w()})})}),grid:Kiosque.ArticlesGridView.design({layout:{top:120,bottom:100,left:48,right:48},contentBinding:"Kiosque.articlesController.content",contentValueKey:"cover",selectionBinding:"Kiosque.articlesController.selection"}),footer:SC.View.design({layout:{bottom:0,right:0,left:0,height:75},classNames:"article-footer".w(),childViews:"feedsButton carrousel".w(),feedsButton:Kiosque.ImageButtonView.design({layout:{bottom:37,left:48,height:24,width:24},value:"/static/kiosque/en/v1/source/resources/images/settings.png",action:"showPickerPane",target:"Kiosque.sourcesController"}),carrousel:Iweb.CarrouselView.design({classNames:"carrousel-view".w(),layout:{bottom:32,centerX:0,width:250,height:35},maxWidth:600,contentValueKey:"name",contentBinding:"Kiosque.thumbsController.arrangedObjects",selectionBinding:"Kiosque.thumbsController.selection",columnWidth:45,rowHeight:30,exampleView:SC.LabelView.design({classNames:"carrousel-label".w()})})}),article:Kiosque.ArticleView.design({isVisible:YES})})});