(function() {
  /* Please use this command to compile this file into the parent `js` directory:
      coffee --no-header -w -o ../js -c bika.lims.common.coffee

      SENAITE Changes:
        - portalMessage markup
  */
  window.CommonUtils = function() {
    var that;
    that = this;
    /**
     * Entry-point method for CommonUtils
     */
    that.load = function() {
      window.bika = window.bika || {
        lims: {}
      };
      /**
       * Analysis Service dependants and dependencies retrieval
       */
      window.bika.lims.AnalysisService = window.bika.lims.AnalysisService || {
        Dependants: function(service_uid) {
          var deps, request_data;
          request_data = {
            catalog_name: 'bika_setup_catalog',
            UID: service_uid,
            include_methods: 'getServiceDependantsUIDs'
          };
          deps = {};
          $.ajaxSetup({
            async: false
          });
          window.bika.lims.jsonapi_read(request_data, function(data) {
            if (data.objects !== null && data.objects.length > 0) {
              deps = data.objects[0].getServiceDependantsUIDs;
            } else {
              deps = [];
            }
          });
          $.ajaxSetup({
            async: true
          });
          return deps;
        },
        Dependencies: function(service_uid) {
          var deps, request_data;
          request_data = {
            catalog_name: 'bika_setup_catalog',
            UID: service_uid,
            include_methods: 'getServiceDependenciesUIDs'
          };
          deps = {};
          $.ajaxSetup({
            async: false
          });
          window.bika.lims.jsonapi_read(request_data, function(data) {
            if (data.objects !== null && data.objects.length > 0) {
              deps = data.objects[0].getServiceDependenciesUIDs;
            } else {
              deps = [];
            }
          });
          $.ajaxSetup({
            async: true
          });
          return deps;
        }
      };
      window.bika.lims.portalMessage = function(message) {
        var str;
        str = '<dl class=\'portalMessage alert alert-danger\'>' + '<dt>' + _('Error') + '</dt>' + '<dd><ul>' + message + '</ul></dd></dl>';
        $('.portalMessage').remove();
        $(str).appendTo('#viewlet-above-content');
      };
      window.bika.lims.log = function(e) {
        var message;
        if (window.location.url === void 0 || window.location.url === null) {
          return;
        }
        message = '(' + window.location.url + '): ' + e;
        $.ajax({
          type: 'POST',
          url: 'js_log',
          data: {
            'message': message,
            '_authenticator': $('input[name=\'_authenticator\']').val()
          }
        });
      };
      window.bika.lims.warning = function(e) {
        var message;
        message = '(' + window.location.href + '): ' + e;
        $.ajax({
          type: 'POST',
          url: 'js_warn',
          data: {
            'message': message,
            '_authenticator': $('input[name=\'_authenticator\']').val()
          }
        });
      };
      window.bika.lims.error = function(e) {
        var message;
        message = '(' + window.location.href + '): ' + e;
        $.ajax({
          type: 'POST',
          url: 'js_err',
          data: {
            'message': message,
            '_authenticator': $('input[name=\'_authenticator\']').val()
          }
        });
      };
      window.bika.lims.jsonapi_cache = {};
      window.bika.lims.jsonapi_read = function(request_data, handler) {
        var jsonapi_cacheKey, jsonapi_read_handler, page_size;
        window.bika.lims.jsonapi_cache = window.bika.lims.jsonapi_cache || {};
        // if no page_size is specified, we need to explicitly add one here: 0=all.
        page_size = request_data.page_size;
        if (page_size === void 0) {
          request_data.page_size = 0;
        }
        jsonapi_cacheKey = $.param(request_data);
        jsonapi_read_handler = handler;
        if (window.bika.lims.jsonapi_cache[jsonapi_cacheKey] === void 0) {
          $.ajax({
            type: 'POST',
            dataType: 'json',
            url: window.portal_url + '/@@API/read',
            data: request_data,
            success: function(data) {
              window.bika.lims.jsonapi_cache[jsonapi_cacheKey] = data;
              jsonapi_read_handler(data);
            }
          });
        } else {
          jsonapi_read_handler(window.bika.lims.jsonapi_cache[jsonapi_cacheKey]);
        }
      };
      // Priority Selection Widget
      $('.ArchetypesPrioritySelectionWidget select').change(function(e) {
        var val;
        val = $(this).find('option:selected').val();
        $(this).attr('value', val);
      });
      $('.ArchetypesPrioritySelectionWidget select').change();
    };
    that.svgToImage = function(svg) {
      var url;
      url = 'data:image/svg+xml;base64,' + btoa(svg);
      return '<img src="' + url + '"/>';
    };
  };

}).call(this);
