// background.js
// Service worker script for Manifest V3

// Your n8n webhook URL
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/save-links";

// Create context menu when extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-n8n",
    title: "Save to n8n",
    contexts: ["page", "link", "selection"]
  });
  console.log("Context menu created: Save to n8n");
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    const payload = {
      title: tab?.title || "",
      url: info.linkUrl || info.pageUrl || tab?.url || "",
      selectionText: info.selectionText || "",
      timestamp: new Date().toISOString()
    };

    console.log("Sending payload to n8n:", payload);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("n8n response:", text);

    if (response.ok) {
      await showNotification("✅ Sent to n8n", "Your link was saved successfully.");
    } else {
      await showNotification("⚠️ n8n Error", `Status: ${response.status}`);
    }

  } catch (error) {
    console.error("Error sending to n8n:", error);
    await showNotification("❌ Error", error.message);
  }
});

// Helper to show notification (works in MV3)
async function showNotification(title, message) {
  try {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title,
      message
    });
  } catch (err) {
    console.warn("Notification error:", err);
  }
}
