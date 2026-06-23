const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');
const fileUtil = require('../../../../utils/file');
const path = require('path');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.contentful.js`;
}

const filePrompt = async function (file, passedValue = false) {
    if (passedValue) return passedValue;

    const folderName = syntax.getName(file);
    const componentPath = path.join(file.fsPath, `${folderName}.js`);
    const excludedProps = ['id', 'className', 'children', 'ref', 'key'];
    const defaultContext = {
      propsToMap: []
    };

    if (!fileUtil.exists(componentPath)) {
      return defaultContext;
    }

    const componentProps = fileUtil.getProps(componentPath) || [];
    const pickableProps = componentProps.filter((prop) => !excludedProps.includes(prop));

    if (!pickableProps.length) {
      return defaultContext;
    }

    const storybookOption = 'Storybook™ Props'
    const selectedProps = await prompts.pickMany(
      [
        ...pickableProps,
        storybookOption
      ],
      'Select Props to Map',
      'Select the component props to map from entry.fields'
    );

    const includeStoryArgs = selectedProps.includes(storybookOption);
    const selectedPropsWithoutStory = selectedProps.filter((prop) => prop !== storybookOption);

    return {
      propsToMap: selectedPropsWithoutStory || defaultContext.propsToMap,
      includeStoryArgs
    };
}

const fileContent = function (file, context = {}) {
  const folderName = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const directoryName = syntax.getDirName(file).toLowerCase();
  const componentName = format.toCapsAndCamel(folderName);
  const contentType = `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}`;

  const selectedProps = (context && Array.isArray(context.propsToMap)) ? context.propsToMap : [];

  const hasKicker = selectedProps.includes('kicker');
  const hasHeading = selectedProps.includes('heading');
  const hasTitle = selectedProps.includes('title');
  const hasBody = selectedProps.includes('body');
  const hasButton = selectedProps.includes('button');
  const hasButtons = selectedProps.includes('buttons');
  const hasPrimaryButton = selectedProps.includes('primaryButton');
  const hasSecondaryButton = selectedProps.includes('secondaryButton');
  const hasBreadcrumbs = selectedProps.includes('breadcrumbs');
  const hasBothDefaultButtons = hasPrimaryButton && hasSecondaryButton;
  const hasFullContentFields = hasKicker && hasHeading && !hasTitle && hasBody && hasPrimaryButton && hasSecondaryButton && !hasButton && !hasButtons;

  const contentFieldIncludes = [];
  if (hasKicker) {
    contentFieldIncludes.push('kicker');
  }
  if (hasHeading) {
    contentFieldIncludes.push('heading');
  } else if (hasTitle) {
    contentFieldIncludes.push('title');
  }
  if (hasBody) {
    contentFieldIncludes.push('body');
  }
  if (hasBothDefaultButtons || hasButtons) {
    contentFieldIncludes.push('buttons');
  }

  if (hasButton) {
    contentFieldIncludes.push('button');
  }

  if (!hasBothDefaultButtons && !hasButtons) {
    if (hasPrimaryButton) {
      contentFieldIncludes.push('primaryButton');
    }
    if (hasSecondaryButton) {
      contentFieldIncludes.push('secondaryButton');
    }
  }

  const hasContentFields = contentFieldIncludes.length > 0;

  const remainingProps = selectedProps.filter((prop) => {
    return prop !== 'kicker' && prop !== 'heading' && prop !== 'title' && prop !== 'body' &&
           prop !== 'button' && prop !== 'buttons' &&
           prop !== 'primaryButton' && prop !== 'secondaryButton' &&
           prop !== 'breadcrumbs';
  });

  const mappedPropLines = remainingProps.map((prop) => {
    const isButton = prop.includes('button') || prop.includes('Button');
    const isImage = prop.includes('image') || prop.includes('Image');
    
    if (isButton) {
      return `    ${prop}: await getButtonField('${prop}', entry)`;
    }
    
    if (isImage) {
      return `    ${prop}: await getImageField('${prop}', entry)`;
    }

    return `    ${prop}: await getField('${prop}', entry)`;
  });

  const includeStoryArgs = context && context.includeStoryArgs;

  const helperImports = [
    'getField'
  ];

  if (hasContentFields) {
    helperImports.push('getContentFields');
  }

  if (remainingProps.some((prop) => prop.includes('image') || prop.includes('Image'))) {
    helperImports.push('getImageField');
  }

  if (remainingProps.some((prop) => prop.includes('button') || prop.includes('Button'))) {
    helperImports.push('getButtonField');
  }

  const importEntries = [
    `import { ${helperImports.join(', ')} } from '@lib/contentful/helpers';`
  ];

  if (hasBreadcrumbs) {
    importEntries.push(`import { getBreadcrumbs } from '@utils/page';`);
  }

  const returnEntries = [
    '    type: contentType',
    "    id: await getField('anchorTag', entry)",
  ];

  if (hasContentFields) {
    if (hasFullContentFields) {
      returnEntries.push('    ...await getContentFields(entry)');
    } else {
      const includeLines = contentFieldIncludes.map((item) => `        '${item}'`).join(',\n');
      returnEntries.push(`    ...await getContentFields(entry, {
      include: [
${includeLines}
      ]
    })`);
    }
  }

  returnEntries.push(...mappedPropLines);

  if (hasBreadcrumbs) {
    returnEntries.push('    breadcrumbs: await getBreadcrumbs(pathname)');
  }

  if (includeStoryArgs) {
    importEntries.push(`import ${folderClass}Stories from '@${directoryName}/${folderClass}/${folderClass}.stories';`);
    returnEntries.push(`    ...${folderClass}Stories.args`);
  }

  const importLines = importEntries.join('\n');
  const returnLines = returnEntries.join(',\n');

  const breadcrumbsParam = hasBreadcrumbs ? ', { pathname } = {}' : '';

  return `${importLines}

export const contentType = '${contentType}';

export default async function map${componentName}(entry${breadcrumbsParam}) {
  return {
${returnLines}
  };
}`
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}