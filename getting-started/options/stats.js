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
  function getTime() {
    const d = new Date();
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
  
// Method to turn number of seconds into a string
function secondsToString(seconds) {
    let s = seconds % 60;
    let minutes = Math.floor(seconds/60);
    let m = minutes % 60;
    let h = Math.floor(minutes/60);
    let sStr = "" + s;
    if (s < 10) {
        sStr = "0" + s;
    }
    let mStr = "" + m;
    if (m < 10) {
        mStr = "0" + m;
    }
    return h + ":" + mStr + ":" + sStr;
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

// Get amount of time spent on each website from eventArr
function getLength(data) {
    let lengthDict = {};
    // Add end time for current tab
    data.push(["time", Date.now()]);
    let count = 1;
    for (let i = 0; i < data.length; i++) {
        if (Array.isArray(data[i]) && data[i][0] == "url" && data[i][1].length > 0) {
            let url = data[i][1];
            let start = data[i-1][1];
            let end = data[i+1][1];
            if (typeof lengthDict[url] == 'undefined') {
                lengthDict[url] = 0;
            }
            lengthDict[url] += Math.round((end - start)/1000);
        }
    }
    let lengthArr = [];
    for (let key in lengthDict) {
        lengthArr.push([]);
        lengthArr[lengthArr.length - 1].push(key);
        let seconds = lengthDict[key];
        let timeStr = secondsToString(seconds)
        lengthArr[lengthArr.length - 1].push(timeStr);
    }
    return lengthArr;
}

// Get the data from background.js

chrome.runtime.sendMessage("loaded");

var timeTable = document.getElementById("timeTable").getElementsByTagName('tbody')[0];

chrome.runtime.onMessage.addListener((message) => {
    // Clear the table, then generate a new table each time we receive a message. 
    let eventArr = message;
    clearTable(timeTable);
    let lengthArr = getLength(eventArr);
    generateTable(timeTable, lengthArr);
});