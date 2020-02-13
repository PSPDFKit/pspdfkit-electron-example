// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const PSPDFKit = require("pspdfkit");

const {
  documentExport,
  documentImport,
  askUserToDiscardChanges
} = require("./lib/modals");
const dragAndDrop = require("./lib/drag-and-drop");
const makeToolbarItems = require("./lib/toolbar");
const LICENSE_KEY = require("./lib/license-key");

/**
 * We store the `PSPDFKit.Instance` in this variable so we can access it from
 * everywhere.
 */
let instance = null;

/**
 * Creates an onAnnotationsChange handler that keeps track of changes.
 *
 * We skip the first call since `annotations.change` fires when the PDF is
 * initialized and populated with annotations.
 */
let hasUnsavedAnnotations = false;
function createOnAnnotationsChange() {
  let initialized = false;
  return () => {
    if (initialized) {
      hasUnsavedAnnotations = true;
    } else {
      initialized = true;
    }
  };
}

/**
 * If there is an existing running instance of PSPDFKit, it is destroyed before
 * a creating a new one.
 *
 * This process will make sure that the WebAssembly module is optimally reused.
 */
async function load(pdf) {
  if (instance) {
    PSPDFKit.unload(instance);
    hasUnsavedAnnotations = false;
    instance = null;
  }

  // Create our custom toolbar
  const toolbarItems = makeToolbarItems(
    function exportFile() {
      documentExport(instance, () => (hasUnsavedAnnotations = false));
    },
    function importFile() {
      if (hasUnsavedAnnotations) {
        askUserToDiscardChanges(() => documentImport(load));
      } else {
        documentImport(load);
      }
    }
  );

  // Set up the configuration object. A custom style sheet is used to customize
  // the look and feel of PSPDFKit.
  const configuration = {
    pdf,
    licenseKey: LICENSE_KEY,
    container: "#root",
    styleSheets: ["./pspdfkit.css"]
  };

  instance = await PSPDFKit.load(configuration);

  instance.setToolbarItems(toolbarItems);
  instance.addEventListener("annotations.change", createOnAnnotationsChange());

  dragAndDrop(instance, file => {
    if (hasUnsavedAnnotations) {
      askUserToDiscardChanges(() => load(file));
    } else {
      load(file);
    }
  });
}

// Open a default document, when the app is started.
window.onload = () => load("../assets/example.pdf");
