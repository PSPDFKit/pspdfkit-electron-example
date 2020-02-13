const { dialog } = require("electron");
const LICENSE_KEY = require("./license-key");

// We verify that the PSPDFKit dependency was correctly added.
try {
  // This will throw when `pspdfkit` is not installed.
  require("pspdfkit");
} catch (error) {
  if (error.message == "Cannot find module 'pspdfkit'") {
    dialog.showErrorBox(
      "Missing PSPDFKit Dependency",
      `In order to start the PSPDFKit for Electron example app, you'll need to install PSPDFKit via npm.

If you are using an evaluation license you can find the npm URL at:

https://pspdfkit.com/guides/web/current/electron/example-project

Otherwise you can find the npm URL in our the customer portal:

https://customers.pspdfkit.com`
    );
    process.exit(1);
  }
}

// And we verify that the license key was correctly set.
if (LICENSE_KEY === "") {
  dialog.showErrorBox(
    "Missing PSPDFKit License Key",
    `Invalid or missing license key. Please save your PSPDFKit license key to:

./config/license-key

If you are using an evaluation license you can find the license key at:

https://pspdfkit.com/guides/web/current/electron/example-project

Otherwise you can find your license key in our the customers portal:

https://customers.pspdfkit.com`
  );
  process.exit(1);
}
