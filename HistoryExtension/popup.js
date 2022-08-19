
let optionsLink = document.getElementById("optionsLink");

optionsLink.addEventListener("click", async () => {
  chrome.runtime.openOptionsPage();
});
