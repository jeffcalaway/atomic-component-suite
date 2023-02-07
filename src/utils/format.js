const toCapsAndSpaces = function (string) {
  return string.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const toLowAndSpaces = function (string) {
  return string.replace(/-/g, " ").replace(/\b\w/g, l => l);
}

const toCapsAndSnake = function (string) {
  return toCapsAndSpaces(string).replace(/ /g, "_");
}

const lowAndSnake = function (string) {
  return toLowAndSpaces(string).replace(/ /g, "_");
}

const toCapsAndCamel = function (string) {
  return toCapsAndSpaces(string).split(" ").join("");
}

const toLowAndCamel = function (string) {
  return toLowAndSpaces(string).split(" ").join("");
}

const toFirstLetter = function (string) {
  return string.charAt(0);
}

const toSingular = function (string) {
  if (string.endsWith('s')) {
    return string.slice(0, -1);
  } else if (string.endsWith('ies')) {
    return string.slice(0, -3) + 'y';
  } else if (string.endsWith('es')) {
    return string.slice(0, -2);
  } else {
    return string;
  }
}

module.exports = {
  toCapsAndSpaces,
  toLowAndSpaces,
  toCapsAndSnake,
  lowAndSnake,
  toCapsAndCamel,
  toLowAndCamel,
  toFirstLetter,
  toSingular
}