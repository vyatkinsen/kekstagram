import {photos} from './data.js';
import {openBigPicture} from './fullscreenPicture.js';

const picturesElementsContainer = document.querySelector('.pictures');
const picturesListFragment = document.createDocumentFragment();
const photoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

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
};

const renderPictures = () => {
  photos().forEach(appendPicture);
  picturesElementsContainer.appendChild(picturesListFragment);
};

export {renderPictures};
