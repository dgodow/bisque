/*
 * ===============================
 * Rebuild and sync external files
 * ===============================
 */

var fileSystem = require("fs-extra"),
    path = require("path");

// clean de dist folder
fileSystem.emptyDirSync(path.join(__dirname, "../build"));

fileSystem.copySync(path.join(__dirname, "../src/images"), path.join(__dirname, "../build/images"))
fileSystem.copySync(path.join(__dirname, "../src/js/controllers/keyLogger.js"), path.join(__dirname, "../build/keyLogger.js"))


/*
 * =================
 * Generate manifest
 * =================
 */

var manifest = require("../src/manifest.json"),
    fileSystem = require("fs"),
    path = require("path"),
    env = require("./env");

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;

manifest.oauth2.client_id = '75953039302-cavl7cquucb1j4cfsga2fv4bv3kqq2h6.apps.googleusercontent.com';

fileSystem.writeFileSync(
  path.join(__dirname, "../build/manifest.json"),
  JSON.stringify(manifest)
);
