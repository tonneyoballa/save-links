// background.js (service worker)
const N8N_WEBHOOK_URL = "https://<your-n8n-host>/webhook/your-webhook-path"; // replace

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-n8n",
    title: "Save to n8n",
    contexts: ["page", "link", "selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    const payload = {
      url: info.linkUrl || info.pageUrl || (tab && tab.url),
      selectionText: info.selectionText || null,
      title: tab && tab.title,
      timestamp: new Date().toISOString(),
      context: info
    };

    // Send payload to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("n8n webhook returned error", await response.text());
      // optional: notify user
      chrome.notifications?.create({
        type: "basic",
        iconUrl: "icon48.png",
        title: "Save failed",
        message: `n8n webhook error: ${response.status}`
      });
    } else {
      chrome.notifications?.create({
        type: "basic",
        iconUrl: "icon48.png",
        title: "Saved",
        message: "Item sent to n8n"
      });
    }
  } catch (err) {
    console.error("Error sending to n8n", err);
  }
});
