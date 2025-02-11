/**
 * TODO:
 * Integrate with high-contrast switcher.
 */
 (function($) {

  if (typeof L === 'undefined') {
    return;
  }

  // Create the defaults once
  var defaults = {

    // Options for using tile imagery with leaflet.
    tileURL: '[replace me]',
    tileOptions: {
      id: '[relace me]',
      accessToken: '[replace me]',
      attribution: '[replace me]',
    },
    // Zoom limits.
    minZoom: 5,
    maxZoom: 10,
    // Visual/choropleth considerations.
    colorRange: chroma.brewer.BuGn,
    noValueColor: '#f0f0f0',
    styleNormal: {
      weight: 1,
      opacity: 1,
      color: '#888',
      fillOpacity: 0.7
    },
    styleHighlighted: {
      weight: 1,
      opacity: 1,
      color: '#111',
      fillOpacity: 0.7
    },
    styleStatic: {
      weight: 2,
      opacity: 1,
      fillOpacity: 0,
      color: '#172d44',
      dashArray: '5,5',
    },
  };

  // Defaults for each map layer.
  var mapLayerDefaults = {
    min_zoom: 0,
    max_zoom: 10,
    subfolder: 'regions',
    label: 'indicator.map',
    staticBorders: false,
  };

  function Plugin(element, options) {

    this.element = element;
    this.options = $.extend(true, {}, defaults, options.mapOptions);
    this.mapLayers = [];
    this.indicatorId = options.indicatorId;
    this.currentDisaggregation = 0;

    // Require at least one geoLayer.
    if (!options.mapLayers || !options.mapLayers.length) {
      console.log('Map disabled - please add "map_layers" in site configuration.');
      return;
    }

    // Apply geoLayer defaults.
    for (var i = 0; i < options.mapLayers.length; i++) {
      this.mapLayers[i] = $.extend(true, {}, mapLayerDefaults, options.mapLayers[i]);
    }

    this._defaults = defaults;
    this._name = 'sdgMap';

    this.init(options);
  }

  Plugin.prototype = {

    // Zoom to a feature.
    zoomToFeature: function(layer) {
      this.map.fitBounds(layer.getBounds());
    },

    // Select a feature.
    highlightFeature: function(layer) {
      // Abort if the layer is not on the map.
      if (!this.map.hasLayer(layer)) {
        return;
      }
      // Update the style.
      layer.setStyle(this.options.styleHighlighted);
      // Add a tooltip if not already there.
      if (!layer.getTooltip()) {
        var tooltipContent = layer.feature.properties.name;
        var tooltipData = this.getData(layer.feature.properties);
        if (tooltipData != null && !Number.isNaN(tooltipData)) {
          tooltipContent += ': ' + tooltipData.toFixed(2).replaceAll(".", ","); // i18n
        }
        layer.bindTooltip(tooltipContent, {
          permanent: true,
        }).addTo(this.map);
      }
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      this.updateStaticLayers();
    },

    // Unselect a feature.
    unhighlightFeature: function(layer) {

      // Reset the feature's style.
      layer.setStyle(this.options.styleNormal);

      // Remove the tooltip if necessary.
      if (layer.getTooltip()) {
        layer.unbindTooltip();
      }

      // Make sure other selections are still highlighted.
      var plugin = this;
      this.selectionLegend.selections.forEach(function(selection) {
        plugin.highlightFeature(selection);
      });
    },

    // Get all of the GeoJSON layers.
    getAllLayers: function() {
      return L.featureGroup(this.dynamicLayers.layers);
    },

    // Get only the visible GeoJSON layers.
    getVisibleLayers: function() {
      // Unfortunately relies on an internal of the ZoomShowHide library.
      return this.dynamicLayers._layerGroup;
    },

    updateStaticLayers: function() {
      // Make sure the static borders are always visible.
      this.staticLayers._layerGroup.eachLayer(function(layer) {
        layer.bringToFront();
      });
    },

    // Update the colors of the Features on the map.
    updateColors: function() {
      var plugin = this;
      this.getAllLayers().eachLayer(function(layer) {
        layer.setStyle(function(feature) {
          return {
            fillColor: plugin.getColor(feature.properties),
          }
        });
      });
    },

    // Get the data from a feature's properties, according to the current year.
    getData: function(props) {
      if (props.values
          && props.values.length
          && props.values[this.currentDisaggregation][this.currentYear] != null
          && !Number.isNaN(props.values[this.currentDisaggregation][this.currentYear])) {
        return props.values[this.currentDisaggregation][this.currentYear];
      }
      return false;
    },

    // Choose a color for a GeoJSON feature.
    getColor: function(props) {
      var data = this.getData(props);
      if (typeof data === 'number') {
        return this.colorScale(data).hex();
      }
      else {
        return this.options.noValueColor;
      }
    },

    // Get the (long) URL of a geojson file, given a particular subfolder.
    getGeoJsonUrl: function(subfolder) {
      var fileName = this.indicatorId + '.geojson';
      return [opensdg.remoteDataBaseUrl, 'geojson', subfolder, fileName].join('/');
    },

    // Initialize the map itself.
    init: function(options) {
      const lat = (opensdg.map.lat !== 'undefined') ? opensdg.map.lat : 0;
      const lon = (opensdg.map.lon !== 'undefined') ? opensdg.map.lon : 0;
      const zoom = (opensdg.map.zoom !== 'undefined') ? opensdg.map.zoom : 0;

      // Create the map.
      this.map = L.map(this.element, {
        minZoom: this.options.minZoom,
        maxZoom: this.options.maxZoom,
        zoomControl: false,
      });

      this.map.setView([lat, lon], 0);
      this.dynamicLayers = new ZoomShowHide();
      this.dynamicLayers.addTo(this.map);
      this.staticLayers = new ZoomShowHide();
      this.staticLayers.addTo(this.map);

      // Add scale.
      this.map.addControl(L.control.scale({position: 'bottomright'}));

      // Add tile imagery.
      L.tileLayer(this.options.tileURL, this.options.tileOptions).addTo(this.map);

      // Because after this point, "this" rarely works.
      var plugin = this;

      // Below we'll be figuring out the min/max values and available years.
      var minimumValues = [],
          maximumValues = [],
          availableYears = [];

      // At this point we need to load the GeoJSON layer/s.
      var geoURLs = this.mapLayers.map(function(item) {
        return $.getJSON(plugin.getGeoJsonUrl(item.subfolder));
      });
      $.when.apply($, geoURLs).done(function() {

        // Apparently "arguments" can either be an array of responses, or if
        // there was only one response, the response itself. This behavior is
        // odd and should be investigated. In the meantime, a workaround is a
        // blunt check to see if it is a single response.
        var geoJsons = arguments;
        // In a response, the second element is a string (like 'success') so
        // check for that here to identify whether it is a response.
        if (arguments.length > 1 && typeof arguments[1] === 'string') {
          // If so, put it into an array, to match the behavior when there are
          // multiple responses.
          geoJsons = [geoJsons];
        }

        for (var i = 0; i < geoJsons.length; i++) {
          // First add the geoJson as static (non-interactive) borders.
          if (plugin.mapLayers[i].staticBorders) {
            var staticLayer = L.geoJson(geoJsons[i][0], {
              style: plugin.options.styleStatic,
              interactive: false,
            });
            // Static layers should start appear when zooming past their dynamic
            // layer, and stay visible after that.
            staticLayer.min_zoom = plugin.mapLayers[i].max_zoom + 1;
            staticLayer.max_zoom = plugin.options.maxZoom;
            plugin.staticLayers.addLayer(staticLayer);
          }
          // Now go on to add the geoJson again as choropleth dynamic regions.
          var geoJson = geoJsons[i][0]
          var layer = L.geoJson(geoJson, {
            style: plugin.options.styleNormal,
            onEachFeature: onEachFeature,
          });
          // Set the "boundaries" for when this layer should be zoomed out of.
          layer.min_zoom = plugin.mapLayers[i].min_zoom;
          layer.max_zoom = plugin.mapLayers[i].max_zoom;
          // Listen for when this layer gets zoomed in or out of.
          layer.on('remove', zoomOutHandler);
          layer.on('add', zoomInHandler);
          // Save the GeoJSON object for direct access (download) later.
          layer.geoJsonObject = geoJson;
          // Add the layer to the ZoomShowHide group.
          plugin.dynamicLayers.addLayer(layer);

          if ($(plugin.element).parent().find("#legend").length === 0) {
            let legend = '<ul id="legend" class="map-legend">';
            for (let index = 0; index < options.sortedIndicators?.length; index++) {
              const indicator = options.sortedIndicators[index];
              legend += '<li><span class="swatchTsr" style="border-color: #7B6079"> </span> <strong>Serie ' + indicator.slug[indicator.slug.length - 1] + '. </strong>' + indicator.graph_title + '</li>'
            }
            legend += '</ul>';
            $(plugin.element).parent().append(legend);
          }

          if($(plugin.element).parent().find("[download]").length === 0) {
            // Add a download button below the map.
            var downloadLabel = translations.t(plugin.mapLayers[i].label)
            var downloadButton = $('<a></a>')
              .attr('href', plugin.getGeoJsonUrl(plugin.mapLayers[i].subfolder))
              .attr('download', '')
              .attr('class', 'btn btn-primary btn-download')
              .attr('title', translations.indicator.download_geojson_title + ' - ' + downloadLabel)
              .text(translations.indicator.download_geojson + ' - ' + downloadLabel);
            $(plugin.element).parent().append(downloadButton);
          }

          // Keep track of the minimums and maximums.
          _.each(geoJson.features, function(feature) {
            if (feature.properties.values && feature.properties.values.length) {
              availableYears = availableYears.concat(Object.keys(feature.properties.values[0]));
              minimumValues.push(_.min(Object.values(feature.properties.values[0])));
              maximumValues.push(_.max(Object.values(feature.properties.values[0])));
            }
          });
        }

        // Calculate the ranges of values, years and colors.
        const values = [_.min(minimumValues), _.max(maximumValues)];
        plugin.valueRange = values.map(val => val.toFixed(2).replaceAll('.', ',')); // i18n
        plugin.colorScale = chroma.scale(plugin.options.colorRange)
          .domain(values)
          .classes(plugin.options.colorRange.length);
        plugin.years = _.uniq(availableYears).sort();
        plugin.currentYear = plugin.years[0];

        // And we can now update the colors.
        plugin.updateColors();

        // Add zoom control.
        plugin.map.addControl(L.Control.zoomHome());

        // Add full-screen functionality.
        plugin.map.addControl(new L.Control.Fullscreen());

        // Add the year slider.
        plugin.map.addControl(L.Control.yearSlider({
          years: plugin.years,
          yearChangeCallback: function(e) {
            plugin.currentYear = new Date(e.time).getFullYear();
            plugin.updateColors();
            plugin.selectionLegend.update();
          }
        }));

        // Add the selection legend.
        plugin.selectionLegend = L.Control.selectionLegend(plugin);
        plugin.map.addControl(plugin.selectionLegend);

        // Add the search feature.
        plugin.searchControl = new L.Control.Search({
          layer: plugin.getAllLayers(),
          propertyName: 'name',
          marker: false,
          moveToLocation: function(latlng) {
            plugin.zoomToFeature(latlng.layer);
            if (!plugin.selectionLegend.isSelected(latlng.layer)) {
              plugin.highlightFeature(latlng.layer);
              plugin.selectionLegend.addSelection(latlng.layer);
            }
          },
          autoCollapse: true,
        });
        plugin.map.addControl(plugin.searchControl);
        // The search plugin messes up zoomShowHide, so we have to reset that
        // with this hacky method. Is there a better way?
        plugin.map.setZoom(plugin.options.maxZoom);
        plugin.map.setZoom(zoom);

        plugin.startExp = 0;

        const command = L.control({position: 'bottomleft'});
        command.onAdd = function (map) {
          const div = L.DomUtil.create('div', 'command');
          let code = '<form>';
          for (let index = 0; index < options.sortedIndicators?.length; index++) {
            const elem = options.sortedIndicators[index];
            const serieLetter = elem.slug.match(/SERIE-(.)/i)
            const serieName = "Serie " + serieLetter[1];
            if (index === plugin.startExp) {
              code += '<label onclick="updateRadioButton(\'' + elem.number.replaceAll(".", "") + '\', ' + index +')" ' +
                  'style="background-color: #ECECEC; padding-right: 6px; padding-left: 4px; font-size: 14px"><input id="command' + Math.random().toString() + '" type="radio" name="serie" value="' + index + '" checked> ' + serieName + ' </label><br>';
            } else {
              code += '<label onclick="updateRadioButton(\'' + elem.number.replaceAll(".", "") + '\', ' + index +')" ' +
                  'style="background-color: #ECECEC; padding-right: 6px; padding-left: 4px; font-size: 14px"><input id="command' + Math.random().toString() + '" type="radio" name="serie" value="' + index + '"> ' + serieName + ' </label><br>';
            }
          }
          code += '</form>';
          div.innerHTML = code;
          return div;

        };
        command.addTo(plugin.map);

        $(document).on('click change', '.map-2-wrapper input[type="radio"]', function(e) {
          plugin.map.setZoom(zoom);
        });

        $(document).on('click', '#metadata-graph  li:nth-of-type(2)', function(e) {
          plugin.map.setZoom(zoom);
        });

        // The list of handlers to apply to each feature on a GeoJson layer.
        function onEachFeature(feature, layer) {
          if (plugin.featureShouldDisplay(feature)) {
            layer.on('click', clickHandler);
            layer.on('mouseover', mouseoverHandler);
            layer.on('mouseout', mouseoutHandler);
          }
        }
        // Event handler for click/touch.
        function clickHandler(e) {
          var layer = e.target;
          if (plugin.selectionLegend.isSelected(layer)) {
            plugin.selectionLegend.removeSelection(layer);
            plugin.unhighlightFeature(layer);
          }
          else {
            plugin.selectionLegend.addSelection(layer);
            plugin.highlightFeature(layer);
            plugin.zoomToFeature(layer);
          }
        }
        // Event handler for mouseover.
        function mouseoverHandler(e) {
          var layer = e.target;
          if (!plugin.selectionLegend.isSelected(layer)) {
            plugin.highlightFeature(layer);
          }
        }
        // Event handler for mouseout.
        function mouseoutHandler(e) {
          var layer = e.target;
          if (!plugin.selectionLegend.isSelected(layer)) {
            plugin.unhighlightFeature(layer);
          }
        }
        // Event handler for when a geoJson layer is zoomed out of.
        function zoomOutHandler(e) {
          var geoJsonLayer = e.target;
          // For desktop, we have to make sure that no features remain
          // highlighted, as they might have been highlighted on mouseover.
          geoJsonLayer.eachLayer(function(layer) {
            if (!plugin.selectionLegend.isSelected(layer)) {
              plugin.unhighlightFeature(layer);
            }
          });
          plugin.updateStaticLayers();
        }
        // Event handler for when a geoJson layer is zoomed into.
        function zoomInHandler(e) {
          plugin.updateStaticLayers();
        }
      });

      // Perform some last-minute tasks when the user clicks on the "Map" tab.
      $('.map .nav-link').click(function() {
        setTimeout(function() {
          $('#map #loader-container').hide();
          // Leaflet needs "invalidateSize()" if it was originally rendered in a
          // hidden element. So we need to do that when the tab is clicked.
          plugin.map.invalidateSize();
          // Also zoom in/out as needed.
          plugin.map.fitBounds(plugin.getVisibleLayers().getBounds());
          // Limit the panning to what we care about.
          plugin.map.setMaxBounds(plugin.getVisibleLayers().getBounds());
          // Make sure the info pane is not too wide for the map.
          var $legendPane = $('.selection-legend.leaflet-control');
          var widthPadding = 20;
          var maxWidth = $('#map').width() - widthPadding;
          if ($legendPane.width() > maxWidth) {
            $legendPane.width(maxWidth);
          }
          // Make sure the map is not too high.
          var heightPadding = 75;
          var maxHeight = $(window).height() - heightPadding;
          if ($('#map').height() > maxHeight) {
            $('#map').height(maxHeight);
          }
        }, 500);
      });
    },

    featureShouldDisplay: function(feature) {
      var display = true;
      display = display && typeof feature.properties.name !== 'undefined';
      display = display && typeof feature.properties.geocode !== 'undefined';
      display = display && typeof feature.properties.values !== 'undefined';
      display = display && typeof feature.properties.disaggregations !== 'undefined';
      return display;
    },
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn['sdgMap'] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_sdgMap')) {
        /* Modificación EDATOS-3320
         * Se sobreescribe la función updateColors para que los colores sin datos
         * se vean transparentes en lugar de grises.
         */
        let plugin = new Plugin(this, options);
        plugin.updateColors = function () {
            var plugin = this;
            this.getAllLayers().eachLayer(function(layer) {
                layer.setStyle(function(feature) {
                    let color = plugin.getColor(feature.properties);
                    return {
                        fillColor: color,
                        fillOpacity: color.toUpperCase() === "#F0F0F0" ? 0 : 0.9,
                    }
                });
            });
        }
        $.data(this, 'plugin_sdgMap', plugin);
      }
    });
  };
})(jQuery);


function updateRadioButton(subindicatorId, index) {
  window.dispatchEvent(new Event('resize'));
  document.querySelectorAll('.map-2-wrapper').forEach(elem => elem.classList.remove('active'));
  document.getElementById('subindicator-2' + subindicatorId).classList.add('active');
  document.querySelectorAll('#subindicator-2' + subindicatorId + ' input[type="radio"]')[index].checked = true;
}
