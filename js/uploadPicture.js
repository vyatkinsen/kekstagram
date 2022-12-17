import {isEscapeKey} from './util.js';
import {sendData} from './serverAPI.js';

const uploadFile = document.querySelector('#upload-file');
const closeButton = document.querySelector('#upload-cancel');
const hashtag = document.querySelector('.text__hashtags');
const comment = document.querySelector('.text__description');
const body = document.querySelector('body');

const imageOverlay = document.querySelector('.img-upload__overlay');
const imageForm = document.querySelector('.img-upload__form');
const submitButton = imageForm.querySelector('.img-upload__submit');
const imageEffectLevel = imageOverlay.querySelector('.img-upload__effect-level');
const imagePreview = imageOverlay.querySelector('.img-upload__preview');

const scaleSmaller = imageOverlay.querySelector('.scale__control--smaller');
const scaleBigger = imageOverlay.querySelector('.scale__control--bigger');
const scaleValue = imageOverlay.querySelector('.scale__control--value');

const effects = imageOverlay.querySelector('.effects__list');
const effectSlider = imageOverlay.querySelector('.effect-level__slider');
const effectValue = imageOverlay.querySelector('.effect-level__value');

const success = document.querySelector('#success').content.querySelector('.success');
const err = document.querySelector('#error').content.querySelector('.error');
const successButton = success.querySelector('.success__button');
const errButton = err.querySelector('.error__button');

const MAX_HASHTAGS_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;
const EFFECTS = {
  chrome: {
    style: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    style: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    style: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    unit: 'px',
    min: 0,
    max: 3,
    step: 0.1,
    style: 'blur',
  },
  heat: {
    style: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  }
};

let currentEffect;

const pristine = new Pristine(imageForm, {
  classTo: 'text',
  errorClass: 'text-invalid',
  successClass: 'text-valid',
  errorTextParent: 'text',
  errorTextTag: 'div',
  errorTextClass: 'text-invalid__error'
}, true);

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtag && evt.target !== comment && !body.contains(err)) {
    evt.preventDefault();
    closeForm();
  }
};

const getControlScale = (step, numScaleValue) => `${parseInt(numScaleValue, 10) + step}%`;

const getTransformScale = (step, numScaleValue) => `scale(${(parseInt(numScaleValue, 10) + step) / 100})`;

const zoomImage = (evt) => {
  const numScaleValue = scaleValue.value.replace('%', '');
  if (evt.target === scaleBigger && numScaleValue < MAX_SCALE) {
    scaleValue.value = getControlScale(SCALE_STEP, numScaleValue);
    imagePreview.style.transform = getTransformScale(SCALE_STEP, numScaleValue);
  } else if (evt.target === scaleSmaller && numScaleValue > MIN_SCALE) {
    scaleValue.value = getControlScale(-SCALE_STEP, numScaleValue);
    imagePreview.style.transform = getTransformScale(-SCALE_STEP, numScaleValue);
  }
};

const onSliderUpdate = () => {
  const sliderValue = effectSlider.noUiSlider.get();
  effectValue.value = sliderValue;
  const selectedConfig = EFFECTS[currentEffect];
  imagePreview.style.filter = selectedConfig ? `${selectedConfig.style}(${sliderValue}${selectedConfig.unit})` : '';
};

const onChangeEffects = (evt) => {
  currentEffect = evt.target.value;
  const selectedConfig = EFFECTS[currentEffect];
  if (!selectedConfig) {
    imageEffectLevel.classList.add('hidden');
    return;
  }
  imageEffectLevel.classList.remove('hidden');
  const {min, max, step} = selectedConfig;
  effectSlider.noUiSlider.updateOptions({
    range: {min, max},
    start: max,
    step,
  });

  imagePreview.className = 'img-upload__preview';
  const effectsPreview = evt.target.parentNode.querySelector('.effects__preview');
  imagePreview.classList.add(effectsPreview.getAttribute('class').split('  ')[1]);
};

const disableSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Подождите...';
};

const enableSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const closeMessages = () => {
  if (body.contains(err)) {
    imageOverlay.classList.remove('hidden');
    body.removeChild(err);
  }
  if (body.contains(success)) {
    body.removeChild(success);
  }
  document.removeEventListener('keydown', onEscErr);
  document.removeEventListener('click', onCloseSuccMsg);
  document.removeEventListener('click', onCloseErrMsg);
  successButton.removeEventListener('click', closeMessages);
  errButton.removeEventListener('click', closeMessages);
};

function onCloseSuccMsg (evt) {
  if (evt.target === success) {
    closeMessages();
  }
}

function onCloseErrMsg (evt) {
  if (evt.target === err) {
    closeMessages();
  }
}

function onEscErr () {
  if (isEscapeKey) {
    closeMessages();
  }
}

uploadFile.addEventListener('change', () => {
  document.addEventListener('keydown', onPopupEscKeydown);
  closeButton.addEventListener('click', closeForm, {once: true});

  scaleValue.value = '100%';
  imagePreview.style.transform = 'scale(1)';
  scaleBigger.addEventListener('click', zoomImage);
  scaleSmaller.addEventListener('click', zoomImage);

  currentEffect = 'effect-none';
  imagePreview.className = 'img-upload__preview';
  imagePreview.classList.add('effects__preview--none');
  effects.addEventListener('change', onChangeEffects);

  imageEffectLevel.classList.add('hidden');
  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100
  });
  effectSlider.noUiSlider.on('update', () => {
    onSliderUpdate();
  });

  document.body.classList.add('modal-open');
  imageOverlay.classList.remove('hidden');
});

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
  if (inputHashTags.length > MAX_HASHTAGS_COUNT || !inputHashTags.every(isHashtag)) {return false;}
  return inputHashTags.filter(
    (number, index, numbers) => numbers.indexOf(number) !== index
  ).length === 0;
};

const validComment = (value) => (value === '' || value.length < MAX_COMMENT_LENGTH);

pristine.addValidator(
  hashtag,
  (value) => validHashtags(value),
  'Введен некорректный хэш-тег'
);

pristine.addValidator(
  comment,
  (value) => validComment(value),
  `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
);

function closeForm () {
  uploadFile.value = '';
  imageForm.reset();
  document.removeEventListener('keydown', onPopupEscKeydown);
  scaleSmaller.removeEventListener('click', zoomImage);
  scaleBigger.removeEventListener('click', zoomImage);
  imageForm.removeEventListener('change', onChangeEffects);
  body.classList.remove('modal-open');
  imageOverlay.classList.add('hidden');
  effectSlider.noUiSlider.destroy();
  pristine.destroy();
}

imageForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    disableSubmitButton();
    sendData(
      () => {
        closeForm();
        enableSubmitButton();
        successButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', onEscErr);
        document.addEventListener('click', onCloseSuccMsg);
        body.appendChild(success);
      },
      () => {
        imageOverlay.classList.add('hidden');
        enableSubmitButton();
        errButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', onEscErr);
        document.addEventListener('click', onCloseErrMsg);
        body.appendChild(err);
      },
      new FormData(evt.target),
    );
  }
}, {once: true});
