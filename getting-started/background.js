// Helper method to pad a number with zeros
function padZeros(num, numZeros) {
  let count = 0;
  let temp = num;
  if (temp == 0) {
    count = 1;
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
  // Get the string for the time
  timeStr = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() 
    + " " + d.getHours() + ":" + padZeros(d.getMinutes(), 2) + ":" + padZeros(d.getSeconds(), 2) + " PDT";
  // Set to PDT for now
  return timeStr;
}

// Helper method to take url string and return the domain
function processURL(url) {
  let split = url.split("/");
  if (split.length >= 3) {
    return url.split("/")[0] + "/" + url.split("/")[1] + "/" + url.split("/")[2] + "/";
  } else {
    return url;
  }
}

// Helper method to send a message with an array
function sendArr(arr) {
  chrome.runtime.sendMessage(arr);
}

// Make sure storageArr and chrome local storage have the same values
storageArr = [];
chrome.storage.local.get(['history'], function(result) {
  if (typeof result.history !== 'undefined') {
    storageArr = result.history;
  }
});
sendArr(storageArr);

var prevURL = "";
var prevTabsLength = 0;
var time = 0;
var isFocused = true;

// Repeatedly get data every 1000 milliseconds
var interval = setInterval(function() { 
  time++;
  // Get active tabs
  chrome.windows.getLastFocused(window => {
    isFocused = window.focused;
  });
  chrome.tabs.query({active: true, lastFocusedWindow: true, highlighted: true}, tabs => {
    
    let tabsLength = tabs.length;
    if (!isFocused) {
      tabsLength = 0;
    }
    // For testing
    if (time % 60 == 0) {
      console.log([getTime(), tabsLength, prevTabsLength]);
    }
    // If there's an active tab, check if it's different from before
    if (tabsLength > 0) {
      let url = tabs[0].url;
      url = processURL(url);
      if ((url != prevURL) || prevTabsLength == 0) {
        // If domain name is different from before, update the arrays and send a message
        storageArr.push(["time", getTime()]);
        storageArr.push(["url", url]);
        prevURL = url;
        chrome.storage.local.set({"history": storageArr}, function() {
          sendArr(storageArr);
        });
      }
    } else if (tabsLength == 0 && prevTabsLength == 1) {
      // If this is the first second with no active tab, record the time
      storageArr.push(["time", getTime()]);
      chrome.storage.local.set({"history": storageArr}, function() {
        sendArr(storageArr);
      });
    }
    // Update prevTabsLength variable
    prevTabsLength = tabsLength;
  });
}, 1000);
