const getRandomPositiveInteger = (min, max) => {
  if (min < 0 || max < 0) {
    return 0;
  }
  return Math.floor(Math.random() * Math.abs(min - max)+ Math.min(min, max));
};

const checkLineLength = (string, maxLength) => string.length <= maxLength;

getRandomPositiveInteger(-1000, 0);
checkLineLength('qwertyui', 2);
