// Helper method to pad a number with zeros
function padZeros(num, numZeros) {
  let count = 0;
  let temp = num;
  if (temp == 0) {
    count = 1
  }
  while (temp > 0) {
    count += 1;
    temp = Math.floor(temp/10);
  }
  paddedStr = "";
  for (let i = 0; i < numZeros - count; i++) {
    paddedStr += "0";
  }
  return paddedStr + num;
}

// Helper method to get current time
function getTime(d) {
  // Hardcode timezone
  let timezone = "unknown timezone";
  let offset = d.getTimezoneOffset();
  
  if (offset == 420) {
    timezone = "PT";
  }
  if (offset == 240) {
    timezone = "ET";
  }
  // Get the string for the time
  timeStr = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() 
    + " " + d.getHours() + ":" + padZeros(d.getMinutes(), 2) + ":" + padZeros(d.getSeconds(), 2) + " " + timezone;
  return timeStr;
}

// Helper method to clear the table
function clearTable(table) {
  while (table.rows.length > 0) {
    table.deleteRow(-1);
  }
}

// Method to turn the data into an array to be passed into generateTable
function dataToTable(data) {
  // Add end time for current tab
  data.push(["time", Date.now()]);
  let result = [];
  let count = 1;
  
  // Iterate through the array and add the URL's and the corresponding times into the array
  for (let i = 0; i < data.length; i++) {
    if (Array.isArray(data[i]) && data[i][0] == "url" && data[i][1].length > 0) {
      result.push([]);
      result[result.length - 1].push(count);
      result[result.length - 1].push(data[i][1]);
      result[result.length - 1].push(getTime(new Date(data[i-1][1])));
      result[result.length - 1].push(getTime(new Date(data[i+1][1])));
      count++;
    }
  }
  return result;
}

// Method to generate table
function generateTable(table, data) {
    for (let i = 0; i < data.length; i++) {
      let row = table.insertRow(-1);
       for (let j = 0; j < data[0].length; j++) {
         let cell = row.insertCell();
         let text = document.createTextNode(data[i][j]);
         cell.appendChild(text);
       }
    }
}

// Add functionality to clear history

document.getElementById("clearHistory").addEventListener("click", clearHistory);

function clearHistory() {
  chrome.runtime.sendMessage("clear history");
  console.log("History cleared");
}

// Get the data from background.js

var table = document.getElementById("messageTable").getElementsByTagName('tbody')[0];

chrome.runtime.sendMessage("loaded");

var eventArr = [];

chrome.runtime.onMessage.addListener((message) => {
  // Clear the table, then generate a new table each time we receive a message. 
  clearTable(table);
  generateTable(table, dataToTable(message));
});

// Script for persistent service worker

let port;
function connect() {
  port = chrome.runtime.connect({name: 'foo'});
  port.onDisconnect.addListener(connect);
}
connect();