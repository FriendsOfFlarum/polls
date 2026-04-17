const path = require('path');
const base = require('@flarum/jest-config')();

// For standalone/workbench extensions, @flarum/core source isn't available
// as an npm package. Override setupFilesAfterEnv to skip the core-dependent
// setup-env, and map flarum/* imports to vendor.
const coreJs = path.resolve(__dirname, '../vendor/flarum/core/js');

module.exports = {
  ...base,
  // Skip the default setup-env.js which requires @flarum/core source
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^flarum/(.*)$': coreJs + '/src/$1',
  },
  // Ensure vendor/ TS files are transformed
  transformIgnorePatterns: ['/node_modules/', '!/vendor/'],
};
