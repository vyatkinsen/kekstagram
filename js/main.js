import { initFilters } from './pictures.js';
import { getData } from './serverAPI.js';
import { showAlert } from './util.js';
import './uploadPicture.js';

getData((pictures) => {
  initFilters(pictures);
}, () => {
  showAlert('Что-то пошло не так! Попробуйте перезагрузить страницу.');
});
