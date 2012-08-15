/* >>>>>>>>>> BEGIN source/lproj/strings.js */
// ==========================================================================
// Project:   Iweb Strings
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//
SC.stringsFor('English', {
  // "_String Key": "Localized String"
}) ;

/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   Iweb
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @namespace

  My cool new framework.  Describe your framework.
  
  @extends SC.Object
*/
Iweb = SC.Object.create(
  /** @scope Iweb.prototype */ {

  NAMESPACE: 'Iweb',
  VERSION: '0.1.0',

  // TODO: Add global constants or singleton objects needed by your app here.

}) ;


/* >>>>>>>>>> BEGIN __sc_chance.js */
if (typeof CHANCE_SLICES === 'undefined') var CHANCE_SLICES = [];CHANCE_SLICES = CHANCE_SLICES.concat([]);

/* >>>>>>>>>> BEGIN source/views/carrousel.js */
// ==========================================================================
// Project:   IWeb.CarrouselView
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @class

  Container view for laying out items horizontally.

  @author Cherif Yaya
  @extends SC.View
*/
Iweb.CarrouselView = SC.View.extend(
/** @scope Iweb.CarrouselView.prototype */ {
  classNames: 'sc-carrousel-view'.w(),
  
  /**
    
    
    @type String
    @default null
  */
  contentValueKey: null,
  
  /**
    
    
    @type String
    @default null
  */
  contentIconKey: null,
  
  /**
    Array containing the items to be displayed
    
    @type Array
    @default null
  */
  content: null,
  
  /**
    Current selection object.
    
    @type SC.Object
    @default null
  */
  selection: null,
  
  /**
    Width of each column
    
    @type Number
    @default 48
  */
  columnWidth: 48,
  
  /**
    Height of the items
    
    @type Number
    @default 48
  */
  rowHeight: 48,
  
  /**
    Max width that this carrousel view can grow to.
    By default the view resizes itself to fit its children items.
    Depending on the columWidth and the amount of items.
    
    @type Number
    @default 1024
  */
  maxWidth: 1024,
  
  /**
    Action called when an item is clicked
    
    @type String
    @default null
  */
  action: null,
  
  /**
    Default view loaded by default. This is the root view of the hierarchy
    
    @type Object
    @default null
  */
  target: null,
  
  /**
    Default view loaded by default. This is the root view of the hierarchy
    
    @type SC.View
    @default null
  */
  exampleView: SC.LabelView,

	
	/** @private */
	init: function() {
		arguments.callee.base.apply(this,arguments);
		
		var gridView = this.getPath('scrollView.contentView');
		
		if (gridView) {
		  //set carrousel view to trigger all bound properties update
		  gridView.set('carrouselView',this);
		  /*
		  gridView.set('columnWidth',this.get('columnWidth'));
		  gridView.set('rowHeight',this.get('rowHeight'));
		  gridView.set('contentValueKey',this.get('contentValueKey'));
		  gridView.set('contentIconKey',this.get('contentIconKey'));
		  gridView.set('action',this.get('action'));
		  gridView.set('target',this.get('target'));
		  gridView.set('exampleView',this.exampleView);
		  */
		}
	}, 
	
	/** @private */
	childViews: 'scrollView'.w(),
	
	/** @private */
	gridView: function() {
	  return this.getPath('scrollView.contentView');
	}.property(),
	
	contentLengthDidChange: function() {
	  var maxWidth = this.get('maxWidth') || 1024,
	      length = this.getPath('content.length'),
	      columnWidth = this.get('columnWidth') || 48;
	  
	  //set width to fit exactly the current amount of items
	  //unless it crosses above the max width
	  var computedWidth = Math.min(length * columnWidth, maxWidth) ;
	  this.adjust({width: computedWidth}) ;
	}.observes('*content.length'),
	
	/** @private */
	scrollView: SC.ScrollView.design({
	  layout: {left:0, right:0, top:0, bottom:0},
	  canScrollVertical: NO,
	  hasVerticalScroller: NO,
	  alwaysBounceHorizontal: YES,
    alwaysBounceVertical: NO,
	  
	  contentView: SC.GridView.design({
	    classNames: 'sc-carrousel-grid-view'.w(),
	    carrouselView: null,
	    layout: {top:0, bottom: 0, left:0},
	    contentValueKeyBinding: '*carrouselView.contentValueKey',
      contentIconKey: '*carrouselView.contentIconKey',
      contentBinding: '*carrouselView.content',
      selectionBinding: '*carrouselView.selection',
      actionBinding: '*carrouselView.action',
      targetBinding: '*carrouselView.target',
      columnWidthBinding: '*carrouselView.columnWidth',
      rowHeightBinding: '*carrouselView.rowHeight',
      exampleViewBinding: '*carrouselView.exampleView',
      maxWidthBinding: '*carrouselView.maxWidth',
      canEditContent: NO,
      canDeleteContent: NO,

      /** @private 
        Overrides default CollectionView method to compute the layout of each item
      */
      layoutForContentIndex: function(contentIndex) {
        var rowHeight = this.get('rowHeight') || 48,
            columnWidth = this.get('columnWidth') || 48;
        return { 
          left: contentIndex * columnWidth,
          top: 0,
          height: rowHeight,
          width: columnWidth
        };
      },
      
      /** @private
        Overrides default CollectionView method to compute the minimim height and width
        of the list view.
      */
      computeLayout: function() {
        var content = this.get('content'),
            count = (content) ? content.get('length') : 0,
            rowHeight = this.get('rowHeight') || 48,
            columnWidth = this.get('columnWidth') || 48,
            itemsPerRow = (count) ? count : 1,
            rows = Math.ceil(count / itemsPerRow) ;

        // use this cached layout hash to avoid allocatining memory...
        var ret = this._cachedLayoutHash ;
        if (!ret) ret = this._cachedLayoutHash = {};

        // set minHeight
        ret.minHeight = Math.max(rows * rowHeight, rowHeight) ;
        this.calculatedHeight = ret.minHeight;
        
        //set minWidth
        ret.minWidth = count * columnWidth;
        this.calculatedWidth = ret.minWidth;
        return ret; 
      }
    })
	})
});

/* >>>>>>>>>> BEGIN source/views/i_scene.js */
// ==========================================================================
// Project:   Iweb.ISceneView
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Oritide */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Iweb.ISceneView = SC.SceneView.extend(
/** @scope Oritide.OritideSceneView.prototype */ {

  /** @private
  
    Invoked whenever we need to animate in the new scene.
  */
  animateScene: function(newContent) {
    var oldContent = this._targetView,
        outIdx     = this._targetIndex,
        scenes     = this.get('scenes'),
        inIdx      = scenes ? scenes.indexOf(this.get('nowShowing')) : -1,
        layout;

    if (outIdx<0 || inIdx<0 || outIdx===inIdx) {
      return this.replaceScene(newContent);
    }

    this._targetView = newContent ;
    this._targetIndex = inIdx; 
    
    // save some info needed for animation
    if (inIdx > outIdx) {
      this._leftView  = oldContent;
      this._rightView = newContent;
      this._target    = SC.TO_LEFT;
    } else {
      this._leftView  = newContent ;
      this._rightView = oldContent ;
      this._target    = SC.TO_RIGHT;
    }

    // setup views
    this.removeAllChildren();

    if (oldContent) this.appendChild(oldContent)
    if (newContent) this.appendChild(newContent);
		
		var transitionDuration = this.get('transitionDuration');

    // setup other general state
    this._start   = Date.now();
    this._end     = this._start + transitionDuration;
		if (this._start == this._end) return this.replaceScene(this._targetView);
		
    this._state   = this.ANIMATING;
    
		//layout = SC.clone(this.get('frame'));
		transitionDuration = transitionDuration * 1.0 / 1000;
		
		var navigationTransitions = {
			left: { duration: transitionDuration, timing: SC.Animatable.TRANSITION_EASE_IN_OUT, action: "animationDidFinish" },
			transform: { duration: transitionDuration, timing: SC.Animatable.TRANSITION_EASE_IN_OUT, action: 'animationDidFinish' }
    };
		
		var sceneView = this;
		
		//mixin SC.Animatable if needed
		if (!this._leftView.isAnimatable) {
			this._leftView.mixin(SC.Animatable);			
		}
		//to be notified
		if (!this._leftView.animationDidFinish) {
			SC.mixin(this._leftView,{
				animationDidFinish: function() {
					sceneView.animationDidFinish("left");
				}
			});
			SC.mixin(this._leftView.transitions, navigationTransitions);
		};
		
		
		if (!this._rightView.isAnimatable) {
			this._rightView.mixin(SC.Animatable);			
		}
		//to be notified at the end
		if (!this._rightView.animationDidFinish) {
			SC.mixin(this._rightView,{
				animationDidFinish: function() {
					sceneView.animationDidFinish("right");
				}
			});
			SC.mixin(this._rightView.transitions, navigationTransitions);
		};
		
		//animate
		var metrics = this._leftView.computeFrameWithParentFrame();
    this._leftView.disableAnimation();
		this._rightView.disableAnimation();
		
		if (this._target === SC.TO_LEFT) {
			
			this._leftView.set('layout',{left: 0, width: metrics.width, top: 0, bottom: 0});
			this._rightView.set('layout',{left: metrics.width, width: metrics.width, top: 0, bottom: 0});
		}
		else {
			this._leftView.set('layout',{left: -metrics.width, width: metrics.width, top: 0, bottom: 0});
			this._rightView.set('layout',{left: 0, width: metrics.width, top: 0, bottom: 0});
		}
		
    this._leftView.enableAnimation();
		this._rightView.enableAnimation();
		
		
		if (this._target === SC.TO_LEFT) {
			this.invokeLater("transform", 10, -metrics.width);
		}
		else {
			this.invokeLater("transform", 10, metrics.width);
		}
		
  },

	/**
    @private
    Applies the supplied CSS transform.
  */
  transform: function(translation) {
		var pos = translation;
		SC.Logger.info("transforming..."+pos);
		/*
		var f1 = this._leftView.computeFrameWithParentFrame();
		var f2 = this._rightView.computeFrameWithParentFrame();
		
   	var leftL = this._leftView.computeFrameWithParentFrame().x, rightL = this._rightView.computeFrameWithParentFrame().x;
		var width = this._leftView.computeFrameWithParentFrame().width;
		
    this._leftView.set('layout', {left: (leftL+translation), width: width, top: 0, bottom: 0});
		this._rightView.set('layout', {left: (rightL+translation), width: width, top: 0, bottom: 0});
		*/
		
		if (SC.Animatable.enableCSS3DTransforms) {
      this._leftView.adjust("transform", "translate3d(" + pos + "px,0px,0px)");
			this._rightView.adjust("transform", "translate3d(" + pos + "px,0px,0px)");
    } else {
      this._leftView.adjust("transform", "translate(" + pos + "px,0px)");
			this._rightView.adjust("transform", "translate(" + pos + "px,0px)");
    }
    
  },

	animationDidFinish: function(msg) {
		SC.Logger.info("animationDidFinish..."+msg);
		this._leftView.disableAnimation();
		this._rightView.disableAnimation();
		this.transform(0);
		
		return this.replaceScene(this._targetView);
	}

});

/* >>>>>>>>>> BEGIN source/views/i_table.js */
// ==========================================================================
// Project:   Tab.ITableView
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Tab */

/** @class

  Iphone Like table view that displays a vertical list of items.
	Items can be configured to have a left icon, a right icon,
	an accessory arrow on the right and an optional detail label
	beneath the main label.

  @extends SC.View
*/
Iweb.ITableView = SC.View.extend(
/** @scope IWeb.ITableView.prototype */ {
	rowHeight: 44,
	contentValueKey: null,
	detailValueKey: null,
	hasContentBranch: YES,
	contentIsBranchKey: null,
	hasContentIcon: NO,
	contentIconKey: null,
	hasContentRightIcon: NO,
	contentRightIconKey: null,
	showAlternatingRows: NO,
	content: null,
	selectionBinding: '*.listView.selection',
	action: null,
	target: null,
	spinnerVisible: NO,
	
	spinnerVisibleDidChange: function() {
		var spinnerVisible = this.get('spinnerVisible');
		if (this.spinnerView) this.spinnerView.set('isVisible',spinnerVisible);
	}.observes("spinnerVisible"),

  createChildViews: function() {
		var childViews = [], scrollView, listView, spinnerView;
		
		spinnerView = this.createChildView(
			SC.ImageView.design({
				classNames: 'i-table-view-spinner'.w(),
			  layout: { centerX: 0, width: 32, centerY: 0, height: 32 },
			  value: '/static/iweb/iweb/en/8498bf98aafde7a13947f9a6c55157d7ee9d6a7d/source/spinner.gif',
				isVisible: NO
			})
		);
		this.set('spinnerView',spinnerView);
		childViews.push(spinnerView);
		
		var tableView = this;
		
		listView = SC.ListView.create({
			classNames: 'i-table-view'.w(),
		  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			actOnSelect: YES,
			rowHeight: tableView.get('rowHeight'),
			contentValueKey: tableView.get('contentValueKey'),
			detailValueKey: tableView.get('detailValueKey'),
			hasContentBranch: tableView.get('hasContentBranch'),
			contentIsBranchKey: tableView.get('contentIsBranchKey'),
			hasContentIcon: tableView.get('hasContentIcon'),
			contentIconKey: tableView.get('contentIconKey'),
			hasContentRightIcon: tableView.get('hasContentRightIcon'),
			contentRightIconKey: tableView.get('contentRightIconKey'),
			showAlternatingRows: tableView.get('showAlternatingRows'),
			action: tableView.get('action'),
			target: tableView.get('target'),
			exampleView: SC.ListItemView.extend({
				classNames: 'i-list-item-view'.w(),
				
				createRenderer: function(theme) {			
					//override some rendering method
					var meths = {
						//override to render detail label when detailValueKey provided
						render: function(context, firstTime) {
							var indent = this.outlineIndent,
					        level = this.outlineLevel;

					    this.renderControlRenderer(context);

					    //context.setClass(this.calculateClasses());

					    context = context.begin("div").addClass("sc-outline");

					    if (level>=0 && indent>0) {
					      context.addStyle("left", indent * (level+1));
					    }

					    this.renderDisclosure(context);
					    this.renderCheckbox(context);
					    this.renderIcon(context);
					    this.renderLabel(context);
					    this.renderRightIcon(context);
					    this.renderCount(context);
					    this.renderBranch(context);

					    context = context.end(); // end outline

							this.renderDetailLabel(context);				    
						},

						//override to add the has-detail class when we have a detail label
						renderLabel: function(context) {
							var label = this.escapeHTML ? SC.RenderContext.escapeHTML(this.label) : this.label;
					    if(!SC.none(this.detailLabel)) {
								context.push('<label class="has-detail">', label || '', '</label>') ;
							}
							else context.push('<label>', label || '', '</label>') ;
					  },

						//render detail label
						renderDetailLabel: function(context, label) {
							if(!SC.none(this.detailLabel)) {
								context.push('<div><label class="detail">', this.detailLabel || '', '</label></div>') ;
							}
					  }
					};
					
					theme.detailListItem = theme.ListItem.create(meths);
					
			    return theme.detailListItem();
			  },
				
				updateRenderer: function(renderer) {
					arguments.callee.base.apply(this,arguments);
					
					var content = this.get('content'),
			        del = this.displayDelegate,
			        key, value;
			
					var attrs = {};
					
					if(this.getDelegateProperty('detailValueKey',del)) {
						key = this.getDelegateProperty('detailValueKey', del) ;
				    value = (key && content) ? (content.get ? content.get(key) : content[key]) : content ;
				    if (value && SC.typeOf(value) !== SC.T_STRING) value = value.toString();
				    attrs.detailLabel = value;
					}
					
					renderer.attr(attrs);					
				}
			}),
			
			selectionDidChange: function() {
				tableView.set('selection',this.get('selection'));
			}.observes('selection'),
			
			OfftouchStart: function(touch, evt) {
		    // When the user presses the mouse down, we don't do much just yet.
		    // Instead, we just need to save a bunch of state about the mouse down
		    // so we can choose the right thing to do later.

		    // Toggle selection only triggers on mouse up.  Do nothing.
		    if (this.get('useToggleSelection')) return true;

		    // find the actual view the mouse was pressed down on.  This will call
		    // hitTest() on item views so they can implement non-square detection
		    // modes. -- once we have an item view, get its content object as well.
		    var itemView      = this.itemViewForEvent(touch),
		        content       = this.get('content'),
		        contentIndex  = itemView ? itemView.get('contentIndex') : -1,
		        info, anchor ;

		    // become first responder if possible.
		    this.becomeFirstResponder() ;
				
				//select right away before raising action on target
				//to avoid incoherence of selection values
				this.select(contentIndex);

		    return YES;
		  }
		});
		this.set('listView', listView);
		
		
		scrollView = this.createChildView(
			SC.ScrollView.design({
				delaysContentTouches: NO,
				alwaysBounceVertical: NO,
				OfftouchWrapUp: function() {
					// we can reset the timeout, as it will no longer be required, and we don't want to re-cancel it later.
			    //this.touch = null;


			    // trigger scroll end
			    this._touchScrollDidChange();

			    // set the scale, vertical, and horizontal offsets to what they technically already are,
			    // but don't know they are yet. This will finally update things like, say, the clipping frame.
			    this.beginPropertyChanges();
			    this.set("scale", this._scale);
			    this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
			    this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
			    this.endPropertyChanges();

			    return;
				},
				
				OfftouchEnd: function(touch) {
			    var touchStatus = this.touch,
			        avg = touch.averagedTouchesForView(this);

			    touch.scrollHasEnded = YES;
			    if (avg.touchCount > 0) {
			      this.beginTouchTracking(touch, NO);
			    } else {
			      if (this.dragging) {
			        touchStatus.dragging = NO;

			        // reset last event time
			        touchStatus.lastEventTime = touch.timeStamp;

			        this.startDecelerationAnimation();
							//this.touchWrapUp();
			      } else {
			        // this part looks weird, but it is actually quite simple.
			        // First, we send the touch off for capture+starting again, but telling it to return to us
			        // if nothing is found or if it is released.
			        touch.captureTouch(this, YES);

			        // if we went anywhere, did anything, etc., call end()
			        if (touch.touchResponder && touch.touchResponder !== this) {
			          touch.end();
			        }

			        // now check if it was released to us or stayed with us the whole time, or is for some
			        // wacky reason empty (in which case it is ours still). If so, and there is a next responder,
			        // relay to that.
			        if (!touch.touchResponder || touch.touchResponder === this) {
			          if (touch.nextTouchResponder) touch.makeTouchResponder(touch.nextTouchResponder);
			        } else {
			          // in this case, the view that captured it and changed responder should have handled
			          // everything for us.
			        }
			      }

			      this.tracking = NO;
			      this.dragging = NO;
			    }
			  },
			
				OffdecelerateAnimation: function() {
			    // get a bunch of properties. They are named well, so not much explanation of what they are...
			    // However, note maxOffsetX/Y takes into account the scale;
			    // also, newX/Y adds in the current deceleration velocity (the deceleration velocity will
			    // be changed later in this function).
			    var touch = this.touch,
			        scale = this._scale,
			        minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign")),
			        minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign")),
			        maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign")),
			        maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign")),

			        now = Date.now(),
			        t = Math.max(now - touch.lastEventTime, 1),

			        newX = this._scroll_horizontalScrollOffset + touch.decelerationVelocity.x * (t/10),
			        newY = this._scroll_verticalScrollOffset + touch.decelerationVelocity.y * (t/10);

			    var de = touch.decelerationFromEdge, ac = touch.accelerationToEdge;

			    // under a few circumstances, we may want to force a valid X/Y position.
			    // For instance, if bouncing is disabled, or if position was okay before
			    // adjusting scale.
			    var forceValidXPosition = !touch.enableBouncing, forceValidYPosition = !touch.enableBouncing;

			    // determine if position was okay before adjusting scale (which we do, in
			    // a lovely, animated way, for the scaled out/in too far bounce-back).
			    // if the position was okay, then we are going to make sure that we keep the
			    // position okay when adjusting the scale.
			    //
			    // Position OKness, here, referring to if the position is valid (within
			    // minimum and maximum scroll offsets)
			    if (newX >= minOffsetX && newX <= maxOffsetX) forceValidXPosition = YES;
			    if (newY >= minOffsetY && newY <= maxOffsetY) forceValidYPosition = YES;

			    // We are going to change scale in a moment, but the position should stay the
			    // same, if possible (unless it would be more jarring, as described above, in
			    // the case of starting with a valid position and ending with an invalid one).
			    //
			    // Because we are changing the scale, we need to make the position scale-neutral.
			    // we'll make it non-scale-neutral after applying scale.
			    //
			    // Question: might it be better to save the center position instead, so scaling
			    // bounces back around the center of the screen?
			    newX /= this._scale;
			    newY /= this._scale;

			    // scale velocity (amount to change) starts out at 0 each time, because 
			    // it is calculated by how far out of bounds it is, rather than by the
			    // previous such velocity.
			    var sv = 0;

			    // do said calculation; we'll use the same bouncyBounce method used for everything
			    // else, but our adjustor that gives a minimum amount to change by and (which, as we'll
			    // discuss, is to make the stop feel slightly more like a stop), we'll leave at 0 
			    // (scale doesn't really need it as much; if you disagree, at least come up with 
			    // numbers more appropriate for scale than the ones for X/Y)
			    sv = this.bouncyBounce(sv, scale, touch.minimumScale, touch.maximumScale, de, ac, 0);

			    // add the amount to scale. This is linear, rather than multiplicative. If you think
			    // it should be multiplicative (or however you say that), come up with a new formula.
			    this._scale = scale = scale + sv;

			    // now we can convert newX/Y back to scale-specific coordinates...
			    newX *= this._scale;
			    newY *= this._scale;

			    // It looks very weird if the content started in-bounds, but the scale animation
			    // made it not be in bounds; it causes the position to animate snapping back, and,
			    // well, it looks very weird. It is more proper to just make sure it stays in a valid
			    // position. So, we'll determine the new maximum/minimum offsets, and then, if it was
			    // originally a valid position, we'll adjust the new position to a valid position as well.


			    // determine new max offset
			    minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign"));
			    minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign"));
			    maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign"));
			    maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign"));

			    // see if scaling messed up the X position (but ignore if 'tweren't right to begin with).
			    if (forceValidXPosition && (newX < minOffsetX || newX > maxOffsetX)) {
			      // Correct the position
			      newX = Math.max(minOffsetX, Math.min(newX, maxOffsetX));

			      // also, make the velocity be ZERO; it is obviously not needed...
			      touch.decelerationVelocity.x = 0;
			    }

			    // now the y
			    if (forceValidYPosition && (newY < minOffsetY || newY > maxOffsetY)) {
			      // again, correct it...
			      newY = Math.max(minOffsetY, Math.min(newY, maxOffsetY));

			      // also, make the velocity be ZERO; it is obviously not needed...
			      touch.decelerationVelocity.y = 0;
			    }


			    // now that we are done modifying the position, we may update the actual scroll
			    this._scroll_horizontalScrollOffset = newX;
			    this._scroll_verticalScrollOffset = newY;

			    this._applyCSSTransforms(touch.layer); // <- Does what it sounds like.

			    SC.RunLoop.begin();
			    //this._touchScrollDidChange();
					this.touchWrapUp();
			    SC.RunLoop.end();

			    // Now we have to adjust the velocities. The velocities are simple x and y numbers that
			    // get added to the scroll X/Y positions each frame.
			    // The default decay rate is .950 per frame. To achieve some semblance of accuracy, we
			    // make it to the power of the elapsed number of frames. This is not fully accurate,
			    // as this is applying the elapsed time between this frame and the previous time to
			    // modify the velocity for the next frame. My mind goes blank when I try to figure out
			    // a way to fix this (given that we don't want to change the velocity on the first frame),
			    // and as it seems to work great as-is, I'm just leaving it.
			    var decay = touch.decelerationRate;
			    touch.decelerationVelocity.y *= Math.pow(decay, (t / 10));
			    touch.decelerationVelocity.x *= Math.pow(decay, (t / 10));

			    // We have a bouncyBounce method that adjusts the velocity for bounce. That is, if it is
			    // out of range and still going, it will slow it down. This step is decelerationFromEdge.
			    // If it is not moving (or has come to a stop from decelerating), but is still out of range, 
			    // it will start it moving back into range (accelerationToEdge)
			    // we supply de and ac as these properties.
			    // The .3 artificially increases the acceleration by .3; this is actually to make the final
			    // stop a bit more abrupt.
			    touch.decelerationVelocity.x = this.bouncyBounce(touch.decelerationVelocity.x, newX, minOffsetX, maxOffsetX, de, ac, 0.3);
			    touch.decelerationVelocity.y = this.bouncyBounce(touch.decelerationVelocity.y, newY, minOffsetY, maxOffsetY, de, ac, 0.3);

			    // if we ain't got no velocity... then we must be finished, as there is no where else to go.
			    // to determine our velocity, we take the absolue value, and use that; if it is less than .01, we
			    // must be done. Note that we check scale's most recent velocity, calculated above using bouncyBounce,
			    // as well.
			    var absXVelocity = Math.abs(touch.decelerationVelocity.x);
			    var absYVelocity = Math.abs(touch.decelerationVelocity.y);
			    if (absYVelocity < 0.01 && absXVelocity < 0.01 && Math.abs(sv) < 0.01) {
			      // we can reset the timeout, as it will no longer be required, and we don't want to re-cancel it later.
			      touch.timeout = null;
			      this.touch = null;

			      // we aren't in a run loop right now (see below, where we trigger the timer)
			      // so, we must start one.
			      SC.RunLoop.begin();

			      // trigger scroll end
			      this._touchScrollDidEnd();

			      // set the scale, vertical, and horizontal offsets to what they technically already are,
			      // but don't know they are yet. This will finally update things like, say, the clipping frame.
			      this.beginPropertyChanges();
			      this.set("scale", this._scale);
			      this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
			      this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
			      this.endPropertyChanges();

			      // and now we're done, so just end the run loop and return.
			      SC.RunLoop.end();
			      return;
			    }

			    // We now set up the next round. We are doing this as raw as we possibly can, not touching the
			    // run loop at all. This speeds up performance drastically--keep in mind, we're on comparatively
			    // slow devices, here. So, we'll just make a closure, saving "this" into "self" and calling
			    // 10ms later (or however long it takes). Note also that we save both the last event time
			    // (so we may calculate elapsed time) and the timeout we are creating, so we may cancel it in future.
			    var self = this;
			    touch.lastEventTime = Date.now();
			    this.touch.timeout = setTimeout(function(){
			      SC.RunLoop.begin();
			      self.decelerateAnimation();
			      SC.RunLoop.end();
			    }, 10);
			  },
			})
		);
		childViews.push(scrollView);
		scrollView.set('contentView', listView) ;
		
		this.set('childViews', childViews);
	},
	
	contentDidChange: function() {
		this.get('listView').set('content', this.get('content'));
	}.observes('content')

});

/* >>>>>>>>>> BEGIN source/views/navigation.js */
// ==========================================================================
// Project:   IWeb.NavigationView
// Copyright: ©2011 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @class

  Wrapper class around the excellent SC.NavigationView. 
  When a view is pushed in and its topToolbqr property is not present 
  this subclass automatically adds a back button with the title
	of the previous view in the stack as label. If you don't want this
	default button, set the leftBarView attribute of the toolbar class
	you're providing to your custom view.
	
	To load view by default, set the rootView property.

  @author Cherif Yaya
  @extends SC.View
*/
Iweb.NavigationView = SC.View.extend(
/** @scope IWeb.NavigationView.prototype */ {
  /**
    Default view loaded by default. This is the root view of the hierarchy
    
    @type SC.View
    @default null
  */
	rootView: null,
	
	/**
    If YES, then the previous view in the stack will be displayed on the left
    along the current view when a landscape orientation is detected.
    
    *Experimental*
    
    @type Boolean
    @default NO
  */
	masterDetailOnLandscape: NO,
	
	/**
    Tracks the orientation of the view. Possible values:
    
      - SC.HORIZONTAL_ORIENTATION
      - SC.PORTRAIT_ORIENTATION
    
    @field
    @type String
    @default SC.HORIZONTAL_ORIENTATION
  */
  orientation: function() {
    var f = this.get("frame");
    if (f.width > f.height) return SC.HORIZONTAL_ORIENTATION;
    else return SC.VERTICAL_ORIENTATION;
  }.property("frame").cacheable(),
	
	/**
	 Pushes a view into the navigation view stack. The view may have topToolbar and bottomToolbar properties.
	 
	 @param {SC.View} view View to be pushed on the view stack 
	*/
	push: function(view){
	  if (this.navigationView) this.navigationView.push(view);
	  if (this.masterDetailOnLandscape) this.invokeOnce('updateDisplayedViews');
	},
	
	/**
	 Pops the current view off the navigation view stack.
	 
	 @returns {SC.View}
	*/
	pop: function(){
	  if (this.navigationView) return this.navigationView.pop();
	  if (this.masterDetailOnLandscape) this.invokeOnce('updateDisplayedViews');
	},
	
	/**
	 Pops to the specified view on the navigation view stack; the view you pass will become the current view.
	 
	 @param {SC.View} view View to be pushed on the view stack 
	*/
	popToView: function(view){
	  if (this.navigationView) this.navigationView.popToView(view);
	  if (this.masterDetailOnLandscape) this.invokeOnce('updateDisplayedViews');
	},
	
	
	/** @private */
	init: function() {
		arguments.callee.base.apply(this,arguments);
		
		var rootView = this.get('rootView');
		if(!SC.none(rootView)) {
			if(rootView.isClass) {
				rootView = this.createChildView(rootView);
				this.set('rootView',rootView);
			}
			if (this.navigationView) this.navigationView.push(rootView);
		}
	},
	
	/** @private */
	childViews: 'navigationView masterContainer'.w(),
	
	/** @private */
	masterContainer: SC.ContainerView.design({
	  layout: {top:0,right:0,bottom:0,left:0 },
	  isVisible: NO
	}),
	
	/** @private 
	*/
	orientationDidChange: function() {
	  var orientation = this.get('orientation'),
	      masterDetailOnLandscape = this.get('masterDetailOnLandscape');
	      
	  if (orientation == SC.HORIZONTAL_ORIENTATION && masterDetailOnLandscape) this.setIfChanged('masterIsHidden',NO);
	  else  this.setIfChanged('masterIsHidden',YES);
	}.observes('orientation', 'masterDetailOnLandscape'),
	
	/** @private */
	masterIsHiddenDidChange: function() {
	  var masterIsHidden = this.get('masterIsHidden');
	      
	  if (masterIsHidden) {
	    //hides master view 
	    this.masterContainer.set('isVisible', NO);    
	    
	    //adjust the navation width back to the total width
	    this.navigationView.set('layout', {left: 0, right:0, top: 0, bottom:0 });
	  }
	  else {
	    //display master container and resize navigationView
	    //according to a 1/3 - 2/3 proportion
	    var f = this.get('frame');
	    var masterWidth = Math.floor(f.width/3),
	        detailWidth = Math.floor(f.width*2/3);
	      
	    //make sure the master container is visible and adjust its width
	    this.masterContainer.set('isVisible',YES);    
	    this.masterContainer.set('layout', {top: 0, bottom: 0, left: 0, width: masterWidth});
	    
	    //adjust the navation width to be 2/3 of the total width
	    this.navigationView.set('layout', {width: detailWidth, right:0, top: 0, bottom:0 });
	  }
	  
	  this.updateDisplayedViews(masterIsHidden);
	  
	}.observes('masterIsHidden'),
	
	updateDisplayedViews: function() {
	  var masterIsHidden = this.get('masterIsHidden');
	  var leftView, rightView;
	  var stack = this.navigationView._views;
	  
	  var currentView, previousView;
	  
	  if (masterIsHidden) {
	    //when hiding master container
	    //update navigation view with master view if no current view defined
	    currentView = this.navigationView._current;
	    if (SC.none(currentView)) {
	      
	      currentView = this.getPath('masterContainer.contentView');
	      this.masterContainer.removeChild(currentView);
	      this.navigationView.push(currentView);
      }
	    
	  }
	  else {
	    //when showing master, display the previous view in the master container
	    //if no previous view, display the current view (which is the root view)
	    //in the master container. the detail view will be empty
	    currentView = this.navigationView._current;
	    previousView = null;
	    if (stack.length > 0) previousView = stack[stack.length -1];
	    
	    if (!SC.none(previousView)) {
	      this.masterContainer.set('contentView',previousView);
	    }
	    else {
	      //no previous view in the stack. use the current view in the master container
	      this.navigationView.pop();
	      
	      this.masterContainer.set('contentView',currentView); 
	    }
	  }
	  
	},
	
	/** @private */
	navigationView: SC.NavigationView.design({
	  layout: {top: 0, left: 0, bottom: 0, right: 0},
	  
	  /** @private 
	    Overriden to add a back button if none provided
	  */
    topToolbarDidChange: function() {
  		var topToolbar = this.get('topToolbar');

  		var views = this._views;


  		//add back button if no leftBarView provided
  		if(topToolbar && !topToolbar.get('leftBarView') && views.length >= 1) {
  			var previousView = views[views.length-1];
  			//make sure title is not empty or undefined 
  			var title = SC.empty(previousView.title) ? 'Back' : previousView.title;

  			var leftButton = SC.ButtonView.create({
  			  layout: { left: 10, width: 90, top: 6 },
  			  title: title,
  			  action: 'pop',
  			  target: this,
  				theme: 'point-left',
  				controlSize: SC.HUGE_CONTROL_SIZE
  			});

  			topToolbar.appendChild(leftButton);
  			topToolbar.set('leftBarView', leftButton);
  		}

  		arguments.callee.base.apply(this,arguments);
  	}
	})

});

/* >>>>>>>>>> BEGIN source/views/tab_control.js */
// ==========================================================================
// Project:   Iweb.TabControlView
// Copyright: ©2011 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @class

  Tab control class. It allows to display a set of views
	in a tab like fashion with a tab bar at the bottom.
  
  @author Cherif Yaya
  @extends SC.View
*/
Iweb.TabBarItem = SC.Object.extend({
	title: null,
	view: null,
	image: null
});

Iweb.IPHONE_TAB_BAR_SIZE = 44;
Iweb.IPAD_TAB_BAR_SIZE = 24;

/** @class

  Tab control class. It allows to display a set of views
	in a tab like fashion with a tab bar at the bottom.
  
  @author Cherif Yaya
  @extends SC.View
*/
Iweb.TabControlView = SC.View.extend(
/** @scope Iweb.TabControlView.prototype */ {
  
  /**
    Array containing path of views to be initially loaded as tabs at loading time. 
    The path can be absolute or relative. In the latter case, they should be defined in the tab control view object itself.
    More tabs can be added at runtime using the TabControlView#addTab method.
    @type {Array}
    @default Empty Array
  */
	tabs: [],
	
	/**
    Currently showing tab name. Setting this value results in the control navigating
    to the tab with the new name (if any).
    
    @type {String}
    @default null
  */
	nowShowing: null,
	
	/**
    If YES, tab bar is displayed. Else, it is hidden.
    
    @type {Boolean}
    @default YES
  */
	isTabBarVisible: YES,
	
	/**
    Duration of tab change animation.
    
    @type {Number}
    @default 250
  */
	transitionDuration: 250,
	
	/**
    If YES, user can navigate between tabs by flicking horizontally on the screen.
    
    @type {Boolean}
    @default YES
  */
	flickToNavigate: YES,
	
	/**
    Percentage of the width of the control for navigating to next (or previous) tab.
    By playing with this value, different flicking behaviours can be achieved.
    
    @type {Number}
    @default 0.4
  */
	flickingThreshold: 0.4,
	
	/**
    Spacing used to separate tabs when flicking else they would be stashed together.
    
    @type {Number}
    @default 10
  */
	flickingSpacing: 10,
	
	/**
    View to use as container for the tab bar items
    
    @type SC.View
    @default Custom view for iPhone and iPad
  */
	tabBarView: function() {
    var view = null ;
	  if (SC.browser.iPhone || SC.browser.iPod) {
	    view = SC.View.design({
  	    classNames: 'sc-tab-bar-view iphone'.w()
  	  }) ;
    }
	  else {
	    view = SC.View.design({
  	    classNames: 'sc-tab-bar-view ipad'.w()
  	  }) ;
  	  return view ;
	  }
	}.property(),
	
	/**
    Height of the tab bar in pixels
    
    @type {Number}
    @default 44 for iPhone and 24 for iPad
  */
	tabBarHeight: function() {
	  if (SC.browser.iPhone || SC.browser.iPod) return Iweb.IPHONE_TAB_BAR_SIZE;
	  else return Iweb.IPAD_TAB_BAR_SIZE;
	}.property().cacheable(),
	
	/**
    Anchor position for the tab bar. Either SC.ANCHOR_TOP or SC.ANCHOR_BOTTOM
    
    @type {String}
    @default SC.ANCHOR_BOTTOM for iPhone sized devices. SC.ANCHOR_TOP otherwise (including iPad)
  */
	tabBarAnchor: function() {
	  if (SC.browser.iPhone || SC.browser.iPod) return SC.ANCHOR_BOTTOM;
	  else return SC.ANCHOR_TOP;
	}.property().cacheable(),
	
	/**
	 Add the passed view as a new tab. The tab is added after all existing tabs.
	 
	 @param {SC.View} tab View to be added as a new tab 
	*/
	addTab: function(tab) {
	  if (SC.none(tab)) return;
		var container = this.get('tabContainer') ;
		var tabBar = this.get('tabBar') ;
		
		var tabController = this ;
		
		var frame = this.get('frame') ;
		
		var tabCount = this._tabViews.get('length') ;
		var tabName = null;
		
		//if passed the tab name, read the view in the current object
		if (SC.typeOf(tab) === SC.T_STRING) {
		  tabName = tab;
		  if (tab.indexOf('.') > 0) {
        tab = SC.objectForPropertyPath(tab);
      } else {
        tab = SC.objectForPropertyPath(tab, this);
      }
		}
		
		// instantiate if needed
		if (tab.isClass) {
		  tab = container.createChildView(tab, {
  		  tabIndex: tabCount,
  		  isActive: YES,

  		  render: function(context, firstTime) {
      		arguments.callee.base.apply(this,arguments);
      		if (this.get('isActive')) {
      		  context.addClass('tab-active') ;
      		  context.removeClass('tab-hidden') ;
    		  }
      		else {
      		  context.addClass('tab-hidden') ;
      		  context.removeClass('tab-active') ;
    		  }
      	},

      	isActiveChange: function() {
      		//update layer rendering
      		this.set('layerNeedsUpdate',YES);
      	}.observes('isActive'),
      	
      	touchStart: function() {
      	  
      	  SC.Logger.debug('touchStart %@'.fmt(this.toString())) ;
      	  var ret = arguments.callee.base.apply(this,arguments) ;
      	  if (this.get('isActive')) return ret;
      	  else return NO;
      	}
  		}) ;
		}
		
		//append to parent
    container.appendChild(tab) ;
		
		/*
		var transitionDuration = this.get('transitionDuration') ;
		if (SC.none(transitionDuration)) transitionDuration = 250 ;
		transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
		//set up css transition on new tab view
		tab.$().css('-webkit-transition-property', '-webkit-transform')
		        .css('-webkit-transition-duration', '%@s'.fmt(transitionDuration)) ;
		        
		*/      
		
		var tabBarItem = tab.get('tabBarItem') || SC.Object.create() ;
		//tabBarItem = SC.Object.create(tabBarItem) ;
		
		
		var customName = tabBarItem.get('tag') || tabName;
		this.set(customName, tab);
		//map tab name to tab index
		this._tabNames[customName] = tabCount;
		
		//by default push the view totally to the right
		tab.set('layout',{top: 0, bottom: 0, left: 0, right: 0 });//left: leftValue, width: frame.width });
		
		this._tabViews.push(tab) ;
		
		
		//create tab bar item
		var tabBarWidth = frame.width / (tabCount + 1) ;
		var tabItem = tabBar.createChildView(
		  SC.View.design({
		    layout: {top:0, bottom:0, left: tabBarWidth * tabCount, width: tabBarWidth},
  			title: tabBarItem.title,
  			targetView: tab,
  			tabIndex: tabCount,
  			tabControl: this,
  			
  			click: function() {
  				this.goToTab() ;
  			},
  			
  			touchStart: function(touch) {
  			  return YES;
  			},
  			
  			touchEnd: function(touch) {
  			  this.goToTab() ;
  			},
  			
  			goToTab: function() {
  			  tabController.navigateToTab(this.tabIndex) ;
  			},

  			childViews: 'label'.w(),
  			label: SC.LabelView.design({
  			  layout: {top:0, bottom:0, right: 0, bottom: 0},
  			  value: tabBarItem.title,
  			  textAlign: SC.ALIGN_CENTER
  			}),
  			classNames: 'sc-tab-bar-item-view'.w()
  		})
		);
		tabBar.appendChild(tabItem) ;
		//tabItem.setStyle( { top: (this.get('tabHeight')-13)+'px'}) ;
		this._tabBarItems.push(tabItem) ;
		
		this._positionTabBarItems();
		
		//position tab views to set translate offsets
		this.invokeLater('_positionTabViews') ;
		
		//return tab
		//in case it were instantiated here the caller might need the actual view object
		return tab ;
	},
	
	
	/**
	 Remove the passed view from tabs.
	 
	 @param {Number|String|SC.View} tab View to be added as a new tab
	 @returns The view removed from this TabControlView
	*/
	removeTab: function(view) {
	  if (SC.none(view)) return ;
	  
	  //if name of tab passed, map to tab Index
	  if (SC.typeOf(view) == SC.T_STRING) view  = this._tabNames[view] ;
	  //if index of tab passed, retrieve corresponding view from views array
	  else if (SC.typeOf(view) == SC.T_NUMBER) view = this._tabViews[view] ;
	  //if none of the above and still not a view object, give up 
	  else if (SC.typeOf(view) != SC.T_OBJECT || !view.kindOf(SC.View)) return ;
	  
	  
	  var nbTabs = this._tabViews.get('length') ;
	  var index = Math.max(this._tabViews.indexOf(view), 0) ;
	  
	  var tab = view ;
	  
	  //remove from DOM parent
	  tab.removeFromParent() ;
	  
	  //remove from tabViews array
	  this._tabViews.removeObject(tab) ;
	  this._positionTabViews() ;
	  
	  //book keeping
	  var customName = tab.getPath('tabBarItem.tag') ;
	  if (!SC.none(customName)) {
	    if (this[customName]) delete this[customName] ;
	    this._tabNames.removeObject(customName) ;
	  }
	  
	  //navigate to the view that is now at position <index>
	  //make sure that if the last item was removed, we don't overflow
	  var newIndex = Math.min(index, this._tabViews.length - 1) ;
	  this.navigateToTab(newIndex) ;
	  
	  return tab ;
	},
	
	/**
	 Make the tab with the passed index the currently showing tab.
	 The index represents the order in which the tabs have been added to the tab control view.
	 
	 @param {Number|String} index Index of tab to navigate to. 
	*/
	navigateToTab: function(index) {
	  //if name of tab passed, map to tab Index
	  if (SC.typeOf(index) == SC.T_STRING) index  = this._tabNames[index] ;
	  if (SC.none(index)) return ;
	  
	  var nbTabs = this._tabViews.get('length') ;
	  //if no tab existing, nowhere to navigate to
	  if (nbTabs === 0) {
	    this.notifyPropertyChange('currentTabIndex') ;
	    return ;
	  }
    
	  //normalize index
	  if (index < 0) index = 0 ;
	  else if (index >= nbTabs) index = nbTabs - 1 ;
	  
		var frame = this.get('frame') ;
		var transitionDuration = this.get('transitionDuration') ;
		
		//navigate to tab view
		for(var i = 0; i < nbTabs; i++) {
			var view = this._tabViews[i] ;
			var delta = i - index ;
			
			//hide invisible tabs
			//if(delta !== 0) view.set('isActive', NO) ;
			//else view.set('isActive', YES) ;
			
			//notify view that it's about to become the front tab
			if(delta === 0 && view.willBecomeFrontTab)	view.willBecomeFrontTab() ;
			
			//reset CSS transforms on view
			var sTranslate = 'translateX(%@px)'.fmt(delta * frame.width) ;
			view.$().css({'-webkit-transform': sTranslate}) ;
			
			//view.animate('left', (delta * frame.width), {
			//  duration: transitionDuration
			//});
			
			
			//notify view that it's become the front tab
			if(delta === 0 && view.didBecomeFrontTab)	{
				var timer = SC.Timer.schedule({
	          target:   view,
	          action:   'didBecomeFrontTab',
	          interval: transitionDuration,
	          repeats:  NO
	      });
			}
			
		}
		
		//make the corresponding tab item the current
		for(i = 0; i < this._tabBarItems.length; i++) {
			var item = this._tabBarItems[i] ;
		 	item.$().setClass('active',(item.tabIndex === index)) ;
		}
		
		//save current Indexes
		this.setIfChanged("currentTabIndex", index) ;
	},
	
	/** @private */
	_tabViews: [],
	
	/** @private */
	_tabBarItems: [],
	
	/** @private */
	_tabNames: {},
	
	/** @private */
	currentTabIndex: 0,

  /** @private */
  init: function() {
		arguments.callee.base.apply(this,arguments);
		
		//create initial tabs
		for(var i = 0; i < this.tabs.length; i++) {
			var tab = this.tabs[i] ;
			this.addTab(tab) ;
		}
		
		var nowShowing = this.get('nowShowing') ;
		if (!SC.empty(nowShowing)) this.navigateToTab(nowShowing) ;
		else this.navigateToTab(0) ;		
	},
	
	/** @private */
	nowShowingDidChange: function() {
	  var nowShowing = this.get('nowShowing') ;
		if (!SC.empty(nowShowing)) this.navigateToTab(nowShowing) ;
	}.observes('nowShowing'),
	
	/** private */
	classNames: 'sc-tab-control-view'.w(),
	
	/** @private */
	createChildViews: function() {
		var childViews = [], view ;
		
		this._createContainers() ;
	},
	
	/** @private */
	frameDidChange: function() {
	  //reset tabs width and position
	  var index = this.currentTabIndex ;
	  var frame = this.get('frame') ;
	  //SC.Logger.log('frame %@'.fmt(frame.width)) ;
		for(var i = 0; i < this._tabViews.length; i++) {
			var view = this._tabViews[i] ;
			var delta = view.tabIndex - index ;
			
			view.adjust({width: frame.width}) ;
			
		}
		
		//reset tab items layouts
		this._positionTabBarItems() ;
	}.observes('frame'),
	
	/** @private */
	isTabBarVisibleDidChange: function() {
	  this._positionContainers() ;  
	}.observes('isTabBarVisible'),
	
	/** @private */
	_createContainers: function() {
	  var childViews = [], view ;
		
		//create the view that contains each tab view
		var container = this.createChildView(
		  SC.View.design({
		    classNames: 'sc-tab-container-view'.w()
		  })
		) ;
		childViews.push(container) ;
		this.set('tabContainer',container) ;
		
		var tabBarView = this.get('tabBarView') ;
		
		//create the tab bar
		var tabBar = this.createChildView(tabBarView) ;
		childViews.push(tabBar) ;
		this.set('tabBar',tabBar) ;
		
		this.set('childViews', childViews) ;
		
		this._positionContainers() ;
	},
	
	/** @private */
	_positionContainers: function() {
		var container = this.get('tabContainer') ;
		var tabBar = this.get('tabBar') ;
		
		var containerLayout = SC.Object.create({left: 0, right: 0}) ;
		var tabBarLayout = SC.Object.create({left: 0, right: 0}) ;
		
		var tabBarVisible = this.get('isTabBarVisible');
		var tabBarAnchor = this.get('tabBarAnchor') ;
		var tabBarHeight = this.get('tabBarHeight') ;
		
		var frame = this.get('frame') ;
		
		if (tabBarVisible) {
		  if(tabBarAnchor == SC.ANCHOR_TOP) {
  			tabBarLayout.mixin({top: 0, height: tabBarHeight}) ;
  			containerLayout.mixin({top: tabBarHeight, bottom: 0}) ;
  		}
  		else if(tabBarAnchor == SC.ANCHOR_BOTTOM) {
  			tabBarLayout.mixin({bottom: 0, height: tabBarHeight}) ;
  			containerLayout.mixin({top: 0, bottom: tabBarHeight}) ;
  		}
		}	
		else {
		  containerLayout.mixin({top: 0, bottom: 0}) ;
		  tabBarLayout.mixin({top: 0, height: 0}) ;
		  tabBar.set('isVisible', NO) ;
		}
		
		//apply layouts
		container.set('layout', containerLayout) ;
		tabBar.set('layout', tabBarLayout) ;
		
	},
	
	/** @private */
	_positionTabBarItems: function() {
	  var frame = this.get('frame') ;
	  var nbTabs = this._tabBarItems.length;
	  var tabBarWidth = frame.width / (nbTabs) ;
	  for(var i = 0; i < nbTabs; i++) {
			var item = this._tabBarItems[i] ;
			item.set('layout', {top:0, bottom:0, left: tabBarWidth * i, width: tabBarWidth}) ;
		}
	  
	},
	
	/** @private */
	_positionTabViews: function() {
	  var currentTabIndex = this.get('currentTabIndex') ;
	  var frame = this.get('frame') ;
	  for(var i = 0; i < this._tabViews.length; i++) {
	    var view = this._tabViews[i] ;
			var delta = view.tabIndex - currentTabIndex ;
			
			//hide invisible tabs
			//if(delta !== 0) view.$().addClass('tab-hidden') ;
			//else view.$().removeClass('tab-hidden') ;
			
			var transitionDuration = this.get('transitionDuration') ;
			if (SC.none(transitionDuration)) transitionDuration = 250 ;
			transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
			
			//set up view to animate translateX change
			view.$().css('-webkit-transition-property', '-webkit-transform')
			       .css('-webkit-transition-duration', '%@s'.fmt(transitionDuration)) ;
			
			//reset CSS transforms on view
			var sTranslate = 'translateX(%@px)'.fmt(delta * frame.width) ;
			view.$().css({'-webkit-transform': sTranslate}) ;
		}
	},
	
	/** @private */
	captureTouch: function() {
	  return YES ;
	},
	
	/** @private */
	touchStart: function(touch) {
	  SC.Logger.debug('TabControl touchStart()');
	  this._touch = {
	    start: {x: touch.pageX, y: touch.pageY}
	  } ;
	  
	  if (this.get('flickToNavigate')) {
	    this._hasTouch = touch ;
	    //remove css transition so that flicking with the finger does not animate
	    this._deactivateCssTransitionForCurrentTabs() ;
	    //in 0.5 sec we'll pass the touch along
	    this.invokeLater('beginContentTouches', 10, touch) ;
	    return YES ;
    }
	  else return NO ;
	},
	
	/** @private */
	beginContentTouches: function(touch) {
	  if (touch === this._hasTouch) {
	    //pass it along
	    touch.captureTouch(this, YES) ;
	  }
	},
	
	/** @private */
	touchesDragged: function(evt, touches) {
	  var t = this._touch;
	  
	  var deltaX = evt.pageX - t.start.x;
	  
    //flick tabs
    this._flick(deltaX);
    //SC.Logger.info('TabControl touchesDragged(%@)'.fmt(deltaX));
	},
	
	/** @private */
	touchCancelled: function(touch) {
	  this.touchEnd(touch) ;
  },
	
	/** @private */
	touchEnd: function(touch) {
	  SC.Logger.info('TabControl touchEnd()');
	  var t = this._touch;
	  
	  if (SC.none(t)) return ;
	  
	  var deltaX = touch.pageX - t.start.x ;
	  var deltaY = touch.pageY - t.start.y ;
	  
	  var frame = this.get('frame') ;
	  var threshold = this.get('flickingThreshold') ;
	  
	  //restore css transitions animations
	  this._activateCssTransitionForCurrentTabs() ;
	  
	  //this._positionTabViews() ;
	  
	  //depending on the distance of the touch, navigate to previous/next tab
	  //or do nothing 
	  if (Math.abs(deltaX) >= (frame.width * threshold)) {
	    //tabs have flicked
	    if (deltaX > 0) {
	      //move left
	      this.navigateToTab(this.currentTabIndex - 1) ;
	    }
	    else {
	      //move right
	      this.navigateToTab(this.currentTabIndex + 1) ;
	    }
	  }
	  else {
	    //no tab moved. snap back
	    this.navigateToTab(this.currentTabIndex) ;
	  }
	  
	  //clean up
    delete this._touch ;
	  this._touch = null ;
	  delete this._hasTouch ;
	  this._hasTouch = null ;
	},
	
	/** @private */
	_deactivateCssTransitionForCurrentTabs: function() {
	  var currentTabIndex = this.get('currentTabIndex') ;
	  
	  this.invokeLater('_flick', 30, 0) ;
	  
	  for(var i = currentTabIndex - 1; i < this._tabViews.length && i <= currentTabIndex + 1; i++) {
	    if (i < 0) continue ;
			var view = this._tabViews[i] ;
			view.set('isActive', YES) ;
			view.$().css('-webkit-transition-property', 'none') ;
		}
	},
	
	/** @private */
	_activateCssTransitionForCurrentTabs: function() {
	  var currentTabIndex = this.get('currentTabIndex') ;
	  
	  var transitionDuration = this.get('transitionDuration') ;
		if (SC.none(transitionDuration)) transitionDuration = 350 ;
		transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
		
	  for(var i = currentTabIndex - 1; i < this._tabViews.length && i <= currentTabIndex + 1; i++) {
	    if (i < 0) continue ;
			var view = this._tabViews[i] ;
      
			view.$().css('-webkit-transition-property', '-webkit-transform')
			       .css('-webkit-transition-duration', '%@s'.fmt(transitionDuration)) ;
		}
	},
	
	/** @private */
	_flick: function(deltaX) {
	  //translate all tabs by the given delta
	  var currentTabIndex = this.currentTabIndex ;
	  var frame = this.get('frame') ;
	  var spacing = this.get('flickingSpacing') ;
	  for(var i = currentTabIndex - 1; i < this._tabViews.length && i <= currentTabIndex + 1; i++) {
	    if (i < 0) continue ;
			var view = this._tabViews[i] ;
			var indexDelta = view.tabIndex - currentTabIndex ;
			
			var defaultX = indexDelta * frame.width ;
			var translateOffset = indexDelta === 0 ? defaultX + deltaX : defaultX + deltaX + (spacing * indexDelta) ;
			//SC.Logger.debug('view %@:%@'.fmt(indexDelta, view.get('layoutStyle')));
			var sTranslate = 'translateX(%@px)'.fmt(translateOffset) ;
			view.$().css({'-webkit-transform': sTranslate}) ;
			
		}
	}

});

