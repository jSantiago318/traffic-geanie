import { Arguments, Environment } from '@expo/webpack-config/webpack/types';

import createExpoWebpackConfigAsync from '@expo/webpack-config/webpack';
import million from 'million/compiler'

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  //millionjs
  
// add plugin
// config.plugins.push(new MyWebpackPlugin())
config.plugins?.push( million.webpack({mode: 'react'}))
  
  return config;
};