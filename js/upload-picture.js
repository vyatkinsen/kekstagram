import { isEscapeKey } from './util.js';
import { sendData } from './server.js';

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
const successMsg = document.querySelector('#success').content.querySelector('.success');

const errMsg = document.querySelector('#error').content.querySelector('.error');
const successButton = successMsg.querySelector('.success__button');
const errButton = errMsg.querySelector('.error__button');

const fileForm = document.querySelector('input[type=file]');
const imagePreviewEl = imagePreview.querySelector('img');

const EXTENSIONS = ['jpg', 'jpeg', 'png','gif'];
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

const onCloseButton = () => {
  closeForm();
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtag && evt.target !== comment && !body.contains(errMsg)) {
    evt.preventDefault();
    closeForm();
  }
};

const getControlScale = (step, numScaleValue) => `${parseInt(numScaleValue, 10) + step}%`;

const getTransformScale = (step, numScaleValue) => `scale(${(parseInt(numScaleValue, 10) + step) / 100})`;

const setPreviewSize = (sign, numScaleValue) => {
  scaleValue.value = getControlScale(sign * SCALE_STEP, numScaleValue);
  imagePreview.style.transform = getTransformScale(SCALE_STEP, numScaleValue);
};

const zoomImage = (evt) => {
  const numScaleValue = scaleValue.value.replace('%', '');
  if (evt.target === scaleBigger && numScaleValue < MAX_SCALE) {
    setPreviewSize(1, numScaleValue);
  } else if (evt.target === scaleSmaller && numScaleValue > MIN_SCALE) {
    setPreviewSize(-1, numScaleValue);
  }
};

const onScaleSmaller = (evt) => {
  zoomImage(evt);
};

const onScaleBigger = (evt) => {
  zoomImage(evt);
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
  if (body.contains(errMsg)) {
    imageOverlay.classList.remove('hidden');
    body.removeChild(errMsg);
  }
  if (body.contains(successMsg)) {
    body.removeChild(successMsg);
  }
  removeMsgListeners();
};

function onCloseSuccMsg (evt) {
  if (evt.target === successMsg) {
    closeMessages();
  }
}

function onCloseErrMsg (evt) {
  if (evt.target === errMsg) {
    closeMessages();
  }
}

function onEscErr () {
  if (isEscapeKey) {
    closeMessages();
  }
}

fileForm.addEventListener('change', () => {
  const file = fileForm.files[0];
  const name = file.name.toLowerCase();
  if (EXTENSIONS.some((it) => name.endsWith(it))) {
    imagePreviewEl.src = URL.createObjectURL(file);
  }
});

uploadFile.addEventListener('change', () => {
  document.addEventListener('keydown', onPopupEscKeydown);
  closeButton.addEventListener('click', onCloseButton, {once: true});

  scaleValue.value = '100%';
  imagePreview.style.transform = 'scale(1)';
  scaleBigger.addEventListener('click', onScaleBigger);
  scaleSmaller.addEventListener('click', onScaleSmaller);

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
  scaleSmaller.removeEventListener('click', onScaleSmaller);
  scaleBigger.removeEventListener('click', onScaleBigger);
  imageForm.removeEventListener('change', onChangeEffects);
  body.classList.remove('modal-open');
  imageOverlay.classList.add('hidden');
  effectSlider.noUiSlider.destroy();
  pristine.destroy();
}

function removeMsgListeners () {
  document.removeEventListener('keydown', onEscErr);
  document.removeEventListener('click', onCloseSuccMsg);
  document.removeEventListener('click', onCloseErrMsg);
  successButton.removeEventListener('click', closeMessages);
  errButton.removeEventListener('click', closeMessages);
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
        body.appendChild(successMsg);
      },
      () => {
        imageOverlay.classList.add('hidden');
        enableSubmitButton();
        errButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', onEscErr);
        document.addEventListener('click', onCloseErrMsg);
        body.appendChild(errMsg);
      },
      new FormData(evt.target),
    );
  }
}, {once: true});
