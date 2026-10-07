const path = require('path');
const base = require('@flarum/jest-config')();

// For standalone/workbench extensions, @flarum/core source isn't available
// as an npm package. Map flarum/* imports to vendor instead, and use our own
// copy of setup-env that does the same.
const coreJs = path.resolve(__dirname, '../vendor/flarum/core/js');

module.exports = {
  ...base,
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/setup-env.js')],
  // Core's source is compiled from vendor/, outside this package, so its own
  // imports (clsx, focus-trap, ...) have to resolve back to node_modules here.
  modulePaths: [path.resolve(__dirname, 'node_modules')],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^flarum/(.*)$': coreJs + '/src/$1',
  },
  // Ensure vendor/ TS files are transformed. @flarum/jest-config ships its
  // matchers as TypeScript, so it has to be transformed too.
  transformIgnorePatterns: ['/node_modules/(?!@flarum/jest-config/)'],
};
