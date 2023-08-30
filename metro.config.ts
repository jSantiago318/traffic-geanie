const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);
// transformer: {
//     assetPlugins: ['expo-asset/tools/hashAssetFiles'],
//   },
// config.resolver.assetExts.push("hcscript");
// config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

module.exports = config;
