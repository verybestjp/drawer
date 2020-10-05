/*!
 * jquery-drawer v3.2.2
 * Flexible drawer menu using jQuery, iScroll and CSS.
 * http://git.blivesta.com/drawer
 * License : MIT
 * Author : blivesta <design@blivesta.com> (http://blivesta.com/)
 */

;(function umd(factory) {
  factory(angular.element);
}(function Drawer($) {
  'use strict';
  var namespace = 'drawer';
  var touches = typeof document.ontouchstart != 'undefined';
  var handler = {};
  var __ = {
    init: function init(options) {
      options = angular.extend({
        iscroll: {
          // nav menu scrollable
          mouseWheel: false,
          preventDefault: false
        },
        showOverlay: true
      }, options);

      __.settings = {
        state: false,
        events: {
          opened: 'drawer_opened',
          closed: 'drawer_closed'
        },
        dropdownEvents: {
          opened: 'shown.bs.dropdown',
          closed: 'hidden.bs.dropdown'
        }
      };

      __.settings.class = angular.extend({
        nav: 'drawer-nav',
        toggle: 'drawer-toggle',
        overlay: 'drawer-overlay',
        open: 'drawer-open',
        close: 'drawer-close',
        dropdown: 'drawer-dropdown'
      }, options.class);

      return angular.forEach($(this), function instantiateDrawer(elemIt) {
        var _this = elemIt;
        var $this = $(elemIt);
        var data = $this.data(namespace);

        if (!data) {
          options = angular.extend({}, options);
          $this.data(namespace, { options: options });

          __.refresh.call(_this);

          if (options.showOverlay) {
            __.addOverlay.call(_this);
          }

          $(document.querySelector('.' + __.settings.class.toggle)).on('click', handler.click = function toggle() {
            __.toggle.call(_this);
            return _this.iScroll.refresh();
          });

          $(window).on('resize', handler.resize = function close() {
            $(document.querySelector(".drawer-overlay")).addClass("overlay-on");
            return _this.iScroll.refresh();
          });

          $(document.querySelector('.' + __.settings.class.dropdown))
            .on(__.settings.dropdownEvents.opened, function onOpenedOrClosed() {
              return _this.iScroll.refresh();
            })
            .on(__.settings.dropdownEvents.closed, function onOpenedOrClosed() {
              return _this.iScroll.refresh();
            });
        }

      }); // end each
    },

    refresh: function refresh() {
      this.iScroll = new IScroll(
        '.' + __.settings.class.nav,
        $(this).data(namespace).options.iscroll
      );
    },

    addOverlay: function addOverlay() {
      var $this = $(this);
      var $overlay = $('<div>').addClass(__.settings.class.overlay + ' ' + __.settings.class.toggle);

      return $this.append($overlay);
    },

    toggle: function toggle() {
      var _this = this;

      if (__.settings.state) {
        return __.close.call(_this);
      } else {
        return __.open.call(_this);
      }
    },

    open: function open() {
      var $this = $(this);

      if (touches) {
        $this.on('touchmove', handler.touchmove = function disableTouch(event) {
          event.preventDefault();
        });
      }

      return $this
        .removeClass(__.settings.class.close)
        .addClass(__.settings.class.open)
        .drawerCallback(function triggerOpenedListeners() {
          __.settings.state = true;
          $this.triggerHandler(__.settings.events.opened);
        });
    },

    close: function close() {
      var $this = $(this);

      if (touches) $this.off('touchmove', handler.touchmove);

      return $this
        .removeClass(__.settings.class.open)
        .addClass(__.settings.class.close)
        .drawerCallback(function triggerClosedListeners() {
          __.settings.state = false;
          $this.triggerHandler(__.settings.events.closed);
        });
    },

    destroy: function destroy() {
      return angular.forEach($(this),function destroyEach(elemIt) {
        var _this = elemIt;
        var $this = $(elemIt);
        $(document.querySelector('.' + __.settings.class.toggle)).off('click', handler.click);
        $(window).off('resize', handler.resize);
        $(document.querySelector('.' + __.settings.class.dropdown)).off(__.settings.dropdownEvents.opened);
        $(document.querySelector('.' + __.settings.class.dropdown)).off(__.settings.dropdownEvents.closed);
        _this.iScroll.destroy();
        $this
          .removeData(namespace)
          .find('.' + __.settings.class.overlay)
          .remove();
      });
    }

  };

  angular.element.prototype.drawerCallback = function drawerCallback(callback) {
    return angular.forEach($(this), function setAnimationEndHandler(elemIt) {
      var $this = $(elemIt);
      $this.on('transitionend', function invokeCallbackOnAnimationEnd() {
        $this.off('transitionend');
        return callback.call(elemIt);
      });
      $this.on('webkitTransitionEnd', function invokeCallbackOnAnimationEnd() {
        $this.off('webkitTransitionEnd');
        return callback.call(elemIt);
      });
    });
  };

  angular.element.prototype.drawer = function drawer(method) {
    if (__[method]) {
      return __[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return __.init.apply(this, arguments);
    } else {
      throw new Error('Method ' + method + ' does not exist on jQuery.' + namespace);
    }
  };

}));
