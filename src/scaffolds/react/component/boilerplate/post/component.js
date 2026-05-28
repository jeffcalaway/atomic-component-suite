const format = require('../../../../../utils/format');
const syntax = require('../../../../../utils/syntax');
const prompts  = require('../../../../../utils/prompts');

const filePath = function (file) {
    const folderName = syntax.getName(file);
    const targetPath = file.fsPath;
    return `${targetPath}/${folderName}.js`;
}

const filePrompt = async function (file, passedValue = false) {
    if (passedValue) return passedValue;

    const context = {};
    
    const setItemType = await prompts.confirm('Would you like to set the itemType?', {
      modal: true
    });

    if (setItemType == 'Yes') {
      context.itemType = await prompts.pickOne(
          [
            {
              label: 'AboutPage',
              value: 'https://schema.org/AboutPage',
            },
            {
              label: 'AggregateRating',
              value: 'https://schema.org/AggregateRating',
            },
            {
              label: 'Answer',
              value: 'https://schema.org/Answer',
            },
            {
              label: 'Article',
              value: 'https://schema.org/Article',
            },
            {
              label: 'BlogPosting',
              value: 'https://schema.org/BlogPosting',
            },
            {
              label: 'BreadcrumbList',
              value: 'https://schema.org/BreadcrumbList',
            },
            {
              label: 'CollectionPage',
              value: 'https://schema.org/CollectionPage',
            },
            {
              label: 'ContactPage',
              value: 'https://schema.org/ContactPage',
            },
            {
              label: 'CreativeWork',
              value: 'https://schema.org/CreativeWork',
            },
            {
              label: 'Event',
              value: 'https://schema.org/Event',
            },
            {
              label: 'FAQPage',
              value: 'https://schema.org/FAQPage',
            },
            {
              label: 'ImageObject',
              value: 'https://schema.org/ImageObject',
            },
            {
              label: 'ItemList',
              value: 'https://schema.org/ItemList',
            },
            {
              label: 'JobPosting',
              value: 'https://schema.org/JobPosting',
            },
            {
              label: 'ListItem',
              value: 'https://schema.org/ListItem',
            },
            {
              label: 'LocalBusiness',
              value: 'https://schema.org/LocalBusiness',
            },
            {
              label: 'NewsArticle',
              value: 'https://schema.org/NewsArticle',
            },
            {
              label: 'Offer',
              value: 'https://schema.org/Offer',
            },
            {
              label: 'OpeningHoursSpecification',
              value: 'https://schema.org/OpeningHoursSpecification',
            },
            {
              label: 'Organization',
              value: 'https://schema.org/Organization',
            },
            {
              label: 'Person',
              value: 'https://schema.org/Person',
            },
            {
              label: 'Place',
              value: 'https://schema.org/Place',
            },
            {
              label: 'PostalAddress',
              value: 'https://schema.org/PostalAddress',
            },
            {
              label: 'Product',
              value: 'https://schema.org/Product',
            },
            {
              label: 'Question',
              value: 'https://schema.org/Question',
            },
            {
              label: 'Review',
              value: 'https://schema.org/Review',
            },
            {
              label: 'SearchResultsPage',
              value: 'https://schema.org/SearchResultsPage',
            },
            {
              label: 'Service',
              value: 'https://schema.org/Service',
            },
            {
              label: 'Thing',
              value: 'https://schema.org/Thing',
            },
            {
              label: 'VideoObject',
              value: 'https://schema.org/VideoObject',
            },
            {
              label: 'WebPage',
              value: 'https://schema.org/WebPage',
            },
          ],
          'Select itemType',
          'Select the schema.org itemType'
      );
    }

    context.hasClickableTitle = await prompts.confirm('Would you like to make the title clickable?', {
      modal: true
    });
    
    return context;
}

const fileContent = function (file, context = {}) {
  const folderName  = syntax.getName(file);
  const folderClass = format.toCapsAndSnake(folderName);
  const folderKebab = format.toKebab(folderName);
  const dirName     = syntax.getDirName(file);
  const dirLetter   = format.toFirstLetter(dirName);

  const className = `${dirLetter}-${folderKebab}`;

  const { itemType = null, hasClickableTitle = false } = context;

  let articleJsx = "<article className={classes} {...rest}>";

  if (itemType) {
    articleJsx = `<article
      className={classes}
      itemScope
      itemType="${itemType.value}"
      {...rest}
    >`;
  }

  let titleJsx = hasClickableTitle == 'Yes' ? `<ClickableHeading
        className={\`\${classBase}__title\`}
        text={title}
        tag={titleTag}
        url={url}
        target={target}
      />` : "<TitleTag className={\`\${classBase}__title\`}>{title}</TitleTag>";

  if (itemType) {
    let titleItemProp = '';

    switch (itemType.value) {
      case 'https://schema.org/Article':
      case 'https://schema.org/BlogPosting':
      case 'https://schema.org/NewsArticle':
        titleItemProp = 'headline';
        break;

      case 'https://schema.org/JobPosting':
        titleItemProp = 'title';
        break;

      default:
        titleItemProp = 'name';
    }

    titleJsx = hasClickableTitle == 'Yes' ? `<ClickableHeading
        className={\`\${classBase}__title\`}
        text={title}
        tag={titleTag}
        url={url}
        target={target}
        itemProp="${titleItemProp}"
      />` : `<TitleTag
        className={\`\${classBase}__title\`}
        itemProp="${titleItemProp}"
      >{title}</TitleTag>`;
  }

  const clickableImport = hasClickableTitle == 'Yes' ? `
import ClickableHeading from '@archetypes/ClickableHeading';` : '';

  const titleTagConst = hasClickableTitle != 'Yes' ? `

  const TitleTag = titleTag;` : '';

  return `import classNames from '@utils/classNames';${clickableImport}

const ${folderClass} = ({
  className,
  title,
  titleTag = 'h3',
  url,
  target,
  ...rest
}) => {
  if (!title) return;${titleTagConst}

  const classBase = '${className}';
  const classes   = classNames(className, classBase);

  return (
    ${articleJsx}
      ${titleJsx}
    </article>
  );
};

export default ${folderClass};`
}

module.exports = {
    filePath,
    filePrompt,
    fileContent
}
