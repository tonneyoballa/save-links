chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "save_link") {
    const url = request.url;
    const title = request.title || "";
    const N8N_WEBHOOK = "http://localhost:5678/webhook-test/save-links";

    // 1️⃣ Send the link to your n8n workflow
    fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        title,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((res) => console.log("Saved:", res.status))
      .catch((err) => console.error("Failed to Save:", err));

    // 2️⃣ Continue your original Google Sheets logic if you have it
    if (typeof saveLinkToGoogleSheets === "function") {
      saveLinkToGoogleSheets(url, sendResponse);
      return true; // keeps sendResponse active for async call
    } else {
      sendResponse({ success: true });
    }
  }
});

// --- Keep your existing Google Sheets function below ---
function saveLinkToGoogleSheets(url, sendResponse) {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (!token) {
      console.error("No auth token found");
      sendResponse({ success: false });
      return;
    }

    const SHEET_ID = "YOUR_SHEET_ID"; // replace with your sheet ID

    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          majorDimension: "ROWS",
          values: [[new Date().toISOString(), url]],
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Saved to Google Sheets:", data);
        sendResponse({ success: true });
      })
      .catch((err) => {
        console.error("❌ Google Sheets save failed:", err);
        sendResponse({ success: false });
      });
  });
}
