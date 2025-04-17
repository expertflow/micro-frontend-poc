const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'mfe1',
  filename: 'remoteEntry.js',
  exposes: {
    './OrderModule': './src/app/order/order.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, eager: true, requiredVersion: 'auto' }),
  },

});
