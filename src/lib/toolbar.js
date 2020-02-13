const PSPDFKit = require("pspdfkit");

/**
 * Prepares the toolbar for our PDF viewer. This will add two additional buttons to import and
 * export PDF files.
 * This will also enable the `layout-config` toolbar module.
 */
module.exports = function makeToolbarItems(exportFile, importFile) {
  const toolbarItems = PSPDFKit.defaultToolbarItems;

  const pagerIndex = toolbarItems.findIndex(item => item.type == "pager");
  toolbarItems.splice(pagerIndex + 1, 0, { type: "layout-config" });

  toolbarItems.push({
    type: "custom",
    title: "Open",
    id: "import-button",
    icon: "../icons/import.svg",
    onPress: importFile
  });

  toolbarItems.push({
    type: "custom",
    title: "Save",
    id: "export-button",
    icon: "../icons/export.svg",
    onPress: exportFile
  });

  return toolbarItems;
};
