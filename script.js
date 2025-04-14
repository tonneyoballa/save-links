// script.js (Local Storage Version)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const urlInput = document.getElementById("url");
  const carouselLinks = document.getElementById("carousel-links");
  const linksPerSlide = 5;

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
      deleteBtn.textContent = `"✖️"`;
      deleteBtn.style.marginLeft = "10px";
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
