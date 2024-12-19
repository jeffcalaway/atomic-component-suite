const toCapsAndSpaces = function (string) {
  return string.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const toLowAndSpaces = function (string) {
  return string.toLowerCase().replace(/[-_]/g, " ");
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

const toPlural = function (string) {
  // If ends with 's' but not 'ss' assume already plural
  if (string.endsWith('s') && !string.endsWith('ss')) return string;

  if (string.endsWith('y')) {
    return string.slice(0, -1) + 'ies';
  }
  else if (string.endsWith('s')) {
    if (string.slice(-4, -3) === 'e') {
      return string.slice(0, -1) + 'es';
    } else {
      return string + 'es';
    }
  }
  else {
    return string + 's';
  }
}

const alignByEqualSign = (items, leftCallback, rightCallback) => {
  if (!items || !items.length) return '';
  
  // Apply callbacks to transform left and right properties
  const transformed = items.map(item => {
    return {
      left: leftCallback(item),
      right: rightCallback(item)
    };
  });

  // Determine the longest left string length
  const longestLeftLength = transformed.reduce((max, item) => {
    return Math.max(max, item.left.length);
  }, 0);

  // Build the aligned lines
  const lines = transformed.map(item => {
    // Pad the left side so all equals signs line up
    const leftPadded = item.left.padEnd(longestLeftLength, ' ');
    return `${leftPadded} = ${item.right}`;
  });

  // Join lines with a newline character
  return lines.join('\n');
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
  toSingular,
  toPlural,
  alignByEqualSign
}