Carrousel=SC.Application.create({NAMESPACE:"Carrousel",VERSION:"0.1.0"});Carrousel.thumbsController=SC.ArrayController.create({init:function(){}});Carrousel.Theme=SC.AceTheme.create({name:"carrousel"});SC.Theme.addTheme(Carrousel.Theme);SC.defaultTheme="carrousel";Carrousel.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"carrousel".w(),labelView:SC.LabelView.design({layout:{centerX:0,centerY:0,width:200,height:18},textAlign:SC.ALIGN_CENTER,tagName:"h1",value:"Welcome to SproutCore!"}),carrousel:Iweb.CarrouselView.design({layout:{centerY:0,centerX:0,width:300,height:60},contentValueKey:"order",contentBinding:"Carrousel.thumbsController.arrangedObjects",selectionBinding:"Carrousel.thumbsController.selection",columnWidth:60,rowHeight:60,exampleView:SC.LabelView.design({classNames:"fantasy-label".w()})}),scrollView:SC.ScrollView.design({backgroundColor:"white",layout:{centerY:0,centerX:0,width:300,height:60},canScrollVertical:NO,hasVerticalScroller:NO,alwaysBounceHorizontal:YES,alwaysBounceVertical:NO,_applyCSSTransforms:function(b){var a="";this.updateScale(this._scale);a+="translate3d("+-this._scroll_horizontalScrollOffset+"px, "+-Math.round(this._scroll_verticalScrollOffset)+"px,0) ";a+=this._scale_css;if(b){SC.Logger.debug("webkitTransform %@... %@".fmt(a,this));b.style.webkitTransformOrigin="top left"}},contentView:SC.GridView.design({backgroundColor:"gray",layout:{top:0,left:0,width:300,height:60},contentValueKey:"order",contentBinding:"Carrousel.thumbsController.arrangedObjects",selectionBinding:"Carrousel.thumbsController.selection",columnWidth:60,rowHeight:60,layoutForContentIndex:function(c){var a=this.get("rowHeight")||48,b=this.get("columnWidth")||48;return{left:c*b,top:0,height:a,width:b}},computeLayout:function(){var e=this.get("content"),d=(e)?e.get("length"):0,c=this.get("rowHeight")||48,g=this.get("columnWidth")||48,a=(d)?d:0,f=Math.ceil(d/a);var b=this._cachedLayoutHash;if(!b){b=this._cachedLayoutHash={}}b.minHeight=f*c;this.calculatedHeight=b.minHeight;b.minWidth=d*g;this.calculatedWidth=b.minWidth;return b}})})})});Carrousel.main=function main(){Carrousel.getPath("mainPage.mainPane").append();var a=[];for(var c=10;c>=0;c--){var b=SC.Object.create({order:c});a.push(b)}Carrousel.thumbsController.set("content",a)};function main(){Carrousel.main()};