const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "mfe1": "mfe1@http://localhost:4100/remoteEntry.js",    
  },

  shared: {
    ...shareAll({ singleton: true, requiredVersion: 'auto', eager: true, }),
  },

});
