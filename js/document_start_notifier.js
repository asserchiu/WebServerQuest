// document_start_notifier.js
// ==========================
//
// This script file will be activated by each document_start.

// Settings for [JSLint](http://www.jslint.com/) -- The JavaScript Code Quality Tool
/*jslint browser: true*/
/*global chrome, WebSocket*/

var xhr = new XMLHttpRequest();

// You won't get `X-Powered-By` header if you use `HEAD` method
xhr.open("GET", document.location.pathname, true);
xhr.send();

/**
 * documentLocationSearch2Dic
 * --------------------------
 *
 * Convert `document.location.search` string into key-values
 *
 * @param {String} documentLocationSearch document.location.search
 * @return {Object} key-values of search strings
 */

function documentLocationSearch2Dic(documentLocationSearch) {
  'use strict';
  var dic = {};
  // NOTE: The HTTP protocol does not place any a priori limit on the length of a URI. -- rfc2616
  var list = documentLocationSearch.substr(1, Number.POSITIVE_INFINITY).split('&');
  var i = list.length;
  while (i--) {
    dic[list[i].split('=')[0]] = list[i].split('=')[1];
  }
  return dic;
}

/**
 * xhr.onreadystatechangeListener
 * ------------------------------
 *
 * Take action when bypass `xhr` change readySatae to 2(header received)
 */
xhr.onreadystatechange = function() {
  "use strict";
  if (this.readyState === 2) {
    var serverType = this.getResponseHeader("Server");
    console.log("serverType: " + serverType);
    console.log(serverType ? serverType.split(" ")[0].split("/") : "-");

    var serverTech = this.getResponseHeader("X-Powered-By");
    console.log("serverTech: " + serverTech);
    console.log(serverTech ? serverTech.split(" ")[0].split("/") : "-");

    var eventLog = {
      "type": "web_server_quest",
      "time": new Date().toISOString(),
      "data": {
        "status": this.status,
        "location": {
          // This way may contains empty values inside the `eventLog`
          /* // "hash"       : document.location.hash, */
          /* // "host"       : document.location.host, */
          /* "hostname"   : document.location.hostname, */
          /* // "href"       : document.location.href, */
          /* // "origin"     : document.location.origin, */
          /* "pathname"   : document.location.pathname, */
          /* "port"       : document.location.port, */
          /* "protocol"   : document.location.protocol, */
          /* "search"     : documentLocationSearch2Dic(document.location.search) */
        }
      }
    };

    // Make validations before adding values into the `eventLog`
    /* var documentLocationKey = ["hash", "host", "hostname", "href", "origin", "pathname", "port", "protocol", "search"]; */
    var documentLocationKey = ["hostname", "pathname", "port", "protocol", "search"];
    var i = documentLocationKey.length;
    while (i--) {
      if (document.location[documentLocationKey[i]]) {
        if (documentLocationKey[i] === "search") {
          eventLog.data.location[documentLocationKey[i]] = documentLocationSearch2Dic(document.location.search);
        } else {
          eventLog.data.location[documentLocationKey[i]] = document.location[documentLocationKey[i]];
        }
      }
    }

    // Has serverType info in response header
    if (serverType) {
      var eventLogServerType = {};
      eventLogServerType.name = serverType.split(" ")[0].split("/")[0];
      if (serverType.split(" ")[0].split("/")[1]) {
        // Has version info
        eventLogServerType.version = serverType.split(" ")[0].split("/")[1];
      }
      eventLog.data.serverType = eventLogServerType;
    }

    // Has serverTech info in response header
    if (serverTech) {
      var eventLogServerTech = {};
      eventLogServerTech.name = serverTech.split(" ")[0].split("/")[0];
      if (serverTech.split(" ")[0].split("/")[1]) {
        // Has version info
        eventLogServerTech.version = serverTech.split(" ")[0].split("/")[1].split("-")[0];
      }
      eventLog.data.serverTech = eventLogServerTech;
    }

    console.log(eventLog);

    // send to `Cube` immediately
    var ws = new WebSocket("ws://localhost:1080/1.0/event/put");

    ws.onopen = function() {
      console.log("ws.onopen");
      console.log("ws.send:", JSON.stringify(eventLog));
      ws.send(JSON.stringify(eventLog));
    };

    ws.onerror = function(error) {
      console.log("ws.onerror:", error);
    };

    ws.onmessage = function(message) {
      console.log("ws.onmessage:", JSON.parse(message.data));
    };

    // send to background page
    chrome.extension.sendRequest(eventLog);
  }
};
