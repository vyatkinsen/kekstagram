import {renderPictures} from './avatars.js';
import {getData} from './serverAPI.js';
import {showAlert} from './util.js';
import './uploadPicture.js';

getData((pictures) => {
  renderPictures(pictures);
}, () => {
  showAlert('Что-то пошло не так! Попробуйте перезагрузить страницу.');
});
