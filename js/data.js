import {faker} from '@faker-js/faker';
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

let commentCounter = 1;
const getComments = () => Array.from({length: getRandomPositiveInteger(0, 100)}).map(() => ({
  id: commentCounter++,
  avatar: `img/${getRandomPositiveInteger(1, MAX_AVATAR_VAL)}.svg`,
  message: MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)],
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
}));

const photos = () => Array.from({length: PHOTOS_AMOUNT}).map((value, id) => ({
  id: id + 1,
  url: `photos/${id + 1}.jpg`,
  description: faker.lorem.sentence(),
  likes: getRandomPositiveInteger(MIN_LIKES_VAL, MAX_LIKES_VAL),
  comments: getComments(),
}));

export {photos, getComments};
