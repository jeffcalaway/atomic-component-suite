const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.client.js`;
}

const filePrompt = async function (file, passedValue = false) {
    if (passedValue) return passedValue;

    const context = {};
    
    let addEventHandling = await prompts.confirm('Would you like to setup event handling for the client wrapper?', {
      modal: true
    });

    context.events = [];
    if (addEventHandling == 'Yes') {
      context.events = await prompts.pickMany(
        [
          {
            label: 'Blur',
            value: 'Blur'
          },
          {
            label: 'Change',
            value: 'Change'
          },
          {
            label: 'Click',
            value: 'Click'
          },
          {
            label: 'Focus',
            value: 'Focus'
          },
          {
            label: 'Hover',
            value: 'Hover'
          },
          {
            label: 'Input',
            value: 'Input'
          },
          {
            label: 'Key Down',
            value: 'KeyDown'
          },
          {
            label: 'Key Up',
            value: 'KeyUp'
          },
          {
            label: 'Mouse Down',
            value: 'MouseDown'
          },
          {
            label: 'Mouse Enter',
            value: 'MouseEnter'
          },
          {
            label: 'Mouse Leave',
            value: 'MouseLeave'
          },
          {
            label: 'Mouse Up',
            value: 'MouseUp'
          },
          {
            label: 'Resize',
            value: 'Resize'
          },
          {
            label: 'Scroll',
            value: 'Scroll'
          },
          {
            label: 'Submit',
            value: 'Submit'
          }
        ],
        'Setup Event Handling',
        'Select which events to setup'
      );
    }
    
    return context;
}

const fileContent = function (file, context = {}) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);

  let cloneElementImport = '';
  let handlersSection = '';
  let componentBody = '  return children;';

  if (context && context.events && context.events.length) {
      cloneElementImport = `
import { cloneElement, isValidElement } from "react";`;

      const commentDivider = '  //≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡';

      handlersSection = context.events.map(eventOption => {
          const eventLabel = eventOption.label || format.toCapsAndSpaces(eventOption.value);
          return `${commentDivider}
  // ✅ Handle ${eventLabel}
${commentDivider}

  const handle${eventOption.value} = (event) => {
  
  };`;
      }).join('\n\n');

      const eventProps = context.events.map(eventOption => `    on${eventOption.value}: handle${eventOption.value},`).join('\n');

      const guardCode = '  if (!isValidElement(children)) return children;';
      const cloneElementCode = `  return cloneElement(children, {
${eventProps}
  });`;

      componentBody = `${guardCode}\n\n${handlersSection}\n\n${cloneElementCode}`;
  }

  const header = cloneElementImport
    ? `'use client';\n${cloneElementImport}\n\n`
    : `'use client';\n\n`;

  return `${header}const ${folderClass}Client = ({
  children
}) => {
${componentBody}
}

export default ${folderClass}Client;`
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}