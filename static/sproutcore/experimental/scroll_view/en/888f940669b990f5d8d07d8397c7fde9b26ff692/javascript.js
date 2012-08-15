/* >>>>>>>>>> BEGIN source/render_delegates/desktop_scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


SC.BaseTheme.desktopScrollerRenderDelegate = SC.RenderDelegate.create({
  name: 'desktop-scroller',

  render: function (dataSource, context) {
    var layoutDirection = dataSource.get('layoutDirection'),
        isVertical = layoutDirection === SC.LAYOUT_VERTICAL,
        isHorizontal = layoutDirection === SC.LAYOUT_HORIZONTAL;

    context.setClass({
      'sc-vertical': isVertical,
      'sc-horizontal': isHorizontal,
      disabled: !dataSource.get('isEnabled'),
      'controls-hidden': dataSource.get('controlsHidden')
    });

    context.push(
      '<div class="track"></div>',
      '<div class="cap"></div>',
      dataSource.get('hasButtons') ?
        '<div class="button-bottom"></div><div class="button-top"></div>' :
        '<div class="endcap"></div>',
      ('<div class="thumb" style="%@:' + dataSource.get('thumbLength') + 'px;' +
                                'top:' + dataSource.get('thumbPosition') + 'px;">').
        fmt(isVertical ? 'height' : 'width'),
         '<div class="thumb-center"></div>',
         '<div class="thumb-top"></div>',
         '<div class="thumb-bottom"></div>',
      '</div>');


    context.attr('aria-orientation',
                 (layoutDirection === SC.LAYOUT_VERTICAL) ? 'vertical' : 'horizontal');
    context.attr('aria-valuemax', dataSource.get('maximum'));
    context.attr('aria-valuemin', dataSource.get('minimum'));
    context.attr('aria-valuenow', dataSource.get('value'));
    context.attr('aria-controls', dataSource.get('controlsId'));
  },

  update: function (dataSource, context) {
    var layoutDirection = dataSource.get('layoutDirection'),
        isVertical = layoutDirection === SC.LAYOUT_VERTICAL,
        isHorizontal = layoutDirection === SC.LAYOUT_HORIZONTAL,
        controlsAreHidden = dataSource.get('controlsHidden'),
        thumb, K = 'desktopScrollerRenderDelegate';

    context.setClass({
      'sc-vertical': isVertical,
      'sc-horizontal': isHorizontal,
      disabled: !dataSource.get('isEnabled'),
      'controls-hidden': controlsAreHidden
    });

    if (dataSource.didChangeFor(K, 'maximum')) {
      context.attr('aria-valuemax', dataSource.get('maximum'));
    }

    if (dataSource.didChangeFor(K, 'minimum')) {
      context.attr('aria-valuemin', dataSource.get('minimum'));
    }

    if (dataSource.didChangeFor(K, 'value')) {
      context.attr('aria-valuenow', dataSource.get('value'));
    }

    // Don't bother if the controls are hidden.
    if (!controlsAreHidden) {
      thumb = context.find('.thumb');

      if (dataSource.didChangeFor(K, 'thumbPosition')) {
        thumb.css(layoutDirection === SC.LAYOUT_VERTICAL ?
                  'top' : 'left', dataSource.get('thumbPosition'));
      }

      if (dataSource.didChangeFor(K, 'thumbLength')) {
        thumb.css(layoutDirection === SC.LAYOUT_VERTICAL ?
                  'height' : 'width', dataSource.get('thumbLength'));
      }
    }
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/native_scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.BaseTheme.nativeScrollRenderDelegate = SC.RenderDelegate.create({
  name: 'native-scroll',

  render: function (dataSource, context) {},

  update: function (dataSource, context) {
    var K = 'scrollRenderDelegate',
        scroll = context.find('.sc-scroll-container-view');

    if (dataSource.didChangeFor(K, 'canScrollHorizontal')) {
      scroll.css('overflow-x', dataSource.get('canScrollHorizontal') ? 'scroll' : 'hidden');
    }

    if (dataSource.didChangeFor(K, 'canScrollVertical')) {
      scroll.css('overflow-y', dataSource.get('canScrollVertical') ? 'scroll' : 'hidden');
    }
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.BaseTheme.scrollRenderDelegate = SC.RenderDelegate.create({
  name: 'scroll',

  render: function (dataSource, context) {
    context.push('<div class="corner"></div>');
  },

  update: function (dataSource, context) {
    var K = 'scrollRenderDelegate',
        thicknessDidChange = dataSource.didChangeFor(K, 'nativeScrollbarThickness'),
        scroll = context.find('.sc-scroll-container-view'),
        canScroll, thickness = dataSource.get('nativeScrollbarThickness');

    if (thicknessDidChange || dataSource.didChangeFor(K, 'canScrollHorizontal')) {
      canScroll = dataSource.get('canScrollHorizontal');
      scroll.css('margin-bottom', canScroll ? -1 * thickness : 0);
      scroll.css('overflow-x', canScroll ? 'scroll' : 'hidden');
    }

    if (thicknessDidChange || dataSource.didChangeFor(K, 'canScrollVertical')) {
      canScroll = dataSource.get('canScrollVertical');
      scroll.css('margin-right', canScroll ? -1 * thickness : 0);
      scroll.css('overflow-y', canScroll ? 'scroll' : 'hidden');
    }
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/touch_scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.BaseTheme.touchScrollerRenderDelegate = SC.RenderDelegate.create({
  name: 'touch-scroller',

  render: function (dataSource, context) {
    var layoutDirection = dataSource.get('layoutDirection'),
        isVertical = layoutDirection === SC.LAYOUT_VERTICAL,
        isHorizontal = layoutDirection === SC.LAYOUT_HORIZONTAL;

    context.setClass({
      'sc-vertical': isVertical,
      'sc-horizontal': isHorizontal,
      disabled: !dataSource.get('isEnabled'),
      'controls-hidden': dataSource.get('controlsHidden')
    });

    context.push(
      '<div class="track"></div>',
      '<div class="cap"></div>',
      dataSource.get('hasButtons') ?
        '<div class="button-bottom"></div><div class="button-top"></div>' :
        '<div class="endcap"></div>',
      '<div class="thumb">',
        '<div class="thumb-top"></div>',
        '<div class="thumb-clip">',
          ('<div class="thumb-inner" style="-webkit-transform: ' +
             'translate%@(' + (dataSource.get('thumbLength') - 1044) + 'px);').
               fmt(isVertical ? 'Y' : 'X') + '">',
             '<div class="thumb-center"></div>',
             '<div class="thumb-bottom"></div>',
           '</div>',
         '</div>',
      '</div>');
  },

  update: function (dataSource, context) {
    var layoutDirection = dataSource.get('layoutDirection'),
        isVertical = layoutDirection === SC.LAYOUT_VERTICAL,
        isHorizontal = layoutDirection === SC.LAYOUT_HORIZONTAL,
        controlsAreHidden = dataSource.get('controlsHidden'),
        K = 'touchScrollerRenderDelegate';

    context.setClass({
      'sc-vertical': isVertical,
      'sc-horizontal': isHorizontal,
      disabled: !dataSource.get('isEnabled'),
      'controls-hidden': controlsAreHidden
    });

    if (!controlsAreHidden) {
      var length = dataSource.get('thumbLength'),
          position = dataSource.get('thumbPosition'),
          T = 'translate3d(%@px,%@px,%@px)';

      if (dataSource.didChangeFor(K, 'thumbPosition')) {
        context.find('.thumb').css('-webkit-transform', isVertical ?
                                   T.fmt(0, position, 0) :
                                   T.fmt(position, 0, 0));
      }

      if (dataSource.didChangeFor(K, 'thumbLength')) {
        context.find('.thumb-inner').css('-webkit-transform', isVertical ?
                                         T.fmt(0, length, 0) :
                                         T.fmt(length, 0, 0));

      }
    }
  }

});

/* >>>>>>>>>> BEGIN source/views/core_scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** @class

  Displays a horizontal or vertical scroller.

  You will not usually need to work with scroller views directly,
  but you may override this class to implement your own custom scrollers.

  Because the scroller uses the dimensions of its constituent elements to
  calculate layout, you may need to override the default display metrics.

  You can either create a subclass of ScrollerView with the new values, or
  provide your own in your theme:

      SC.mixin(SC.ScrollerView.prototype, {
        scrollbarThickness: 14,
        capLength: 18,
        capOverlap: 14,
        buttonOverlap: 11,
        buttonLength: 41
      });

  You can change whether scroll buttons are displayed by setting the
  hasButtons property.

  @extends SC.View
  @since SproutCore 1.6
 */
SC.CoreScrollerView = SC.View.extend(
  /** @scope SC.CoreScrollerView.prototype */{

  /**
    @type Array
    @default ['sc-scroller-view']
    @see SC.View#classNames
   */
  classNames: ['sc-scroller-view'],

  /**
    @type Array
    @default ['thumbPosition', 'thumbLength', 'isEnabled', 'controlsHidden', 'capLength'
              'layoutDirection', 'hasButtons', 'value', 'controlsId', 'maximum', 'minimum']
    @see SC.View#displayProperties
   */
  displayProperties: ['thumbPosition', 'thumbLength', 'isEnabled', 'controlsHidden',
                      'layoutDirection', 'hasButtons', 'capLength',
                      'value', 'controlsId', 'maximum', 'minimum'], // WAI-ARIA attrs

  /**
    The WAI-ARIA role for scroller view.

    @type String
    @default 'scrollbar'
    @readOnly
   */
  ariaRole: 'scrollbar',

  // ..........................................................
  // PROPERTIES
  //

  /**
    If YES, a click on the track will cause the scrollbar to scroll to that position.
    Otherwise, a click on the track will cause a page down.

    In either case, alt-clicks will perform the opposite behavior.

    @type Boolean
    @default NO
   */
  shouldScrollToClick: NO,

  /**
    WAI-ARIA ID to the control that this scroller is controlling.

    @field
    @type String
   */
  controlsIdBinding: SC.Binding.oneWay('*parentView.contentView.layerId'),

  /**
    @type Number
    @observes value
    @observes touchValue
   */
  displayValue: function () {
    return this.get('value');
  }.property("value").cacheable(),

  /**
    The value of the scroller.
    The value represents the position of the scroller's thumb.

    @field
    @type Number
    @observes maximum
    @observes minimum
   */
  value: function (key, value) {
    var minimum = this.get('minimum');
    if (typeof value !== "undefined") {
      this._scs_value = value;
    }

    value = this._scs_value || minimum; // default value is at top / left
    return Math.max(Math.min(value, this.get('maximum')), minimum);
  }.property('maximum', 'minimum').cacheable(),

  /**
    The portion of the track that the thumb should fill. Usually the
    proportion will be the ratio of the size of the scroll view's content view
    to the size of the scroll view.

    Should be specified as a value between 0.0 (minimal size) and 1.0 (fills
    the slot). Note that if the proportion is 1.0 then the control will be
    disabled.

    @type Number
    @default 0.0
   */
  proportion: 0,

  /**
    The maximum offset value for the scroller.  This will be used to calculate
    the internal height/width of the scroller itself.

    When set less than the height of the scroller, the scroller is disabled.

    @type Number
    @default 100
   */
  maximum: 100,

  /**
    The minimum offset value for the scroller.  This will be used to calculate
    the internal height/width of the scroller itself.

    @type Number
    @default 0
   */
  minimum: 0,

  /**
    YES to enable scrollbar, NO to disable it. Scrollbars will automatically
    disable if the maximum scroll width does not exceed their capacity.

    @field
    @type Boolean
    @default YES
    @observes proportion
   */
  isEnabled: function (key, value) {
    var enabled;
    if (typeof value !== "undefined") {
      this._scsv_isEnabled = value;
    }
    enabled = this._scsv_isEnabled;

    return !SC.none(enabled) ? enabled : this.get('proportion') < 1;
  }.property('proportion').cacheable(),

  /** @private */
  _scsv_isEnabled: undefined,

  /**
    Determine the layout direction.  Determines whether the scrollbar should
    appear horizontal or vertical.  This must be set when the view is created.
    Changing this once the view has been created will have no effect. Possible
    values:

      - SC.LAYOUT_VERTICAL
      - SC.LAYOUT_HORIZONTAL

    @type String
    @default SC.LAYOUT_VERTICAL
   */
  layoutDirection: SC.LAYOUT_VERTICAL,

  /**
    Whether or not the scroller should display scroll buttons

    @type Boolean
    @default YES
   */
  hasButtons: YES,


  // ..........................................................
  // DISPLAY METRICS
  //

  /**
    The width (if vertical scroller) or height (if horizontal scroller) of the
    scrollbar.

    @type Number
    @default 14
   */
  scrollbarThickness: 14,

  /**
    Whether or not the scrollbar is translucent.
    This effectively means you would like the scroller to be overlaid.

    @type Boolean
    @default NO
   */
  isTranslucent: NO,

  /**
    The width or height of the cap that encloses the track.

    @type Number
    @default 18
   */
  capLength: 18,

  /**
    The amount by which the thumb overlaps the cap.

    @type Number
    @default 14
   */
  capOverlap: 14,

  /**
    The width or height of the up/down or left/right arrow buttons. If the
    scroller is not displaying arrows, this is the width or height of the end
    cap.

    @type Number
    @defaut 41
   */
  buttonLength: 41,

  /**
    The amount by which the thumb overlaps the arrow buttons. If the scroller
    is not displaying arrows, this is the amount by which the thumb overlaps
    the end cap.

    @type Number
    @default 11
   */
  buttonOverlap: 11,

  /**
    The minimium length that the thumb will be, regardless of how much content
    is in the scroll view.

    @type Number
    @default 20
   */
  minimumThumbLength: 20,

  // ..........................................................
  // SCROLLER DIMENSION COMPUTED PROPERTIES
  //

  /** @private
    Returns the total length of the track in which the thumb sits.

    The length of the track is the height or width of the scroller, less the
    cap length and the button length. This property is used to calculate the
    position of the thumb relative to the view.

    @property
   */
  trackLength: function () {
    return this.get('scrollerLength') -
      (this.get('capLength') - this.get('capOverlap')) -      // Subtract the size of the top/left cap
      (this.get('buttonLength') - this.get('buttonOverlap')); // Subtract the size of the scroll buttons,
                                                              // or the end cap if they are not shown.
  }.property('scrollerLength', 'capLength', 'capOverlap', 'buttonLength', 'buttonOverlap').cacheable(),

  /** @private
    Returns the height of the view if this is a vertical scroller or the width
    of the view if this is a horizontal scroller. This is used when scrolling
    up and down by page, as well as in various layout calculations.

    @type Number
   */
  scrollerLength: function () {
    var frame = this.get('frame'),
        layoutDirection = this.get('layoutDirection');

    return layoutDirection === SC.LAYOUT_VERTICAL ? frame.height :
           layoutDirection === SC.LAYOUT_HORIZONTAL ? frame.width : 0;
  }.property('frame').cacheable(),

  /** @private
    The total length of the thumb. The size of the thumb is the
    length of the track times the content proportion.

    @property
   */
  thumbLength: function () {
    var length = Math.floor(this.get('trackLength') * this.get('proportion'));

    return Math.max(isNaN(length) ? 0 : length, this.get('minimumThumbLength'));
  }.property('trackLength', 'proportion', 'minimumThumbLength').cacheable(),

  /** @private
    The position of the thumb in the track.

    @type Number
    @isReadOnly
   */
  thumbPosition: function () {
    var position = (this.get('displayValue') / this.get('maximum')) *
                    (this.get('trackLength') - this.get('thumbLength')) +
                    this.get('capLength') - this.get('capOverlap'); // account for the top / left cap
    return Math.floor(isNaN(position) ? 0 : position);
  }.property('displayValue', 'maximum', 'trackLength', 'thumbLength', 'capLength', 'capOverlap').cacheable(),

  /** @private
    YES if the maximum value exceeds the frame size of the scroller.  This
    will hide the thumb and buttons.

    @type Boolean
    @isReadOnly
   */
  controlsHidden: function () {
    return this.get('proportion') >= 1;
  }.property('proportion').cacheable()

});

/* >>>>>>>>>> BEGIN source/views/desktop/scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/core_scroller');

/** @class
  Implements a custom desktop-like scroller view that handles
  your basic scrollbar events:

   - Arrow buttons for incremental scrolling in either direction.
   - Clicking in the track to incrementally jump to a location.
   - CTL+Click to jump immediately to a location.
   - A draggable scroll thumb.

  @extends SC.CoreScrollerView
  @since SproutCore 1.6
*/
SC.DesktopScrollerView = SC.CoreScrollerView.extend(
  /** @scope SC.DesktopScrollerView.prototype */{

  /**
    @type String
    @default 'desktopScrollerRenderDelegate'
  */
  renderDelegateName: 'desktopScrollerRenderDelegate',

  // ..........................................................
  // MOUSE EVENTS
  //

  /** @private
    Returns the value for a position within the scroller's frame.
   */
  valueForPosition: function (pos) {
    return ((pos - (this.get('capLength') - this.get('capOverlap'))) /
            (this.get('trackLength') - this.get('thumbLength'))) * this.get('maximum');
  },

  /** @private
    Handles mouse down events and adjusts the value property depending where
    the user clicked.

    If the control is disabled, we ignore all mouse input.

    If the user clicks the thumb, we note the position of the mouse event but
    do not take further action until they begin to drag.

    If the user clicks the track, we adjust the value a page at a time, unless
    alt is pressed, in which case we scroll to that position.

    If the user clicks the buttons, we adjust the value by a fixed amount, unless
    alt is pressed, in which case we adjust by a page.

    If the user clicks and holds on either the track or buttons, those actions
    are repeated until they release the mouse button.

    @param evt {SC.Event} the mousedown event
   */
  mouseDown: function (evt) {
    if (!this.get('isEnabled')) return NO;

    var target = evt.target,
        thumbPosition = this.get('thumbPosition'),
        value, clickLocation, clickOffset,
        scrollerLength = this.get('scrollerLength');

    // Determine the subcontrol that was clicked
    if (target.className.indexOf('thumb') >= 0) {
      // Convert the mouseDown coordinates to the view's coordinates
      clickLocation = this.convertFrameFromView({ x: evt.pageX,
                                                  y: evt.pageY });

      clickLocation.x -= thumbPosition;
      clickLocation.y -= thumbPosition;

      // Store the starting state so we know how much to adjust the
      // thumb when the user drags
      this._thumbDragging = YES;
      this._thumbOffset = clickLocation;
      this._mouseDownLocation = { x: evt.pageX,
                                  y: evt.pageY };
      this._thumbPositionAtDragStart = this.get('thumbPosition');
      this._valueAtDragStart = this.get("value");

    // User clicked the up/left button; decrement the value by a fixed amount or page size
    } else if (target.className.indexOf('button-top') >= 0) {
      this.decrementProperty('value', 30);
      this.makeButtonActive('.button-top');

      // start a timer that will continue to fire until mouseUp is called
      this.startMouseDownTimer('scrollUp');
      this._isScrollingUp = YES;

    // User clicked the down/right button; increment the value by a fixed amount
    } else if (target.className.indexOf('button-bottom') >= 0) {
      this.incrementProperty('value', 30);
      this.makeButtonActive('.button-bottom');

      // start a timer that will continue to fire until mouseUp is called
      this.startMouseDownTimer('scrollDown');
      this._isScrollingDown = YES;

    // User clicked in the track
    } else {
      var scrollToClick = this.get("shouldScrollToClick"),
          trackLength = this.get('trackLength'),
          thumbLength = this.get('thumbLength'),
          frame = this.convertFrameFromView({ x: evt.pageX, y: evt.pageY }),
          mousePosition;

      if (evt.altKey) scrollToClick = !scrollToClick;

      switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        this._mouseDownLocation = mousePosition = frame.y;
        break;
      case SC.LAYOUT_HORIZONTAL:
        this._mouseDownLocation = mousePosition = frame.x;
        break;
      }

      if (scrollToClick) {
        this.set('value', this.valueForPosition(mousePosition - (thumbLength / 2)));

        // and start a normal mouse down
        thumbPosition = this.get('thumbPosition');

        this._thumbDragging = YES;
        this._thumbOffset = { x: frame.x - thumbPosition,
                              y: frame.y - thumbPosition };
        this._mouseDownLocation = { x: evt.pageX,
                                    y: evt.pageY };
        this._thumbPositionAtDragStart = thumbPosition;
        this._valueAtDragStart = this.get("value");

      // Move the thumb up or down a page depending on whether the click
      // was above or below the thumb
      } else if (mousePosition < thumbPosition) {
        this.decrementProperty('value', scrollerLength);
        this.startMouseDownTimer('page');

      } else {
        this.incrementProperty('value', scrollerLength);
        this.startMouseDownTimer('page');
      }
    }

    return YES;
  },

  /** @private
    When the user releases the mouse button, remove any active
    state from the button controls, and cancel any outstanding
    timers.

    @param evt {SC.Event} the mousedown event
   */
  mouseUp: function (evt) {
    var active = this._scs_buttonActive,
        ret = NO, timer;

    // If we have an element that was set as active in mouseDown,
    // remove its active state
    if (active) {
      active.removeClass('active');
      ret = YES;
    }

    // Stop firing repeating events after mouseup
    timer = this._mouseDownTimer;
    if (timer) {
      timer.invalidate();
      this._mouseDownTimer = null;
    }

    this._thumbDragging = NO;
    this._isScrollingDown = NO;
    this._isScrollingUp = NO;

    return ret;
  },

  /** @private
    If the user began the drag on the thumb, we calculate the difference
    between the mouse position at click and where it is now.  We then
    offset the thumb by that amount, within the bounds of the track.

    If the user began scrolling up/down using the buttons, this will track
    what component they are currently over, changing the scroll direction.

    @param evt {SC.Event} the mousedragged event
   */
  mouseDragged: function (evt) {
    var value, length, delta, thumbPosition,
        target = evt.target,
        thumbPositionAtDragStart = this._thumbPositionAtDragStart,
        isScrollingUp = this._isScrollingUp,
        isScrollingDown = this._isScrollingDown,
        active = this._scs_buttonActive,
        timer;

    // Only move the thumb if the user clicked on the thumb during mouseDown
    if (this._thumbDragging) {
      switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        delta = (evt.pageY - this._mouseDownLocation.y);
        break;
      case SC.LAYOUT_HORIZONTAL:
        delta = (evt.pageX - this._mouseDownLocation.x);
        break;
      }

      thumbPosition = thumbPositionAtDragStart + delta;
      length = this.get('trackLength') - this.get('thumbLength');
      this.set('value', Math.round( (thumbPosition/length) * this.get('maximum')));

    } else if (isScrollingUp || isScrollingDown) {
      var nowScrollingUp = NO, nowScrollingDown = NO;

      var topButtonRect = this.$('.button-top')[0].getBoundingClientRect();
      var bottomButtonRect = this.$('.button-bottom')[0].getBoundingClientRect();

      switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        nowScrollingUp = (evt.clientY < topButtonRect.bottom);
        break;
      case SC.LAYOUT_HORIZONTAL:
        nowScrollingUp = (evt.clientX < topButtonRect.right);
        break;
      }
      nowScrollingDown = !nowScrollingUp;

      if ((nowScrollingUp || nowScrollingDown) && nowScrollingUp !== isScrollingUp) {
        // If we have an element that was set as active in mouseDown,
        // remove its active state
        if (active) active.removeClass('active');

        // Stop firing repeating events after mouseup
        this._mouseDownTimerAction = nowScrollingUp ? "scrollUp" : "scrollDown";

        if (nowScrollingUp) {
          this.makeButtonActive('.button-top');
        } else if (nowScrollingDown) {
          this.makeButtonActive('.button-bottom');
        }

        this._isScrollingUp = nowScrollingUp;
        this._isScrollingDown = nowScrollingDown;
      }
    }

    return YES;
  },

  mouseWheel: function (evt) {
    var el = this.getPath('parentView.containerView.layer'),
        rawEvent = evt.originalEvent;

    if (el && rawEvent) {
      try {
        if (SC.typeOf(el.fireEvent) === SC.T_FUNCTION) { // IE
          el.fireEvent(rawEvent.type, rawEvent);
        } else { // W3C
          el.dispatchEvent(rawEvent);
        }
      } catch (x) {
        // Can't dispatch the event; give up.
      }
    }
  },

  /** @private
    Starts a timer that fires after 300ms.  This is called when the user
    clicks a button or inside the track to move a page at a time. If they
    continue holding the mouse button down, we want to repeat that action
    after a small delay.  This timer will be invalidated in mouseUp.

    Specify "immediate" as YES if it should not wait.
   */
  startMouseDownTimer: function (action, immediate) {
    this._mouseDownTimerAction = action;
    this._mouseDownTimer = SC.Timer.schedule({
      target: this,
      action: this.mouseDownTimerDidFire,
      interval: immediate ? 0 : 300
    });
  },

  /** @private
    Called by the mousedown timer.  This method determines the initial
    user action and repeats it until the timer is invalidated in mouseUp.
   */
  mouseDownTimerDidFire: function () {
    var scrollerLength = this.get('scrollerLength'),
        mouseLocation = SC.device.get('mouseLocation'),
        thumbPosition = this.get('thumbPosition'),
        thumbLength = this.get('thumbLength'),
        timerInterval = 50;

    switch (this.get('layoutDirection')) {
    case SC.LAYOUT_VERTICAL:
      mouseLocation = this.convertFrameFromView(mouseLocation).y;
      break;
    case SC.LAYOUT_HORIZONTAL:
      mouseLocation = this.convertFrameFromView(mouseLocation).x;
      break;
    }

    switch (this._mouseDownTimerAction) {
    case 'scrollDown':
      this.incrementProperty('value', 30);
      break;
    case 'scrollUp':
      this.decrementProperty('value', 30);
      break;
    case 'page':
      timerInterval = 150;
      if (mouseLocation < thumbPosition) {
        this.decrementProperty('value', scrollerLength);
      } else if (mouseLocation > thumbPosition+thumbLength) {
        this.incrementProperty('value', scrollerLength);
      }
    }

    this._mouseDownTimer = SC.Timer.schedule({
      target: this,
      action: this.mouseDownTimerDidFire,
      interval: timerInterval
    });
  },

  /** @private
    Given a selector, finds the corresponding DOM element and adds
    the 'active' class name.  Also stores the returned element so that
    the 'active' class name can be removed during mouseup.

    @param {String} the selector to find
   */
  makeButtonActive: function (selector) {
    this._scs_buttonActive = this.$(selector).addClass('active');
  }

});

/* >>>>>>>>>> BEGIN source/views/scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/desktop/scroller');

// Legacy ScrollerView === DesktopScrollerView
SC.ScrollerView = SC.DesktopScrollerView;

/* >>>>>>>>>> BEGIN source/views/core_scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/scroller');

/** @class
  The core scroll view component.

  This class is an input-agnostic scroll view implementation.

  Important Events:

    - contentView frame size changes (to autoshow/hide scrollbar - adjust scrollbar size)
    - horizontalScrollOffset change
    - verticalScrollOffsetChanges

  @extends SC.View
  @since SproutCore 1.6
 */
SC.CoreScrollView = SC.View.extend(
  /** @scope SC.ScrollView.prototype  */{

  /**
    @type Array
    @default ['sc-scroll-view']
    @see SC.View#classNames
   */
  classNames: ['sc-scroll-view'],

  // ..........................................................
  // PROPERTIES
  //

  /**
    Walk like a duck

    @type Boolean
    @default YES
    @readOnly
   */
  isScrollable: YES,

  /**
    The content view you want the scroll view to manage.
    This will be assigned to the `contentView` of the `clipView` also.

    @type SC.View
    @default null
   */
  contentView: null,

  /**
    The horizontal alignment for non-filling content inside of the `ScrollView`.
    Possible values are:

      - `SC.ALIGN_LEFT`
      - `SC.ALIGN_RIGHT`
      - `SC.ALIGN_CENTER`

    @type String
    @default SC.ALIGN_LEFT
   */
  horizontalAlign: SC.ALIGN_LEFT,

  /**
    The vertical alignment for non-filling content inside of the `ScrollView`.
    Possible values are:

      - `SC.ALIGN_TOP`
      - `SC.ALIGN_BOTTOM`
      - `SC.ALIGN_MIDDLE`

    @type String
    @default SC.ALIGN_TOP
   */
  verticalAlign: SC.ALIGN_TOP,

  /**
    The current horizontal scroll offset. Changing this value will update both
    the `contentView` and the horizontal scroller, if there is one.

    @field
    @type Number
    @default 0
   */
  horizontalScrollOffset: function (key, value) {
    if (typeof value !== "undefined") {
      var minOffset = this.minimumHorizontalScrollOffset(),
          maxOffset = this.get('maximumHorizontalScrollOffset');
      this._scroll_horizontalScrollOffset = Math.max(minOffset, Math.min(maxOffset, value));
    }

    return this._scroll_horizontalScrollOffset || 0;
  }.property().cacheable(),

  /**
    The current vertical scroll offset. Changing this value will update both
    the `contentView` and the vertical scroller, if there is one.

    @field
    @type Number
    @default 0
   */
  verticalScrollOffset: function (key, value) {
    if (typeof value !== "undefined") {
      var minOffset = this.get('minimumVerticalScrollOffset'),
          maxOffset = this.get('maximumVerticalScrollOffset');
      this._scroll_verticalScrollOffset = Math.max(minOffset, Math.min(maxOffset, value));
    }

    return this._scroll_verticalScrollOffset || 0;
  }.property().cacheable(),

  /** @private
    Calculates the maximum offset given content and container sizes, and the
    alignment.
   */
  maximumScrollOffset: function (contentSize, containerSize, align) {
    // If the content is larger than the container, the maximum offset is
    // the location of the `contentView` when scrolled all the way down.
    var delta = contentSize - containerSize;
    if (contentSize >= containerSize) return delta;

    return (align === SC.ALIGN_LEFT || align === SC.ALIGN_TOP) ? 0 : // top-left aligned
           (align === SC.ALIGN_MIDDLE || align === SC.ALIGN_CENTER) ?
             Math.round(delta / 2) : // center aligned
             delta;                  // right aligned
  },

  /** @private
    Calculates the minimum offset given content and container sizes, and the
    alignment.
   */
  minimumScrollOffset: function (contentSize, containerSize, align) {
    var delta = contentSize - containerSize;

    return (contentSize > containerSize || align === SC.ALIGN_LEFT || align === SC.ALIGN_TOP) ?
             0 : // top-left aligned or larger than the container.
           (align === SC.ALIGN_MIDDLE || align === SC.ALIGN_CENTER) ?
             Math.round(delta / 2) : // center aligned
             delta;                  // right aligned
  },

  /**
    The maximum horizontal scroll offset allowed given the current contentView
    size and the size of the scroll view.  If horizontal scrolling is
    disabled, this will always return 0.

    @field
    @type Number
    @default 0
   */
  maximumHorizontalScrollOffset: function () {
    var view = this.get('contentView'),
        contentWidth = view ? view.get('frame').width : 0,
        calculatedWidth = view ? view.get('calculatedWidth') : 0,
        containerWidth = this.get('containerView').get('frame').width;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if (calculatedWidth) {
      contentWidth = view.calculatedWidth;
    }
    contentWidth *= this._scale;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollHorizontal')) contentWidth = Math.min(contentWidth, containerWidth);
    return this.maximumScrollOffset(contentWidth, containerWidth, this.get("horizontalAlign"));
  }.property(),

  /**
    The maximum vertical scroll offset allowed given the current contentView
    size and the size of the scroll view.  If vertical scrolling is disabled,
    this will always return 0 (or whatever alignment dictates).

    @field
    @type Number
    @default 0
   */
  maximumVerticalScrollOffset: function () {
    var view = this.get('contentView'),
        contentHeight = (view && view.get('frame')) ? view.get('frame').height : 0,
        calculatedHeight = view ? view.get('calculatedHeight') : 0,
        containerHeight = this.get('containerView').get('frame').height;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if (calculatedHeight) {
      contentHeight = calculatedHeight;
    }
    contentHeight *= this._scale;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollVertical')) contentHeight = Math.min(contentHeight, containerHeight);
    return this.maximumScrollOffset(contentHeight, containerHeight, this.get("verticalAlign"));
  }.property(),


  /**
    The minimum horizontal scroll offset allowed given the current contentView
    size and the size of the scroll view.  If horizontal scrolling is
    disabled, this will always return 0 (or whatever alignment dictates).

    @field
    @type Number
    @default 0
   */
  minimumHorizontalScrollOffset: function () {
    var view = this.get('contentView'),
        contentWidth = view ? view.get('frame').width : 0,
        calculatedWidth = view ? view.get('calculatedWidth') : 0,
        containerWidth = this.get('containerView').get('frame').width;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if (calculatedWidth) {
      contentWidth = calculatedWidth;
    }
    contentWidth *= this._scale;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollHorizontal')) contentWidth = Math.min(contentWidth, containerWidth);
    return this.minimumScrollOffset(contentWidth, containerWidth, this.get("horizontalAlign"));
  }.property(),

  /**
    The minimum vertical scroll offset allowed given the current contentView
    size and the size of the scroll view.  If vertical scrolling is disabled,
    this will always return 0 (or whatever alignment dictates).

    @field
    @type Number
    @default 0
   */
  minimumVerticalScrollOffset: function () {
    var view = this.get('contentView'),
        contentHeight = (view && view.get('frame')) ? view.get('frame').height : 0,
        calculatedHeight = view ? view.get('calculatedHeight') : 0,
        containerHeight = this.get('containerView').get('frame').height;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if (calculatedHeight) {
      contentHeight = view.calculatedHeight;
    }
    contentHeight *= this._scale;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollVertical')) contentHeight = Math.min(contentHeight, containerHeight);
    return this.minimumScrollOffset(contentHeight, containerHeight, this.get("verticalAlign"));
  }.property(),


  /**
    Amount to scroll one vertical line.

    Used by the default implementation of scrollDownLine() and scrollUpLine().

    @type Number
    @default 20
   */
  verticalLineScroll: 20,

  /**
    Amount to scroll one horizontal line.

    Used by the default implementation of scrollLeftLine() and
    scrollRightLine().

    @type Number
    @default 20
   */
  horizontalLineScroll: 20,

  /**
    Amount to scroll one vertical page.

    Used by the default implementation of scrollUpPage() and scrollDownPage().

    @field
    @type Number
    @default value of frame.height
    @observes frame
   */
  verticalPageScroll: function () {
    return this.get('frame').height;
  }.property('frame'),

  /**
    Amount to scroll one horizontal page.

    Used by the default implementation of scrollLeftPage() and
    scrollRightPage().

    @field
    @type Number
    @default value of frame.width
    @observes frame
   */
  horizontalPageScroll: function () {
    return this.get('frame').width;
  }.property('frame'),

  /**
    Whether or not native scrollbars are wanted.

    @type Boolean
    @default NO
   */
  wantsNativeScrollbars: NO,

  // ..........................................................
  // SCROLLERS
  //

  /**
    YES if the view should maintain a horizontal scroller.
    This property must be set when the view is created.

    @type Boolean
    @default YES
   */
  hasHorizontalScroller: YES,

  /**
    The horizontal scroller view class.

    This will be replaced with a view instance when the
    ScrollView is created unless hasHorizontalScroller is NO.

    @type SC.View
    @default null
   */
  horizontalScrollerView: null,

  /**
    YES if the horizontal scroller should be visible.  You can change this
    property value anytime to show or hide the horizontal scroller.  If you
    do not want to use a horizontal scroller at all, you should instead set
    hasHorizontalScroller to NO to avoid creating a scroller view in the
    first place.

    @type Boolean
    @default YES
   */
  isHorizontalScrollerVisible: YES,

  /**
    Returns YES if the view both has a horizontal scroller, the scroller is
    visible.

    @field
    @type Boolean
    @default YES
   */
  canScrollHorizontal: function () {
    return !!(this.get('hasHorizontalScroller') &&
              this.get('horizontalScrollerView') &&
              this.get('isHorizontalScrollerVisible'));
  }.property('isHorizontalScrollerVisible', 'horizontalScrollerView').cacheable(),

  /**
    If YES, the horizontal scroller will autohide if the contentView is
    smaller than the visible area.  You must set hasHorizontalScroller to YES
    for this property to have any effect.

    @type Boolean
    @default YES
   */
  autohidesHorizontalScroller: YES,

  /**
    YES if the view shuld maintain a vertical scroller.   This property must
    be set when the view is created.

    @type Boolean
    @default YES
   */
  hasVerticalScroller: YES,

  /**
    The vertical scroller view class. This will be replaced with a view
    instance when the ScrollView is created unless hasVerticalScroller is NO.

    @type SC.View
    @default null
   */
  verticalScrollerView: null,

  /**
    YES if the vertical scroller should be visible.  You can change this
    property value anytime to show or hide the vertical scroller.  If you do
    not want to use a vertical scroller at all, you should instead set
    hasVerticalScroller to NO to avoid creating a scroller view in the first
    place.

    @type Boolean
    @default YES
   */
  isVerticalScrollerVisible: YES,

  /**
    Returns YES if the view both has a horizontal scroller, the scroller is
    visible.

    @field
    @type Boolean
    @default YES
   */
  canScrollVertical: function () {
    return !!(this.get('hasVerticalScroller') &&
              this.get('verticalScrollerView') &&
              this.get('isVerticalScrollerVisible'));
  }.property('isVerticalScrollerVisible', 'verticalScrollerView').cacheable(),

  /**
    If YES, the vertical scroller will autohide if the contentView is
    smaller than the visible area.  You must set hasVerticalScroller to YES
    for this property to have any effect.

    @type Boolean
    @default YES
   */
  autohidesVerticalScroller: YES,

  /**
    Use this property to set the 'bottom' offset of your vertical scroller,
    to make room for a thumb view or other accessory view. Default is 0.

    @type Number
    @default 0
   */
  verticalScrollerBottom: 0,

  /**
    Use this to overlay the vertical scroller.

    This ensures that the container frame will not resize to accomodate the
    vertical scroller, hence overlaying the scroller on top of
    the container.

    @type Boolean
    @default NO
   */
  verticalOverlay: NO,

  /**
    Use this to overlay the horizontal scroller.

    This ensures that the container frame will not resize to accomodate the
    horizontal scroller, hence overlaying the scroller on top of
    the container

    @type Boolean
    @default NO
   */
  horizontalOverlay: NO,

  /**
    Use to control the positioning of the vertical scroller.  If you do not
    set 'verticalOverlay' to YES, then the content view will be automatically
    sized to meet the left edge of the vertical scroller, wherever it may be.
    This allows you to easily, for example, have “one pixel higher and one
    pixel lower” scroll bars that blend into their parent views.

    If you do set 'verticalOverlay' to YES, then the scroller view will
    “float on top” of the content view.

    Example: { top: -1, bottom: -1, right: 0 }

    @type Hash
    @default null
   */
  verticalScrollerLayout: null,

  /**
    Use to control the positioning of the horizontal scroller.  If you do not
    set 'horizontalOverlay' to YES, then the content view will be
    automatically sized to meet the top edge of the horizontal scroller,
    wherever it may be.

    If you do set 'horizontalOverlay' to YES, then the scroller view will
    “float on top” of the content view.

    Example: { left: 0, bottom: 0, right: 0 }

    @type Hash
    @default null
   */
  horizontalScrollerLayout: null,

  // ..........................................................
  // CUSTOM VIEWS
  //

  /**
    The container view that will contain your main content view.  You can
    replace this property with your own custom subclass if you prefer.

    @type SC.ContainerView
    @default SC.ConainerView
   */
  containerView: SC.ContainerView.extend({}),


  // ..........................................................
  // METHODS
  //

  /**
    Scrolls the receiver to the specified x,y coordinate.  This should be the
    offset into the contentView you want to appear at the top-left corner of
    the scroll view.

    This method will contrain the actual scroll based on whether the view
    can scroll in the named direction and the maximum distance it can
    scroll.

    If you only want to scroll in one direction, pass null for the other
    direction.  You can also optionally pass a Hash for the first parameter
    with x and y coordinates.

    @param {Number} x the x scroll location
    @param {Number} y the y scroll location
    @returns {SC.ScrollView} receiver
   */
  scrollTo: function (x, y) {
    // normalize params
    if (typeof y === "undefined" && SC.typeOf(x) === SC.T_HASH) {
      y = x.y; x = x.x;
    }

    if (!SC.none(x)) {
      this.set('horizontalScrollOffset', x);
    }

    if (!SC.none(y)) {
      this.set('verticalScrollOffset', y);
    }

    return this;
  },

  /**
    Scrolls the receiver in the horizontal and vertical directions by the
    amount specified, if allowed.  The actual scroll amount will be
    constrained by the current scroll view settings.

    If you only want to scroll in one direction, pass null or 0 for the other
    direction.  You can also optionally pass a Hash for the first parameter
    with x and y coordinates.

    @param {Number} x change in the x direction (or hash)
    @param {Number} y change in the y direction
    @returns {SC.ScrollView} receiver
   */
  scrollBy: function (x, y) {
    // normalize params
    if (typeof y === "undefined" && SC.typeOf(x) === SC.T_HASH) {
      y = x.y;
      x = x.x;
    }

    // if null, undefined, or 0, pass null; otherwise just add current offset
    x = (x) ? this.get('horizontalScrollOffset') + x : null;
    y = (y) ? this.get('verticalScrollOffset') + y : null;
    return this.scrollTo(x, y);
  },

  /**
    Scroll the view to make the view's frame visible.  For this to make sense,
    the view should be a subview of the contentView.  Otherwise the results
    will be undefined.

    @param {SC.View} view view to scroll or null to scroll receiver visible
    @returns {Boolean} YES if scroll position was changed
   */
  scrollToVisible: function (view) {
    // if no view is passed, do default
    if (typeof view === "undefined") return arguments.callee.base.apply(this,arguments);

    var contentView = this.get('contentView');
    if (!contentView) return NO; // nothing to do if no contentView.

    // get the frame for the view - should work even for views with static
    // layout, assuming it has been added to the screen.
    var vf = view.get('frame');
    if (!vf) return NO; // nothing to do

    // convert view's frame to an offset from the contentView origin.  This
    // will become the new scroll offset after some adjustment.
    vf = contentView.convertFrameFromView(vf, view.get('parentView'));

    return this.scrollToRect(vf);
  },

  /**
    Scroll to the supplied rectangle.
    @param {Rect} rect Rectangle to scroll to.
    @returns {Boolean} YES if scroll position was changed.
   */
  scrollToRect: function (rect) {
    // find current visible frame.
    var vo = SC.cloneRect(this.get('containerView').get('frame')),
        origX = this.get('horizontalScrollOffset'),
        origY = this.get('verticalScrollOffset');

    vo.x = origX;
    vo.y = origY;

    // if top edge is not visible, shift origin
    vo.y -= Math.max(0, SC.minY(vo) - SC.minY(rect));
    vo.x -= Math.max(0, SC.minX(vo) - SC.minX(rect));

    // if bottom edge is not visible, shift origin
    vo.y += Math.max(0, SC.maxY(rect) - SC.maxY(vo));
    vo.x += Math.max(0, SC.maxX(rect) - SC.maxX(vo));

    // scroll to that origin.
    if ((origX !== vo.x) || (origY !== vo.y)) {
      this.scrollTo(vo.x, vo.y);
      return YES;
    } else return NO;
  },


  /**
    Scrolls the receiver down one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollDownLine: function (lines) {
    if (typeof lines === "undefined") lines = 1;
    return this.scrollBy(null, this.get('verticalLineScroll') * lines);
  },

  /**
    Scrolls the receiver up one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollUpLine: function (lines) {
    if (typeof lines === "undefined") lines = 1;
    return this.scrollBy(null, -1 * this.get('verticalLineScroll') * lines);
  },

  /**
    Scrolls the receiver right one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollRightLine: function (lines) {
    if (typeof lines === "undefined") lines = 1;
    return this.scrollTo(this.get('horizontalLineScroll') * lines, null);
  },

  /**
    Scrolls the receiver left one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollLeftLine: function (lines) {
    if (typeof lines === "undefined") lines = 1;
    return this.scrollTo(-1 * this.get('horizontalLineScroll') * lines, null);
  },

  /**
    Scrolls the receiver down one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollDownPage: function (pages) {
    if (typeof pages === "undefined") pages = 1;
    return this.scrollBy(null, this.get('verticalPageScroll') * pages);
  },

  /**
    Scrolls the receiver up one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollUpPage: function (pages) {
    if (typeof pages === "undefined") pages = 1;
    return this.scrollBy(null, -1 * this.get('verticalPageScroll') * pages);
  },

  /**
    Scrolls the receiver right one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollRightPage: function (pages) {
    if (typeof pages === "undefined") pages = 1;
    return this.scrollBy(this.get('horizontalPageScroll') * pages, null);
  },

  /**
    Scrolls the receiver left one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
   */
  scrollLeftPage: function (pages) {
    if (typeof pages === "undefined") pages = 1;
    return this.scrollBy(-1 * this.get('horizontalPageScroll') * pages, null);
  },

  /** @private
    Adjusts the layout for the various internal views.  This method is called
    once when the scroll view is first configured and then anytime a scroller
    is shown or hidden.  You can call this method yourself as well to retile.

    You may also want to override this method to handle layout for any
    additional controls you have added to the view.
   */
  tile: function () {
    if (this.get('wantsNativeScrollbars')) return; // Let the browser retile

    var hasHorizontal = this.get('canScrollHorizontal'),
        hasVertical = this.get('canScrollVertical'),
        hScroll = this.get('hasHorizontalScroller') ? this.get('horizontalScrollerView') : null,
        vScroll = this.get('hasVerticalScroller') ? this.get('verticalScrollerView') : null,
        clipView = this.get('containerView'),
        clipLayout = { left: 0, top: 0 }, layout;

    var ht = hasHorizontal ? hScroll.get('scrollbarThickness') : 0;
    var vt = hasVertical ? vScroll.get('scrollbarThickness') : 0;

    if (hasHorizontal) {
      layout = this.get('horizontalScrollerLayout');
      layout = {
        left:   layout ? layout.left : 0,
        bottom: layout ? layout.bottom : 0,
        right:  layout ? layout.right + vt-1 : vt-1,
        height: ht
      };
      hScroll.set('layout', layout);
      clipLayout.bottom = layout.bottom + (hScroll.get('isTranslucent') ? 0 : layout.height);
    }

    if ((hasHorizontal && this.get('horizontalOverlay')) || !hasHorizontal) {
      clipLayout.bottom = 0;
    }

    if (hScroll) hScroll.set('isVisible', hasHorizontal);

    if (hasVertical) {
      ht     = ht + this.get('verticalScrollerBottom');
      layout = this.get('verticalScrollerLayout');
      layout = {
        top:    layout ? layout.top : 0,
        bottom: layout ? layout.bottom + ht : ht,
        right:  layout ? layout.right : 0,
        width:  vt
      };
      vScroll.set('layout', layout);
      clipLayout.right = layout.right + (vScroll.get('isTranslucent') ? 0 : layout.width);
    }

    if ((hasVertical && this.get('verticalOverlay')) || !hasVertical) {
      clipLayout.right = 0;
    }

    if (vScroll) vScroll.set('isVisible', hasVertical);

    clipView.adjust(clipLayout);
  },

  /** @private
    Called whenever a scroller visibility changes.
    Calls the tile() method.
   */
  scrollerVisibilityDidChange: function () {
    this.tile();
  }.observes('isVerticalScrollerVisible', 'isHorizontalScrollerVisible'),

  // ..............................................
  // SCALING SUPPORT
  //

  /**
    Determines whether scaling is allowed.

    @type Boolean
    @default NO
   */
  canScale: NO,

  /** @private
    The current scale.
   */
  _scale: 1.0,

  /**
    @field
    @type Number
    @default 1.0
   */
  scale: function (key, value) {
    if (typeof value !== "undefined") {
      this._scale = Math.min(Math.max(this.get("minimumScale"), value), this.get("maximumScale"));
    }
    return this._scale;
  }.property().cacheable(),

  /**
    The minimum scale.

    @type Number
    @default 0.25
   */
  minimumScale: 0.25,

  /**
    The maximum scale.

    @type Number
    @default 2.0
   */
  maximumScale: 2.0,

  /**
    Whether to automatically determine the scale range based on the size of the content.

    @type Boolean
    @default NO
   */
  autoScaleRange: NO,

  /** @private */
  _scale_css: "",

  /** @private */
  updateScale: function (scale) {
    var contentView = this.get("contentView");
    if (!contentView) return;

    if (contentView.isScalable) {
      this.get("contentView").applyScale(scale);
      this._scale_css = "";
    } else {
      this._scale_css = "scale3d(" + scale + ", " + scale + ", 1)";
    }
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private
    Instantiate scrollers & container views as needed.  Replace their classes
    in the regular properties.
   */
  createChildViews: function () {
    var childViews = [], view;

    // create the containerView.  We must always have a container view.
    // also, setup the contentView as the child of the containerView...
    if (SC.none(view = this.containerView)) view = SC.ContainerView;

    childViews.push(this.containerView = this.createChildView(view, {
      contentView: this.contentView,
      isScrollContainer: YES
    }));

    // and replace our own contentView...
    this.contentView = this.containerView.get('contentView');

    if (!this.get('wantsNativeScrollbars')) {
      // create a horizontal scroller view if needed...
      view = this.get("horizontalScrollerView");
      if (view) {
        if (this.get('hasHorizontalScroller')) {
          view = this.createChildView(view, {
            layoutDirection: SC.LAYOUT_HORIZONTAL,
            valueBinding: '*owner.horizontalScrollOffset'
          });
          this.set('horizontalScrollerView', view);
          childViews.push(view);
        } else this.horizontalScrollerView = null;
      }

      // create a vertical scroller view if needed...
      view = this.get("verticalScrollerView");
      if (view) {
        if (this.get('hasVerticalScroller')) {
          view = this.createChildView(view, {
            layoutDirection: SC.LAYOUT_VERTICAL,
            valueBinding: '*owner.verticalScrollOffset'
          });
          this.set('verticalScrollerView', view);
          childViews.push(view);
        } else this.verticalScrollerView = null;
      }
    }

    // set childViews array.
    this.childViews = childViews;

    this.contentViewDidChange(); // setup initial display...
    this.tile(); // set up initial tiling
  },

  /** @private */
  init: function () {
    arguments.callee.base.apply(this,arguments);

    // start observing initial content view.  The content view's frame has
    // already been setup in prepareDisplay so we don't need to call
    // viewFrameDidChange...
    this._scroll_contentView = this.get('contentView');
    var contentView = this._scroll_contentView;

    if (contentView) {
      contentView.addObserver('frame', this, this.contentViewFrameDidChange);
      contentView.addObserver('calculatedWidth', this, this.contentViewFrameDidChange);
      contentView.addObserver('calculatedHeight', this, this.contentViewFrameDidChange);
    }

    if (this.get('isVisibleInWindow')) this._scsv_registerAutoscroll();
  },

  /** @private
    Registers/deregisters view with SC.Drag for autoscrolling
   */
  _scsv_registerAutoscroll: function () {
    this.get('isVisibleInWindow') ? SC.Drag.addScrollableView(this) :
                                    SC.Drag.removeScrollableView(this);
  }.observes('isVisibleInWindow'),

  /** @private
    Whenever the contentView is changed, we need to observe the content view's
    frame to be notified whenever it's size changes.
   */
  contentViewDidChange: function () {
    var newView = this.get('contentView'),
        oldView = this._scroll_contentView,
        frameObserver = this.contentViewFrameDidChange,
        layerObserver = this.contentViewLayerDidChange;

    if (newView !== oldView) {

      // stop observing old content view
      if (oldView) {
        oldView.removeObserver('calculatedWidth', this, this.contentViewFrameDidChange);
        oldView.removeObserver('calculatedHeight', this, this.contentViewFrameDidChange);
        oldView.removeObserver('frame', this, frameObserver);
        oldView.removeObserver('layer', this, layerObserver);
      }

      // update cache
      this._scroll_contentView = newView;
      if (newView) {
        newView.addObserver('frame', this, frameObserver);
        newView.addObserver('calculatedWidth', this, this.contentViewFrameDidChange);
        newView.addObserver('calculatedHeight', this, this.contentViewFrameDidChange);
        newView.addObserver('layer', this, layerObserver);
      }

      // replace container
      this.containerView.set('contentView', newView);

      this.contentViewFrameDidChange();
    }
  }.observes('contentView'),

  /** @private */
  oldMaxHOffset: 0,

  /** @private */
  oldMaxVOffset: 0,

  /** @private
    Invoked whenever the contentView's frame changes.  This will update the
    scroller maxmimum and optionally update the scroller visibility if the
    size of the contentView changes.  We don't care about the origin since
    that is tracked separately from the offset values.

    @param {Boolean} [force] Re-calculate everything even if the contentView’s frame didn’t change size
   */
  contentViewFrameDidChange: function (force) {
    var view   = this.get('contentView'),
        f      = (view) ? view.get('frame') : null,
        scale  = this._scale,
        width  = 0,
        height = 0,
        dim, dimWidth, dimHeight, calculatedWidth, calculatedHeight;

    // If no view has been set yet, or it doesn't have a frame,
    // we can avoid doing any work.
    if (!view || !f) { return; }

    width = view.get('calculatedWidth') || f.width || 0;
    height = view.get('calculatedHeight') || f.height || 0;

    width *= scale;
    height *= scale;

    // cache out scroll settings...
    if (!force && (width === this._scroll_contentWidth) && (height === this._scroll_contentHeight)) return;
    this._scroll_contentWidth  = width;
    this._scroll_contentHeight = height;

    dim       = this.getPath('containerView.frame');
    dimWidth  = dim.width;
    dimHeight = dim.height;

    if (this.get('hasHorizontalScroller') && (view = this.get('horizontalScrollerView'))) {
      // decide if it should be visible or not
      if (this.get('autohidesHorizontalScroller')) {
        this.set('isHorizontalScrollerVisible', width > dimWidth);
      }
      if (!this.get('wantsNativeScrollbars')) {
        view.setIfChanged('maximum', width-dimWidth);
        view.setIfChanged('proportion', dimWidth/width);
      }
    }

    if (this.get('hasVerticalScroller') && (view = this.get('verticalScrollerView'))) {
      // decide if it should be visible or not
      if (this.get('autohidesVerticalScroller')) {
        this.set('isVerticalScrollerVisible', height > dimHeight);
      }
      if (!this.get('wantsNativeScrollbars')) {
        view.setIfChanged('maximum', height - dimHeight);
        view.setIfChanged('proportion', dimHeight / height);
      }
    }

    // If there is no vertical scroller and auto hiding is on, make
    // sure we are at the top if not already there
    if (!this.get('isVerticalScrollerVisible') && (this.get('verticalScrollOffset') !== 0) &&
        this.get('autohidesVerticalScroller')) {
      this.set('verticalScrollOffset', 0);
    }

    // Same thing for horizontal scrolling.
    if (!this.get('isHorizontalScrollerVisible') && (this.get('horizontalScrollOffset') !== 0) &&
       this.get('autohidesHorizontalScroller')) {
      this.set('horizontalScrollOffset', 0);
    }

    // This forces to recalculate the height of the frame when is at the bottom
    // of the scroll and the content dimension are smaller that the previous one
    var mxVOffSet   = this.get('maximumVerticalScrollOffset'),
        vOffSet     = this.get('verticalScrollOffset'),
        mxHOffSet   = this.get('maximumHorizontalScrollOffset'),
        hOffSet     = this.get('horizontalScrollOffset'),
        forceHeight = mxVOffSet < vOffSet,
        forceWidth  = mxHOffSet < hOffSet;

    if (forceHeight || forceWidth) {
      this.forceDimensionsRecalculation(forceWidth, forceHeight, vOffSet, hOffSet);
    }
  },

  /** @private
    If our frame changes, then we need to re-calculate the visiblility of our
    scrollers, etc.
   */
  frameDidChange: function () {
    this.contentViewFrameDidChange(YES);
  }.observes('frame'),

  /** @private
    If the layer of the content view changes, we need to readjust the
    scrollTop and scrollLeft properties on the new DOM element.
   */
  contentViewLayerDidChange: function () {
    // Invalidate these cached values, as they're no longer valid
    if (this._verticalScrollOffset !== 0) this._verticalScrollOffset = -1;
    if (this._horizontalScrollOffset !== 0) this._horizontalScrollOffset = -1;
    this.invokeLast(this.adjustElementScroll);
  },

  willScroll: function () {
    var content = this.get('contentView');
    content && content.willScroll && content.willScroll(this);
  },

  didScroll: function () {
    var content = this.get('contentView');
    content && content.didScroll && content.didScroll(this);
  },

  /** @private
    Whenever the horizontal scroll offset changes, update the scrollers and
    edit the location of the contentView.
   */
  _scsv_offsetDidChange: function () {
    this.invokeLast(this.adjustElementScroll);
  }.observes('horizontalScrollOffset', 'verticalScrollOffset'),

  /** @private
    Called at the end of the run loop to actually adjust the scrollTop
    and scrollLeft properties of the container view.
   */
  adjustElementScroll: function () {
    var content = this.get('contentView');

    // We notify the content view that its frame property has changed
    // before we actually update the scrollTop/scrollLeft properties.
    // This gives views that use incremental rendering a chance to render
    // newly-appearing elements before they come into view.
    if (content && content._viewFrameDidChange) {
      content._viewFrameDidChange();
    }
  },

  /** @private */
  forceDimensionsRecalculation: function (forceWidth, forceHeight, vOffSet, hOffSet) {
    var oldScrollHOffset = hOffSet;
    var oldScrollVOffset = vOffSet;
    this.scrollTo(0, 0);
    if (forceWidth && forceHeight) {
      this.scrollTo(this.get('maximumHorizontalScrollOffset'),
                    this.get('maximumVerticalScrollOffset'));
    }
    if (forceWidth && !forceHeight) {
      this.scrollTo(this.get('maximumHorizontalScrollOffset'), oldScrollVOffset);
    }
    if (!forceWidth && forceHeight) {
      this.scrollTo(oldScrollHOffset, this.get('maximumVerticalScrollOffset'));
    }
  },

  /** @private */
  _scroll_verticalScrollOffset: 0,

  /** @private */
  _scroll_horizontalScrollOffset: 0

});

/* >>>>>>>>>> BEGIN source/views/desktop/scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/core_scroll');
sc_require('views/desktop/scroller');

/** @class
  Implements a desktop scroll view using mouse events.

  This class uses native scroll events, inverting the control
  of `horizontalScrollOffset` and `verticalScrollOffset` to
  properly proxy the scroll offset values to and from SC.

  When you set these, SC gets notified _after_ the scroll
  offset gets set in the DOM.

  Important Events:

    - contentView frame size changes (to autoshow/hide scrollbar- adjust scrollbar size)
    - horizontalScrollOffset change
    - verticalScrollOffsetChanges

  @extends SC.View
  @since SproutCore 1.6
*/
SC.DesktopScrollView = SC.CoreScrollView.extend(
  /** @scope SC.DesktopScrollView.prototype */{

  /** @private
    Adjust scrollers immediately.
   */
  init: function () {
    SC.platform.propertyDidChange('scrollbarSize'); // invalidate the cache.
    this.set('nativeScrollbarThickness', SC.platform.get('scrollbarSize'));
    return arguments.callee.base.apply(this,arguments);
  },

  /**
    @type SC.CoreScrollerView
    @default SC.DesktopScrollerView
   */
  horizontalScrollerView: SC.DesktopScrollerView,

  /**
    @type SC.CoreScrollerView
    @default SC.DesktopScrollerView
   */
  verticalScrollerView: SC.DesktopScrollerView,

  /**
    Dynamically compute the renderDelegate name off of
    the property `wantsNativeScrollbars`, which will flip
    the render delegate between custom scrollbars and
    native ones.
    @field
    @type String
    @default scrollRenderDelegate
   */
  renderDelegateName: function () {
    return this.get('wantsNativeScrollbars') ? 'nativeScrollRenderDelegate' : 'scrollRenderDelegate';
  }.property('wantsNativeScrollbars').cacheable(),

  /**
    @type Array
    @default ['canScrollVertical', 'canScrollHorizontal', 'nativeScrollbarThickness']
   */
  displayProperties: ['canScrollVertical', 'canScrollHorizontal', 'nativeScrollbarThickness'],

  /**
    The current horizontal scroll offset.
    Changing this value will update both the `contentView`
    and the horizontal scroller, if there is one.

    @field
    @type Number
    @default 0
   */
  horizontalScrollOffset: function (key, value) {
    if (arguments.length === 2) {
      var minOffset = this.minimumHorizontalScrollOffset(),
          maxOffset = this.get('maximumHorizontalScrollOffset'),
          layer = this.getPath('containerView.layer'),
          offset = Math.max(minOffset, Math.min(maxOffset, value));

      this._scroll_horizontalScrollOffset = offset;
      if (layer && layer.scrollLeft !== offset) {
        layer.scrollLeft = offset;
      }
    }

    return this._scroll_horizontalScrollOffset || 0;
  }.property().cacheable(),

  /**
    The current vertical scroll offset.
    Changing this value will update both the `contentView`
    and the vertical scroller, if there is one.

    @field
    @type Number
    @default 0
   */
  verticalScrollOffset: function (key, value) {
    if (arguments.length === 2) {
      var minOffset = this.get('minimumVerticalScrollOffset'),
          maxOffset = this.get('maximumVerticalScrollOffset'),
          layer = this.getPath('containerView.layer'),
          offset = Math.max(minOffset, Math.min(maxOffset, value));

      this._scroll_verticalScrollOffset = offset;
      if (layer && layer.scrollTop !== offset) {
        layer.scrollTop = offset;
      }
    }

    return this._scroll_verticalScrollOffset || 0;
  }.property().cacheable(),

   /**
    The minimum interval between scroll event before
    it signals that scrolling is "done".

    @type Number
    @default 100
    */
  debounceInterval: 100,

  // ..........................................................
  // SCROLL WHEEL SUPPORT
  //

  containerView: SC.ContainerView.extend({

    classNames: ['sc-scroll-container-view'],

    wheelEvent: function () {
      // Firefox emits different mousewheel events than other browsers
      return SC.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel';
    }.property().cacheable(),

    /** @private
      Remove the "scroll" event handler for the layer.
     */
    willDestroyLayer: function () {
      SC.Event.remove(this.get('layer'), 'scroll', this, this.scroll);
      SC.Event.remove(this.get('layer'), this.get('wheelEvent'), this, this._scdsv_scrollDebounce);
    },

    /** @private
      Attach the "scroll" event handler for the layer.
     */
    didCreateLayer: function () {
      SC.Event.add(this.get('layer'), 'scroll', this, this.scroll);
      SC.Event.add(this.get('layer'), this.get('wheelEvent'), this, this._scdsv_scrollDebounce);
      this.get('parentView').displayDidChange();
    },

    _scdsv_scrollDebounce: function (evt) {
      if (this._debounce != null) {
        this._debounce.invalidate();
        this._debounce = null;
      } else {
        var layer = this.get('layer'),
            scrollTop = layer.scrollTop,
            scrollLeft = layer.scrollLeft;
        this.get('parentView').willScroll(this.get('parentView'));
      }

      this._debounce = this.invokeLater(this._scdsv_scrollDidFinish.bind(this),
                                        this.getPath('parentView.debounceInterval'));
    },

    _scdsv_scrollDidFinish: function () {
      var layer = this.get('layer'),
          scrollTop = layer.scrollTop,
          scrollLeft = layer.scrollLeft;
      this.get('parentView').didScroll(this.get('parentView'));
      this._debounce = null;
    },

    /** @private
      Notify the container that the scroll offsets have changed.
     */
    scroll: function (evt) {
      var layer = this.get('layer'),
          scrollTop = layer.scrollTop,
          scrollLeft = layer.scrollLeft,
          parentView = this.get('parentView');

      // I'm using `verticalScrollOffset` and `horizontalScrollOffset`
      // as proxies for the the actual scroll offsets.

      // Since we know what the offsets are (we got the event), this
      // needs to set the cached value, and let properties know that
      // the offset changed.
      if (parentView._scroll_verticalScrollOffset !== scrollTop) {
        parentView.propertyWillChange('verticalScrollOffset');
        parentView._scroll_verticalScrollOffset = scrollTop;
        parentView.propertyDidChange('verticalScrollOffset');
      }

      if (parentView._scroll_horizontalScrollOffset !== scrollLeft) {
        parentView.propertyWillChange('horizontalScrollOffset');
        parentView._scroll_horizontalScrollOffset = scrollLeft;
        parentView.propertyDidChange('horizontalScrollOffset');
      }

      return parentView.get('canScrollHorizontal') || parentView.get('canScrollVertical');
    }
  }),

  /**
    The native scrollbar thickness.
    @type Number
    @default 15
   */
  nativeScrollbarThickness: 15,

  /** @private
    Check to see if the native scrollbarSize changed due to scaling on the part
    of the browser.
   */
  viewDidResize: function () {
    SC.platform.propertyDidChange('scrollbarSize'); // invalidate the cache.
    this.set('nativeScrollbarThickness', SC.platform.get('scrollbarSize'));
    return arguments.callee.base.apply(this,arguments);
  }

});

/* >>>>>>>>>> BEGIN source/views/touch/scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
sc_require('views/core_scroller');

/** @class
  Implementation of a touch scroller view to be used in tandem with
  `SC.TouchScrollView`.

  To style the touch scroller view, implement your own render delegate.

  @extends SC.CoreScrollerView
 */
SC.TouchScrollerView = SC.CoreScrollerView.extend(
  /** @scope SC.TouchScrollerView.prototype */{

  /**
    @type Array
    @default ['sc-touch-scroller-view']
    @see SC.View#classNames
   */
  classNames: ['sc-touch-scroller-view'],

  /**
    @type Array
    @default ['displayThumbPosition', 'displayThumbLength']
    @see SC.View#displayProperties
   */
  displayProperties: ['displayThumbPosition', 'displayThumbLength'],

  /**
    @type Number
    @default 12
   */
  scrollbarThickness: 12,

  /**
    @type Boolean
    @default YES
   */
  isTranslucent: YES,
  
  /**
    @type Number
    @default 5
   */
  capLength: 5,
  
  /**
    @type Number
    @default 0
   */
  capOverlap: 0,
  
  /**
    @type Boolean
    @default NO
   */
  hasButtons: NO,
  
  /**
    @type Number
    @default 36
   */
  buttonOverlap: 36,

  /**
    @type String
    @default 'touchScrollerRenderDelegate'
   */
  renderDelegateName: 'touchScrollerRenderDelegate',

  /**
    @type Number
    @observes value
    @observes _touchScrollValue
   */
  displayValue: function () {
    var touchValue = this.get('_touchScrollValue');
    return !SC.none(touchValue) ? touchValue : this.get('value');
  }.property("value", "_touchScrollValue").cacheable(),

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  touchScrollDidStart: function (value) {
    this.set("_touchScrollValue", value);
  },

  /** @private */
  touchScrollDidEnd: function (value) {
    this.set("_touchScrollValue", null);
  },

  /** @private */
  touchScrollDidChange: function (value) {
    this.set("_touchScrollValue", value);
  },

  /** @private
    Updates the thumb display length and position to reflect
    the ability for touch scroll views to go out of bounds.

    This makes the scroller shrink when scrolling out of the
    bounds of the view, while ensuring that the scroller doesn't
    go past it's minimum bounds.
   */
  _sctcv_updateThumbDisplay: function () {
    var max = this.get("scrollerLength") - this.get('capLength'),
        min = this.get("minimum") + this.get('capLength'),
        position = this.get('thumbPosition'),
        length = this.get('thumbLength');

    if (position + length > max) {
      position = Math.min(max - 20, position);
      length = max - position;
    }

    if (position < min) {
      length -= min - position;
      position = min;
    }

    this.setIfChanged('displayThumbPosition', position);
    this.setIfChanged('displayThumbLength', Math.round(length - 1044));
  }.observes('thumbPosition', 'thumbLength', 'scrollerLength', 'capLength', 'minimum')

});

/* >>>>>>>>>> BEGIN source/views/touch/scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/core_scroll');
sc_require('views/touch/scroller');

/**
  @static
  @type Number
  @default 0.95
*/
SC.NORMAL_SCROLL_DECELERATION = 0.95;

/**
  @static
  @type Number
  @default 0.85
*/
SC.FAST_SCROLL_DECELERATION = 0.85;


/** @class
  Implements touch events for a scroll view

  Since the iPad doesn't allow native one-finger scrolling,
  this has to do all of the work of implementing the solution
  over again.

  In addition to the one-finger scrolling, this view implements
  edge-resistance.

  Note that incremental rendering is done after the scrolling
  has completely finished, which makes for a wait-and-see
  experience.

  @extends SC.CoreScrollerView
 */
SC.TouchScrollView = SC.CoreScrollView.extend(
  /** @scope SC.TouchScrollView.prototype */{

  /**
    Use this to overlay the vertical scroller.

    This ensures that the container frame will not resize to accomodate the
    vertical scroller, hence overlaying the scroller on top of
    the container.

    @type Boolean
    @default YES
  */
  verticalOverlay: YES,

  /**
    Use this to overlay the horizontal scroller.

    This ensures that the container frame will not resize to accomodate the
    horizontal scroller, hence overlaying the scroller on top of
    the container

    @type Boolean
    @default YES
  */
  horizontalOverlay: YES,

  /**
    @type SC.CoreScrollerView
    @default SC.TouchScrollerView
   */
  horizontalScrollerView: SC.TouchScrollerView,

  /**
    @type SC.CoreScrollerView
    @default SC.TouchScrollerView
   */
  verticalScrollerView: SC.TouchScrollerView,

  // ..........................................................
  // TOUCH SUPPORT
  //

  /**
    @type Boolean
    @default YES
    @readOnly
  */
  acceptsMultitouch: YES,

  /**
    The scroll deceleration rate.

    @type Number
    @default SC.NORMAL_SCROLL_DECELERATION
  */
  decelerationRate: SC.NORMAL_SCROLL_DECELERATION,

  /**
    If YES, bouncing will always be enabled in the horizontal direction, even if the content
    is smaller or the same size as the view.

    @type Boolean
    @default NO
  */
  alwaysBounceHorizontal: NO,

  /**
    If NO, bouncing will not be enabled in the vertical direction when the content is smaller
    or the same size as the scroll view.

    @type Boolean
    @default YES
  */
  alwaysBounceVertical: YES,

  /**
    Whether to delay touches from passing through to the content.

    @type Boolean
    @default YES
  */
  delaysContentTouches: YES,

  /** @private */
  _applyCSSTransforms: function (layer) {
    var transform = "";
    this.updateScale(this._scale);
    transform += 'translate3d('+ -this._scroll_horizontalScrollOffset +'px, '+ -Math.round(this._scroll_verticalScrollOffset)+'px,0) ';
    transform += this._scale_css;
    if (layer) {
      layer.style.webkitTransform = transform;
      layer.style.webkitTransformOrigin = "top left";
    }
  },

  /** @private */
  captureTouch: function (touch) {
    return YES;
  },

  /** @private */
  touchGeneration: 0,

  /** @private */
  touchStart: function (touch) {
    var generation = ++this.touchGeneration;
    if (!this.tracking && this.get("delaysContentTouches")) {
      this.invokeLater(this.beginTouchesInContent, 150, generation);
    } else if (!this.tracking) {
      // NOTE: We still have to delay because we don't want to call touchStart
      // while touchStart is itself being called...
      this.invokeLater(this.beginTouchesInContent, 1, generation);
    }
    this.beginTouchTracking(touch, YES);
    return YES;
  },

  /** @private */
  beginTouchesInContent: function (gen) {
    if (gen !== this.touchGeneration) return;

    var touch = this.touch, itemView;
    if (touch && this.tracking && !this.dragging && !touch.touch.scrollHasEnded) {
      // try to capture the touch
      touch.touch.captureTouch(this, YES);

      if (!touch.touch.touchResponder) {
        // if it DIDN'T WORK!!!!!
        // then we need to take possession again.
        touch.touch.makeTouchResponder(this);
      // Otherwise, it did work, and if we had a pending scroll end, we must do it now
      } else if (touch.needsScrollEnd) {
        this._touchScrollDidEnd();
      }
    }
  },

  /** @private
    This will notify anything that's incrementally rendering while
    scrolling, instead of having unrendered views.
   */
  _sctsv_setOffset: function (x, y) {
    if (!SC.none(x)) {
      this._scroll_horizontalScrollOffset = x;
    }

    if (!SC.none(y)) {
      this._scroll_verticalScrollOffset = y;
    }
  },

  /** @private
    Initializes the start state of the gesture.

    We keep information about the initial location of the touch so we can
    disambiguate between a tap and a drag.

    @param {Event} evt
  */
  beginTouchTracking: function (touch, starting) {
    var avg = touch.averagedTouchesForView(this, starting);

    var verticalScrollOffset = this._scroll_verticalScrollOffset || 0,
        horizontalScrollOffset = this._scroll_horizontalScrollOffset || 0,
        startClipOffsetX = horizontalScrollOffset,
        startClipOffsetY = verticalScrollOffset,
        needsScrollEnd = NO;

    this.willScroll(this);

    if (this.touch && this.touch.timeout) {
      // clear the timeout
      clearTimeout(this.touch.timeout);
      this.touch.timeout = null;

      // get the scroll offsets
      startClipOffsetX = this.touch.startClipOffset.x;
      startClipOffsetY = this.touch.startClipOffset.y;
      needsScrollEnd = YES;
    }

    // calculate container+content width/height
    var view = this.get('contentView') ;
    var contentWidth = view ? view.get('frame').width : 0,
        contentHeight = view ? view.get('frame').height : 0;

    if (view.calculatedWidth && view.calculatedWidth!==0) contentWidth = view.get('calculatedWidth');
    if (view.calculatedHeight && view.calculatedHeight !==0) contentHeight = view.get('calculatedHeight');

    var containerWidth = this.get('containerView').get('frame').width,
        containerHeight = this.get('containerView').get('frame').height;

    // calculate position in content
    var globalFrame = this.convertFrameToView(this.get("frame"), null),
        positionInContentX = (horizontalScrollOffset + (avg.x - globalFrame.x)) / this._scale,
        positionInContentY = (verticalScrollOffset + (avg.y - globalFrame.y)) / this._scale;

    this.touch = {
      startTime: touch.timeStamp,
      notCalculated: YES,

      enableScrolling: {
        x: contentWidth * this._scale > containerWidth || this.get("alwaysBounceHorizontal"),
        y: contentHeight * this._scale > containerHeight || this.get("alwaysBounceVertical")
      },
      scrolling: { x: NO, y: NO },

      enableBouncing: SC.platform.bounceOnScroll,

      // offsets and velocities
      startClipOffset: { x: startClipOffsetX, y: startClipOffsetY },
      lastScrollOffset: { x: horizontalScrollOffset, y: verticalScrollOffset },
      startTouchOffset: { x: avg.x, y: avg.y },
      scrollVelocity: { x: 0, y: 0 },

      startTouchOffsetInContent: { x: positionInContentX, y: positionInContentY },

      containerSize: { width: containerWidth, height: containerHeight },
      contentSize: { width: contentWidth, height: contentHeight },

      startScale: this._scale,
      startDistance: avg.d,
      canScale: this.get("canScale") && SC.platform.pinchToZoom,
      minimumScale: this.get("minimumScale"),
      maximumScale: this.get("maximumScale"),

      globalFrame: globalFrame,

      // cache some things
      layer: this.get("contentView").get('layer'),

      // some constants
      resistanceCoefficient: 0.998,
      resistanceAsymptote: 320,
      decelerationFromEdge: 0.05,
      accelerationToEdge: 0.1,

      // how much percent of the other drag direction you must drag to start dragging that direction too.
      scrollTolerance: { x: 15, y: 15 },
      scaleTolerance: 5,
      secondaryScrollTolerance: 30,
      scrollLock: 500,

      decelerationRate: this.get("decelerationRate"),

      // general status
      lastEventTime: touch.timeStamp,

      // the touch used
      touch: (starting ? touch : (this.touch ? this.touch.touch : null)),

      // needsScrollEnd will cause a scrollDidEnd even if this particular touch does not start a scroll.
      // the reason for this is because we don't want to say we've stopped scrolling just because we got
      // another touch, but simultaneously, we still need to send a touch end eventually.
      // there are two cases in which this will be used:
      //
      //    1. If the touch was sent to content touches (in which case we will not be scrolling)
      //    2. If the touch ends before scrolling starts (no scrolling then, either)
      needsScrollEnd: needsScrollEnd
    };

    if (!this.tracking) {
      this.tracking = YES;
      this.dragging = NO;
    }
  },

  /** @private */
  _adjustForEdgeResistance: function (offset, minOffset, maxOffset, resistanceCoefficient, asymptote) {
    var distanceFromEdge;

    // find distance from edge
    if (offset < minOffset) distanceFromEdge = offset - minOffset;
    else if (offset > maxOffset) distanceFromEdge = maxOffset - offset;
    else return offset;

    // manipulate logarithmically
    distanceFromEdge = Math.pow(resistanceCoefficient, Math.abs(distanceFromEdge)) * asymptote;

    // adjust mathematically
    if (offset < minOffset) distanceFromEdge = distanceFromEdge - asymptote;
    else distanceFromEdge = -distanceFromEdge + asymptote;

    // generate final value
    return Math.min(Math.max(minOffset, offset), maxOffset) + distanceFromEdge;
  },

  /** @private */
  touchesDragged: function (evt, touches) {
    var avg = evt.averagedTouchesForView(this);
    this.updateTouchScroll(avg.x, avg.y, avg.d, evt.timeStamp);
  },

  /** @private */
  updateTouchScroll: function (touchX, touchY, distance, timeStamp) {
    // get some vars
    var touch = this.touch,
        touchXInFrame = touchX - touch.globalFrame.x,
        touchYInFrame = touchY - touch.globalFrame.y,
        offsetY,
        maxOffsetY,
        offsetX,
        maxOffsetX,
        minOffsetX, minOffsetY;

    // calculate new position in content
    var positionInContentX = ((this._scroll_horizontalScrollOffset||0) + touchXInFrame) / this._scale,
        positionInContentY = ((this._scroll_verticalScrollOffset||0) + touchYInFrame) / this._scale;

    // calculate deltas
    var deltaX = positionInContentX - touch.startTouchOffset.x,
        deltaY = positionInContentY - touch.startTouchOffset.y;

    var isDragging = touch.dragging;
    if (!touch.scrolling.x && Math.abs(deltaX) > touch.scrollTolerance.x && touch.enableScrolling.x) {
      // say we are scrolling
      isDragging = YES;
      touch.scrolling.x = YES;
      touch.scrollTolerance.y = touch.secondaryScrollTolerance;

      // reset position
      touch.startTouchOffset.x = touchX;
      deltaX = 0;
    }
    if (!touch.scrolling.y && Math.abs(deltaY) > touch.scrollTolerance.y && touch.enableScrolling.y) {
      // say we are scrolling
      isDragging = YES;
      touch.scrolling.y = YES;
      touch.scrollTolerance.x = touch.secondaryScrollTolerance;

      // reset position
      touch.startTouchOffset.y = touchY;
      deltaY = 0;
    }

    // handle scroll start
    if (isDragging && !touch.dragging) {
      touch.dragging = YES;
      this.dragging = YES;
      this._touchScrollDidStart();
    }

    // calculate new offset
    if (!touch.scrolling.x && !touch.scrolling.y && !touch.canScale) return;
    if (touch.scrolling.x && !touch.scrolling.y) {
      if (deltaX > touch.scrollLock && !touch.scrolling.y) touch.enableScrolling.y = NO;
    }
    if (touch.scrolling.y && !touch.scrolling.x) {
      if (deltaY > touch.scrollLock && !touch.scrolling.x) touch.enableScrolling.x = NO;
    }

    // handle scaling through pinch gesture
    if (touch.canScale) {

      var startDistance = touch.startDistance, dd = distance - startDistance;
      if (Math.abs(dd) > touch.scaleTolerance) {
        touch.scrolling.y = YES; // if you scale, you can scroll.
        touch.scrolling.x = YES;

        // we want to say something that was the startDistance away from each other should now be
        // distance away. So, if we are twice as far away as we started...
        var scale = touch.startScale * (distance / Math.max(startDistance, 50));

        var newScale = this._adjustForEdgeResistance(scale, touch.minimumScale, touch.maximumScale, touch.resistanceCoefficient, touch.resistanceAsymptote);
        this.dragging = YES;
        this._scale = newScale;
        var newPositionInContentX = positionInContentX * this._scale,
            newPositionInContentY = positionInContentY * this._scale;
      }
    }

    // these do exactly what they sound like. So, this comment is just to
    // block off the code a bit
    // In english, these calculate the minimum X/Y offsets
    minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale,
                                          touch.containerSize.width, this.get("horizontalAlign"));
    minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale,
                                          touch.containerSize.height, this.get("verticalAlign"));

    // and now, maximum...
    maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale,
                                          touch.containerSize.width, this.get("horizontalAlign"));
    maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale,
                                          touch.containerSize.height, this.get("verticalAlign"));

    // So, the following is the completely written out algebra:
    // (offsetY + touchYInFrame) / this._scale = touch.startTouchOffsetInContent.y
    // offsetY + touchYInFrame = touch.startTouchOffsetInContent.y * this._scale;
    // offsetY = touch.startTouchOffset * this._scale - touchYInFrame

    // and the result applied:
    offsetX = touch.startTouchOffsetInContent.x * this._scale - touchXInFrame;
    offsetY = touch.startTouchOffsetInContent.y * this._scale - touchYInFrame;


    // we need to adjust for edge resistance, or, if bouncing is disabled, just stop flat.
    if (touch.enableBouncing) {
      offsetX = this._adjustForEdgeResistance(offsetX, minOffsetX, maxOffsetX, touch.resistanceCoefficient, touch.resistanceAsymptote);
      offsetY = this._adjustForEdgeResistance(offsetY, minOffsetY, maxOffsetY, touch.resistanceCoefficient, touch.resistanceAsymptote);
    } else {
      offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX));
      offsetY = Math.max(minOffsetY, Math.min(maxOffsetY, offsetY));
    }

    // and now, _if_ scrolling is enabled, set the new coordinates
    if (touch.scrolling.x) this._sctsv_setOffset(offsetX, null);
    if (touch.scrolling.y) this._sctsv_setOffset(null, offsetY);

    // and apply the CSS transforms.
    this._applyCSSTransforms(touch.layer);
    this._touchScrollDidChange();


    // prepare for momentum scrolling by calculating the momentum.
    if ((timeStamp - touch.lastEventTime) >= 1 || touch.notCalculated) {
      touch.notCalculated = NO;
      var horizontalOffset = this._scroll_horizontalScrollOffset;
      var verticalOffset = this._scroll_verticalScrollOffset;

      touch.scrollVelocity.x = (horizontalOffset - touch.lastScrollOffset.x) /
                                Math.max(1, timeStamp - touch.lastEventTime); // in px per ms
      touch.scrollVelocity.y = (verticalOffset - touch.lastScrollOffset.y) /
                                Math.max(1, timeStamp - touch.lastEventTime); // in px per ms
      touch.lastScrollOffset.x = horizontalOffset;
      touch.lastScrollOffset.y = verticalOffset;
      touch.lastEventTime = timeStamp;
    }
  },

  /** @private */
  touchEnd: function (touch) {
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
      } else {
        // well. The scrolling stopped. Let us tell everyone if there was a pending one that this non-drag op interrupted.
        if (touchStatus.needsScrollEnd) this._touchScrollDidEnd();

        // this part looks weird, but it is actually quite simple.
        // First, we send the touch off for capture+starting again, but telling it to return to us
        // if nothing is found or if it is released.
        touch.captureTouch(this, YES);

        // if we went anywhere, did anything, etc., call end()
        if (touch.touchResponder && touch.touchResponder !== this) {
          touch.end();
        } else if (!touch.touchResponder || touch.touchResponder === this) {
          // if it was released to us or stayed with us the whole time, or is for some
          // wacky reason empty (in which case it is ours still). If so, and there is a next responder,
          // relay to that.

          if (touch.nextTouchResponder) touch.makeTouchResponder(touch.nextTouchResponder);
        } else {
          // in this case, the view that captured it and changed responder should have handled
          // everything for us.
        }

        this.touch = null;
      }

      this.tracking = NO;
      this.dragging = NO;
    }
  },

  /** @private */
  touchCancelled: function (touch) {
    var touchStatus = this.touch,
        avg = touch.averagedTouchesForView(this);

    // if we are decelerating, we don't want to stop that. That would be bad. Because there's no point.
    if (!this.touch || !this.touch.timeout) {
      this.beginPropertyChanges();
      this.set("scale", this._scale);
      this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
      this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
      this.endPropertyChanges();
      this.didScroll(this);
      this.tracking = NO;

      if (this.dragging) {
        this._touchScrollDidEnd();
      }

      this.dragging = NO;
      this.touch = null;
    }
  },

  /** @private */
  startDecelerationAnimation: function (evt) {
    var touch = this.touch;
    touch.decelerationVelocity = {
      x: touch.scrollVelocity.x * 10,
      y: touch.scrollVelocity.y * 10
    };

    this.decelerateAnimation();
  },

  /** @private
    Does bounce calculations, adjusting velocity.

    Bouncing is fun. Functions that handle it should have fun names,
    don'tcha think?

    P.S.: should this be named "bouncityBounce" instead?
  */
  bouncyBounce: function (velocity, value, minValue, maxValue, de, ac, additionalAcceleration) {
    // we have 4 possible paths. On a higher level, we have two leaf paths that can be applied
    // for either of two super-paths.
    //
    // The first path is if we are decelerating past an edge: in this case, this function must
    // must enhance that deceleration. In this case, our math boils down to taking the amount
    // by which we are past the edge, multiplying it by our deceleration factor, and reducing
    // velocity by that amount.
    //
    // The second path is if we are not decelerating, but are still past the edge. In this case,
    // we must start acceleration back _to_ the edge. The math here takes the distance we are from
    // the edge, multiplies by the acceleration factor, and then performs two additional things:
    // First, it speeds up the acceleration artificially  with additionalAcceleration; this will
    // make the stop feel more sudden, as it will still have this additional acceleration when it reaches
    // the edge. Second, it ensures the result does not go past the final value, so we don't end up
    // bouncing back and forth all crazy-like.
    if (value < minValue) {
      if (velocity < 0) velocity = velocity + ((minValue - value) * de);
      else {
        velocity = Math.min((minValue-value) * ac + additionalAcceleration, minValue - value - 0.01);
      }
    } else if (value > maxValue) {
      if (velocity > 0) velocity = velocity - ((value - maxValue) * de);
      else {
        velocity = -Math.min((value - maxValue) * ac + additionalAcceleration, value - maxValue - 0.01);
      }
    }
    return velocity;
  },

  /** @private */
  decelerateAnimation: function () {
    // get a bunch of properties. They are named well, so not much explanation of what they are...
    // However, note maxOffsetX/Y takes into account the scale;
    // also, newX/Y adds in the current deceleration velocity (the deceleration velocity will
    // be changed later in this function).
    var touch = this.touch,
        scale = this._scale,
        minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale,
                                              touch.containerSize.width, this.get("horizontalAlign")),
        minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale,
                                              touch.containerSize.height, this.get("verticalAlign")),
        maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale,
                                              touch.containerSize.width, this.get("horizontalAlign")),
        maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale,
                                              touch.containerSize.height, this.get("verticalAlign")),

        now = Date.now(),
        t = Math.max(now - touch.lastEventTime, 1),

        newX = this._scroll_horizontalScrollOffset + touch.decelerationVelocity.x * (t / 10),
        newY = this._scroll_verticalScrollOffset + touch.decelerationVelocity.y * (t / 10);

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
    minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale,
                                          touch.containerSize.width, this.get("horizontalAlign"));
    minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale,
                                          touch.containerSize.height, this.get("verticalAlign"));
    maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale,
                                          touch.containerSize.width, this.get("horizontalAlign"));
    maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale,
                                          touch.containerSize.height, this.get("verticalAlign"));

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
    this._sctsv_setOffset(newX, newY);

    this._applyCSSTransforms(touch.layer); // <- Does what it sounds like.

    this._touchScrollDidChange();

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
    if (absYVelocity < 0.05 && absXVelocity < 0.05 && Math.abs(sv) < 0.05) {
      // we can reset the timeout, as it will no longer be required, and we don't want to re-cancel it later.
      touch.timeout = null;
      this.touch = null;

      // trigger scroll end
      this._touchScrollDidEnd();

      // set the scale, vertical, and horizontal offsets to what they technically already are,
      // but don't know they are yet. This will finally update things like, say, the clipping frame.
      this.beginPropertyChanges();
      this.set("scale", this._scale);
      this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
      this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
      this.endPropertyChanges();
      this.didScroll(this);

      return;
    }

    // We now set up the next round. We are doing this as raw as we possibly can, not touching the
    // run loop at all. This speeds up performance drastically--keep in mind, we're on comparatively
    // slow devices, here. So, we'll just make a closure, saving "this" into "self" and calling
    // 10ms later (or however long it takes). Note also that we save both the last event time
    // (so we may calculate elapsed time) and the timeout we are creating, so we may cancel it in future.
    var self = this;
    touch.lastEventTime = Date.now();
    this.touch.timeout = setTimeout(function () {
      SC.run(self.decelerateAnimation(), self);
    }, 10);
  },

  adjustElementScroll: function () {
    var content = this.get('contentView');

    if (content) {
      this._applyCSSTransforms(content.get('layer'));
    }
    return arguments.callee.base.apply(this,arguments);
  },

  /** @private */
  _touchScrollDidChange: function () {
    var contentView = this.get('contentView'),
        horizontalScrollOffset = this._scroll_horizontalScrollOffset,
        verticalScrollOffset = this._scroll_verticalScrollOffset;
    if (contentView.touchScrollDidChange) {
      contentView.touchScrollDidChange(horizontalScrollOffset, verticalScrollOffset);
    }

    // tell scrollers
    if (this.verticalScrollerView && this.verticalScrollerView.touchScrollDidChange) {
      this.verticalScrollerView.touchScrollDidChange(verticalScrollOffset);
    }

    if (this.horizontalScrollerView && this.horizontalScrollerView.touchScrollDidChange) {
      this.horizontalScrollerView.touchScrollDidChange(horizontalScrollOffset);
    }
  }
});

SC.TouchScrollView.prototype.mixin({

  /** @private */
  _touchScrollDidStart: SC.TouchScrollView.prototype._touchScrollDidChange,

  /** @private */
  _touchScrollDidEnd: SC.TouchScrollView.prototype._touchScrollDidChange

});

/* >>>>>>>>>> BEGIN source/views/scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/desktop/scroll');
sc_require('views/touch/scroll');

SC.ScrollView = SC.platform.touch ? SC.TouchScrollView : SC.DesktopScrollView;

// Spoofed browsers should use TouchScrollView.
if (SC.browser && SC.platform && SC.browser.mobileSafari && !SC.platform.touch) {
  SC.ScrollView = SC.TouchScrollView;
}

