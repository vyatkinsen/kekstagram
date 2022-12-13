import {isEscapeKey} from './util.js';

const uploadFile = document.querySelector('#upload-file');
const editor = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');
const form = document.querySelector('.img-upload__form');
const hashtag = document.querySelector('.text__hashtags');
const comment = document.querySelector('.text__description');
const body = document.querySelector('body');

const closeForm = () => {
  editor.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFile.value = '';
  hashtag.value = '';
  comment.value = '';
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtag && evt.target !== comment) {
    evt.preventDefault();
    closeForm();
  }
};

uploadFile.addEventListener('change', () => {
  editor.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscKeydown);
  closeButton.addEventListener('click', closeForm, {once: true});
});

const pristine = new Pristine(form, {
  classTo: 'text',
  errorClass: 'text-invalid',
  successClass: 'text-valid',
  errorTextParent: 'text',
  errorTextTag: 'div',
  errorTextClass: 'text-invalid__error'
}, true);

const isHashtag = (tag) => {
  const regex = /(^\s*$)|(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)/;
  return regex.test(tag);
};

const validHashtags = (value) => {
  if (value === '') {return true;}
  const inputHashTags = value
    .trim()
    .toLowerCase()
    .split(' ');
  if (inputHashTags.length > 5 || !inputHashTags.every(isHashtag)) {return false;}
  return inputHashTags.filter(
    (number, index, numbers) => numbers.indexOf(number) !== index
  ).length === 0;
};

const validComment = (value) => (value === '' || value.length < 140);

pristine.addValidator(
  hashtag,
  (value) => validHashtags(value),
  'Введен некорректный хэш-тег'
);

pristine.addValidator(
  comment,
  (value) => validComment(value),
  'Длина комментария не должна превышать 140 символов'
);

form.addEventListener('submit', (evt) => {
  const isPristineValid = pristine.validate();
  if (!isPristineValid) {evt.preventDefault();}
});


