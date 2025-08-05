// background.js — manages screenshot capture requests from the popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CAPTURE_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, dataUrl => {
      sendResponse({ dataUrl });
    });
    // Indicate we will reply asynchronously
    return true;
  }
});
