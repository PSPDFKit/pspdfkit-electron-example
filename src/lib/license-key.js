/**
 * This file will load the license key from the file ./config/license-key.
 */

const fs = require("fs");
const path = require("path");

module.exports = fs
  .readFileSync(path.join(__dirname, "../../config/license-key"))
  .toString()
  .replace(/\s/g, "");
