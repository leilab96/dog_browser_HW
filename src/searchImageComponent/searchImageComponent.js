import '../css/searchImageComponent.css';
import ContentComponent from '../contentComponent/contentComponent.js';
import LazyLoad from 'vanilla-lazyload';
import preloader from '../img/preloading.gif';

class SearchImage extends ContentComponent {
  constructor() {
    super();
    this.render();
  }

  async getImages(dogBreed) {
    dogBreed = dogBreed.split(' ');
    let urlString;
    if (dogBreed.length === 1) {
      urlString = `https://dog.ceo/api/breed/${dogBreed[0]}/images`;
    } else if (dogBreed.length === 2) {
      urlString = `https://dog.ceo/api/breed/${dogBreed[1]}/${dogBreed[0]}/images`;
    }
    const response = await fetch(urlString);
    if (response.status === 404) {
      return;
    }
    if (!response.ok) {
      throw new Error('API response error');
    }
    const data = await response.json();
    return data.message;
  }

  displayImage(imageList) {
    const image = document.createElement('img');
    const lazyLoadInstance = new LazyLoad();
    image.classList.add('lazy');
    image.src = preloader;
    image.dataset.src = imageList[Math.floor(Math.random() * imageList.length)];
    document.querySelector('#content').appendChild(image);
    lazyLoadInstance.update();
  }

  handleSearch() {
    const searchTerm = document.querySelector('#dogSearchInput').value;
    let count = Math.floor(Number(document.querySelector('#imageNumberInput').value));
    //ha negatív vagy 0, illetve ha NaN akkor 1 lesz a count alapértelmezett értéke
    if (count <= 0 || isNaN(count)) {
      count = 1;
    }

    if (!searchTerm) {
      this.displayError('Please enter a search term');
      return;
    }

    this.getImages(searchTerm.toLowerCase())
      .then((imageList) => {
        if (imageList) {
          this.clearContent();
          this.clearErrors();
          for (let i = 0; i < count; i++) {
            this.displayImage(imageList);
          }
        } else {
          this.displayError('Breed not found. Please try to list the breeds first.');
        }
      })
      .catch((error) => {
        this.displayError('Something went wrong. Please try again later.');
        console.error(error);
      });
  }

  render() {
    const markup = `
    <form class="dog-search">
      <span class="search-icon"></span>
      <input type="text" id="dogSearchInput">
      <input type="text" id="imageNumberInput" placeholder="1">
      <button type="submit">Search</button>
    </form>
    `;
    document.querySelector('#header').insertAdjacentHTML('beforeend', markup);

    document.querySelector('.dog-search button').addEventListener('click', (event) => {
      // megakadályozzuk a form küldését
      event.preventDefault();
      this.handleSearch();
    });
    document.addEventListener('onSearch', (e) => {
      document.querySelector('#dogSearchInput').value = e.detail;
      this.handleSearch();
    });
  }
}

export default SearchImage;
