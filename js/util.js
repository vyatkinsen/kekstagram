const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const showAlert = (errorMessage) => {
  const messageElement = document.createElement('div');
  messageElement.style.alignItems = 'center';
  messageElement.style.fontSize = '25px';
  messageElement.style.lineHeight = '1.5';
  messageElement.style.textAlign = 'center';
  messageElement.style.zIndex = '50';
  messageElement.style.backgroundColor = 'rgba(65, 65, 65)';
  messageElement.style.position = 'fixed';
  messageElement.style.left = '35%';
  messageElement.style.top = '35%';
  messageElement.style.width = '30%';
  messageElement.style.height = '30%';
  messageElement.style.display = 'flex';
  messageElement.style.color = '#e9dc45';
  messageElement.style.borderRadius = '15px';
  messageElement.textContent = errorMessage;
  document.querySelector('body').appendChild(messageElement);
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const throttle = (callback, delayBetweenFrames) => {
  let lastTime = 0;

  return (...rest) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
};

export {getRandomPositiveInteger, isEscapeKey, showAlert, debounce, throttle };
