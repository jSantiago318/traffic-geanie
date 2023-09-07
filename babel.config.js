const million = require('million/compiler');
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [ "babel-preset-million", "babel-preset-expo"] ,
    plugins: ["react-native-reanimated/plugin" , [
      "module:react-native-dotenv" ,{
        "moduleName": "@env",
        "path": ".env",
        "safe": false,
        "allowUndefined": true,
        "verbose": false,
        "allowlist": null,
      }
    ],
  ],

    
  };
};
