// Helper method to get current time
function getTime() {
  const d = new Date();
  return d.toString();
}

// Helper method to clear the table
function clearTable(table) {
  while (table.rows.length > 0) {
    table.deleteRow(-1);
  }
}

// Method to generate table
function generateTable(table, data) {
    // Add end time for current tab
    data.push(["time", getTime()]);
    let count = 1;
    for (let i = 0; i < data.length; i++) {
      if (Array.isArray(data[i]) && data[i][0] == "url") {
        let row = table.insertRow(-1);

        // Add cell for number
        let numCell = row.insertCell();
        let numText = document.createTextNode(count);
        count++;
        numCell.appendChild(numText);

        // Add cell for url
        let cell = row.insertCell();
        let text = document.createTextNode(data[i][1]);
        cell.appendChild(text);

        // Add cell for start time
        let start = row.insertCell();
        let textStart = document.createTextNode(data[i-1][1]);
        start.appendChild(textStart);

        // Add cell for end time
        let end = row.insertCell();
        let textEnd = document.createTextNode(data[i+1][1]);
        end.appendChild(textEnd);
      }
    }
}

var table = document.getElementById("messageTable").getElementsByTagName('tbody')[0];

chrome.runtime.onMessage.addListener((message) => {
  // Clear the table, then generate a new table each time we receive a message. 
  clearTable(table);
  generateTable(table, message);
});



