/**
 * Create a document picker used to select PDF files.
 *
 * Will invoke `onPicked`, when the operation is complete.
 */
function documentImport(onPicked) {
  const { dialog } = require("electron").remote;

  // Show the native open dialog.
  const filePaths = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "PDF Documents", extensions: ["pdf"] }]
  });

  if (filePaths && filePaths.length > 0) {
    onPicked(filePaths[0]);
  }
}

/**
 * Use the native document picker to save the resulting PDF file of the given `PSPDFKit.Instance`.
 *
 * Will invoke `onDone`, when the operation is complete.
 */
function documentExport(instance, onDone) {
  const { dialog } = require("electron").remote;

  // Show the native save dialog.
  dialog.showSaveDialog(
    {
      title: "Export PDF",
      filters: [{ name: "PDF Documents", extensions: ["pdf"] }]
    },
    fileName => {
      if (!fileName) {
        return;
      }

      instance.exportPDF().then(arrayBuffer => {
        require("fs").writeFile(fileName, Buffer.from(arrayBuffer), error => {
          if (error) {
            alert(
              "There was an error while trying to write to " +
                fileName +
                "\n\n" +
                error.message
            );
          } else {
            onDone();
          }
        });
      });
    }
  );
}

function askUserToDiscardChanges(onYes) {
  const { dialog } = require("electron").remote;

  // Show the native message box.
  dialog.showMessageBox(
    {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Discard changes?",
      message:
        "You have unsaved changes. Do you wish to discard them and open a new document?"
    },
    response => {
      if (response === 0) {
        // User answered, yes.
        onYes();
      }
    }
  );
}

module.exports = {
  documentImport,
  documentExport,
  askUserToDiscardChanges
};
