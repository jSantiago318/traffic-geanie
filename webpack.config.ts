import { Arguments, Environment } from '@expo/webpack-config/webpack/types';

import createExpoWebpackConfigAsync from '@expo/webpack-config/webpack';

module.exports = async function (env: Environment, argv: Arguments) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  //millionjs
  

  
  
  return config;
};