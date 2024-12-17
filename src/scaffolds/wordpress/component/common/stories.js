const format = require('../../../../utils/format');
const syntax = require('../../../../utils/syntax');
const prompts = require('../../../../utils/prompts');
const fileUtil = require('../../../../utils/file');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.stories.php`;
}

const filePrompt = async function (file) {
  const templatePartPath = syntax.getFile(file, '.php');
  let options = [];

  if (fileUtil.exists(templatePartPath)) {
    const content = fileUtil.read(templatePartPath);
    const regex = /\$props->admit_props\(\[\s*([\s\S]*?)\s*\]\)/;
    const match = content.match(regex);

    if (match[1] !== null && match[1] !== undefined && match[1] !== '') {
      options = match[1].replace(/,\s*$/, '').split(',').map(item => {
        const itemValue = item.trim().replace(/['"]/g, '');
        return {
          label: itemValue,
          value: {
            propName  : itemValue,
            varName   : itemValue,
            fieldName : itemValue
          }
        };
      });
    }
  }

  if (!options.length) return;

  const selectedPropOptions = await prompts.pickMany(
    options,
    'Setup Default Story',
    'Select which props to use for the default story'
  );

  if (!selectedPropOptions) return;

  const context = {};

  // get only the value of the options
  context.defaultProps = selectedPropOptions.map(option => option.value);

  let createStories = await prompts.confirm('Would you like to setup additional stories now?', {
    modal: true
  });

  context.stories = [];

  while (true) {
    console.log( 'createStories Response:', createStories );
    if (createStories == 'Yes') {
        const storyName = await prompts.input('Enter the name of the story');
        if (!storyName) break; // Exit the loop if no story name is provided
        const storyKey = format.toLowAndSnake(storyName);
        context.stories.push({
            title: storyName,
            key: storyKey
        });
  
        const storyProps = await prompts.pickMany(
            options,
            `Setup ${storyName} Story`,
            `Select which props to use for the ${storyName} story`
        );
    
        if (storyProps) {
            context.stories[storyKey] = storyProps.map(option => option.value);
        }
    
        createStories = await prompts.confirm('Create another story?', {
            modal: true
        });
        if (!createStories) break; // Exit the loop if user does not want to create more stories
    } else if (createStories == 'No') {
        break; // Exit the loop if `createStories` is false initially
    }
  }

  return context;
}

const fileContent = function (file, storyContext) {
    const folderName  = syntax.getName(file);
    const folderTitle = format.toCapsAndSpaces(folderName).replace(/cta/gi, 'CTA');
    const folderClass = format.toCapsAndSnake(folderName);
    const dirName     = syntax.getDirName(file);
    const dirTitle    = format.toCapsAndSpaces(dirName);

    let props = [];

    if (storyContext) {
        props = (storyContext.defaultProps && storyContext.defaultProps.length) ? storyContext.defaultProps : [];
    }

    const longestPropNameLength = props.length
    ? Math.max(...props.map(prop => prop.propName.length))
    : 2;

    const defaultProps = props.map(prop => {
        const propName = prop.propName;
        const propNamePadded = `'${propName}'`.padEnd(longestPropNameLength + 2); 
        // +2 for the quotes around propName
        // Example: propName = heading (7 chars) → 'heading' = 9 chars total
        // padEnd(longestPropNameLength+2) accounts for quotes length
        return `            ${propNamePadded} => null,`;
    }).join('\n');

    let additionalStories = '';

    if (storyContext) {
        if (storyContext.stories && storyContext.stories.length) {
            additionalStories = '\n'+storyContext.stories.map(story => {
                const storyKey   = story.key;
                const storyTitle = story.title;
                const storyProps = storyContext.stories[storyKey];
            
                const storyArgs = storyProps.map(prop => {
                    const propName       = prop.propName;
                    const propNamePadded = `'${propName}'`.padEnd(longestPropNameLength + 2);
                    return `            ${propNamePadded} => null,`;
                });
            
                return `
            $${storyKey} = $this->add_story('${storyTitle}', [$this, 'template']);
            $${storyKey}->args([
    ${storyArgs}
            ]);`;
            }).join('\n');
        }
    }

    return `<?php
  
use Useful_Stories\\Library\\Stories;
  
class ${folderClass} extends Stories {
    function __construct(){
        $this->title    = '${dirTitle}/${folderTitle}';
        $this->defaults = [
${defaultProps}
        ];
    }

    function template($args=[]) {
        $args = wp_parse_args($args, $this->defaults);

        render_template_part('${dirName}/${folderName}', $args);
    }
  
    function initialize() {
        $default = $this->add_story('Default', [$this, 'template']);${additionalStories}
    }
}`;
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}