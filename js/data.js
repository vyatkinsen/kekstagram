import {getRandomPositiveInteger} from './util.js';

const PHOTOS_AMOUNT = 25;
const MAX_AVATAR_VAL = 6;
const MIN_LIKES_VAL  = 15;
const MAX_LIKES_VAL = 200;
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const DESCRIPTIONS = [
  'Если смогу, я сделаю это. Конец истории.!',
  'Смейтесь как только умеете, любите столько, сколько живете.',
  'Помните: вы единственный человек, который может наполнить ваш мир солнечным светом.',
  'Я полностью уверена, что я — диснеевская принцесса, которую еще не придумали.',
  'Делайте в вашей жизни то, что меньше заставляет вас смотреть в свой телефон.',
  'Цена пацана измеряется выполнением его обещаний.',
  'Брат – это тот, кто не наглеет, даже если ты разрешаешь ему многое.',
  'Бей первым, пацан, бей первым всегда. Пропустишь удар и будет беда. За мать, за друзей, за отца, бей первым по жизни всегда!',
  'На дворе дрова, на дровах братва, у братвы трава вся братва в дрова.',
  'Судить меня дано лишь Богу, другим я укажу дорогу.',
  'Самое позорное для пацана — поливать грязью ту, с которой делил постель, ел за одним столом и жил несколько лет.'
];
const NAMES = [
  'Шейх-Хайдар',
  'Шон',
  'Эберхард',
  'Эдмунд',
  'Стефано',
  'Стивен',
  'Таврион',
  'Тавус',
  'Бронислава',
  'Бруна',
  'Валенсия',
  'Валентина',
  'Дросида',
  'Дуклида',
  'Ева',
  'Евангелина'
];


let commentCounter = 1;
const getComments = () => Array.from({length: getRandomPositiveInteger(0, 100)}).map(() => ({
  id: commentCounter++,
  avatar: `img/${getRandomPositiveInteger(1, MAX_AVATAR_VAL)}.svg`,
  message: MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)],
  name: NAMES[getRandomPositiveInteger(0, NAMES.length - 1)],
}));

const photos = () => Array.from({length: PHOTOS_AMOUNT}).map((value, id) => ({
  id: id + 1,
  url: `photos/${id + 1}.jpg`,
  description: DESCRIPTIONS[getRandomPositiveInteger(0, DESCRIPTIONS.length - 1)],
  likes: getRandomPositiveInteger(MIN_LIKES_VAL, MAX_LIKES_VAL),
  comments: getComments(),
}));

export {photos, getComments};
