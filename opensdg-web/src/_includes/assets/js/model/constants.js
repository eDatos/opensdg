/**
 * Constants to be used in indicatorModel.js and helper functions.
 */
var UNIT_COLUMN = 'Units';
var SERIES_COLUMN = 'Series';
var LABEL_SERIES = 'Serie';
var GEOCODE_COLUMN = 'Territorio';
var YEAR_COLUMN = 'Year';
var VALUE_COLUMN = 'Value';
var HEADLINE_COLOR = '#777777';
var SERIES_TOGGLE = {{ site.series_toggle | default: false }};

// Constante utilizada para poder marcar los checkboxes por defecto.
opensdg.nacional = {
    "es": "España",
    "ca": "Espanya"
};