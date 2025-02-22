chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "save_link") {
      const url = request.url;
      saveLinkToGoogleSheets(url);
    }
  });
  
  function saveLinkToGoogleSheets(url) {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (token) {
        fetch("https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/A1:append", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            values: [[url]]
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log("Link saved to Google Sheets:", data);
          })
          .catch(error => {
            console.error("Error saving link to Google Sheets:", error);
          });
      } else {
        console.error("Failed to get auth token");
      }
    });
  }
  