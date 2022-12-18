import { initFilters } from './pictures.js';
import { getData } from './server.js';
import { showAlert } from './util.js';
import './upload-picture.js';

getData((pictures) => {
  initFilters(pictures);
}, () => {
  showAlert('Что-то пошло не так! Попробуйте перезагрузить страницу.');
});
