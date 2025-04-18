chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "save_link") {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError || !token) {
        console.error("Auth error:", chrome.runtime.lastError);
        sendResponse({ success: false, error: "Authentication failed." });
        return;
      }

      const spreadsheetId = "1Gk9HIu_t_dtFacS8Ol4D7NRFz_5N0UBZZptqMVA7ebo";
      const sheetName = "Sheet1";
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:A:append?valueInputOption=USER_ENTERED`;

      fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          values: [[request.url]]
        })
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to save to Google Sheets");
        return response.json();
      })
      .then(data => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error("Google Sheets error:", error);
        sendResponse({ success: false, error: error.message });
      });
    });

    // Needed for async `sendResponse`
    return true;
  }
});
