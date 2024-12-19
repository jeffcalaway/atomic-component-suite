const vscode = require('vscode');
const fileUtil = require('./file');
const path = require('path');

const pickOne = async (options, title = null, placeholder = null) => {
  const args = {
    canPickMany: false
  }
  if (title) args.title = title;
  if (placeholder) args.placeHolder = placeholder;

  return await vscode.window.showQuickPick(options, args);
}

const pickMany = async (options, title = null, placeholder = null) => {
  const args = {
    canPickMany: true
  }
  if (title) args.title = title;
  if (placeholder) args.placeHolder = placeholder;

  return await vscode.window.showQuickPick(options, args);
}

const input = async (label, placeholder = null) => {
  return await vscode.window.showInputBox({
    prompt: label,
    placeHolder: placeholder
  });
}

const form = async (fields) => {
  const form = {};
  const totalSteps = fields.length;

  for (let i = 0; i < totalSteps; i++) {
    const field = fields[i];
    const step = i + 1;
    field.label = `${field.label} (${step}/${totalSteps})`;
    const input = await input(field.label, field.placeholder);
    if (!input) return;
    form[field.name || field.label] = input;
  }
  return form;
}

const notification = async (text, options, ...buttons) => {
  return await vscode.window.showInformationMessage(text, options, ...buttons);
}

const confirm = async (text, options) => {
  return await notification(text, options, 'Yes', 'No');
}

const errorMessage = async (text, options, ...buttons) => {
  return await vscode.window.showErrorMessage(text, options, ...buttons);
}

const fileCreated = async (filePath) => {
  const fileName = filePath.split('/').pop();
  const openFile = await notification(`Generated ${fileName} successfully!`, {}, 'Open', 'Dismiss');

  if (openFile === 'Open') {
    const uri = vscode.Uri.file(filePath);
    vscode.window.showTextDocument(uri);
  }
}

const fileUpdated = async (filePath, message) => {
  const fileName = filePath.split('/').pop();
  const updateMessage = message || `Updated ${fileName} successfully!`;
  const openFile = await notification(updateMessage, {}, 'Open', 'Dismiss');

  if (openFile === 'Open') {
    const uri = vscode.Uri.file(filePath);
    vscode.window.showTextDocument(uri);
  }
}

const openUrlInBrowser = async (url) => {
  try {
    // Validate the URL
    const validatedUrl = new URL(url);

    // Convert the URL string to a VS Code Uri
    const uri = vscode.Uri.parse(validatedUrl.href);

    // Use the VS Code API to open the external URL
    const opened = await vscode.env.openExternal(uri);

    if (!opened) {
      errorMessage(`Failed to open the URL: ${url}`);
    }
  } catch (error) {
    errorMessage(`Invalid URL: ${url}`);
    console.error(`Error opening URL: ${error.message}`);
  }
}

const advPickOne = async (options, title, placeholder = false) => {
  const selector = vscode.window.createQuickPick();
  selector.title = title;
  if (placeholder) {
    selector.placeholder = placeholder;
  }
  
  // Ensure your options actually have a 'value' field if you're expecting one
  selector.items = options;

  let returnValue;

  // When selection changes, capture the chosen value and hide the selector
  const selectionListener = selector.onDidChangeSelection(selection => {
    if (selection[0]) {
      returnValue = selection[0].value;
      selector.hide();
    }
  });

  selector.show();

  return new Promise(resolve => {
    const hideListener = selector.onDidHide(() => {
      // Clean up event listeners to avoid memory leaks
      selectionListener.dispose();
      hideListener.dispose();
      selector.dispose();

      resolve(returnValue);
    });
  });
};

/**
 * Displays a QuickPick with Dashicons and buttons to view each Dashicon.
 * @returns {Promise<string | undefined>} - The selected Dashicon value.
 */
const selectDashicon = async (title, placeholder = false) => {
  const themeKind = vscode.window.activeColorTheme.kind;
  
  let iconTheme = 'dark';

  switch (themeKind) {
    case vscode.ColorThemeKind.Dark:
      iconTheme = 'light';
      break;
    case vscode.ColorThemeKind.Light:
      iconTheme = 'dark';
      break;
  }

  const dashicons = [
      {
          label: "Admin Appearance",
          value: "dashicons-admin-appearance",
          iconPath: fileUtil.getAsset('admin-appearance.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Comments",
          value: "dashicons-admin-comments",
          iconPath: fileUtil.getAsset('admin-comments.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Generic",
          value: "dashicons-admin-generic",
          iconPath: fileUtil.getAsset('admin-generic.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Home",
          value: "dashicons-admin-home",
          iconPath: fileUtil.getAsset('admin-home.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Links",
          value: "dashicons-admin-links",
          iconPath: fileUtil.getAsset('admin-links.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Media",
          value: "dashicons-admin-media",
          iconPath: fileUtil.getAsset('admin-media.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Page",
          value: "dashicons-admin-page",
          iconPath: fileUtil.getAsset('admin-page.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Plugins",
          value: "dashicons-admin-plugins",
          iconPath: fileUtil.getAsset('admin-plugins.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Post",
          value: "dashicons-admin-post",
          iconPath: fileUtil.getAsset('admin-post.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Settings",
          value: "dashicons-admin-settings",
          iconPath: fileUtil.getAsset('admin-settings.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Site",
          value: "dashicons-admin-site",
          iconPath: fileUtil.getAsset('admin-site.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Site Alt",
          value: "dashicons-admin-site-alt",
          iconPath: fileUtil.getAsset('admin-site-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Site Alt 2",
          value: "dashicons-admin-site-alt2",
          iconPath: fileUtil.getAsset('admin-site-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Site Alt 3",
          value: "dashicons-admin-site-alt3",
          iconPath: fileUtil.getAsset('admin-site-alt3.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Tools",
          value: "dashicons-admin-tools",
          iconPath: fileUtil.getAsset('admin-tools.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Admin Users",
          value: "dashicons-admin-users",
          iconPath: fileUtil.getAsset('admin-users.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Archive",
          value: "dashicons-archive",
          iconPath: fileUtil.getAsset('archive.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Down",
          value: "dashicons-arrow-down",
          iconPath: fileUtil.getAsset('arrow-down.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Down Alt",
          value: "dashicons-arrow-down-alt",
          iconPath: fileUtil.getAsset('arrow-down-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Down Alt2",
          value: "dashicons-arrow-down-alt2",
          iconPath: fileUtil.getAsset('arrow-down-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Left",
          value: "dashicons-arrow-left",
          iconPath: fileUtil.getAsset('arrow-left.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Left Alt",
          value: "dashicons-arrow-left-alt",
          iconPath: fileUtil.getAsset('arrow-left-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Left Alt2",
          value: "dashicons-arrow-left-alt2",
          iconPath: fileUtil.getAsset('arrow-left-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Right",
          value: "dashicons-arrow-right",
          iconPath: fileUtil.getAsset('arrow-right.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Right Alt",
          value: "dashicons-arrow-right-alt",
          iconPath: fileUtil.getAsset('arrow-right-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Right Alt2",
          value: "dashicons-arrow-right-alt2",
          iconPath: fileUtil.getAsset('arrow-right-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Up",
          value: "dashicons-arrow-up",
          iconPath: fileUtil.getAsset('arrow-up.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Up Alt",
          value: "dashicons-arrow-up-alt",
          iconPath: fileUtil.getAsset('arrow-up-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Arrow Up Alt2",
          value: "dashicons-arrow-up-alt2",
          iconPath: fileUtil.getAsset('arrow-up-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Art",
          value: "dashicons-art",
          iconPath: fileUtil.getAsset('art.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Awards",
          value: "dashicons-awards",
          iconPath: fileUtil.getAsset('awards.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Backup",
          value: "dashicons-backup",
          iconPath: fileUtil.getAsset('backup.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Bank",
          value: "dashicons-bank",
          iconPath: fileUtil.getAsset('bank.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Book",
          value: "dashicons-book",
          iconPath: fileUtil.getAsset('book.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Activity",
          value: "dashicons-buddicons-activity",
          iconPath: fileUtil.getAsset('buddicons-activity.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons BBPress Logo",
          value: "dashicons-buddicons-bbpress-logo",
          iconPath: fileUtil.getAsset('buddicons-bbpress-logo.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Buddypress Logo",
          value: "dashicons-buddicons-buddypress-logo",
          iconPath: fileUtil.getAsset('buddicons-buddypress-logo.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Community",
          value: "dashicons-buddicons-community",
          iconPath: fileUtil.getAsset('buddicons-community.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Friends",
          value: "dashicons-buddicons-friends",
          iconPath: fileUtil.getAsset('buddicons-friends.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Groups",
          value: "dashicons-buddicons-groups",
          iconPath: fileUtil.getAsset('buddicons-groups.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons PM",
          value: "dashicons-buddicons-pm",
          iconPath: fileUtil.getAsset('buddicons-pm.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Topics",
          value: "dashicons-buddicons-topics",
          iconPath: fileUtil.getAsset('buddicons-topics.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Buddicons Tracking",
          value: "dashicons-buddicons-tracking",
          iconPath: fileUtil.getAsset('buddicons-tracking.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Businessman",
          value: "dashicons-businessman",
          iconPath: fileUtil.getAsset('businessman.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Calendar",
          value: "dashicons-calendar",
          iconPath: fileUtil.getAsset('calendar.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Camera",
          value: "dashicons-camera",
          iconPath: fileUtil.getAsset('camera.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Car",
          value: "dashicons-car",
          iconPath: fileUtil.getAsset('car.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Cart",
          value: "dashicons-cart",
          iconPath: fileUtil.getAsset('cart.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Category",
          value: "dashicons-category",
          iconPath: fileUtil.getAsset('category.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Chart Area",
          value: "dashicons-chart-area",
          iconPath: fileUtil.getAsset('chart-area.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Chart Bar",
          value: "dashicons-chart-bar",
          iconPath: fileUtil.getAsset('chart-bar.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Chart Line",
          value: "dashicons-chart-line",
          iconPath: fileUtil.getAsset('chart-line.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Chart Pie",
          value: "dashicons-chart-pie",
          iconPath: fileUtil.getAsset('chart-pie.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Clipboard",
          value: "dashicons-clipboard",
          iconPath: fileUtil.getAsset('clipboard.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Clock",
          value: "dashicons-clock",
          iconPath: fileUtil.getAsset('clock.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Cloud",
          value: "dashicons-cloud",
          iconPath: fileUtil.getAsset('cloud.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Back",
          value: "dashicons-controls-back",
          iconPath: fileUtil.getAsset('controls-back.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Forward",
          value: "dashicons-controls-forward",
          iconPath: fileUtil.getAsset('controls-forward.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Pause",
          value: "dashicons-controls-pause",
          iconPath: fileUtil.getAsset('controls-pause.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Play",
          value: "dashicons-controls-play",
          iconPath: fileUtil.getAsset('controls-play.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Repeat",
          value: "dashicons-controls-repeat",
          iconPath: fileUtil.getAsset('controls-repeat.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Skip Back",
          value: "dashicons-controls-skipback",
          iconPath: fileUtil.getAsset('controls-skipback.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Controls Skip Forward",
          value: "dashicons-controls-skipforward",
          iconPath: fileUtil.getAsset('controls-skipforward.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Dashboard",
          value: "dashicons-dashboard",
          iconPath: fileUtil.getAsset('dashboard.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Desktop",
          value: "dashicons-desktop",
          iconPath: fileUtil.getAsset('desktop.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Dismiss",
          value: "dashicons-dismiss",
          iconPath: fileUtil.getAsset('dismiss.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Download",
          value: "dashicons-download",
          iconPath: fileUtil.getAsset('download.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Edit",
          value: "dashicons-edit",
          iconPath: fileUtil.getAsset('edit.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "External",
          value: "dashicons-external",
          iconPath: fileUtil.getAsset('external.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Facebook",
          value: "dashicons-facebook",
          iconPath: fileUtil.getAsset('facebook.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Feedback",
          value: "dashicons-feedback",
          iconPath: fileUtil.getAsset('feedback.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Filter",
          value: "dashicons-filter",
          iconPath: fileUtil.getAsset('filter.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Flag",
          value: "dashicons-flag",
          iconPath: fileUtil.getAsset('flag.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Aside",
          value: "dashicons-format-aside",
          iconPath: fileUtil.getAsset('format-aside.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Audio",
          value: "dashicons-format-audio",
          iconPath: fileUtil.getAsset('format-audio.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Chat",
          value: "dashicons-format-chat",
          iconPath: fileUtil.getAsset('format-chat.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Gallery",
          value: "dashicons-format-gallery",
          iconPath: fileUtil.getAsset('format-gallery.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Image",
          value: "dashicons-format-image",
          iconPath: fileUtil.getAsset('format-image.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Quote",
          value: "dashicons-format-quote",
          iconPath: fileUtil.getAsset('format-quote.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Status",
          value: "dashicons-format-status",
          iconPath: fileUtil.getAsset('format-status.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Format Video",
          value: "dashicons-format-video",
          iconPath: fileUtil.getAsset('format-video.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Forms",
          value: "dashicons-forms",
          iconPath: fileUtil.getAsset('forms.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Google",
          value: "dashicons-google",
          iconPath: fileUtil.getAsset('google.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Groups",
          value: "dashicons-groups",
          iconPath: fileUtil.getAsset('groups.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Hammer",
          value: "dashicons-hammer",
          iconPath: fileUtil.getAsset('hammer.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Heart",
          value: "dashicons-heart",
          iconPath: fileUtil.getAsset('heart.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "ID",
          value: "dashicons-id",
          iconPath: fileUtil.getAsset('id.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Image Crop",
          value: "dashicons-image-crop",
          iconPath: fileUtil.getAsset('image-crop.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Image Filter",
          value: "dashicons-image-filter",
          iconPath: fileUtil.getAsset('image-filter.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Image Rotate",
          value: "dashicons-image-rotate",
          iconPath: fileUtil.getAsset('image-rotate.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Info",
          value: "dashicons-info",
          iconPath: fileUtil.getAsset('info.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Insert",
          value: "dashicons-insert",
          iconPath: fileUtil.getAsset('insert.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Location",
          value: "dashicons-location",
          iconPath: fileUtil.getAsset('location.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Lock",
          value: "dashicons-lock",
          iconPath: fileUtil.getAsset('lock.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Archive",
          value: "dashicons-media-archive",
          iconPath: fileUtil.getAsset('media-archive.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Audio",
          value: "dashicons-media-audio",
          iconPath: fileUtil.getAsset('media-audio.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Code",
          value: "dashicons-media-code",
          iconPath: fileUtil.getAsset('media-code.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Default",
          value: "dashicons-media-default",
          iconPath: fileUtil.getAsset('media-default.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Document",
          value: "dashicons-media-document",
          iconPath: fileUtil.getAsset('media-document.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Interactive",
          value: "dashicons-media-interactive",
          iconPath: fileUtil.getAsset('media-interactive.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Spreadsheet",
          value: "dashicons-media-spreadsheet",
          iconPath: fileUtil.getAsset('media-spreadsheet.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Text",
          value: "dashicons-media-text",
          iconPath: fileUtil.getAsset('media-text.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Media Video",
          value: "dashicons-media-video",
          iconPath: fileUtil.getAsset('media-video.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Megaphone",
          value: "dashicons-megaphone",
          iconPath: fileUtil.getAsset('megaphone.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Microphone",
          value: "dashicons-microphone",
          iconPath: fileUtil.getAsset('microphone.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Networking",
          value: "dashicons-networking",
          iconPath: fileUtil.getAsset('networking.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "No",
          value: "dashicons-no",
          iconPath: fileUtil.getAsset('no.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "No Alt",
          value: "dashicons-no-alt",
          iconPath: fileUtil.getAsset('no-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Open Folder",
          value: "dashicons-open-folder",
          iconPath: fileUtil.getAsset('open-folder.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Palmtree",
          value: "dashicons-palmtree",
          iconPath: fileUtil.getAsset('palmtree.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Performance",
          value: "dashicons-performance",
          iconPath: fileUtil.getAsset('performance.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Plugins Checked",
          value: "dashicons-plugins-checked",
          iconPath: fileUtil.getAsset('plugins-checked.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Plus",
          value: "dashicons-plus",
          iconPath: fileUtil.getAsset('plus.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Pressthis",
          value: "dashicons-pressthis",
          iconPath: fileUtil.getAsset('pressthis.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Products",
          value: "dashicons-products",
          iconPath: fileUtil.getAsset('products.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Randomize",
          value: "dashicons-randomize",
          iconPath: fileUtil.getAsset('randomize.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Redo",
          value: "dashicons-redo",
          iconPath: fileUtil.getAsset('redo.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "RSS",
          value: "dashicons-rss",
          iconPath: fileUtil.getAsset('rss.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Saved",
          value: "dashicons-saved",
          iconPath: fileUtil.getAsset('saved.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Search",
          value: "dashicons-search",
          iconPath: fileUtil.getAsset('search.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Share",
          value: "dashicons-share",
          iconPath: fileUtil.getAsset('share.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Share Alt",
          value: "dashicons-share-alt",
          iconPath: fileUtil.getAsset('share-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Share Alt2",
          value: "dashicons-share-alt2",
          iconPath: fileUtil.getAsset('share-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Shield",
          value: "dashicons-shield",
          iconPath: fileUtil.getAsset('shield.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Slides",
          value: "dashicons-slides",
          iconPath: fileUtil.getAsset('slides.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Smartphone",
          value: "dashicons-smartphone",
          iconPath: fileUtil.getAsset('smartphone.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Smiley",
          value: "dashicons-smiley",
          iconPath: fileUtil.getAsset('smiley.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Sort",
          value: "dashicons-sort",
          iconPath: fileUtil.getAsset('sort.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Spotify",
          value: "dashicons-spotify",
          iconPath: fileUtil.getAsset('spotify.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Star Empty",
          value: "dashicons-star-empty",
          iconPath: fileUtil.getAsset('star-empty.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Star Filled",
          value: "dashicons-star-filled",
          iconPath: fileUtil.getAsset('star-filled.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Star Half",
          value: "dashicons-star-half",
          iconPath: fileUtil.getAsset('star-half.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Sticky",
          value: "dashicons-sticky",
          iconPath: fileUtil.getAsset('sticky.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Store",
          value: "dashicons-store",
          iconPath: fileUtil.getAsset('store.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Tablet",
          value: "dashicons-tablet",
          iconPath: fileUtil.getAsset('tablet.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Tag",
          value: "dashicons-tag",
          iconPath: fileUtil.getAsset('tag.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Tagcloud",
          value: "dashicons-tagcloud",
          iconPath: fileUtil.getAsset('tagcloud.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Testimonial",
          value: "dashicons-testimonial",
          iconPath: fileUtil.getAsset('testimonial.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Text",
          value: "dashicons-text",
          iconPath: fileUtil.getAsset('text.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Thumbs Down",
          value: "dashicons-thumbs-down",
          iconPath: fileUtil.getAsset('thumbs-down.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Thumbs Up",
          value: "dashicons-thumbs-up",
          iconPath: fileUtil.getAsset('thumbs-up.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Tickets",
          value: "dashicons-tickets",
          iconPath: fileUtil.getAsset('tickets.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Translation",
          value: "dashicons-translation",
          iconPath: fileUtil.getAsset('translation.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Trash",
          value: "dashicons-trash",
          iconPath: fileUtil.getAsset('trash.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Twitter",
          value: "dashicons-twitter",
          iconPath: fileUtil.getAsset('twitter.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Undo",
          value: "dashicons-undo",
          iconPath: fileUtil.getAsset('undo.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Universal Access",
          value: "dashicons-universal-access",
          iconPath: fileUtil.getAsset('universal-access.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Universal Access Alt",
          value: "dashicons-universal-access-alt",
          iconPath: fileUtil.getAsset('universal-access-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Update",
          value: "dashicons-update",
          iconPath: fileUtil.getAsset('update.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Upload",
          value: "dashicons-upload",
          iconPath: fileUtil.getAsset('upload.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Vault",
          value: "dashicons-vault",
          iconPath: fileUtil.getAsset('vault.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Video Alt",
          value: "dashicons-video-alt",
          iconPath: fileUtil.getAsset('video-alt.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Video Alt2",
          value: "dashicons-video-alt2",
          iconPath: fileUtil.getAsset('video-alt2.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Video Alt3",
          value: "dashicons-video-alt3",
          iconPath: fileUtil.getAsset('video-alt3.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Visibility",
          value: "dashicons-visibility",
          iconPath: fileUtil.getAsset('visibility.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Warning",
          value: "dashicons-warning",
          iconPath: fileUtil.getAsset('warning.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Welcome Add Page",
          value: "dashicons-welcome-add-page",
          iconPath: fileUtil.getAsset('welcome-add-page.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Welcome Comments",
          value: "dashicons-welcome-comments",
          iconPath: fileUtil.getAsset('welcome-comments.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Welcome Learn More",
          value: "dashicons-welcome-learn-more",
          iconPath: fileUtil.getAsset('welcome-learn-more.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Welcome View Site",
          value: "dashicons-welcome-view-site",
          iconPath: fileUtil.getAsset('welcome-view-site.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Welcome Write Blog",
          value: "dashicons-welcome-write-blog",
          iconPath: fileUtil.getAsset('welcome-write-blog.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Wordpress",
          value: "dashicons-wordpress",
          iconPath: fileUtil.getAsset('wordpress.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Yes",
          value: "dashicons-yes",
          iconPath: fileUtil.getAsset('yes.svg',`images/dashicons/${iconTheme}`)
      },
      {
          label: "Yes Alt",
          value: "dashicons-yes-alt",
          iconPath: fileUtil.getAsset('yes-alt.svg',`images/dashicons/${iconTheme}`)
      }
  ];

  const choice = await advPickOne(dashicons, title, placeholder);

  return choice;
}

const selectAsset = async (folderPath, getAssetPath, title, placeholder = false) => {
  let files = fileUtil.getFiles(folderPath);

  if (!files || !files.length) {
      return errorMessage(`No files found in ${folderPath}`);
  }

  files = files.filter(file => fileUtil.isImage(file));

  if (!files || !files.length) {
      return errorMessage(`No image files found in ${folderPath}`);
  }

  const options = files.map(file => {
      const filePath = path.join(`${folderPath}/${file}`)
      return {
          label: file,
          value: `get_asset('${file}', '${getAssetPath}')`,
          description: filePath,
          iconPath: filePath
      };
  });

  const choice = await advPickOne(options, title, placeholder);

  return choice;
}

module.exports = {
  pickOne,
  advPickOne,
  pickMany,
  input,
  form,
  notification,
  confirm,
  errorMessage,
  fileCreated,
  fileUpdated,
  openUrlInBrowser,
  selectDashicon,
  selectAsset
}