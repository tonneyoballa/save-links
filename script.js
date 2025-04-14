// script.js (Local Storage Version)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const urlInput = document.getElementById("url");
  const carouselLinks = document.getElementById("carousel-links");
  const linksPerSlide = 5;

  // Create empty message element
  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = "No links saved yet. Add one above 👆";
  emptyMessage.style.textAlign = "center";
  emptyMessage.style.color = "#ADEBB3";
  emptyMessage.style.fontSize = "14px";
  emptyMessage.style.marginTop = "20px";
  carouselLinks.parentElement.insertBefore(emptyMessage, carouselLinks);

  // Load links from local storage and render
  let savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];
  buildCarousel(savedLinks);

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const url = urlInput.value.trim();

    if (url) {
      savedLinks.push(url);
      localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
      buildCarousel(savedLinks);
      urlInput.value = "";
      alert("✅ Link saved successfully!");

      setTimeout(() => {
        window.close(); // Close the popup after alert
      }, 300);
    }
  });

  // Build carousel slides from an array of links
  function buildCarousel(links) {
    carouselLinks.innerHTML = ""; // Clear previous content
    emptyMessage.style.display = links.length === 0 ? "block" : "none";

    for (let i = 0; i < links.length; i += linksPerSlide) {
      const chunk = links.slice(i, i + linksPerSlide);
      addLinksToSlide(chunk, i === 0);
    }
  }

  // Add a single slide to carousel
  function addLinksToSlide(links, isActive) {
    const slide = document.createElement("div");
    slide.classList.add("carousel-item");
    if (isActive) slide.classList.add("active");

    const list = document.createElement("ul");
    list.classList.add("link-list");

    links.forEach(link => {
      const listItem = document.createElement("li");

      const linkElement = document.createElement("a");
      linkElement.href = link;
      linkElement.textContent = link;
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
      deleteBtn.onclick = () => deleteLink(link);

      listItem.appendChild(linkElement);
      listItem.appendChild(deleteBtn);
      list.appendChild(listItem);
    });

    slide.appendChild(list);
    carouselLinks.appendChild(slide);
  }

  // Delete link and update local storage
  function deleteLink(linkToDelete) {
    savedLinks = savedLinks.filter(link => link !== linkToDelete);
    localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
    buildCarousel(savedLinks);
  }

  // Show status feedback (optional improvement)
  function showStatus(message) {
    const status = document.createElement("div");
    status.textContent = message;
    status.style.padding = "10px";
    status.style.color = "green";
    form.insertAdjacentElement("afterend", status);
    setTimeout(() => status.remove(), 2000);
  }
});
