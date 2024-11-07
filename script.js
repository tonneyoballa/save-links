document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const urlInput = document.getElementById("url");
    const linksList = document.getElementById("links-list");
  
    // Load and display saved links
    chrome.storage.sync.get({ savedLinks: [] }, function (data) {
      data.savedLinks.forEach(link => {
        const listItem = document.createElement("li");
        const linkElement = document.createElement("a");
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.target = "_blank";
        listItem.appendChild(linkElement);
        linksList.appendChild(listItem);
      });
    });
  
    // Handle form submission to save a new link
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const url = urlInput.value;
  
      if (url) {
        chrome.storage.sync.get({ savedLinks: [] }, function (data) {
          const updatedLinks = [...data.savedLinks, url];
          chrome.storage.sync.set({ savedLinks: updatedLinks }, function () {
            alert("Link saved successfully!");
            urlInput.value = ""; // Clear input after saving
            
            // Add the new link to the list
            const listItem = document.createElement("li");
            const linkElement = document.createElement("a");
            linkElement.href = url;
            linkElement.textContent = url;
            linkElement.target = "_blank";
            listItem.appendChild(linkElement);
            linksList.appendChild(listItem);
          });
        });
      }
    });
  });
  