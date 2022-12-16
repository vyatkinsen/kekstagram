import {isEscapeKey} from './util.js';

const uploadFile = document.querySelector('#upload-file');
const editor = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');
const hashtag = document.querySelector('.text__hashtags');
const comment = document.querySelector('.text__description');
const body = document.querySelector('body');

const imageOverlay = document.querySelector('.img-upload__overlay');
const imageForm = document.querySelector('.img-upload__form');
const imageEffectLevel = imageOverlay.querySelector('.img-upload__effect-level');
const imagePreview = imageOverlay.querySelector('.img-upload__preview');

const scaleSmaller = imageOverlay.querySelector('.scale__control--smaller');
const scaleBigger = imageOverlay.querySelector('.scale__control--bigger');
const scaleValue = imageOverlay.querySelector('.scale__control--value');

const effectSlider = imageOverlay.querySelector('.effect-level__slider');
const effectValue = imageOverlay.querySelector('.effect-level__value');

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
    imagePreview.style.filter = 'none';
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

uploadFile.addEventListener('change', () => {
  editor.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscKeydown);
  closeButton.addEventListener('click', closeForm, {once: true});

  scaleValue.value = '100%';
  imagePreview.style.transform = 'scale(1)';
  scaleSmaller.addEventListener('click', zoomImage);
  scaleBigger.addEventListener('click', zoomImage);

  currentEffect = 'effect-none';
  imagePreview.className = 'img-upload__preview';
  imagePreview.classList.add('effects__preview--none');
  imageForm.addEventListener('change', onChangeEffects);

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

  imageEffectLevel.classList.add('hidden');
  body.classList.add('modal-open');
  imageOverlay.classList.remove('hidden');
  imagePreview.style.filter = 'none';
});

const pristine = new Pristine(imageForm, {
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

imageForm.addEventListener('submit', (evt) => {
  const isPristineValid = pristine.validate();
  if (!isPristineValid) {evt.preventDefault();}
});


