/**
 * Model helper functions related to charts and datasets.
 */

/**
 * @param {string} currentTitle
 * @param {Array} allTitles Objects containing 'unit' and 'title'
 * @param {String} selectedUnit
 * @param {String} selectedSeries
 * @return {String} Updated title
 */
function getChartTitle(currentTitle, allTitles, selectedUnit, selectedSeries) {
  var newTitle = currentTitle;
  if (allTitles && allTitles.length > 0) {
      var matchedTitle;
      if (selectedUnit && selectedSeries) {
          matchedTitle = allTitles.find(function (title) {
              return title.unit === selectedUnit && title.series === selectedSeries;
          });
      }
      if (!matchedTitle && selectedSeries) {
          matchedTitle = allTitles.find(function (title) {
              return title.series === selectedSeries;
          });
      }
      if (!matchedTitle && selectedUnit) {
          matchedTitle = allTitles.find(function (title) {
              return title.unit === selectedUnit;
          });
      }
      newTitle = (matchedTitle) ? matchedTitle.title : allTitles[0].title;
  }
  return newTitle;
}

/**
* @param {Array} headline Rows
* @param {Array} rows
* @param {Array} combinations Objects representing disaggregation combinations
* @param {Array} years
* @param {string} defaultLabel
* @param {Array} colors
* @param {Array} selectableFields Field names
* @return {Array} Datasets suitable for Chart.js
*/
function getDatasets(headline, data, combinations, years, defaultLabel, colors, selectableFields) {
  var datasets = [],
      index = 0,
      dataset, color, background, border;
  combinations.forEach(function (combination) {
      var filteredData = getDataMatchingCombination(data, combination, selectableFields);
      if (filteredData.length > 0) {
          color = getColor(index, colors);
          background = getBackground(index, colors);
          border = getBorderDash(index, colors);
          dataset = makeDataset(years, filteredData, combination, defaultLabel, color, background, border, getLegendLabel(filteredData));
          datasets.push(dataset);
          index++;
      }
  }, this);

  datasets.sort((a,b) => {
      if (/Serie ([a-zA-Z])/igm.test(a.label_serie) & /Serie ([a-zA-Z])/igm.test(b.label_serie)) {
          var aValue = /Serie ([a-zA-Z])/igm.exec(a.label_serie)[1];
          var bValue = /Serie ([a-zA-Z])/igm.exec(b.label_serie)[1];
          if (aValue > bValue) return 1;
          if (aValue < bValue) return -1;
      }
      
      return 0;
  });
  
  datasets.forEach(d => {
      if (/.*Objetivo.*/igm.test(d.label)) {
          var relatedDataset = getRelatedDataset(datasets, d);
          if (relatedDataset != null) {
              d.pointBorderColor = relatedDataset.pointBorderColor;
              d.backgroundColor = relatedDataset.backgroundColor;
              d.borderColor = relatedDataset.borderColor;
          }
      }
  })

  if (headline.length > 0) {
      dataset = makeHeadlineDataset(years, headline, defaultLabel);
      datasets.unshift(dataset);
  }
  return datasets;
}

function getLegendLabel(data) {
  if (data[0].Serie != undefined) {
    return data[0].Serie + ". ";
  }
  return "";
}

/**
* Función que implementa la intersección de conjuntos
* @param {Set} otroSet 
*/
Set.prototype.intersection = function (otroSet) {
  var intersectionSet = new Set();
  for (var elem of otroSet) {
      if (this.has(elem)) {
          intersectionSet.add(elem);
      }
  }
  return intersectionSet;
}

/**
* Encontrar el dataset al que hace referencia un objetivo para luego poder utilizar su color.
* 
* @param {Array<Dataset>} datasets 
* @param {Dataset} target 
*/
function getRelatedDataset(datasets, target) {
  var targetSplited = target.label.split(', ');
  var targetSet = new Set(targetSplited);
  var selectedDataset = null;
  var coincidences = 0;
  _.each(datasets, function (d, i) {
      var dSet = new Set(d.label.split(', '));
      if (!dSet.has(targetSplited[0])) {
          var intersection = dSet.intersection(targetSet);
          if (intersection.size > coincidences) {
              selectedDataset = d;
              coincidences = intersection.size;
          }
      }
  })
  return selectedDataset;
}

/**
* @param {Array} rows
* @param {Object} combination Key/value representation of a field combo
* @param {Array} selectableFields Field names
* @return {Array} Matching rows
*/
function getDataMatchingCombination(data, combination, selectableFields) {
  return data.filter(function (row) {
      return selectableFields.every(function (field) {
          return row[field] === combination[field];
      });
  });
}

/**
* @param {int} datasetIndex
* @param {Array} colors
* @return Color from a list
*/
function getColor(datasetIndex, colors) {
  if (datasetIndex >= colors.length) {
      // Support double the number of colors, because we'll use striped versions.
      return '#' + colors[datasetIndex - colors.length];
  } else {
      return '#' + colors[datasetIndex];
  }
}

/**
* @param {int} datasetIndex
* @param {Array} colors
* @return Background color or pattern
*/
function getBackground(datasetIndex, colors) {
  var color = getColor(datasetIndex, colors);

  if (datasetIndex >= colors.length) {
      color = getStripes(color);
  }

  return color;
}

/**
* @param {string} color
* @return Canvas pattern from color
*/
function getStripes(color) {
  if (window.pattern && typeof window.pattern.draw === 'function') {
      return window.pattern.draw('diagonal', color);
  }
  return color;
}

/**
* @param {int} datasetIndex
* @param {Array} colors
* @return {Array|undefined} An array produces dashed lines on the chart
*/
function getBorderDash(datasetIndex, colors) {
  return datasetIndex >= colors.length ? [5, 5] : undefined;
}

/**
* @param {Array} years
* @param {Array} rows
* @param {Object} combination
* @param {string} labelFallback
* @param {string} color
* @param {string} background
* @param {Array} border
* @return {Object} Dataset object for Chart.js
*/
function makeDataset(years, rows, combination, labelFallback, color, background, border, label_serie) {
  var dataset = getBaseDataset();
  var labelName = getCombinationDescription(combination, labelFallback);
  return Object.assign(dataset, {
      label_serie: label_serie,
      label: labelName,
      pointStyle: getPointStyle(labelName),
      disaggregation: combination,
      borderColor: color,
      backgroundColor: background,
      pointBorderColor: color,
      pointBackgroundColor: 'rgb(255,255,255)',
      borderDash: border,
      borderWidth: 2,
      data: prepareDataForDataset(years, rows),
  });
}

function isObjetivo(label) {
  let objetivoRegex = /.*Objetivo.*/;
  return objetivoRegex.test(label);
}

function getPointStyle(label) {
  if (isObjetivo(label)) {
      return 'rect';
  } else {
      return 'circle';
  }
}

/**
* @return {Object} Starting point for a Chart.js dataset
*/
function getBaseDataset() {
  return Object.assign({}, {
      fill: false,
      pointHoverRadius: 9,
      pointRadius: 7,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 3,
      tension: 0,
      spanGaps: true
  });
}

/**
* @param {Object} combination Key/value representation of a field combo
* @param {string} fallback
* @return {string} Human-readable description of combo
*/
function getCombinationDescription(combination, fallback) {
    var keys = Object.keys(combination).sort();
    if (keys.length === 0) {
        return fallback;
    }
    var label = keys.map(function (key) {
        // TODO EDATOS-3208: Usar una constante para la palabra Territorio.
        if (key != "Territorio") {
            return translations.t(combination[key]);
        }
    }).join(', ');
    
    if ("Territorio" in combination) {
        label += `, ${translations.t(combination["Territorio"])}`;
        label = label.replace(/, ,/gi, ',');
    }
    return label;
}

/**
* @param {Array} years
* @param {Array} rows
* @return {Array} Prepared rows
*/
function prepareDataForDataset(years, rows) {
  return years.map(function (year) {
      var found = rows.find(function (row) {
          return row[YEAR_COLUMN] === year;
      });
      return found ? found[VALUE_COLUMN] : null;
  });
}

/**
* @return {string} Hex number of headline color
*
* TODO: Make this dynamic to support high-contrast.
*/
function getHeadlineColor() {
  return HEADLINE_COLOR;
}

/**
* @param {Array} years
* @param {Array} rows
* @param {string} label
* @return {Object} Dataset object for Chart.js
*/
function makeHeadlineDataset(years, rows, label) {
  var dataset = getBaseDataset();
  return Object.assign(dataset, {
      label: label,
      borderColor: getHeadlineColor(),
      backgroundColor: getHeadlineColor(),
      pointBorderColor: getHeadlineColor(),
      pointBackgroundColor: getHeadlineColor(),
      borderWidth: 4,
      data: prepareDataForDataset(years, rows),
  });
}
