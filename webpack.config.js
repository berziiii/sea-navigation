'use strict';

let webpack = require('webpack');
let path    = require('path');

module.exports = {
    entry: {
        bundle: __dirname + "/index.js"
    },
    output: {
        path: path.join(__dirname, "./"),
        filename: "bundle.js"
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ],
    module: {
      loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          },
          {
            test: /\.css/,
            loader:'style!css',
            includePaths: [path.resolve(__dirname, './node_modules')]
          },
          {
            test: /\.scss/,
            loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader',
            includePaths: [path.resolve(__dirname, './node_modules')]
          },
          {
            test: /\.woff[\d]?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
          },
          {
            test: /\.(hbs|handlebars)$/,
            loader: 'handlebars-loader',
            query: {
              helperDirs: [
                path.join(__dirname, '/../assets/scripts/templates/helpers')
              ]
            }
          }
        ]
    },
    resolve: {
        modulesDirectories: [
            "node_modules",
            "assets/scripts"
        ]
    },
};
