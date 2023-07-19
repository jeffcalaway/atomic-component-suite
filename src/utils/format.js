const toCapsAndSpaces = function (string) {
  return string.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const toLowAndSpaces = function (string) {
  return string.replace(/-/g, " ").replace(/\b\w/g, l => l);
}

const toCapsAndSnake = function (string) {
  return toCapsAndSpaces(string).replace(/ /g, "_");
}

const toLowAndSnake = function (string) {
  return toLowAndSpaces(string).replace(/ /g, "_");
}

const toCapsAndCamel = function (string) {
  return toCapsAndSpaces(string).split(" ").join("");
}

const toLowAndCamel = function (string) {
  return toLowAndSpaces(string).split(" ").join("");
}

const toKebab = function (string) {
  let noUnderscores = string.replace(/_/g, '');
  return noUnderscores.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const toFirstLetter = function (string) {
  return string.charAt(0);
}

const toSingular = function (string) {
  if (string.endsWith('ies')) {
    return string.slice(0, -3) + 'y';
  }
  // else if (string.endsWith('es')) {
  //   if (string.slice(-4, -3) === 'e') {
  //     return string.slice(0, -1);
  //   } else {
  //     return string.slice(0, -2);
  //   }
  // }
  else if (string.endsWith('s')) {
    return string.slice(0, -1);
  } else {
    return string;
  }
}

module.exports = {
  toCapsAndSpaces,
  toLowAndSpaces,
  toCapsAndSnake,
  toLowAndSnake,
  toCapsAndCamel,
  toLowAndCamel,
  toKebab,
  toFirstLetter,
  toSingular
}