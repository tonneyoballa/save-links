document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const urlInput = document.getElementById("url");
  const carouselLinks = document.getElementById("carousel-links");
  const linksPerSlide = 5;

  // Function to add links to a carousel slide
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

  // Load and display saved links in slides
  chrome.storage.sync.get({ savedLinks: [] }, function (data) {
    const savedLinks = data.savedLinks;
    for (let i = 0; i < savedLinks.length; i += linksPerSlide) {
      const linksChunk = savedLinks.slice(i, i + linksPerSlide);
      addLinksToSlide(linksChunk);
    }

    // Set the first slide to active
    if (carouselLinks.firstElementChild) {
      carouselLinks.firstElementChild.classList.add("active");
    }
  });

  // Save a new link and update the carousel
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const url = urlInput.value;

    if (url) {
      chrome.storage.sync.get({ savedLinks: [] }, function (data) {
        const updatedLinks = [...data.savedLinks, url];
        chrome.storage.sync.set({ savedLinks: updatedLinks }, function () {
          alert("Link saved successfully!");
          urlInput.value = "";

          // Refresh carousel to show the new link in the slides
          carouselLinks.innerHTML = "";  // Clear the carousel
          for (let i = 0; i < updatedLinks.length; i += linksPerSlide) {
            const linksChunk = updatedLinks.slice(i, i + linksPerSlide);
            addLinksToSlide(linksChunk);
          }

          if (carouselLinks.firstElementChild) {
            carouselLinks.firstElementChild.classList.add("active");
          }
        });
      });
    }
  });
});
