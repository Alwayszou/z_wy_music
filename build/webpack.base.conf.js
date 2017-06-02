var path = require('path')
var glob = require('glob')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var env = require("dotenvr").load()
var webpack = require('webpack')
var InsertGlobalCss = require('../config-utils/webpack-insert-global-css')
var entries = getEntry('./src/modules/**/*.js')


function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);

    if((tmp[1]+'.js')===tmp[2]){
      pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
      entries[pathname] = entry;
    }
  });
  // console.log("base-entrys:");
  // console.log(entries);
  return entries;
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: entries,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src')
        }
    },
    module: {
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')]
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }
        ]
    },
    //公共的module模版
    // common_modules: {
    //     header_metadata: path.resolve(__dirname, '../src/common_html/header_metadata.html')
    // },
    plugins: [
        new InsertGlobalCss(glob.sync('./src/common_css/*.less')),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"'+env.NODE_ENV+'"'
            }
        })
    ]
}
