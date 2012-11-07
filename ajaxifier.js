/*

    Squarespace Ajaxifier
    ------------------------

    USAGE:
    <script src="ajaxifier.js"></script>
    <script>Y.use('squarespace-ajaxifier', function() { new Y.Squarespace.Ajaxifier(); });</script>

    Details:
    Sets up click handlers on anchor links with relative urls,
    to fetch content via ajax and inject into DOM

    Value in a[href] is used.

    HTML5 History is used to update url.
 
 */

YUI.add('squarespace-ajaxifier', function(Y) {

  Y.namespace('Squarespace').Ajaxifier = Y.Base.create('Ajaxifier', Y.Base, [], {

    initializer: function() {
      this.history = new Y.History();
      this.wrapper = Y.one(this.constructor.WRAPPERS);
      if (this.wrapper) { // only proceed if we have something to insert into
        Y.one('body').delegate('click', function(e) {
          var canceled = this._fetchAndRenderUrl(e.currentTarget.getAttribute('href'), e.target);
          if (canceled) {
            e.halt();
          }
        }, this.constructor.CLASS_NAMES.search, this);

        // setup initial state
        this.wrapper.setAttribute('data-dynamic-data-link', window.location.pathname.replace(/\//g,''));

        // Handle back/forward clicks
        Y.on('history:change', Y.bind(function(e) {
          if (e.changed && e.changed.page && e.src == Y.HistoryHTML5.SRC_POPSTATE) {
            var url = e.changed.page.newVal.replace('#', '');
            this._fetchAndRenderUrl(url, Y.one(this.constructor.CLASS_NAMES.search + '[href="' + url + '"]'));
          }
        }, this));

      }
    },

    /*
     * Fetches and Renders.
     *
     * @param {string} url The url to load
     * @param {Node} anchorEl The anchor element.
     */
    _fetchAndRenderUrl: function(url, anchorEl) {

      // helper methods
      function cleanUrl(url) {
        return url.replace(/\//g,'');
      }

      // implementation
      if (anchorEl.getAttribute('data-ajaxify') == "false") {
        return false;
      }

      this.history.addValue('page', url, {
        title: anchorEl.get('text'),
        url: url
      });

      // set state on nav element (if any)
      anchorEl.get('parentNode').addClass('active-link').siblings().removeClass('active-link');

      // Only load items if haven't been loaded
      var cleanedUrl = cleanUrl(url);
      if (anchorEl && cleanedUrl != this.wrapper.getAttribute(this.constructor.CLASS_NAMES.activeWrapper)) {
        this.wrapper.setAttribute(this.constructor.CLASS_NAMES.activeWrapper, cleanedUrl);

        // Change state from active to loading
        Y.all(this.constructor.CLASS_NAMES.search)
          .removeClass(this.constructor.CLASS_NAMES.active).removeClass(this.constructor.CLASS_NAMES.loading);

        anchorEl.addClass(this.constructor.CLASS_NAMES.loading);
        this.wrapper.removeClass(this.constructor.CLASS_NAMES.ready);
        this.wrapper.addClass(this.constructor.CLASS_NAMES.loading);

        // Do da ajax
        Y.Data.get({
          url: url,
          responseFormat: 'raw',
          success: function(response) {
            // console.log(response);

            if (response) {
              var dom, content, bodyClass;

              // Swap out the dom
              dom = Y.DOM.create(response);
              content = Y.Selector.query(this.constructor.WRAPPERS, dom, true);
              this.wrapper.empty(true).setContent(Y.one(content).get('children'));
              
              // Switch body class
              bodyClass = response.match(new RegExp('<body.*class="([^"]*)"'));
              Y.one('body').set('className', bodyClass[1]);

              // Run site.js if exists (not sure how to make this work for all scripts)
              if (Y.one('script[src*="site.js"]')) {
                if (!this.siteJs) {
                  Y.Data.get({ 
                    url: '/scripts/site.js', 
                    responseFormat: 'raw',
                    success: Y.bind(function(response) {
                      this.siteJs = response; // cache it
                      eval(this.siteJs);
                    }, this)
                  });
                } else {
                  eval(this.siteJs);
                }
              }

              this._initializeReplacedContent(url, anchorEl);
            }
          }
        }, this);
      }

      return true;

    },

    _initializeReplacedContent: function(url, anchorEl) {
      // SQS layout
      Squarespace.initializeLayoutBlocks(Y);

      wrapper.all('img[data-image]').each(function(el) {
        if (!el.ancestor('.sqs-layout')) {
          ImageLoader.load(el);
        }
      });

      if (this.wrapper.one('.audio-block')) {
        Squarespace.initializeAudio(Y);
      }

      // Social Buttons
      Y.all('.squarespace-social-buttons').empty( true );
      new Y.Squarespace.SocialButtons();

      // Like Button
      this.wrapper.all('.sqs-simple-like').each(function(n) {
        Y.Squarespace.SimpleLike.renderLikeCount( n );
      });

      // Execute scripts within
      wrapper.all( 'script' ).each(function( n ) {
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        if (n.getAttribute('src')) {
          newScript.src = n.getAttribute('src');
        } else {
          newScript.innerHTML = n.get('innerHTML');
        }

        Y.one('head').append(newScript);
      });

      // Change state from loading to active
      this.wrapper.removeClass(this.constructor.CLASS_NAMES.loading);
      anchorEl.removeClass(this.constructor.CLASS_NAMES.loading);
      this.wrapper.addClass(this.constructor.CLASS_NAMES.ready);
      anchorEl.addClass(this.constructor.CLASS_NAMES.active);
    }

  }, {
    WRAPPERS: '[role="main"], header ~ section, header ~ #canvas',
    CLASS_NAMES: {
      search: 'a:not([href^="http"])',
      active: 'sqs-dynamic-data-active',
      loading: 'sqs-dynamic-data-loading',
      ready: 'sqs-dynamic-data-ready',
      activeWrapper: 'data-dynamic-data-link'
    },
    ATTRS: {
      callbackFn: {
        value: function() {}
      }
    }
  });


}, '1.0', { requires: [ 'node', 'squarespace-social-buttons', 'history' ] });

