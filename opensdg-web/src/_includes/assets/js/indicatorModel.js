var indicatorModel = function (options) {

  var helpers = {% include assets/js/model/helpers.js %}

  // events:
  this.onDataComplete = new event(this);
  this.onFieldsComplete = new event(this);
  this.onUnitsComplete = new event(this);
  this.onUnitsSelectedChanged = new event(this);
  this.onSeriesesComplete = new event(this);
  this.onSeriesesSelectedChanged = new event(this);
  this.onFieldsStatusUpdated = new event(this);
  this.onFieldsCleared = new event(this);
  this.onSelectionUpdate = new event(this);


  /**
   * Traduce todos los códigos NUTS2 de los datos a su valor correspondiente.
   * @param {Array<Dictionary>} data 
   */
  function translateNUTCodes(data) {
    var auxData = [].concat(data);
    for (var i = 0; i < auxData.length; i++) {
      if (auxData[i][translations.t("general.territorio")]) {
        auxData[i][translations.t("general.territorio")] = translations.t('nuts.' + auxData[i][translations.t("general.territorio")]);
      }
    }
    return auxData;
  }

  /**
   * Devuelve el índice del edge que posea el from pasado dentro de un array de edges.
   * @param {String} from 
   * @param {Array} edgeArray 
   */
  function getIndexOfEdgeFrom(from, edgeArray) {
    for(var i = 0; i < edgeArray.length; i++) {
      if (edgeArray[i].From == from) {
        return i;
      }
    }
  }

  /**
   * Corrige los edges para evitar inconsistencias al borrar la serie de los edges.
   * @param {Array} edgeArray 
   */
  function fixEdges(edgeArray) {
    if (edgeArray.length <= 1) {
      return [];
    }

    var auxEdgeArray = [].concat(edgeArray);
    for (var i = 0; i < auxEdgeArray.length; i++) {
      if (auxEdgeArray[i].To == "Serie") {
        auxEdgeArray[i].To = auxEdgeArray[i+1].From;
        break;
      }
    }

    return auxEdgeArray;
  }
  
  // general members:
  var that = this;
  this.data = helpers.convertJsonFormatToRows(options.data);
  this.data = translateNUTCodes(this.data);
  this.edgesData = helpers.convertJsonFormatToRows(options.edgesData);
  this.edgesData.splice(getIndexOfEdgeFrom("Serie", this.edgesData), 1);
  this.edgesData = fixEdges(this.edgesData);

  this.hasHeadline = true;
  this.country = options.country;
  this.indicatorId = options.indicatorId;
  this.shortIndicatorId = options.shortIndicatorId;
  this.chartTitle = options.chartTitle,
  this.chartTitles = options.chartTitles;
  this.graphType = options.graphType;
  this.measurementUnit = options.measurementUnit;
  this.startValues = options.startValues;
  this.showData = options.showData;
  this.selectedFields = [];
  this.allowedFields = [];
  this.selectedUnit = undefined;
  this.fieldsByUnit = undefined;
  this.dataHasUnitSpecificFields = false;
  this.selectedSeries = undefined;
  this.fieldsBySeries = undefined;
  this.dataHasSeriesSpecificFields = false;
  this.fieldValueStatuses = [];
  this.validParentsByChild = {};
  this.hasGeoData = false;
  this.showMap = options.showMap;
  this.graphLimits = options.graphLimits;
  this.stackedDisaggregation = options.stackedDisaggregation;
  this.graphAnnotations = options.graphAnnotations;

  // calculate some initial values:
  this.years = helpers.getUniqueValuesByProperty(helpers.YEAR_COLUMN, this.data);
  this.hasGeoData = helpers.dataHasGeoCodes(this.data);
  if (helpers.dataHasUnits(this.data)) {
    this.hasUnits = true;
    this.units = helpers.getUniqueValuesByProperty(helpers.UNIT_COLUMN, this.data);
    this.selectedUnit = this.units[0];
    this.fieldsByUnit = helpers.fieldsUsedByUnit(this.units, this.data);
    this.dataHasUnitSpecificFields = helpers.dataHasUnitSpecificFields(this.fieldsByUnit);
  }
  else {
    this.hasUnits = false;
  }
  if (helpers.SERIES_TOGGLE && helpers.dataHasSerieses(this.data)) {
    this.hasSerieses = true;
    this.serieses = helpers.getUniqueValuesByProperty(helpers.SERIES_COLUMN, this.data);
    this.selectedSeries = this.serieses[0];
    this.fieldsBySeries = helpers.fieldsUsedBySeries(this.serieses, this.data);
    this.dataHasSeriesSpecificFields = helpers.dataHasSeriesSpecificFields(this.fieldsBySeries);
  }
  else {
    this.hasSerieses = false;
  }
  this.fieldItemStates = helpers.getInitialFieldItemStates(this.data, this.edgesData);
  this.validParentsByChild = helpers.validParentsByChild(this.edgesData, this.fieldItemStates, this.data);
  this.selectableFields = helpers.getFieldNames(this.fieldItemStates);
  this.allowedFields = helpers.getInitialAllowedFields(this.selectableFields, this.edgesData);
  this.data = helpers.prepareData(this.data);
  this.colors = opensdg.chartColors(this.indicatorId);
  this.maxDatasetCount = 2 * this.colors.length;
  this.hasStartValues = Array.isArray(this.startValues) && this.startValues.length > 0;

  this.clearSelectedFields = function() {
    this.selectedFields = [];
    this.getData();
    this.onFieldsCleared.notify();
  };

  this.updateFieldStates = function(selectedFields) {
    this.selectedFields = helpers.removeOrphanSelections(selectedFields, this.edgesData);
    this.allowedFields = helpers.getAllowedFieldsWithChildren(this.selectableFields, this.edgesData, selectedFields);
    this.fieldItemStates = helpers.getUpdatedFieldItemStates(this.fieldItemStates, this.edgesData, selectedFields, this.validParentsByChild);
    this.onSelectionUpdate.notify({
      selectedFields: this.selectedFields,
      allowedFields: this.allowedFields
    });
  }

  this.updateSelectedFields = function (selectedFields) {
    this.updateFieldStates(selectedFields);
    this.getData();
  };

  this.updateChartTitle = function() {
    this.chartTitle = helpers.getChartTitle(this.chartTitle, this.chartTitles, this.selectedUnit, this.selectedSeries);
  }

  this.updateSelectedUnit = function(selectedUnit) {
    this.selectedUnit = selectedUnit;
    this.getData({
      updateFields: true // Se fuerza la actualización para tener en cuenta siempre el filtro de campos.
    });
    this.onUnitsSelectedChanged.notify(selectedUnit);
  };

  this.updateSelectedSeries = function(selectedSeries) {
    this.selectedSeries = selectedSeries;
    this.getData({
      updateFields: this.dataHasSeriesSpecificFields
    });
    this.onSeriesesSelectedChanged.notify(selectedSeries);
  };

  this.getData = function(options) {
    options = Object.assign({
      initial: false,
      updateFields: false
    }, options);

    var headlineUnfiltered = helpers.getHeadline(this.selectableFields, this.data);
    var headline;
    if (this.hasUnits && !this.hasSerieses) {
      headline = helpers.getDataByUnit(headlineUnfiltered, this.selectedUnit);
    }
    else if (this.hasSerieses && !this.hasUnits) {
      headline = helpers.getDataBySeries(headlineUnfiltered, this.selectedSeries);
    }
    else if (this.hasSerieses && this.hasUnits) {
      headline = helpers.getDataByUnit(headlineUnfiltered, this.selectedUnit);
      headline = helpers.getDataBySeries(headline, this.selectedSeries);
    }
    else {
      headline = headlineUnfiltered;
    }

    // If this is the initial load, check for special cases.
    var selectionUpdateNeeded = false;
    if (options.initial) {
      // Decide on a starting unit.
      if (this.hasUnits) {
        var startingUnit = this.selectedUnit;
        if (this.hasStartValues) {
          var unitInStartValues = helpers.getUnitFromStartValues(this.startValues);
          if (unitInStartValues) {
            startingUnit = unitInStartValues;
          }
        }
        else {
          // If our selected unit causes the headline to be empty, change it
          // to the first one available that would work.
          if (headlineUnfiltered.length > 0 && headline.length === 0) {
            startingUnit = helpers.getFirstUnitInData(headlineUnfiltered);
          }
        }
        // Re-query the headline if needed.
        if (this.selectedUnit !== startingUnit) {
          headline = helpers.getDataByUnit(headlineUnfiltered, startingUnit);
        }
        this.selectedUnit = startingUnit;
      }

      // Decide on a starting series.
      if (this.hasSerieses) {
        var startingSeries = this.selectedSeries;
        if (this.startValues) {
          var seriesInStartValues = helpers.getSeriesFromStartValues(this.startValues);
          if (seriesInStartValues) {
            startingSeries = seriesInStartValues;
          }
        }
        else {
          // If our selected series causes the headline to be empty, change it
          // to the first one available that would work.
          if (headlineUnfiltered.length > 0 && headline.length === 0) {
            startingSeries = helpers.getFirstSeriesInData(headlineUnfiltered);
          }
        }
        // Re-query the headline if needed.
        if (this.selectedSeries !== startingSeries) {
          headline = helpers.getDataBySeries(headlineUnfiltered, startingSeries);
        }
        this.selectedSeries = startingSeries;
      }

      // Decide on starting field values.
      var startingFields = this.selectedFields;
      if (this.hasStartValues) {
        startingFields = helpers.selectFieldsFromStartValues(this.startValues, this.selectableFields);
      }
      else {
        if (headline.length === 0) {
          startingFields = helpers.selectMinimumStartingFields(this.data, this.selectableFields, this.selectedUnit);
        }
      }
      if (startingFields.length > 0) {
        this.selectedFields = startingFields;
        selectionUpdateNeeded = true;
      }

      this.onUnitsComplete.notify({
        units: this.units,
        selectedUnit: this.selectedUnit
      });

      this.onSeriesesComplete.notify({
        serieses: this.serieses,
        selectedSeries: this.selectedSeries
      });
    }

    if (options.initial || options.updateFields) {
      this.onFieldsComplete.notify({
        fields: helpers.fieldItemStatesForView(
          this.fieldItemStates,
          this.fieldsByUnit,
          this.selectedUnit,
          this.dataHasUnitSpecificFields,
          this.fieldsBySeries,
          this.selectedSeries,
          this.dataHasSeriesSpecificFields,
          this.selectedFields,
          this.edgesData
        ),
        allowedFields: this.allowedFields,
        edges: this.edgesData,
        hasGeoData: this.hasGeoData,
        indicatorId: this.indicatorId,
        showMap: this.showMap,
      });
    }

    if (selectionUpdateNeeded || options.unitsChangeSeries) {
      this.updateFieldStates(this.selectedFields);
    }

    var filteredData = helpers.getDataBySelectedFields(this.data, this.selectedFields);
    if (this.hasUnits) {
      filteredData = helpers.getDataByUnit(filteredData, this.selectedUnit);
    }
    if (this.hasSerieses) {
      filteredData = helpers.getDataBySeries(filteredData, this.selectedSeries);
    }

    filteredData = helpers.sortData(filteredData, this.selectedUnit);
    if (headline.length > 0) {
      headline = helpers.sortData(headline, this.selectedUnit);
    }

    var combinations = helpers.getCombinationData(this.selectedFields, this.data);
    var datasets = helpers.getDatasets(headline, filteredData, combinations, this.years, this.country, this.colors, this.selectableFields);
    var selectionsTable = helpers.tableDataFromDatasets(datasets, this.years);

    var datasetCountExceedsMax = false;
    // restrict count if it exceeds the limit:
    if(datasets.length > this.maxDatasetCount) {
      datasetCountExceedsMax = true;
    }

    this.updateChartTitle();

    this.onFieldsStatusUpdated.notify({
      data: this.fieldItemStates,
      selectionStates: []
    });
    this.onDataComplete.notify({
      datasetCountExceedsMax: datasetCountExceedsMax,
      datasets: datasetCountExceedsMax ? datasets.slice(0, this.maxDatasetCount) : datasets,
      labels: this.years,
      headlineTable: helpers.getHeadlineTable(headline, this.selectedUnit),
      selectionsTable: selectionsTable,
      indicatorId: this.indicatorId,
      shortIndicatorId: this.shortIndicatorId,
      selectedUnit: this.selectedUnit,
      selectedSeries: this.selectedSeries,
      graphLimits: this.graphLimits,
      stackedDisaggregation: this.stackedDisaggregation,
      graphAnnotations: this.graphAnnotations,
      chartTitle: this.chartTitle
    });
  };
};

indicatorModel.prototype = {
  initialise: function () {
    this.getData({
      initial: true
    });
  },
  getData: function () {
    this.getData();
  }
};
