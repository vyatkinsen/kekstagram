import {photos} from './data.js';

const picturesElementsContainer = document.querySelector('.pictures');
const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesListFragment = document.createDocumentFragment();

const appendPicture = (picture) => {
  const {url, likes, comments} = picture;
  const pictureElement = photoTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  picturesListFragment.appendChild(pictureElement);
};

const renderPictures = () => {
  photos().forEach(appendPicture);
  picturesElementsContainer.appendChild(picturesListFragment);
};

export {renderPictures};
