import { isEscapeKey } from './util.js';

const bigPictureElement = document.querySelector('.big-picture');
const imageElement = bigPictureElement.querySelector('.big-picture__img img');
const commentsLengthElement = bigPictureElement.querySelector('.comments-count');
const likesCounter = bigPictureElement.querySelector('.likes-count');
const descriptionOnPicture = bigPictureElement.querySelector('.social__caption');

const commentsLoadButton = bigPictureElement.querySelector('.social__comments-loader');
const closeButton = bigPictureElement.querySelector('#picture-cancel');

const commentList = bigPictureElement.querySelector('.social__comments');
const commentsCounterElement = bigPictureElement.querySelector('.social__comment-count');
const commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

const COMMENTS_TO_LOAD = 5;
let lengthOfComments,countOfLoadedComments, commentsArr;

const renderComment = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  commentElement.querySelector('.social__picture').src = comment.avatar;
  return commentElement;
};

const loadComments = () => {
  for (let numberOfCurrentComment = countOfLoadedComments; numberOfCurrentComment < countOfLoadedComments + COMMENTS_TO_LOAD; numberOfCurrentComment++) {
    if (numberOfCurrentComment >= lengthOfComments) {
      return;
    }
    if (numberOfCurrentComment === lengthOfComments - 1) {
      commentsLoadButton.classList.add('hidden');
    }
    const comment = renderComment(commentsArr[numberOfCurrentComment]);
    commentList.appendChild(comment);
    commentsCounterElement.textContent = `${numberOfCurrentComment + 1} из ${lengthOfComments} комментариев`;
  }
  countOfLoadedComments += 5;
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  commentsCounterElement.classList.add('hidden');
  commentsLoadButton.classList.add('hidden');

  commentsLoadButton.removeEventListener('click', loadComments);
  document.removeEventListener('keydown', onPopupEscapeKeydown);
};

const openBigPicture = ({url, likes, comments, description}) => {
  countOfLoadedComments = 0;
  commentList.textContent = '';
  commentsArr = comments;
  lengthOfComments = commentsArr.length;

  imageElement.src = url;
  commentsLengthElement.textContent = comments.length;
  likesCounter.textContent = likes;
  descriptionOnPicture.textContent = description;

  document.body.classList.add('modal-open');
  bigPictureElement.classList.remove('hidden');

  commentsCounterElement.classList.remove('hidden');
  commentsLoadButton.classList.remove('hidden');

  if (lengthOfComments > COMMENTS_TO_LOAD) {
    commentsLoadButton.classList.remove('hidden');
    commentsLoadButton.addEventListener('click', loadComments);
  } else {
    commentsLoadButton.classList.add('hidden');
  }
  loadComments();

  document.addEventListener('keydown', onPopupEscapeKeydown);
  closeButton.addEventListener('click', closeBigPicture, {once: true});
};

function onPopupEscapeKeydown (evt){
  if (isEscapeKey) {
    evt.preventDefault();
    closeBigPicture();
  }
}

export {openBigPicture};
