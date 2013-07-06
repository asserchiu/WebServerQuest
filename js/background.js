// background.js
// =============
//
// The main instance of this extension

// Settings for [JSLint](http://www.jslint.com/) -- The JavaScript Code Quality Tool
/*jslint browser: true*/
/*global chrome*/

// `tabList` keeps the current state of opened tabs.
// Update an item onRequest; delete an item onRemoved.
var tabList = {};

// `tabHistory` keeps logs for every request.
var tabHistory = [];

// `currentStatus` stores summed matrix representing encountered `serverType` and `serverTech`.
var currentStatus = {
  'serverType': {},
  'serverTech': {}
};

/**
 * chrome.extension.onRequestListener
 * ----------------------------------
 *
 * Triggered by `chrome.extension.sendRequest(eventLog)`.
 *
 * @param {Object} eventLog
 *  The eventLog created when starting a document.
 * @param {Object} sender
 *  The sender object.
 */
chrome.extension.onRequest.addListener(function(eventLog, sender) {
  "use strict";

  tabList[sender.tab.id] = eventLog;
  tabHistory.push(eventLog);

  console.log("tabList[" + sender.tab.id + "]");
  console.log(tabList[sender.tab.id]);

  // update currentStatus.serverType
  var tempTypeName = eventLog.data.hasOwnProperty('serverType') ? eventLog.data.serverType.name : "unknown";
  if (currentStatus.serverType.hasOwnProperty(tempTypeName)) {
    currentStatus.serverType[tempTypeName] += 1;
  } else {
    currentStatus.serverType[tempTypeName] = 1;
  }

  // update currentStatus.serverTech
  var tempTechName = eventLog.data.hasOwnProperty('serverTech') ? eventLog.data.serverTech.name : "unknown";
  if (currentStatus.serverTech.hasOwnProperty(tempTechName)) {
    currentStatus.serverTech[tempTechName] += 1;
  } else {
    currentStatus.serverTech[tempTechName] = 1;
  }

  console.log(tabHistory);
  console.log(currentStatus);
});

/**
 * chrome.tabs.onRemovedListener
 * -----------------------------
 *
 * Remove tab information form `tabList[tabId]`.
 *
 * @param {Number} tabId The
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
  "use strict";
  delete tabList[tabId];
});
