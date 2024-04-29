chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const blacklist = ["example.com", "example.com"]; //change the "example.com" to a website of your liking
    //also works for SPECIFIC websites like: "https://www.youtube.com/watch?v=jNQXAC9IVRw" which will automatically close that video specifically and ignore "youtube.com"
    for (let website of blacklist) {
      if (changeInfo.url.includes(website)) {
        chrome.tabs.remove(tabId);
        break;
      }
    }
  }
});
