// script.js (Airtable Integration Version)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const urlInput = document.getElementById("url");
  const carouselLinks = document.getElementById("carousel-links");
  const linksPerSlide = 5;

  const AIRTABLE_API_KEY = "patlW2b1iPeWU9RZL.8831284c7b1b5322f411c984e101be6000ef0c64da4cc7b695ca60d08a98ff99";
  const BASE_ID = "apphIDAkVv7qdhiJJ";
  const TABLE_NAME = "Saved Links";

  // Create empty message element
  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "No links saved yet. Add one above 👆";
  emptyMessage.style.textAlign = "center";
  emptyMessage.style.color = "#777";
  emptyMessage.style.fontSize = "14px";
  emptyMessage.style.marginTop = "20px";
  carouselLinks.parentElement.insertBefore(emptyMessage, carouselLinks);

  let savedLinks = [];

  // Fetch existing links from Airtable on load
  fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  })
    .then(response => response.json())
    .then(data => {
      savedLinks = data.records.map(record => ({
        url: record.fields.url,
        id: record.id
      }));
      buildCarousel(savedLinks);
    })
    .catch(error => console.error("Error loading data from Airtable:", error));

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const url = urlInput.value.trim();

    if (url) {
      fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            url: url
          }
        })
      })
        .then(response => response.json())
        .then(data => {
          savedLinks.push({
            url: data.fields.url,
            id: data.id
          });
          buildCarousel(savedLinks);
          urlInput.value = "";
          alert("✅ Link saved successfully!");
          setTimeout(() => window.close(), 300);
        })
        .catch(error => {
          console.error("Error saving to Airtable:", error);
          alert("❌ Failed to save link.");
        });
    }
  });

  function buildCarousel(links) {
    carouselLinks.innerHTML = "";
    emptyMessage.style.display = links.length === 0 ? "block" : "none";

    for (let i = 0; i < links.length; i += linksPerSlide) {
      const chunk = links.slice(i, i + linksPerSlide);
      addLinksToSlide(chunk, i === 0);
    }
  }

  function addLinksToSlide(links, isActive) {
    const slide = document.createElement("div");
    slide.classList.add("carousel-item");
    if (isActive) slide.classList.add("active");

    const list = document.createElement("ul");
    list.classList.add("link-list");

    links.forEach(item => {
      const listItem = document.createElement("li");

      const linkElement = document.createElement("a");
      linkElement.href = item.url;
      linkElement.textContent = item.url;
      linkElement.target = "_blank";

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 6l3 18h12l3-18H3zm5 16l-2-14h2v14zm4 0V8h2v14h-2zm4 0l-2-14h2l2 14zM5 4V2h14v2h5v2H0V4h5z"/>
        </svg>
      `;
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.background = "none";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = () => deleteLink(item.id);

      listItem.appendChild(linkElement);
      listItem.appendChild(deleteBtn);
      list.appendChild(listItem);
    });

    slide.appendChild(list);
    carouselLinks.appendChild(slide);
  }

  function deleteLink(id) {
    fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`
      }
    })
      .then(() => {
        savedLinks = savedLinks.filter(item => item.id !== id);
        buildCarousel(savedLinks);
      })
      .catch(error => console.error("Error deleting from Airtable:", error));
  }

  function showStatus(message) {
    const status = document.createElement("div");
    status.textContent = message;
    status.style.padding = "10px";
    status.style.color = "green";
    form.insertAdjacentElement("afterend", status);
    setTimeout(() => status.remove(), 2000);
  }
});
