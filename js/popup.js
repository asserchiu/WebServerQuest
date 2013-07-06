// # popup.js
//
// This script file will bring-up with [popup.html](../html/popup.html.html), after the popup window has been activate by the user.
// Main functionality of this script is

// Settings for [JSLint](http://www.jslint.com/) -- The JavaScript Code Quality Tool
/*jslint browser: true*/
/*global chrome, Dygraph*/

var tabHistory = chrome.extension.getBackgroundPage().tabHistory;
var currentStatus = chrome.extension.getBackgroundPage().currentStatus;

/**
 * ## printCurrentTabProperties
 *
 * Print current tab properties inside the popup window.
 */

function printCurrentTabProperties() {
  "use strict";
  chrome.tabs.getSelected(null, function(tab) {
    var data = chrome.extension.getBackgroundPage().tabList[tab.id].data;
    document.getElementById("monsName").innerText = data.serverType.name || "Ghost";
    document.getElementById("monsTech").innerText = data.serverTech.name || "Nothing";
  });
}

/**
 * ## printRawData
 *
 * Print summed status inside the popup window.
 */

function printRawData() {
  "use strict";
  // print currentStatus.serverType and currentStatus.serverTech
  document.getElementById("countByServerType").innerText = "countByServerType = " + JSON.stringify(currentStatus.serverType, null, '  ');
  document.getElementById("countByServerTech").innerText = "countByServerTech = " + JSON.stringify(currentStatus.serverTech, null, '  ');
}

/**
 * ## drawDygraph
 *
 * Print historical event diagram inside the popup window.
 *
 * @param {String} dataSource Name of the data.
 */

function drawDygraph(dataSource) {
  "use strict";

  var graphs = [];

  // List of column names
  var DygraphDataLabel = [];

  // CSV data for printing historical diagram
  var DygraphDataCSV = "";

  var tmpEventLog;
  var tmpProperty;
  var lineBuff = "";
  var countBuff = {};

  // Create CSV header and the list of column names
  lineBuff += "time,";
  DygraphDataLabel.push("time");
  for (tmpProperty in currentStatus[dataSource]) {
    if (currentStatus[dataSource].hasOwnProperty(tmpProperty)) {
      DygraphDataLabel.push(tmpProperty);
      lineBuff += tmpProperty;
      lineBuff += ",";
    }
  }

  // Add empty column to DygraphDataLabel for the trailing `,`
  DygraphDataLabel.push("");
  console.log(DygraphDataLabel);

  // DygraphDataCSV column name
  console.log(lineBuff);
  DygraphDataCSV += lineBuff;
  DygraphDataCSV += "\n";

  // DygraphDataCSV data
  for (tmpEventLog in tabHistory) {
    if (tabHistory.hasOwnProperty(tmpEventLog)) {
      lineBuff = "";
      tmpProperty = tabHistory[tmpEventLog].data.hasOwnProperty(dataSource) ? tabHistory[tmpEventLog].data[dataSource].name : "unknown";
      countBuff[tmpProperty] = countBuff[tmpProperty] ? countBuff[tmpProperty] + 1 : 1;

      lineBuff += tabHistory[tmpEventLog].time;
      lineBuff += ",";
      for (tmpProperty in currentStatus[dataSource]) {
        if (currentStatus[dataSource].hasOwnProperty(tmpProperty)) {
          lineBuff += countBuff[tmpProperty] || 0;
          lineBuff += ",";
        }
      }
      DygraphDataCSV += lineBuff;
      DygraphDataCSV += "\n";
      console.log(lineBuff);
    }
  }

  // Create new Dygraph
  var g = new Dygraph(
    document.getElementById("plot"),
    DygraphDataCSV,
    {
      title: dataSource,
      width: 480,
      height: 320,
      labels: DygraphDataLabel,
      /* labelsDiv: document.getElementById("legend"), */
      /* labelsDivWidth: 480, */
      labelsSeparateLines: true,
      /* labelsShowZeroValues: false, */
      stackedGraph: true,

      valueRange: [0, null],
      /* rightGap: 20, */

      /* showRoller: true, */
      /* rollPeriod: 1, */

      highlightCircleSize: 2,
      strokeWidth: 1,
      strokeBorderWidth: null,

      highlightSeriesOpts: {
        strokeWidth: 3,
        strokeBorderWidth: 1,
        highlightCircleSize: 5
      }
    }
  );

  graphs.push(g);
}

/**
 * ## document.onDOMContentLoaded
 *
 * main controler of the popup window
 */
document.addEventListener('DOMContentLoaded', function() {
  "use strict";

  // Always print serverType and serverTech to the popup window
  printCurrentTabProperties();

  var showRawData = document.getElementById('showRawData');
  var graphType = document.getElementsByName('graphType');
  var rawData = document.getElementById('rawData');
  var graph = document.getElementById('graph');

  // Show rawData or graph
  showRawData.onchange = function() {
    rawData.style.display = this.checked ? "" : "none";
    graph.style.display = this.checked ? "none" : "";
  };
  showRawData.checked = false;
  showRawData.onchange();

  rawData.onload = printRawData();

  // Select one of the historical plot by graphType
  graphType.serverType.onchange = function() {
    drawDygraph('serverType');
  };
  graphType.serverTech.onchange = function() {
    drawDygraph('serverTech');
  };
  graphType.serverType.checked = true;
  graphType.serverType.onchange();
});
