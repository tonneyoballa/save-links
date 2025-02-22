document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const urlInput = document.getElementById("url");
  const carouselLinks = document.getElementById("carousel-links");
  const linksPerSlide = 5;

  function addLinksToSlide(links) {
    const slide = document.createElement("div");
    slide.classList.add("carousel-item");

    const list = document.createElement("ul");
    list.classList.add("link-list");

    links.forEach(link => {
      const listItem = document.createElement("li");
      const linkElement = document.createElement("a");
      linkElement.href = link;
      linkElement.textContent = link;
      linkElement.target = "_blank";
      listItem.appendChild(linkElement);
      list.appendChild(listItem);
    });

    slide.appendChild(list);
    carouselLinks.appendChild(slide);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const url = urlInput.value;

    if (url) {
      chrome.runtime.sendMessage({ action: "save_link", url: url }, function(response) {
        if (response.success) {
          alert("Link saved successfully!");
          urlInput.value = "";
        } else {
          alert("Failed to save link.");
        }
      });
    }
  });
});
