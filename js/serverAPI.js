const GET_DATA_LINK = 'https://26.javascript.pages.academy/kekstagram/data';
const SEND_DATA_LINK = 'https://26.javascript.pages.academy/kekstagram';
const GET_DATA_ERR_MSG = 'Возникла ошибка при загрузке данных.';
const SEND_DATA_ERR_MSG = 'Возникла ошибка при отправке формы. Попробуйте еще раз.';

const getData = (onSuccess, onFail) => {
  fetch(GET_DATA_LINK)
    .then((response) => {
      if (response.ok) {
        response.json().then((posts) => {
          onSuccess(posts);
        });
      } else {
        throw new Error('Not OK response');
      }
    })
    .catch(() => {
      onFail(GET_DATA_ERR_MSG);
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    SEND_DATA_LINK,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail(SEND_DATA_ERR_MSG);
      }
    })
    .catch(() => {
      onFail(SEND_DATA_ERR_MSG);
    });
};

export {getData, sendData};
