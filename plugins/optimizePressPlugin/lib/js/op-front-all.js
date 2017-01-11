/*!
 * SelectNav.js (v. 0.1.2)
 * Converts your <ul>/<ol> navigation into a dropdown list for small screens
 * https://github.com/lukaszfiszer/selectnav.js
 *
 * modified by Luka Peharda (if sub nav was empty "undefined" was returned instead of empty string)
 * modified by Zoran Jambor (added check to ensure that addEventListener doesn't break the script if there's no element to attach it to)
 * modified by Zoran Jambor (removed navigation item from the list; it was automatically added to list by the script)
 */
window.selectnav = function() {
    "use strict";
    var e = function(e, t) {
        function c(e) {
            var t;
            if (!e) e = window.event;
            if (e.target) t = e.target;
            else if (e.srcElement) t = e.srcElement;
            if (t.nodeType === 3) t = t.parentNode;
            if (t.value) window.location.href = t.value
        }

        function h(e) {
            var t = e.nodeName.toLowerCase();
            return t === "ul" || t === "ol"
        }

        function p(e) {
            for (var t = 1; document.getElementById("selectnav" + t); t++);
            return e ? "selectnav" + t : "selectnav" + (t - 1)
        }

        function d(e) {
            a++;
            var t = e.children.length,
                n = "",
                l = "",
                c = a - 1;
            if (!t) {
                a--;
                return ''
            }
            if (c) {
                while (c--) {
                    l += o
                }
                l += " "
            }
            for (var v = 0; v < t; v++) {
                var m = e.children[v].children[0];
                if (typeof m !== "undefined") {
                    var g = m.innerText || m.textContent;
                    var y = "";
                    if (r) {
                        y = m.className.search(r) !== -1 || m.parentNode.className.search(r) !== -1 ? f : ""
                    }
                    if (i && !y) {
                        y = m.href === document.URL ? f : ""
                    }
                    n += '<option value="' + m.href + '" ' + y + ">" + l + g + "</option>";
                    if (s) {
                        var b = e.children[v].children[1];
                        if (b && h(b)) {
                            n += d(b)
                        }
                    }
                }
            }
            if (a === 1 && u) {
                n = '<option value="">' + u + "</option>" + n
            }
            if (a === 1) {
                n = '<select class="selectnav dk" name="op_dropdown" tabindex="1" id="' + p(true) + '">' + n + "</select>"
            }
            a--;
            return n
        }
        e = document.getElementById(e);
        if (!e) {
            return
        }
        if (!h(e)) {
            return
        }
        if (!("insertAdjacentHTML" in window.document.documentElement)) {
            return
        }
        document.documentElement.className += " js";
        var n = t || {},
            r = n.activeclass || "active",
            i = typeof n.autoselect === "boolean" ? n.autoselect : true,
            s = typeof n.nested === "boolean" ? n.nested : true,
            o = n.indent || "→",
            u = n.label || "",
            a = 0,
            f = " selected ";
        e.insertAdjacentHTML("afterend", d(e));
        var l = document.getElementById(p());
        if (l && l.addEventListener) {
            l.addEventListener("change", c)
        }
        if (l && l.attachEvent) {
            l.attachEvent("onchange", c)
        }
        return l
    };
    return function(t, n) {
        e(t, n)
    }
}()
;
/*!
 * DropKick 2.0.2
 *
 * Highly customizable <select> lists
 * https://github.com/robdel12/DropKick
 *
*/

(function( $, window, document, undefined ) {

window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );
window.isIframe = (window.parent != window.self && location.host === parent.location.host);

var

  // Cache of DK Objects
  dkCache = {},
  dkIndex = 0,

  // The Dropkick Object
  Dropkick = function( sel, opts ) {
    var i;

    // Prevent DK on mobile
    if ( window.isMobile && !opts.mobile ) {
      return false;
    }

    // Safety if `Dropkick` is called without `new`
    if ( this === window ) {
      return new Dropkick( sel, opts );
    }

    if ( typeof sel === "string" && sel[0] === "#" ) {
      sel = document.getElementById( sel.substr( 1 ) );
    }

    // Check if select has already been DK'd and return the DK Object
    if ( i = sel.getAttribute( "data-dkcacheid" ) ) {
      _.extend( dkCache[ i ].data.settings, opts );
      return dkCache[ i ];
    }

    if ( sel.nodeName === "SELECT" ) {
      return this.init( sel, opts );
    }
  },

  noop = function() {},

  // DK default options
  defaults = {

    // Called once after the DK element is inserted into the DOM
    initialize: noop,

    // Called every time the select changes value
    change: noop,

    // Called every time the DK element is opened
    open: noop,

    // Called every time the DK element is closed
    close: noop,

    // Search method; "strict", "partial", or "fuzzy"
    search: "strict"
  },

  // Common Utilities
  _ = {

    hasClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      return elem && reg.test( elem.className );
    },

    addClass: function( elem, classname ) {
      if( elem && !_.hasClass( elem, classname ) ) {
        elem.className += " " + classname;
      }
    },

    removeClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      elem && ( elem.className = elem.className.replace( reg, " " ) );
    },

    toggleClass: function( elem, classname ) {
      var fn = _.hasClass( elem, classname ) ? "remove" : "add";
      _[ fn + "Class" ]( elem, classname );
    },

    // Shallow object extend
    extend: function( obj ) {
      Array.prototype.slice.call( arguments, 1 ).forEach( function( source ) {
        if ( source ) for ( var prop in source ) obj[ prop ] = source[ prop ];
      });

      return obj;
    },

    // Returns the top and left offset of an element
    offset: function( elem ) {
      var box = elem.getBoundingClientRect() || { top: 0, left: 0 },
        docElem = document.documentElement;

      return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft
      };
    },

    // Returns the top and left position of an element relative to an ancestor
    position: function( elem, relative ) {
      var pos = { top: 0, left: 0 };

      while ( elem !== relative ) {
        pos.top += elem.offsetTop;
        pos.left += elem.offsetLeft;
        elem = elem.parentNode;
      }

      return pos;
    },

    // Returns the closest ancestor element of the child or false if not found
    closest: function( child, ancestor ) {
      while ( child ) {
        if ( child === ancestor ) return child;
        child = child.parentNode;
      }
      return false;
    },

    // Creates a DOM node with the specified attributes
    create: function( name, attrs ) {
      var a, node = document.createElement( name );

      if ( !attrs ) attrs = {};

      for ( a in attrs ) {
        if ( attrs.hasOwnProperty( a ) ) {
          if ( a == "innerHTML" ) {
            node.innerHTML = attrs[ a ];
          } else {
            node.setAttribute( a, attrs[ a ] );
          }
        }
      }

      return node;
    }
  };


// Extends the DK objects's Prototype
Dropkick.prototype = {

  // Emulate some of HTMLSelectElement's methods

  /**
   * Adds an element to the select
   * @param {Node}         elem   HTMLOptionElement
   * @param {Node/Integer} before HTMLOptionElement/Index of Element
   */
  add: function( elem, before ) {
    var text, option, i;

    if ( typeof elem === "string" ) {
      text = elem;
      elem = document.createElement("option");
      elem.text = text;
    }

    if ( elem.nodeName === "OPTION" ) {
      option = _.create( "li", {
        "class": "dk-option",
        "data-value": elem.value,
        "innerHTML": elem.text,
        "role": "option",
        "aria-selected": "false",
        "id": "dk" + this.data.cacheID + "-" + ( elem.id || elem.value.replace( " ", "-" ) )
      });

      _.addClass( option, elem.className );
      this.length += 1;

      if ( elem.disabled ) {
        _.addClass( option, "dk-option-disabled" );
        option.setAttribute( "aria-disabled", "true" );
      }

      this.data.select.add( elem, before );

      if ( typeof before === "number" ) {
        before = this.item( before );
      }

      if ( this.options.indexOf( before ) > -1 ) {
        before.parentNode.insertBefore( option, before );
      } else {
        this.data.elem.lastChild.appendChild( option );
      }

      option.addEventListener( "mouseover", this );

      i = this.options.indexOf( before );
      this.options.splice( i, 0, option );

      if ( elem.selected ) {
        this.select( i );
      }
    }
  },

  /**
   * Selects an option in the lists at the desired index
   * (negative numbers select from the end)
   * @param  {Integer} index Index of element (positive or negative)
   * @return {Node}          The DK option from the list, or null if not found
   */
  item: function( index ) {
    index = index < 0 ? this.options.length + index : index;
    return this.options[ index ] || null;
  },

  /**
   * Removes an element at the given index
   * @param  {Integer} index Index of element (positive or negative)
   */
  remove: function( index ) {
    var dkOption = this.item( index );
    dkOption.parentNode.removeChild( dkOption );
    this.options.splice( index, 1 );
    this.data.select.remove( index );
    this.select( this.data.select.selectedIndex );
    this.length -= 1;
  },

  /**
   * Initializes the DK Object
   * @param  {Node}   sel  [description]
   * @param  {Object} opts Options to override defaults
   * @return {Object}      The DK Object
   */
  init: function( sel, opts ) {
    var i,
      dk =  Dropkick.build( sel, "dk" + dkIndex );

    // Set some data on the DK Object
    this.data = {};
    this.data.select = sel;
    this.data.elem = dk.elem;
    this.data.settings = _.extend({}, defaults, opts );

    // Emulate some of HTMLSelectElement's properties
    this.disabled = sel.disabled;
    this.form = sel.form;
    this.length = sel.length;
    this.multiple = sel.multiple;
    this.options = dk.options.slice( 0 );
    this.selectedIndex = sel.selectedIndex;
    this.selectedOptions = dk.selected.slice( 0 );
    this.value = sel.value;

    // Insert the DK element before the original select
    sel.parentNode.insertBefore( this.data.elem, sel );

    // Bind events
    this.data.elem.addEventListener( "click", this );
    this.data.elem.addEventListener( "keydown", this );
    this.data.elem.addEventListener( "keypress", this );

    if ( this.form ) {
      this.form.addEventListener( "reset", this );
    }

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        this.options[ i ].addEventListener( "mouseover", this );
      }
    }

    if ( dkIndex === 0 ) {
      document.addEventListener( "click", Dropkick.onDocClick );
      if ( window.isIframe ){
        parent.document.addEventListener( "click", Dropkick.onDocClick );
      }
    }

    // Add the DK Object to the cache
    this.data.cacheID = dkIndex;
    sel.setAttribute( "data-dkCacheId", this.data.cacheID );
    dkCache[ this.data.cacheID ] = this;

    // Call the optional initialize function
    this.data.settings.initialize.call( this );

    // Increment the index
    dkIndex += 1;

    return this;
  },

  /**
   * Closes the DK dropdown
   */
  close: function() {
    var dk = this.data.elem;

    if ( !this.isOpen || this.multiple ) {
      return false;
    }

    for ( i = 0; i < this.options.length; i++ ) {
      _.removeClass( this.options[ i ], "dk-option-highlight" );
    }

    dk.lastChild.setAttribute( "aria-expanded", "false" );
    _.removeClass( dk.lastChild, "dk-select-options-highlight" );
    _.removeClass( dk, "dk-select-open-(up|down)" );
    this.isOpen = false;

    this.data.settings.close.call( this );
  },

  /**
   * Opens the DK dropdown
   */
  open: function() {
    var dropHeight, above, below,
      dk = this.data.elem,
      dkOptsList = dk.lastChild,
      dkTop = _.offset( dk ).top - window.scrollY,
      dkBottom = window.innerHeight - ( dkTop + dk.offsetHeight );

    if ( this.isOpen || this.multiple ) return false;

    dkOptsList.style.display = "block";
    dropHeight = dkOptsList.offsetHeight;
    dkOptsList.style.display = "";

    above = dkTop > dropHeight;
    below = dkBottom > dropHeight;
    direction = above && !below ? "-up" : "-down";

    this.isOpen = true;
    _.addClass( dk, "dk-select-open" + direction );
    dkOptsList.setAttribute( "aria-expanded", "true" );
    this._scrollTo( this.options.length - 1 );
    this._scrollTo( this.selectedIndex );

    this.data.settings.open.call( this );
  },

  /**
   * Disables or enables an option or the entire Dropkick
   * @param  {Node/Integer} elem     The element or index to disable
   * @param  {Boolean}      disabled Value of disabled
   */
  disable: function( elem, disabled ) {
    var disabledClass = "dk-option-disabled";

    if ( arguments.length == 0 || typeof elem === "boolean" ) {
      disabled = elem === undefined ? true : false;
      elem = this.data.elem;
      disabledClass = "dk-select-disabled";
      this.disabled = disabled;
    }

    if ( disabled == undefined ) {
      disabled = true;
    }

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    _[ disabled ? "addClass" : "removeClass" ]( elem, disabledClass );
  },

  /**
   * Selects an option from the list
   * @param  {Node/Integer/String} elem     The element, index, or value to select
   * @param  {Boolean}             disabled Selects disabled options
   * @return {Node}                         The selected element
   */
  select: function( elem, disabled ) {
    var i, index, option, combobox,
      select = this.data.select;

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    if ( typeof elem === "string" ) {
      for ( i = 0; i < this.length; i++ ) {
        if ( this.options[ i ].getAttribute( "data-value" ) == elem ) {
          elem = this.options[ i ];
        } else {
          return false;
        }
      }
    }

    if ( !disabled && _.hasClass( elem, "dk-option-disabled" ) ) return false;

    if ( _.hasClass( elem, "dk-option" ) ) {
      index = this.options.indexOf( elem );
      option = select.options[ index ];

      if ( this.multiple ) {
        _.toggleClass( elem, "dk-option-selected" );
        option.selected = !option.selected;

        if ( _.hasClass( elem, "dk-option-selected" ) ) {
          elem.setAttribute( "aria-selected", "true" );
          this.selectedOptions.push( elem );
        } else {
          elem.setAttribute( "aria-selected", "false" );
          index = this.selectedOptions.indexOf( elem );
          this.selectedOptions.splice( index, 1 );
        }
      } else {
        combobox = this.data.elem.firstChild;

        if ( this.selectedOptions.length ) {
          _.removeClass( this.selectedOptions[0], "dk-option-selected" );
          this.selectedOptions[0].setAttribute( "aria-selected", "false" );
        }

        _.addClass( elem, "dk-option-selected" );
        elem.setAttribute( "aria-selected", "true" );

        combobox.setAttribute( "aria-activedescendant", elem.id );
        combobox.innerHTML = option.text;

        this.selectedOptions[0] = elem;
        option.selected = true;
      }

      this.selectedIndex = select.selectedIndex;
      this.value = select.value;
      this.data.settings.change.call( this );

      return elem;
    }
  },

  /**
   * Selects a single option from the list
   * @param  {Node/Integer} elem     The element or index to select
   * @param  {Boolean}      disabled Selects disabled options
   * @return {Node}                  The selected element
   */
  selectOne: function( elem, disabled ) {
    this.reset( true );
    this._scrollTo( elem );
    return this.select( elem, disabled );
  },

  /**
   * Finds all options who's text matches a pattern (strict, partial, or fuzzy)
   * @param  {String} string  The string to search for
   * @param  {Integer} mode   How to search; "strict", "partial", or "fuzzy"
   * @return {Array/Boolean}  An Array of matched elements
   */
  search: function( pattern, mode ) {
    var i, tokens, str, tIndex, sIndex, cScore, tScore, reg,
      options = this.data.select.options,
      matches = [];

    if ( !pattern ) return this.options;

    // Fix Mode
    mode = mode ? mode.toLowerCase() : "strict";
    mode = mode == "fuzzy" ? 2 : mode == "partial" ? 1 : 0;

    reg = new RegExp( ( mode ? "" : "^" ) + pattern, "i" );

    for ( i = 0; i < options.length; i++ ) {
      str = options[ i ].text.toLowerCase();

      // Fuzzy
      if ( mode == 2 ) {
        tokens = pattern.toLowerCase().split("");
        tIndex = sIndex = cScore = tScore = 0;

        while ( sIndex < str.length ) {
          if ( str[ sIndex ] === tokens[ tIndex ] ) {
            cScore += 1 + cScore;
            tIndex++;
          } else {
            cScore = 0;
          }

          tScore += cScore;
          sIndex++;
        }

        if ( tIndex == tokens.length ) {
          matches.push({ e: this.options[ i ], s: tScore, i: i });
        }

      // Partial or Strict (Default)
      } else {
        reg.test( str ) && matches.push( this.options[ i ] );
      }
    }

    // Sort fuzzy results
    if ( mode == 2 ) {
      matches = matches.sort( function ( a, b ) {
        return ( b.s - a.s ) || a.i - b.i;
      }).reduce( function ( p, o ) {
        p[ p.length ] = o.e;
        return p;
      }, [] );
    }

    return matches;
  },

  /**
   * Resets the DK and select element
   * @param  {Boolean} clear Defaults to first option if True
   */
  reset: function( clear ) {
    var i,
      select = this.data.select;

    this.selectedOptions.length = 0;

    for ( i = 0; i < select.options.length; i++ ) {
      select.options[ i ].selected = false;
      _.removeClass( this.options[ i ], "dk-option-selected" );
      this.options[ i ].setAttribute( "aria-selected", "false" );
      if ( !clear && select.options[ i ].defaultSelected ) {
        this.select( i, true );
      }
    }

    if ( !this.selectedOptions.length && !this.multiple ) {
      this.select( 0, true );
    }
  },

  /**
   * Rebuilds the DK Object
   * (use if HTMLSelectElement has changed)
   */
  refresh: function() {
    this.dispose().init( this.data.select, this.data.settings );
  },

  /**
   * Removes the DK Object from the cache and the element from the DOM
   */
  dispose: function() {
    delete dkCache[ this.data.cachID ];
    this.data.elem.parentNode.removeChild( this.data.elem );
    this.data.select.removeAttribute( "data-dkCacheId" );
    return this;
  },

  // Private Methods

  handleEvent: function( event ) {
    if ( this.disabled ) return;

    switch ( event.type ) {
    case "click":
      this._delegate( event );
      break;
    case "keydown":
      this._keyHandler( event );
      break;
    case "keypress":
      this._searchOptions( event );
      break;
    case "mouseover":
      this._highlight( event );
      break;
    case "reset":
      this.reset();
      break;
    }
  },

  _delegate: function( event ) {
    var selection, index, firstIndex, lastIndex,
      target = event.target;

    if ( _.hasClass( target, "dk-option-disabled" ) ) {
      return false;
    }

    if ( !this.multiple ) {
      this[ this.isOpen ? "close" : "open" ]();
      if ( _.hasClass( target, "dk-option" ) ) this.select( target );
    } else {
      if ( _.hasClass( target, "dk-option" ) ) {
        selection = window.getSelection();
        if ( selection.type == "Range" ) selection.collapseToStart();

        if ( event.shiftKey ) {
          firstIndex = this.options.indexOf( this.selectedOptions[0] );
          lastIndex = this.options.indexOf( this.selectedOptions[ this.selectedOptions.length - 1 ] );
          index =  this.options.indexOf( target );

          if ( index > firstIndex && index < lastIndex ) index = firstIndex;
          if ( index > lastIndex && lastIndex > firstIndex ) lastIndex = firstIndex;

          this.reset( true );

          if ( lastIndex > index ) {
            while ( index < lastIndex + 1 ) this.select( index++ );
          } else {
            while ( index > lastIndex - 1 ) this.select( index-- );
          }
        } else if ( event.ctrlKey || event.metaKey ) {
          this.select( target );
        } else {
          this.reset( true );
          this.select( target );
        }
      }
    }
  },

  _highlight: function( event ) {
    var i, option = event.target;

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        _.removeClass( this.options[ i ], "dk-option-highlight" );
      }

      _.addClass( this.data.elem.lastChild, "dk-select-options-highlight" );
      _.addClass( option, "dk-option-highlight" );
    }
  },

  _keyHandler: function( event ) {
    var lastSelected,
      selected = this.selectedOptions,
      options = this.options,
      i = 1,
      keys = {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        up: 38,
        down: 40
      };

    switch ( event.keyCode ) {
    case keys.up:
      i = -1;
      // deliberate fallthrough
    case keys.down:
      event.preventDefault();
      lastSelected = selected[ selected.length - 1 ];
      i = options.indexOf( lastSelected ) + i;

      if ( i > options.length - 1 ) {
        i = options.length - 1;
      } else if ( i < 0 ) {
        i = 0;
      }

      if ( !this.data.select.options[ i ].disabled ) {
        this.reset( true );
        this.select( i );
        this._scrollTo( i );
      }
      break;
    case keys.space:
      if ( !this.isOpen ) {
        event.preventDefault();
        this.open();
        break;
      }
      // deliberate fallthrough
    case keys.tab:
    case keys.enter:
      for ( i = 0; i < options.length; i++ ) {
        if ( _.hasClass( options[ i ], "dk-option-highlight" ) ) {
          this.select( i );
        }
      }
      // deliberate fallthrough
    case keys.esc:
      if ( this.isOpen ) {
        event.preventDefault();
        this.close();
      }
      break;
    }
  },

  _searchOptions: function( event ) {
    var results,
      self = this,
      keyChar = String.fromCharCode( event.keyCode || event.which ),

      waitToReset = function() {
        if ( self.data.searchTimeout ) {
          clearTimeout( self.data.searchTimeout );
        }

        self.data.searchTimeout = setTimeout(function() {
          self.data.searchString = "";
        }, 1000 );
      };

    if ( this.data.searchString === undefined ) {
      this.data.searchString = "";
    }

    waitToReset();

    this.data.searchString += keyChar;
    results = this.search( this.data.searchString, this.data.settings.search );

    if ( results.length ) {
      if ( !_.hasClass( results[0], "dk-option-disabled" ) ) {
        this.selectOne( results[0] );
      }
    }
  },

  _scrollTo: function( option ) {
    var optPos, optTop, optBottom,
      dkOpts = this.data.elem.lastChild;

    if ( !this.isOpen && !this.multiple ) {
      return false;
    }

    if ( typeof option === "number" ) {
      option = this.item( option );
    }

    optPos = _.position( option, dkOpts ).top;
    optTop = optPos - dkOpts.scrollTop;
    optBottom = optTop + option.offsetHeight;

    if ( optBottom > dkOpts.offsetHeight ) {
      optPos += option.offsetHeight;
      dkOpts.scrollTop = optPos - dkOpts.offsetHeight;
    } else if ( optTop < 0 ) {
      dkOpts.scrollTop = optPos;
    }
  }
};

// Static Methods

/**
 * Builds the Dropkick element from a select element
 * @param  {Node} sel The HTMLSelectElement
 * @return {Object}   An object containing the new DK element and it's options
 */
Dropkick.build = function( sel, idpre ) {
  var optList, i,
    options = [],

    ret = {
      elem: null,
      options: [],
      selected: []
    },

    addOption = function ( node ) {
      var option, optgroup, optgroupList, i,
        children = [];

      switch ( node.nodeName ) {
      case "OPTION":
        option = _.create( "li", {
          "class": "dk-option",
          "data-value": node.value,
          "innerHTML": node.text,
          "role": "option",
          "aria-selected": "false",
          "id": idpre + "-" + ( node.id || node.value.replace( " ", "-" ) )
        });

        _.addClass( option, node.className );

        if ( node.disabled ) {
          _.addClass( option, "dk-option-disabled" );
          option.setAttribute( "aria-disabled", "true" );
        }

        if ( node.selected ) {
          _.addClass( option, "dk-option-selected" );
          option.setAttribute( "aria-selected", "true" );
          ret.selected.push( option );
        }

        ret.options.push( this.appendChild( option ) );
        break;
      case "OPTGROUP":
        optgroup = _.create( "li", { "class": "dk-optgroup" });

        if ( node.label ) {
          optgroup.appendChild( _.create( "div", {
            "class": "dk-optgroup-label",
            "innerHTML": node.label
          }));
        }

        optgroupList = _.create( "ul", {
          "class": "dk-optgroup-options",
        });

        for ( i = node.children.length; i--; children.unshift( node.children[ i ] ) );
        children.forEach( addOption, optgroupList );

        this.appendChild( optgroup ).appendChild( optgroupList );
        break;
      }
    };

  ret.elem = _.create( "div", {
    "class": "dk-select" + ( sel.multiple ? "-multi" : "" )
  });

  optList = _.create( "ul", {
    "class": "dk-select-options",
    "id": idpre + "-listbox",
    "role": "listbox"
  });

  sel.disabled && _.addClass( ret.elem, "dk-select-disabled" );
  ret.elem.id = idpre + ( sel.id ? "-" + sel.id : "" );
  _.addClass( ret.elem, sel.className );

  if ( !sel.multiple ) {
    ret.elem.appendChild( _.create( "div", {
      "class": "dk-selected",
      "tabindex": sel.tabindex || 0,
      "innerHTML": sel.options[ sel.selectedIndex ].text,
      "id": idpre + "-combobox",
      "aria-live": "assertive",
      "aria-owns": optList.id,
      "role": "combobox"
    }));
    optList.setAttribute( "aria-expanded", "false" );
  } else {
    ret.elem.setAttribute( "tabindex", sel.getAttribute( "tabindex" ) || "0" );
    optList.setAttribute( "aria-multiselectable", "true" );
  }

  for ( i = sel.children.length; i--; options.unshift( sel.children[ i ] ) );
  options.forEach( addOption, ret.elem.appendChild( optList ) );

  return ret;
};

/**
 * Focus DK Element when corresponding label is clicked; close all other DK's
 */
Dropkick.onDocClick = function( event ) {
  var t, tId, i;

  if ( t = document.getElementById( event.target.htmlFor ) ) {
    if ( ( tId = t.getAttribute( "data-dkcacheid" ) ) !== null ) {
      dkCache[ tId ].data.elem.focus();
    }
  }

  for ( i in dkCache ) {
    if ( !_.closest( event.target, dkCache[ i ].data.elem ) ) {
      dkCache[ i ].disabled || dkCache[ i ].close();
    }
  }
};


/**
 * Without this part taken from Dropkick v1, we have issues with scrolling element list in live editor in fancybox in chrome (but not in Firefox).
 */
// Prevents window scroll when scrolling  through dk_options, simulating native behaviour
var wheelSupport =  'onwheel' in window ? 'wheel' : // Modern browsers support "wheel"
  'onmousewheel' in document ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
  "MouseScrollEvent" in window ? 'DOMMouseScroll MozMousePixelScroll' : // legacy non-standard event for older Firefox
  false // lacks support
;
wheelSupport && $(document).on(wheelSupport, '.dk_options_inner', function(event) {
  var delta = event.originalEvent.wheelDelta || -event.originalEvent.deltaY || -event.originalEvent.detail; // Gets scroll ammount
  if (msie) { this.scrollTop -= Math.round(delta/10); return false; } // Normalize IE behaviour
  return (delta > 0 && this.scrollTop <= 0 ) || (delta < 0 && this.scrollTop >= this.scrollHeight - this.offsetHeight ) ? false : true; // Finally cancels page scroll when nedded
});

// Expose Dropkick Globally
window.Dropkick = Dropkick;

})( opjq, window, document );


opjq.fn.dropkick = function () {
  var args = Array.prototype.slice.call( arguments );
  return opjq( this ).each(function() {
    if ( !args[0] || typeof args[0] === 'object' ) {
      new Dropkick( this, args[0] || {} );
    } else if ( typeof args[0] === 'string' ) {
      Dropkick.prototype[ args[0] ].apply( new Dropkick( this ), args.slice( 1 ) );
    }
  });
};;
/*!
 *  Sharrre.com - Make your sharing widget!
 *  Version: beta 1.3.4
 *  Author: Julien Hany
 *  License: MIT http://en.wikipedia.org/wiki/MIT_License or GPLv2 http://en.wikipedia.org/wiki/GNU_General_Public_License
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}(';(6($,g,h,i){l j=\'1Y\',23={3i:\'1Y\',L:{O:C,E:C,z:C,I:C,p:C,K:C,N:C,B:C},2a:0,18:\'\',12:\'\',3:h.3h.1a,x:h.12,1p:\'1Y.3d\',y:{},1q:0,1w:w,3c:w,3b:w,2o:C,1X:6(){},38:6(){},1P:6(){},26:6(){},8:{O:{3:\'\',15:C,1j:\'37\',13:\'35-4Y\',2p:\'\'},E:{3:\'\',15:C,R:\'1L\',11:\'4V\',H:\'\',1A:\'C\',2c:\'C\',2d:\'\',1B:\'\',13:\'4R\'},z:{3:\'\',15:C,y:\'33\',2m:\'\',16:\'\',1I:\'\',13:\'35\'},I:{3:\'\',15:C,Q:\'4K\'},p:{3:\'\',15:C,1j:\'37\'},K:{3:\'\',15:C,11:\'1\'},N:{3:\'\',15:C,22:\'\'},B:{3:\'\',1s:\'\',1C:\'\',11:\'33\'}}},1n={O:"",E:"1D://4J.E.o/4x?q=4u%2X,%4j,%4i,%4h,%4f,%4e,46,%45,%44%42%41%40%2X=%27{3}%27&1y=?",z:"S://3W.3P.z.o/1/3D/y.2G?3={3}&1y=?",I:"S://3l.I.o/2.0/5a.59?54={3}&Q=1c&1y=?",p:\'S://52.p.o/4Q/2G/4B/m?3={3}&1y=?\',K:"",N:"S://1o.N.o/4z/y/L?4r=4o&3={3}&1y=?",B:""},2A={O:6(b){l c=b.4.8.O;$(b.r).X(\'.8\').Z(\'<n G="U 4d"><n G="g-25" m-1j="\'+c.1j+\'" m-1a="\'+(c.3!==\'\'?c.3:b.4.3)+\'" m-2p="\'+c.2p+\'"></n></n>\');g.3Z={13:b.4.8.O.13};l d=0;9(A 2x===\'F\'&&d==0){d=1;(6(){l a=h.1g(\'P\');a.Q=\'x/1c\';a.1r=w;a.17=\'//3w.2w.o/Y/25.Y\';l s=h.1d(\'P\')[0];s.1e.1f(a,s)})()}J{2x.25.3X()}},E:6(c){l e=c.4.8.E;$(c.r).X(\'.8\').Z(\'<n G="U E"><n 2T="1V-47"></n><n G="1V-1L" m-1a="\'+(e.3!==\'\'?e.3:c.4.3)+\'" m-1A="\'+e.1A+\'" m-11="\'+e.11+\'" m-H="\'+e.H+\'" m-3u-2c="\'+e.2c+\'" m-R="\'+e.R+\'" m-2d="\'+e.2d+\'" m-1B="\'+e.1B+\'" m-16="\'+e.16+\'"></n></n>\');l f=0;9(A 1i===\'F\'&&f==0){f=1;(6(d,s,a){l b,2s=d.1d(s)[0];9(d.3x(a)){1v}b=d.1g(s);b.2T=a;b.17=\'//4c.E.4n/\'+e.13+\'/4t.Y#4C=1\';2s.1e.1f(b,2s)}(h,\'P\',\'E-5g\'))}J{1i.3n.3p()}},z:6(b){l c=b.4.8.z;$(b.r).X(\'.8\').Z(\'<n G="U z"><a 1a="1D://z.o/L" G="z-L-U" m-3="\'+(c.3!==\'\'?c.3:b.4.3)+\'" m-y="\'+c.y+\'" m-x="\'+b.4.x+\'" m-16="\'+c.16+\'" m-2m="\'+c.2m+\'" m-1I="\'+c.1I+\'" m-13="\'+c.13+\'">3q</a></n>\');l d=0;9(A 2j===\'F\'&&d==0){d=1;(6(){l a=h.1g(\'P\');a.Q=\'x/1c\';a.1r=w;a.17=\'//1M.z.o/1N.Y\';l s=h.1d(\'P\')[0];s.1e.1f(a,s)})()}J{$.3C({3:\'//1M.z.o/1N.Y\',3E:\'P\',3F:w})}},I:6(a){l b=a.4.8.I;$(a.r).X(\'.8\').Z(\'<n G="U I"><a G="3H \'+b.Q+\'" 3L="3U 3V" 1a="S://I.o/2y?3=\'+V((b.3!==\'\'?b.3:a.4.3))+\'"></a></n>\');l c=0;9(A 43===\'F\'&&c==0){c=1;(6(){l s=h.1g(\'2z\'),24=h.1d(\'2z\')[0];s.Q=\'x/1c\';s.1r=w;s.17=\'//1N.I.o/8.Y\';24.1e.1f(s,24)})()}},p:6(a){9(a.4.8.p.1j==\'4g\'){l b=\'H:2r;\',2e=\'D:2B;H:2r;1B-1j:4y;1t-D:2B;\',2l=\'D:2C;1t-D:2C;2k-50:1H;\'}J{l b=\'H:53;\',2e=\'2g:58;2f:0 1H;D:1u;H:5c;1t-D:1u;\',2l=\'2g:5d;D:1u;1t-D:1u;\'}l c=a.1w(a.4.y.p);9(A c==="F"){c=0}$(a.r).X(\'.8\').Z(\'<n G="U p"><n 1T="\'+b+\'1B:5i 5j,5k,5l-5n;5t:3k;1S:#3m;2D:3o-2E;2g:2F;D:1u;1t-D:3r;2k:0;2f:0;x-3s:0;3t-2b:3v;">\'+\'<n 1T="\'+2e+\'2H-1S:#2I;2k-3y:3z;3A:3B;x-2b:2J;1O:2K 2L #3G;1O-2M:1H;">\'+c+\'</n>\'+\'<n 1T="\'+2l+\'2D:2E;2f:0;x-2b:2J;x-3I:2F;H:2r;2H-1S:#3J;1O:2K 2L #3K;1O-2M:1H;1S:#2I;">\'+\'<2N 17="S://1o.p.o/3M/2N/p.3N.3O" D="10" H="10" 3Q="3R" /> 3S</n></n></n>\');$(a.r).X(\'.p\').3T(\'1P\',6(){a.2O(\'p\')})},K:6(b){l c=b.4.8.K;$(b.r).X(\'.8\').Z(\'<n G="U K"><2P:28 11="\'+c.11+\'" 3h="\'+(c.3!==\'\'?c.3:b.4.3)+\'"></2P:28></n>\');l d=0;9(A 1E===\'F\'&&d==0){d=1;(6(){l a=h.1g(\'P\');a.Q=\'x/1c\';a.1r=w;a.17=\'//1M.K.o/1/1N.Y\';l s=h.1d(\'P\')[0];s.1e.1f(a,s)})();s=g.3Y(6(){9(A 1E!==\'F\'){1E.2Q();21(s)}},20)}J{1E.2Q()}},N:6(b){l c=b.4.8.N;$(b.r).X(\'.8\').Z(\'<n G="U N"><P Q="1Z/L" m-3="\'+(c.3!==\'\'?c.3:b.4.3)+\'" m-22="\'+c.22+\'"></P></n>\');l d=0;9(A g.2R===\'F\'&&d==0){d=1;(6(){l a=h.1g(\'P\');a.Q=\'x/1c\';a.1r=w;a.17=\'//1M.N.o/1Z.Y\';l s=h.1d(\'P\')[0];s.1e.1f(a,s)})()}J{g.2R.1W()}},B:6(b){l c=b.4.8.B;$(b.r).X(\'.8\').Z(\'<n G="U B"><a 1a="S://B.o/1K/2u/U/?3=\'+(c.3!==\'\'?c.3:b.4.3)+\'&1s=\'+c.1s+\'&1C=\'+c.1C+\'" G="1K-3j-U" y-11="\'+c.11+\'">48 49</a></n>\');(6(){l a=h.1g(\'P\');a.Q=\'x/1c\';a.1r=w;a.17=\'//4a.B.o/Y/4b.Y\';l s=h.1d(\'P\')[0];s.1e.1f(a,s)})()}},2S={O:6(){},E:6(){1V=g.2v(6(){9(A 1i!==\'F\'){1i.2t.2q(\'2U.2u\',6(a){1m.1l([\'1k\',\'E\',\'1L\',a])});1i.2t.2q(\'2U.4k\',6(a){1m.1l([\'1k\',\'E\',\'4l\',a])});1i.2t.2q(\'4m.1A\',6(a){1m.1l([\'1k\',\'E\',\'1A\',a])});21(1V)}},2V)},z:6(){2W=g.2v(6(){9(A 2j!==\'F\'){2j.4p.4q(\'1J\',6(a){9(a){1m.1l([\'1k\',\'z\',\'1J\'])}});21(2W)}},2V)},I:6(){},p:6(){},K:6(){},N:6(){6 4s(){1m.1l([\'1k\',\'N\',\'L\'])}},B:6(){}},2Y={O:6(a){g.19("1D://4v.2w.o/L?4w="+a.8.O.13+"&3="+V((a.8.O.3!==\'\'?a.8.O.3:a.3)),"","1b=0, 1G=0, H=2Z, D=20")},E:6(a){g.19("S://1o.E.o/30/30.3d?u="+V((a.8.E.3!==\'\'?a.8.E.3:a.3))+"&t="+a.x+"","","1b=0, 1G=0, H=2Z, D=20")},z:6(a){g.19("1D://z.o/4A/1J?x="+V(a.x)+"&3="+V((a.8.z.3!==\'\'?a.8.z.3:a.3))+(a.8.z.16!==\'\'?\'&16=\'+a.8.z.16:\'\'),"","1b=0, 1G=0, H=31, D=32")},I:6(a){g.19("S://I.o/4D/4E/2y?3="+V((a.8.I.3!==\'\'?a.8.I.3:a.3))+"&12="+a.x+"&1I=w&1T=w","","1b=0, 1G=0, H=31, D=32")},p:6(a){g.19(\'S://1o.p.o/4F?v=5&4G&4H=4I&3=\'+V((a.8.p.3!==\'\'?a.8.p.3:a.3))+\'&12=\'+a.x,\'p\',\'1b=1F,H=1h,D=1h\')},K:6(a){g.19(\'S://1o.K.o/28/?3=\'+V((a.8.p.3!==\'\'?a.8.p.3:a.3)),\'K\',\'1b=1F,H=1h,D=1h\')},N:6(a){g.19(\'1D://1o.N.o/4L/L?3=\'+V((a.8.p.3!==\'\'?a.8.p.3:a.3))+\'&4M=&4N=w\',\'N\',\'1b=1F,H=1h,D=1h\')},B:6(a){g.19(\'S://B.o/1K/2u/U/?3=\'+V((a.8.B.3!==\'\'?a.8.B.3:a.3))+\'&1s=\'+V(a.8.B.1s)+\'&1C=\'+a.8.B.1C,\'B\',\'1b=1F,H=4O,D=4P\')}};6 T(a,b){7.r=a;7.4=$.4S(w,{},23,b);7.4.L=b.L;7.4T=23;7.4U=j;7.1W()};T.W.1W=6(){l c=7;9(7.4.1p!==\'\'){1n.O=7.4.1p+\'?3={3}&Q=O\';1n.K=7.4.1p+\'?3={3}&Q=K\';1n.B=7.4.1p+\'?3={3}&Q=B\'}$(7.r).4W(7.4.3i);9(A $(7.r).m(\'12\')!==\'F\'){7.4.12=$(7.r).4X(\'m-12\')}9(A $(7.r).m(\'3\')!==\'F\'){7.4.3=$(7.r).m(\'3\')}9(A $(7.r).m(\'x\')!==\'F\'){7.4.x=$(7.r).m(\'x\')}$.1z(7.4.L,6(a,b){9(b===w){c.4.2a++}});9(c.4.3b===w){$.1z(7.4.L,6(a,b){9(b===w){4Z{c.34(a)}51(e){}}})}J 9(c.4.18!==\'\'){7.4.26(7,7.4)}J{7.2n()}$(7.r).1X(6(){9($(7).X(\'.8\').36===0&&c.4.3c===w){c.2n()}c.4.1X(c,c.4)},6(){c.4.38(c,c.4)});$(7.r).1P(6(){c.4.1P(c,c.4);1v C})};T.W.2n=6(){l c=7;$(7.r).Z(\'<n G="8"></n>\');$.1z(c.4.L,6(a,b){9(b==w){2A[a](c);9(c.4.2o===w){2S[a]()}}})};T.W.34=6(c){l d=7,y=0,3=1n[c].1x(\'{3}\',V(7.4.3));9(7.4.8[c].15===w&&7.4.8[c].3!==\'\'){3=1n[c].1x(\'{3}\',7.4.8[c].3)}9(3!=\'\'&&d.4.1p!==\'\'){$.55(3,6(a){9(A a.y!=="F"){l b=a.y+\'\';b=b.1x(\'\\56\\57\',\'\');y+=1Q(b,10)}J 9(a.m&&a.m.36>0&&A a.m[0].39!=="F"){y+=1Q(a.m[0].39,10)}J 9(A a.3a!=="F"){y+=1Q(a.3a,10)}J 9(A a[0]!=="F"){y+=1Q(a[0].5b,10)}J 9(A a[0]!=="F"){}d.4.y[c]=y;d.4.1q+=y;d.2i();d.1R()}).5e(6(){d.4.y[c]=0;d.1R()})}J{d.2i();d.4.y[c]=0;d.1R()}};T.W.1R=6(){l a=0;5f(e 1Z 7.4.y){a++}9(a===7.4.2a){7.4.26(7,7.4)}};T.W.2i=6(){l a=7.4.1q,18=7.4.18;9(7.4.1w===w){a=7.1w(a)}9(18!==\'\'){18=18.1x(\'{1q}\',a);$(7.r).1U(18)}J{$(7.r).1U(\'<n G="5h"><a G="y" 1a="#">\'+a+\'</a>\'+(7.4.12!==\'\'?\'<a G="L" 1a="#">\'+7.4.12+\'</a>\':\'\')+\'</n>\')}};T.W.1w=6(a){9(a>=3e){a=(a/3e).3f(2)+"M"}J 9(a>=3g){a=(a/3g).3f(1)+"k"}1v a};T.W.2O=6(a){2Y[a](7.4);9(7.4.2o===w){l b={O:{14:\'5m\',R:\'+1\'},E:{14:\'E\',R:\'1L\'},z:{14:\'z\',R:\'1J\'},I:{14:\'I\',R:\'29\'},p:{14:\'p\',R:\'29\'},K:{14:\'K\',R:\'29\'},N:{14:\'N\',R:\'L\'},B:{14:\'B\',R:\'1K\'}};1m.1l([\'1k\',b[a].14,b[a].R])}};T.W.5o=6(){l a=$(7.r).1U();$(7.r).1U(a.1x(7.4.1q,7.4.1q+1))};T.W.5p=6(a,b){9(a!==\'\'){7.4.3=a}9(b!==\'\'){7.4.x=b}};$.5q[j]=6(b){l c=5r;9(b===i||A b===\'5s\'){1v 7.1z(6(){9(!$.m(7,\'2h\'+j)){$.m(7,\'2h\'+j,5u T(7,b))}})}J 9(A b===\'5v\'&&b[0]!==\'5w\'&&b!==\'1W\'){1v 7.1z(6(){l a=$.m(7,\'2h\'+j);9(a 5x T&&A a[b]===\'6\'){a[b].5y(a,5z.W.5A.5B(c,1))}})}}})(5C,5D,5E);',62,351,'|||url|options||function|this|buttons|if||||||||||||var|data|div|com|delicious||element|||||true|text|count|twitter|typeof|pinterest|false|height|facebook|undefined|class|width|digg|else|stumbleupon|share||linkedin|googlePlus|script|type|action|http|Plugin|button|encodeURIComponent|prototype|find|js|append||layout|title|lang|site|urlCount|via|src|template|open|href|toolbar|javascript|getElementsByTagName|parentNode|insertBefore|createElement|550|FB|size|_trackSocial|push|_gaq|urlJson|www|urlCurl|total|async|media|line|20px|return|shorterTotal|replace|callback|each|send|font|description|https|STMBLPN|no|status|3px|related|tweet|pin|like|platform|widgets|border|click|parseInt|rendererPerso|color|style|html|fb|init|hover|sharrre|in|500|clearInterval|counter|defaults|s1|plusone|render||badge|add|shareTotal|align|faces|colorscheme|cssCount|padding|float|plugin_|renderer|twttr|margin|cssShare|hashtags|loadButtons|enableTracking|annotation|subscribe|50px|fjs|Event|create|setInterval|google|gapi|submit|SCRIPT|loadButton|35px|18px|display|block|none|json|background|fff|center|1px|solid|radius|img|openPopup|su|processWidgets|IN|tracking|id|edge|1000|tw|20url|popup|900|sharer|650|360|horizontal|getSocialJson|en|length|medium|hide|total_count|shares|enableCounter|enableHover|php|1e6|toFixed|1e3|location|className|it|pointer|services|666666|XFBML|inline|parse|Tweet|normal|indent|vertical|show|baseline|apis|getElementById|bottom|5px|overflow|hidden|ajax|urls|dataType|cache|ccc|DiggThisButton|decoration|7EACEE|40679C|rel|static|small|gif|api|alt|Delicious|Add|on|nofollow|external|cdn|go|setTimeout|___gcfg|20WHERE|20link_stat|20FROM|__DBW|20click_count|20comments_fbid|commentsbox_count|root|Pin|It|assets|pinit|connect|googleplus|20total_count|20comment_count|tall|20like_count|20share_count|20normalized_url|remove|unlike|message|net|jsonp|events|bind|format|LinkedInShare|all|SELECT|plus|hl|fql|15px|countserv|intent|urlinfo|xfbml|tools|diggthis|save|noui|jump|close|graph|DiggCompact|cws|token|isFramed|700|300|v2|en_US|extend|_defaults|_name|button_count|addClass|attr|US|try|top|catch|feeds|93px|links|getJSON|u00c2|u00a0|right|getInfo|story|total_posts|26px|left|error|for|jssdk|box|12px|Arial|Helvetica|sans|Google|serif|simulateClick|update|fn|arguments|object|cursor|new|string|_|instanceof|apply|Array|slice|call|opjq|window|document'.split('|'),0,{}))
;
/*!
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
!function(a){a("body").on("click","a[data-reveal-id]",function(b){b.preventDefault();var c=a(this).attr("data-reveal-id");a("#"+c).reveal(a(this).data())}),a.fn.reveal=function(b){var c={animation:"fadeAndPop",animationspeed:300,closeonbackgroundclick:!0,dismissmodalclass:"close-reveal-modal"},b=a.extend({},c,b);return this.each(function(){function c(){h=!1}function d(){h=!0}var e=a(this),f=parseInt(e.css("top")),g=e.height()+f,h=!1,i=a(".reveal-modal-bg");0==i.length&&(i=a('<div class="reveal-modal-bg" />').insertAfter(e)),e.bind("reveal:open",function(){i.unbind("click.modalEvent"),a("."+b.dismissmodalclass).unbind("click.modalEvent"),h||(d(),"fadeAndPop"==b.animation&&(e.css({top:a(document).scrollTop()-g,opacity:0,visibility:"visible"}),i.fadeIn(b.animationspeed/2),e.delay(b.animationspeed/2).animate({top:a(document).scrollTop()+f+"px",opacity:1},b.animationspeed,c())),"fade"==b.animation&&(e.css({opacity:0,visibility:"visible",top:a(document).scrollTop()+f}),i.fadeIn(b.animationspeed/2),e.delay(b.animationspeed/2).animate({opacity:1},b.animationspeed,c())),"none"==b.animation&&(e.css({visibility:"visible",top:a(document).scrollTop()+f}),i.css({display:"block"}),c())),e.unbind("reveal:open")}),e.bind("reveal:close",function(){h||(d(),"fadeAndPop"==b.animation&&(i.delay(b.animationspeed).fadeOut(b.animationspeed),e.animate({top:a(document).scrollTop()-g+"px",opacity:0},b.animationspeed/2,function(){e.css({top:f,opacity:1,visibility:"hidden"}),c()})),"fade"==b.animation&&(i.delay(b.animationspeed).fadeOut(b.animationspeed),e.animate({opacity:0},b.animationspeed,function(){e.css({opacity:1,visibility:"hidden",top:f}),c()})),"none"==b.animation&&(e.css({visibility:"hidden",top:f}),i.css({display:"none"}))),e.unbind("reveal:close")}),e.trigger("reveal:open");a("."+b.dismissmodalclass).bind("click.modalEvent",function(){e.trigger("reveal:close")});b.closeonbackgroundclick&&(i.css({cursor:"pointer"}),i.bind("click.modalEvent",function(){e.trigger("reveal:close")})),a("body").keyup(function(a){27===a.which&&e.trigger("reveal:close")})})}}(opjq);;
/*! http://keith-wood.name/countdown.html
   Countdown for jQuery v1.6.2.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
   Please attribute the author if you use it. */
(function ($) {

	function Countdown() {
		this.regional = [];
		this.regional[''] = {
			labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
			labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
			compactLabels: ['y', 'm', 'w', 'd'],
			whichLabels: null,
			digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			timeSeparator: ':',
			isRTL: false
		};
		this._defaults = {
			until: null,
			since: null,
			timezone: null,
			serverSync: null,
			format: 'dHMS',
			layout: '',
			compact: false,
			significant: 0,
			description: '',
			expiryUrl: '',
			expiryText: '',
			alwaysExpire: false,
			onExpiry: null,
			onTick: null,
			tickInterval: 1
		};
		$.extend(this._defaults, this.regional['']);
		this._serverSyncs = [];

		function timerCallBack(a) {
			var b;
			if (a < 1e12) {
				if (typeof performance !== 'undefined' && performance.now) {
					b = performance.now() + performance.timing.navigationStart;
				} else {
					b = Date.now();
				}
			} else {
				b = a || new Date().getTime();
			}
			if (b - d >= 1000) {
				x._updateTargets();
				d = b
			}
			c(timerCallBack)
		}
		var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
		var d = 0;

		// We don't want an active countdown element in live editor,
		// because it causes too much repaints/reflows/requestanimationframes
		if (typeof op_live_editor === 'undefined' || !op_live_editor) {
			// return false;
			if (!c || $.noRequestAnimationFrame) {
				$.noRequestAnimationFrame = null;
				setInterval(function () {
					x._updateTargets()
				}, 980)
			} else {
				d = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || new Date().getTime();
				c(timerCallBack)
			}
		}
	}
	var Y = 0;
	var O = 1;
	var W = 2;
	var D = 3;
	var H = 4;
	var M = 5;
	var S = 6;
	$.extend(Countdown.prototype, {
		markerClassName: 'hasCountdown',
		propertyName: 'countdown',
		_rtlClass: 'countdown_rtl',
		_sectionClass: 'countdown_section',
		_amountClass: 'countdown_amount',
		_rowClass: 'countdown_row',
		_holdingClass: 'countdown_holding',
		_showClass: 'countdown_show',
		_descrClass: 'countdown_descr',
		_timerTargets: [],
		setDefaults: function (a) {
			this._resetExtraLabels(this._defaults, a);
			$.extend(this._defaults, a || {})
		},
		UTCDate: function (a, b, c, e, f, g, h, i) {
			if (typeof b == 'object' && b.constructor == Date) {
				i = b.getMilliseconds();
				h = b.getSeconds();
				g = b.getMinutes();
				f = b.getHours();
				e = b.getDate();
				c = b.getMonth();
				b = b.getFullYear()
			}
			var d = new Date();
			d.setUTCFullYear(b);
			d.setUTCDate(1);
			d.setUTCMonth(c || 0);
			d.setUTCDate(e || 1);
			d.setUTCHours(f || 0);
			d.setUTCMinutes((g || 0) - (Math.abs(a) < 30 ? a * 60 : a));
			d.setUTCSeconds(h || 0);
			d.setUTCMilliseconds(i || 0);
			return d
		},
		periodsToSeconds: function (a) {
			return a[0] * 31557600 + a[1] * 2629800 + a[2] * 604800 + a[3] * 86400 + a[4] * 3600 + a[5] * 60 + a[6]
		},
		_attachPlugin: function (a, b) {
			a = $(a);
			if (a.hasClass(this.markerClassName)) {
				return
			}
			var c = {
				options: $.extend({}, this._defaults),
				_periods: [0, 0, 0, 0, 0, 0, 0]
			};
			a.addClass(this.markerClassName).data(this.propertyName, c);
			this._optionPlugin(a, b)
		},
		_addTarget: function (a) {
			if (!this._hasTarget(a)) {
				this._timerTargets.push(a)
			}
		},
		_hasTarget: function (a) {
			return ($.inArray(a, this._timerTargets) > -1)
		},
		_removeTarget: function (b) {
			this._timerTargets = $.map(this._timerTargets, function (a) {
				return (a == b ? null : a)
			})
		},
		_updateTargets: function () {
			for (var i = this._timerTargets.length - 1; i >= 0; i--) {
				this._updateCountdown(this._timerTargets[i])
			}
		},
		_optionPlugin: function (a, b, c) {
			a = $(a);
			var d = a.data(this.propertyName);
			if (!b || (typeof b == 'string' && c == null)) {
				var e = b;
				b = (d || {}).options;
				return (b && e ? b[e] : b)
			}
			if (!a.hasClass(this.markerClassName)) {
				return
			}
			b = b || {};
			if (typeof b == 'string') {
				var e = b;
				b = {};
				b[e] = c
			}
			this._resetExtraLabels(d.options, b);
			var f = (d.options.timezone != b.timezone);
			$.extend(d.options, b);
			this._adjustSettings(a, d, b.until != null || b.since != null || f);
			var g = new Date();
			if ((d._since && d._since < g) || (d._until && d._until > g)) {
				this._addTarget(a[0])
			}
			this._updateCountdown(a, d)
		},
		_updateCountdown: function (a, b) {
			var c = $(a);
			b = b || c.data(this.propertyName);
			if (!b) {
				return
			}
			c.html(this._generateHTML(b)).toggleClass(this._rtlClass, b.options.isRTL);
			if ($.isFunction(b.options.onTick)) {
				var d = b._hold != 'lap' ? b._periods : this._calculatePeriods(b, b._show, b.options.significant, new Date());
				if (b.options.tickInterval == 1 || this.periodsToSeconds(d) % b.options.tickInterval == 0) {
					b.options.onTick.apply(a, [d])
				}
			}
			var e = b._hold != 'pause' && (b._since ? b._now.getTime() < b._since.getTime() : b._now.getTime() >= b._until.getTime());
			if (e && !b._expiring) {
				b._expiring = true;
				if (this._hasTarget(a) || b.options.alwaysExpire) {
					this._removeTarget(a);
					if ($.isFunction(b.options.onExpiry)) {
						b.options.onExpiry.apply(a, [])
					}
					if (b.options.expiryText) {
						var f = b.options.layout;
						b.options.layout = b.options.expiryText;
						this._updateCountdown(a, b);
						b.options.layout = f
					}
					if (b.options.expiryUrl) {
						window.location = b.options.expiryUrl
					}
				}
				b._expiring = false
			} else if (b._hold == 'pause') {
				this._removeTarget(a)
			}
			c.data(this.propertyName, b)
		},
		_resetExtraLabels: function (a, b) {
			var c = false;
			for (var n in b) {
				if (n != 'whichLabels' && n.match(/[Ll]abels/)) {
					c = true;
					break
				}
			}
			if (c) {
				for (var n in a) {
					if (n.match(/[Ll]abels[02-9]|compactLabels1/)) {
						a[n] = null
					}
				}
			}
		},
		_adjustSettings: function (a, b, c) {
			var d;
			var e = 0;
			var f = null;
			for (var i = 0; i < this._serverSyncs.length; i++) {
				if (this._serverSyncs[i][0] == b.options.serverSync) {
					f = this._serverSyncs[i][1];
					break
				}
			}
			if (f != null) {
				e = (b.options.serverSync ? f : 0);
				d = new Date()
			} else {
				var g = ($.isFunction(b.options.serverSync) ? b.options.serverSync.apply(a, []) : null);
				d = new Date();
				e = (g ? d.getTime() - g.getTime() : 0);
				this._serverSyncs.push([b.options.serverSync, e])
			}
			var h = b.options.timezone;
			h = (h == null ? -d.getTimezoneOffset() : h);
			if (c || (!c && b._until == null && b._since == null)) {
				b._since = b.options.since;
				if (b._since != null) {
					b._since = this.UTCDate(h, this._determineTime(b._since, null));
					if (b._since && e) {
						b._since.setMilliseconds(b._since.getMilliseconds() + e)
					}
				}
				b._until = this.UTCDate(h, this._determineTime(b.options.until, d));
				if (e) {
					b._until.setMilliseconds(b._until.getMilliseconds() + e)
				}
			}
			b._show = this._determineShow(b)
		},
		_destroyPlugin: function (a) {
			a = $(a);
			if (!a.hasClass(this.markerClassName)) {
				return
			}
			this._removeTarget(a[0]);
			a.removeClass(this.markerClassName).empty().removeData(this.propertyName)
		},
		_pausePlugin: function (a) {
			this._hold(a, 'pause')
		},
		_lapPlugin: function (a) {
			this._hold(a, 'lap')
		},
		_resumePlugin: function (a) {
			this._hold(a, null)
		},
		_hold: function (a, b) {
			var c = $.data(a, this.propertyName);
			if (c) {
				if (c._hold == 'pause' && !b) {
					c._periods = c._savePeriods;
					var d = (c._since ? '-' : '+');
					c[c._since ? '_since' : '_until'] = this._determineTime(d + c._periods[0] + 'y' + d + c._periods[1] + 'o' + d + c._periods[2] + 'w' + d + c._periods[3] + 'd' + d + c._periods[4] + 'h' + d + c._periods[5] + 'm' + d + c._periods[6] + 's');
					this._addTarget(a)
				}
				c._hold = b;
				c._savePeriods = (b == 'pause' ? c._periods : null);
				$.data(a, this.propertyName, c);
				this._updateCountdown(a, c)
			}
		},
		_getTimesPlugin: function (a) {
			var b = $.data(a, this.propertyName);
			return (!b ? null : (b._hold == 'pause' ? b._savePeriods : (!b._hold ? b._periods : this._calculatePeriods(b, b._show, b.options.significant, new Date()))))
		},
		_determineTime: function (k, l) {
			var m = function (a) {
				var b = new Date();
				b.setTime(b.getTime() + a * 1000);
				return b
			};
			var n = function (a) {
				a = a.toLowerCase();
				var b = new Date();
				var c = b.getFullYear();
				var d = b.getMonth();
				var e = b.getDate();
				var f = b.getHours();
				var g = b.getMinutes();
				var h = b.getSeconds();
				var i = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;
				var j = i.exec(a);
				while (j) {
					switch (j[2] || 's') {
					case 's':
						h += parseInt(j[1], 10);
						break;
					case 'm':
						g += parseInt(j[1], 10);
						break;
					case 'h':
						f += parseInt(j[1], 10);
						break;
					case 'd':
						e += parseInt(j[1], 10);
						break;
					case 'w':
						e += parseInt(j[1], 10) * 7;
						break;
					case 'o':
						d += parseInt(j[1], 10);
						e = Math.min(e, x._getDaysInMonth(c, d));
						break;
					case 'y':
						c += parseInt(j[1], 10);
						e = Math.min(e, x._getDaysInMonth(c, d));
						break
					}
					j = i.exec(a)
				}
				return new Date(c, d, e, f, g, h, 0)
			};
			var o = (k == null ? l : (typeof k == 'string' ? n(k) : (typeof k == 'number' ? m(k) : k)));
			if (o) o.setMilliseconds(0);
			return o
		},
		_getDaysInMonth: function (a, b) {
			return 32 - new Date(a, b, 32).getDate()
		},
		_normalLabels: function (a) {
			return a
		},
		_generateHTML: function (c) {
			var d = this;
			c._periods = (c._hold ? c._periods : this._calculatePeriods(c, c._show, c.options.significant, new Date()));
			var e = false;
			var f = 0;
			var g = c.options.significant;
			var h = $.extend({}, c._show);
			for (var i = Y; i <= S; i++) {
				e |= (c._show[i] == '?' && c._periods[i] > 0);
				h[i] = (c._show[i] == '?' && !e ? null : c._show[i]);
				f += (h[i] ? 1 : 0);
				g -= (c._periods[i] > 0 ? 1 : 0)
			}
			var j = [false, false, false, false, false, false, false];
			for (var i = S; i >= Y; i--) {
				if (c._show[i]) {
					if (c._periods[i]) {
						j[i] = true
					} else {
						j[i] = g > 0;
						g--
					}
				}
			}
			var k = (c.options.compact ? c.options.compactLabels : c.options.labels);
			var l = c.options.whichLabels || this._normalLabels;
			var m = function (a) {
				var b = c.options['compactLabels' + l(c._periods[a])];
				return (h[a] ? d._translateDigits(c, c._periods[a]) + (b ? b[a] : k[a]) + ' ' : '')
			};
			var n = function (a) {
				var b = c.options['labels' + l(c._periods[a])];
				if (a !== 6) {
					return ((!c.options.significant && h[a]) || (c.options.significant && j[a]) ? '<span class="' + x._sectionClass + '">' + '<span class="' + x._amountClass + '">' + d._translateDigits(c, c._periods[a]) + '</span><br/>' + (b ? b[a] : k[a]) + '</span>' : '')
				} else {
					return '<span class="' + x._sectionClass + '">' + '<span class="' + x._amountClass + '">' + d._translateDigits(c, c._periods[a]) + '</span><br/>' + (b ? b[a] : k[a]) + '</span>';
				}
			};
			return (c.options.layout ? this._buildLayout(c, h, c.options.layout, c.options.compact, c.options.significant, j) : ((c.options.compact ? '<span class="' + this._rowClass + ' ' + this._amountClass + (c._hold ? ' ' + this._holdingClass : '') + '">' + m(Y) + m(O) + m(W) + m(D) + (h[H] ? this._minDigits(c, c._periods[H], 2) : '') + (h[M] ? (h[H] ? c.options.timeSeparator : '') + this._minDigits(c, c._periods[M], 2) : '') + (h[S] ? (h[H] || h[M] ? c.options.timeSeparator : '') + this._minDigits(c, c._periods[S], 2) : '') : '<span class="' + this._rowClass + ' ' + this._showClass + (c.options.significant || f) + (c._hold ? ' ' + this._holdingClass : '') + '">' + n(Y) + n(O) + n(W) + n(D) + n(H) + n(M) + n(S)) + '</span>' + (c.options.description ? '<span class="' + this._rowClass + ' ' + this._descrClass + '">' + c.options.description + '</span>' : '')))
		},
		_buildLayout: function (c, d, e, f, g, h) {
			var j = c.options[f ? 'compactLabels' : 'labels'];
			var k = c.options.whichLabels || this._normalLabels;
			var l = function (a) {
				return (c.options[(f ? 'compactLabels' : 'labels') + k(c._periods[a])] || j)[a]
			};
			var m = function (a, b) {
				return c.options.digits[Math.floor(a / b) % 10]
			};
			var o = {
				desc: c.options.description,
				sep: c.options.timeSeparator,
				yl: l(Y),
				yn: this._minDigits(c, c._periods[Y], 1),
				ynn: this._minDigits(c, c._periods[Y], 2),
				ynnn: this._minDigits(c, c._periods[Y], 3),
				y1: m(c._periods[Y], 1),
				y10: m(c._periods[Y], 10),
				y100: m(c._periods[Y], 100),
				y1000: m(c._periods[Y], 1000),
				ol: l(O),
				on: this._minDigits(c, c._periods[O], 1),
				onn: this._minDigits(c, c._periods[O], 2),
				onnn: this._minDigits(c, c._periods[O], 3),
				o1: m(c._periods[O], 1),
				o10: m(c._periods[O], 10),
				o100: m(c._periods[O], 100),
				o1000: m(c._periods[O], 1000),
				wl: l(W),
				wn: this._minDigits(c, c._periods[W], 1),
				wnn: this._minDigits(c, c._periods[W], 2),
				wnnn: this._minDigits(c, c._periods[W], 3),
				w1: m(c._periods[W], 1),
				w10: m(c._periods[W], 10),
				w100: m(c._periods[W], 100),
				w1000: m(c._periods[W], 1000),
				dl: l(D),
				dn: this._minDigits(c, c._periods[D], 1),
				dnn: this._minDigits(c, c._periods[D], 2),
				dnnn: this._minDigits(c, c._periods[D], 3),
				d1: m(c._periods[D], 1),
				d10: m(c._periods[D], 10),
				d100: m(c._periods[D], 100),
				d1000: m(c._periods[D], 1000),
				hl: l(H),
				hn: this._minDigits(c, c._periods[H], 1),
				hnn: this._minDigits(c, c._periods[H], 2),
				hnnn: this._minDigits(c, c._periods[H], 3),
				h1: m(c._periods[H], 1),
				h10: m(c._periods[H], 10),
				h100: m(c._periods[H], 100),
				h1000: m(c._periods[H], 1000),
				ml: l(M),
				mn: this._minDigits(c, c._periods[M], 1),
				mnn: this._minDigits(c, c._periods[M], 2),
				mnnn: this._minDigits(c, c._periods[M], 3),
				m1: m(c._periods[M], 1),
				m10: m(c._periods[M], 10),
				m100: m(c._periods[M], 100),
				m1000: m(c._periods[M], 1000),
				sl: l(S),
				sn: this._minDigits(c, c._periods[S], 1),
				snn: this._minDigits(c, c._periods[S], 2),
				snnn: this._minDigits(c, c._periods[S], 3),
				s1: m(c._periods[S], 1),
				s10: m(c._periods[S], 10),
				s100: m(c._periods[S], 100),
				s1000: m(c._periods[S], 1000)
			};
			var p = e;
			for (var i = Y; i <= S; i++) {
				var q = 'yowdhms'.charAt(i);
				var r = new RegExp('\\{' + q + '<\\}(.*)\\{' + q + '>\\}', 'g');
				p = p.replace(r, ((!g && d[i]) || (g && h[i]) ? '$1' : ''))
			}
			$.each(o, function (n, v) {
				var a = new RegExp('\\{' + n + '\\}', 'g');
				p = p.replace(a, v)
			});
			return p
		},
		_minDigits: function (a, b, c) {
			b = '' + b;
			if (b.length >= c) {
				return this._translateDigits(a, b)
			}
			b = '0000000000' + b;
			return this._translateDigits(a, b.substr(b.length - c))
		},
		_translateDigits: function (b, c) {
			return ('' + c).replace(/[0-9]/g, function (a) {
				return b.options.digits[a]
			})
		},
		_determineShow: function (a) {
			var b = a.options.format;
			var c = [];
			c[Y] = (b.match('y') ? '?' : (b.match('Y') ? '!' : null));
			c[O] = (b.match('o') ? '?' : (b.match('O') ? '!' : null));
			c[W] = (b.match('w') ? '?' : (b.match('W') ? '!' : null));
			c[D] = (b.match('d') ? '?' : (b.match('D') ? '!' : null));
			c[H] = (b.match('h') ? '?' : (b.match('H') ? '!' : null));
			c[M] = (b.match('m') ? '?' : (b.match('M') ? '!' : null));
			c[S] = (b.match('s') ? '?' : (b.match('S') ? '!' : null));
			return c
		},
		_calculatePeriods: function (c, d, e, f) {
			c._now = f;
			c._now.setMilliseconds(0);
			var g = new Date(c._now.getTime());
			if (c._since) {
				if (f.getTime() < c._since.getTime()) {
					c._now = f = g
				} else {
					f = c._since
				}
			} else {
				g.setTime(c._until.getTime());
				if (f.getTime() > c._until.getTime()) {
					c._now = f = g
				}
			}
			var h = [0, 0, 0, 0, 0, 0, 0];
			if (d[Y] || d[O]) {
				var i = x._getDaysInMonth(f.getFullYear(), f.getMonth());
				var j = x._getDaysInMonth(g.getFullYear(), g.getMonth());
				var k = (g.getDate() == f.getDate() || (g.getDate() >= Math.min(i, j) && f.getDate() >= Math.min(i, j)));
				var l = function (a) {
					return (a.getHours() * 60 + a.getMinutes()) * 60 + a.getSeconds()
				};
				var m = Math.max(0, (g.getFullYear() - f.getFullYear()) * 12 + g.getMonth() - f.getMonth() + ((g.getDate() < f.getDate() && !k) || (k && l(g) < l(f)) ? -1 : 0));
				h[Y] = (d[Y] ? Math.floor(m / 12) : 0);
				h[O] = (d[O] ? m - h[Y] * 12 : 0);
				f = new Date(f.getTime());
				var n = (f.getDate() == i);
				var o = x._getDaysInMonth(f.getFullYear() + h[Y], f.getMonth() + h[O]);
				if (f.getDate() > o) {
					f.setDate(o)
				}
				f.setFullYear(f.getFullYear() + h[Y]);
				f.setMonth(f.getMonth() + h[O]);
				if (n) {
					f.setDate(o)
				}
			}
			var p = Math.floor((g.getTime() - f.getTime()) / 1000);
			var q = function (a, b) {
				h[a] = (d[a] ? Math.floor(p / b) : 0);
				p -= h[a] * b
			};
			q(W, 604800);
			q(D, 86400);
			q(H, 3600);
			q(M, 60);
			q(S, 1);
			if (p > 0 && !c._since) {
				var r = [1, 12, 4.3482, 7, 24, 60, 60];
				var s = S;
				var t = 1;
				for (var u = S; u >= Y; u--) {
					if (d[u]) {
						if (h[s] >= t) {
							h[s] = 0;
							p = 1
						}
						if (p > 0) {
							h[u]++;
							p = 0;
							s = u;
							t = 1
						}
					}
					t *= r[u]
				}
			}
			if (e) {
				for (var u = Y; u <= S; u++) {
					if (e && h[u]) {
						e--
					} else if (!e) {
						h[u] = 0
					}
				}
			}
			return h
		}
	});
	var w = ['getTimes'];

	function isNotChained(a, b) {
		if (a == 'option' && (b.length == 0 || (b.length == 1 && typeof b[0] == 'string'))) {
			return true
		}
		return $.inArray(a, w) > -1
	}
	$.fn.countdown = function (a) {
		var b = Array.prototype.slice.call(arguments, 1);
		if (isNotChained(a, b)) {
			return x['_' + a + 'Plugin'].apply(x, [this[0]].concat(b))
		}
		return this.each(function () {
			if (typeof a == 'string') {
				if (!x['_' + a + 'Plugin']) {
					throw 'Unknown command: ' + a;
				}
				x['_' + a + 'Plugin'].apply(x, [this].concat(b))
			} else {
				x._attachPlugin(this, a || {})
			}
		})
	};

	var x = $.countdown = new Countdown()
}(opjq));;
/*
 *
 *  Note: The only code that should go in this file is code that can and should be
 *  executed globally. This means not only the user facing pages but the admin as well
 *
 */

(function($){
    //Init obejcts
    var Assets = {},
        Sharrre = {};

    //Init Assets object
    Assets.init = {}; //Used to hold all assets init functions

    //Init Sharrre constants
    Sharrre.urlCurl = OptimizePress.paths.js + 'jquery/sharrre.inc.php';
    Sharrre.services = [
        'twitter',
        'facebook',
        'googlePlus',
        'linkedin'
    ];
    Sharrre.options = {
        enableHover: false,
        enableTracking: true,
        urlCurl: Sharrre.urlCurl,
        buttons: {
            twitter: {},
            facebook: {},
            googlePlus: {}
        }
    };

    //Init document ready
    $(document).ready(function(){
        //Init general
        init_sharrre();
        init_selectnav();
        init_dropkick();
        init_tooltipster();
        init_reveal();
        addTextAttributes();

        //Init assets
        if ('function' === typeof Assets.init.countdown){
            Assets.init.countdown();
        }
        if ('function' === typeof Assets.init.countdown_cookie){
            Assets.init.countdown_cookie();
        }
    });

    function addTextAttributes() {
        $('input').each(function(){
            if (!$(this).attr('type')) {
                $(this).attr('type', 'text');
            }
        });
    }

    //Init the Sharrre widget functionality
    function init_sharrre(){
        $.each(Sharrre.services, function(index, val){
            var localOptions = Sharrre.options;

            //Set the click functionality
            localOptions.click = function(api, options){
                api.simulateClick();
                api.openPopup(val);
            }

            //Init share widgets
            $('.social-sharing .' + val).each(function(){
                //Get the language for this element
                var lang = (typeof($(this).data('lang'))=='undefined' ? 'en_US' : $(this).data('lang'));
                var via = (typeof($(this).data('via'))=='undefined' ? '' : $(this).data('via'));
                var title = (typeof($(this).data('title'))=='undefined' ? '' : $(this).data('title'));
                var url = (typeof($(this).data('url'))=='undefined' ? '' : $(this).data('url'));

                //Enable/disable counter
                localOptions.enableCounter = $(this).parent().data('counter');

                //Set social variables
                switch(val){
                    case 'twitter':
                        localOptions.share = { twitter: true };
                        localOptions.buttons.twitter.lang = lang;
                        localOptions.buttons.twitter.via = via;
                        localOptions.buttons.twitter.title = title;
                        localOptions.buttons.twitter.url = url;
                        break;
                    case 'facebook':
                        localOptions.share = { facebook: true };
                        localOptions.buttons.facebook.lang = lang;
                        break;
                    case 'googlePlus':
                        localOptions.share = { googlePlus: true };
                        localOptions.buttons.googlePlus.lang = lang;
                        break;
                }

                //Apply sharrre to element
                $(this).sharrre(localOptions);
            });
        });
    }

    $(window).on('op_init_sharrre', init_sharrre);

    function init_selectnav(){
        if (typeof selectnav !== 'undefined') {
            selectnav('navigation-above', {indent: '<span>-</span>'});
            selectnav('navigation-below', {indent: '<span>-</span>'});
            selectnav('navigation-alongside', {indent: '<span>-</span>'});
        }
    }

    //Init the dropkick JS functionality
    function init_dropkick(){
        var navSelector = '.navigation .dk';
        var otherSelector = ($('body').hasClass('blog') ? '.main-content .dk' : '.content .dk');

        dropkickListener = function () {
            if (parseInt($(this).width(), 10) < 960) {
                $(navSelector).each(function () {
                    if (!$(this).data('dropkickInitialized')) {
                        $(this).dropkick({
                            mobile: true,
                            change: function () {
                                if (this.value) {
                                    window.location = this.value;
                                }
                            }
                        });
                        $(this).data('dropkickInitialized', 'true')
                    }

                    var item = $(this).siblings('ul').find('li:first-child a');
                    var color = item.css('color');
                    $(this).prev('.dk_container').find('.dk_label').css({ color: color });
                });
            }
        }

        //Init the nav dropkick functionality and trigger it
        $(window).on('resize', dropkickListener).trigger('resize');

        //Init the other content dropkick dropdowns
        $(otherSelector).each(function(){
            if (!$(this).data('dropkickInitialized')) {
                $(this).dropkick({
                    mobile: true,
                    change: function () {
                        if (value) {
                            window.location = value;
                        }
                    }
                });
                $(this).data('dropkickInitialized', 'true')
            }
        });

        $('li.op-pagebuilder a').fancybox({
            width: '98%',
            height: '98%',
            padding: 0,
            scrolling: 'no',
            closeClick: false,
            type: 'iframe',
            openEffect: 'none',
            closeEffect: 'fade',
            openSpeed: 0,
            closeSpeed: 200,
            openOpacity: true,
            closeOpacity: true,
            scrollOutside: false,
            helpers: {
                overlay: {
                    closeClick: false,
                    showEarly: false,
                    css: { opacity: 0 },
                    speedOut: 200,
                }
            },
            beforeLoad: function () {
                op_show_loading();
            },
            beforeShow: function() {
                OptimizePress.fancyboxBeforeShowAnimation(this);
            },
            afterShow: function () {
                op_hide_loading();
                $('.fancybox-opened').find('iframe').focus();
            },
            beforeClose: function(){
                var returnValue = false;

                if (!OptimizePress.disable_alert) {
                    returnValue = confirm(OptimizePress.pb_unload_alert);
                    if (returnValue) {
                        OptimizePress.fancyboxBeforeCloseAnimation(this);
                    }
                    return returnValue;
                }

                OptimizePress.fancyboxBeforeCloseAnimation(this);
                OptimizePress.disable_alert = false;
            }
        });
    }

    function init_tooltipster(){
        $('.tooltip').tooltipster({animation: 'grow'});
    }

    function init_reveal(){
        $('.optin-modal-container').each(function(){
            $(this).on('click', '.optin-modal-link', function(e) {
                e.preventDefault();
                $(this).next('.optin-modal').reveal();
            });
            $(this).on('click', ' .optin-modal .css-button', function(e){
                e.preventDefault();
                $(this).parent('form').submit();
            });
        });
    }

    //Countdown Asset
    Assets.init.countdown = function(){
        //Find each timer instance
        $('div.countdown-timer').each(function(){
            //Extract date and time
            var obj = $(this),
                data = obj.data('end').split(' '),
                date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                isSince = (typeof(obj.data('end'))!='undefined' ? false : true),
                newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                labels = [
                    obj.data('years_text')   === undefined ? 'Years'   : obj.data('months_text'),
                    obj.data('months_text')  === undefined ? 'Months'  : obj.data('months_text'),
                    obj.data('weeks_text')   === undefined ? 'Weeks'   : obj.data('weeks_text'),
                    obj.data('days_text')    === undefined ? 'Days'    : obj.data('days_text'),
                    obj.data('hours_text')   === undefined ? 'Hours'   : obj.data('hours_text'),
                    obj.data('minutes_text') === undefined ? 'Minutes' : obj.data('minutes_text'),
                    obj.data('seconds_text') === undefined ? 'Seconds' : obj.data('seconds_text')
                ],
                labels1 = [
                    obj.data('years_text_singular')   === undefined ? 'Year'   : obj.data('months_text_singular'),
                    obj.data('months_text_singular')  === undefined ? 'Month'  : obj.data('months_text_singular'),
                    obj.data('weeks_text_singular')   === undefined ? 'Week'   : obj.data('weeks_text_singular'),
                    obj.data('days_text_singular')    === undefined ? 'Day'    : obj.data('days_text_singular'),
                    obj.data('hours_text_singular')   === undefined ? 'Hour'   : obj.data('hours_text_singular'),
                    obj.data('minutes_text_singular') === undefined ? 'Minute' : obj.data('minutes_text_singular'),
                    obj.data('seconds_text_singular') === undefined ? 'Second' : obj.data('seconds_text_singular')
                ],
                format = obj.data('format') || 'yodhms',
                width = 0,
                widthOffset = 9;

            for (var i = 0; i < labels.length; i++) {
                if (labels[i].replace(/\s+/g, '') == '') {
                    labels[i] = '&nbsp;';
                }
            }
            for (var i = 0; i < labels1.length; i++) {
                if (labels1[i].replace(/\s+/g, '') == '') {
                    labels1[i] = '&nbsp;';
                }
            }

            //Download the script if it isn't loaded and initiate countdown
            $.loadScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version , function(){

                    // Get redirect url and trim it (do not allow ' ')
                    var redirect_url = $(obj).attr('data-redirect_url');
                    redirect_url = redirect_url ? $.trim(redirect_url) : redirect_url;

                    // Change location?
                    var expire = ! window.OptimizePress.wp_admin_page && !! redirect_url;

                    //Init countdown
                    obj.countdown({
                        until: newDateObj,
                        format: 'yodhms',
                        labels: labels,
                        labels1: labels1,
                        format: format,
                        'timezone': data[data.length-1],
                        expiryUrl: expire ? redirect_url : '',
                        alwaysExpire: expire
                    });

                    //Get countdown sections and add each width to width variable
                    obj.find('span.countdown_section').each(function(){
                        width += $(this).width() + widthOffset;
                    });

                    //Set width to main obj
                    //obj.width(width + 'px');
                    obj.width('100%');
            });
        });
    }

    // Expose this script for when it's needed
    OptimizePress.initCountdownElements = Assets.init.countdown;

    //Countdown Cookie Asset
    Assets.init.countdown_cookie = function(){
        //Find each timer instance
        $('div.countdown-cookie-timer').each(function(){
            //Extract date and time
            var obj = $(this),
                data = obj.data('end').split(' '),
                date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                labels = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
                labels1 = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
                width = 0,
                widthOffset = 9;

            //Download the script if it isn't loaded and initiate countdown
            $.loadScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version, function(){
                    //Init countdown
                    obj.countdown({
                        until: newDateObj,
                        format: 'yodhms',
                        labels: labels,
                        labels1: labels1
                    });

                    //Get countdown sections and add each width to width variable
                    obj.find('span.countdown_section, span.countdown_row').each(function(){
                        width += $(this).width() + widthOffset;
                    });

                    //Set width to main obj
                    obj.width(width + 'px');
            });
        });
    }


    // Easy cookie manipulation
    OptimizePress.cookie = {};

    OptimizePress.cookie.create = function (name, value, days) {
        var date;
        var expires;

        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    };

    OptimizePress.cookie.read = function (name) {
        var nameEQ = name + "=";
        var cookiesArray = document.cookie.split(';');
        var cookiesArrayLength = cookiesArray.length;
        var i = 0;
        var cookie;

        for (i = 0; i < cookiesArrayLength; i += 1) {
            cookie = cookiesArray[i];

            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    };

    OptimizePress.cookie.erase = function (name) {
        OptimizePress.cookie.create(name, "", -1);
    };

})(opjq);
