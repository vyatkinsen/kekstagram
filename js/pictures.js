import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
import { openBigPicture } from './fullscreenPicture.js';
import { debounce } from './util.js';

const picturesElementsContainer = document.querySelector('.pictures');
const picturesListFragment = document.createDocumentFragment();
const photoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const defaultFilterbutton = document.querySelector('#filter-default');
const randomFilterbutton = document.querySelector('#filter-random');
const discussedFilterbutton = document.querySelector('#filter-discussed');
const imgFiltersForm = document.querySelector('.img-filters__form');
const imgFilters = document.querySelector('.img-filters');

const DELAY_MS = 500;
const RAND_PICTURE_NUM = 10;
let selectedFilter = 'filter-default', picturesToAppend, appendedPictures = [];

const appendPicture = (picture) => {
  const {url, likes, comments} = picture;
  const pictureElement = photoTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.addEventListener('click', () => {
    openBigPicture(picture);
  });
  picturesListFragment.appendChild(pictureElement);
  appendedPictures.push(pictureElement);
};

const clearPage = () => {
  appendedPictures.forEach((picture) => picturesElementsContainer.removeChild(picture));
  appendedPictures = [];
};

const renderPictures = () => {
  clearPage();
  picturesToAppend.forEach(appendPicture);
  picturesElementsContainer.appendChild(picturesListFragment);
};

const applyFilter = (button) => {
  defaultFilterbutton.classList.remove('img-filters__button--active');
  randomFilterbutton.classList.remove('img-filters__button--active');
  discussedFilterbutton.classList.remove('img-filters__button--active');
  button.classList.add('img-filters__button--active');
};

const initFilters = (pictures) => {
  imgFilters.classList.remove('img-filters--inactive');
  picturesToAppend = pictures;
  renderPictures();
  imgFiltersForm.addEventListener('click', (evt) => {
    const newFilter = evt.target.id;
    const defaultPictures = Array.from(pictures);
    const randomPictures =  Array.from(pictures);
    const discussedPictures = Array.from(pictures).sort((a, b) => b.comments.length - a.comments.length);
    const renderWithDelay = debounce(renderPictures, DELAY_MS);
    switch(newFilter) {
      case 'filter-default':
        applyFilter(defaultFilterbutton);
        picturesToAppend = defaultPictures;
        break;
      case 'filter-random':
        applyFilter(randomFilterbutton);
        picturesToAppend = faker.helpers.shuffle(randomPictures).slice(0, RAND_PICTURE_NUM);
        break;
      case 'filter-discussed':
        applyFilter(discussedFilterbutton);
        picturesToAppend = discussedPictures;
        break;
    }
    if(newFilter !== selectedFilter) {
      selectedFilter = newFilter;
      renderWithDelay();
    }
  });
};

export { initFilters };
