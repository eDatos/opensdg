/**
 * Constants to be used in indicatorModel.js and helper functions.
 */
var UNIT_COLUMN = 'Units';
var SERIES_COLUMN = 'Series';
var LABEL_SERIES = 'Serie';
var GEOCODE_COLUMN = translations.t("general.territorio");
var YEAR_COLUMN = 'Year';
var VALUE_COLUMN = 'Value';
var HEADLINE_COLOR = '#777777';
var SERIES_TOGGLE = {{ site.series_toggle | default: false }};

// Se obtiene un array con el orden que deben respetar los territorios.
opensdg.orden_territorio = "{{ site.orden_territorio }}".split(",");