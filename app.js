const auth = "563492ad6f917000010000013dc081c1154c4f198531028cc00a4a18";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
const more = document.querySelector(".more");
let page = 1;
let fetchLink;
let curatedSearch;

//EventListner
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  curatedSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

//Functions
function updateInput(e) {
  searchValue = e.target.value;
}

function generatePhotos(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-image");
    galleryImg.innerHTML = `
    <div class="gallery-info">
    <p>${photo.photographer}</p>
    <a href="${photo.src.original}">Download</a>
    </div>
    <img src=${photo.src.large}></img>
    `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);

  generatePhotos(data);
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);

  generatePhotos(data);
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "aplication/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  if (curatedSearch) {
    page++;
    fetchLink = `https://api.pexels.com/v1/search?query=${curatedSearch}&per_page=15&page=${page}`;
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
  } else {
    page++;
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
  }
}

curatedPhotos();
