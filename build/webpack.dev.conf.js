var utils = require('./utils')
var glob = require('glob')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var jetpack = require('fs-jetpack')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var htmlXXXInject = require('../config-utils/html-xxx-inject');

function getEntry(globPath){
    var entries = {},basename, tmp, pathname;
    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[pathname] = entry;
    });

  return entries;
}

var pages = getEntry('./src/modules/**/*.html');
var header_metadata = jetpack.read(path.resolve(__dirname, '../src/common_html/header_metadata.html'));

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

//公用css添加到webpack hot middleware
glob.sync('./src/common_css/*.less').forEach(function (v, k){
    baseWebpackConfig.entry[path.basename(v)] = v;
});

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'idea.html',
    //   template: 'idea.html',
    //   inject: true
    // }),

    new FriendlyErrorsPlugin()
  ]
})

for (var pathname in pages) {
  // console.log("filename:" + pathname + '.html');
  // 配置生成的html文件，定义路径等
  (function (path){

    var conf = {
      filename: path + '.html',
      templateContent: function (templateParams, compilation){
        var tc = jetpack.read( pages[path]);
        tc = htmlXXXInject.headMetaDataInject(tc, header_metadata);
        return tc;
      },
      inject: true,              // js插入位置
      chunksSortMode: 'dependency'
    };
    // console.log(pathname)
    // console.log(module.exports.entry)
    // console.log('~~~~~~~~~~~~~~')
    if (pathname in module.exports.entry) {
      // console.log(pathname, module.exports.entry)
      conf.chunks = [path];
      conf.hash = true;
    }

    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
  })(pathname)
}