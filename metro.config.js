const { getDefaultConfig } = require('@expo/metro-config');

// Initialize the default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Extend the resolver.sourceExts array to include 'cjs' file extensions
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
