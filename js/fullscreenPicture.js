import {isEscapeKey} from './util.js';

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImgElement = document.querySelector('.big-picture__img').querySelector('img');
const likesCountElement = document.querySelector('.likes-count');
const commentsCountElement = document.querySelector('.comments-count');
const pictureDescriptionElement = document.querySelector('.social__caption');
const socialCommentCountElement = document.querySelector('.social__comment-count');
const commentsLoaderElement = document.querySelector('.comments-loader');

const escKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    bigPictureElement.classList.add('hidden');
  }
};

const createComments = (comments) => {
  const socialCommentElement = document.querySelector('.social__comment');
  let clone = socialCommentElement.cloneNode(true);
  const arrOfCom = document.querySelectorAll('.social__comment');
  for (let i = 0; i <= arrOfCom.length - 1; i++) {
    document.querySelector('.social__comment').remove();
  }

  Array.from({length:  arrOfCom.length}, () => socialCommentElement.remove());

  for (const comment of comments) {
    const img = clone.querySelector('img');
    img.src = comment.avatar;
    img.alt = comment.name;
    clone.querySelector('.social__text').textContent = comment.message;
    document.querySelector('.social__comments').appendChild(clone);
    clone = socialCommentElement.cloneNode(true);
  }
};

const openFullscreenPhoto = (photo) => {
  bigPictureImgElement.src = photo.url;
  likesCountElement.textContent = photo.likes;
  commentsCountElement.textContent = photo.comments.length;
  pictureDescriptionElement.textContent = photo.description;
  socialCommentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
  document.querySelector('body').classList.add('modal-open');
  bigPictureElement.classList.remove('hidden');
  document.addEventListener('keydown', escKeydown);
  document.querySelector('.big-picture__cancel').addEventListener('click', () => {
    bigPictureElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
    socialCommentCountElement.classList.remove('hidden');
    commentsLoaderElement.classList.remove('hidden');
  }, {once:true});
  createComments(photo.comments);
};

export {openFullscreenPhoto};
