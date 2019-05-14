const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const srcPath = path.join(__dirname, 'src');
const extractCSS = new MiniCssExtractPlugin({
  filename: 'css/[name]-[hash].css'
});
const isProd = process.env.NODE_ENV === 'production';

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new HtmlWebpackPlugin({
    template: path.join(srcPath, 'index.html'),
    filename: isProd ? '../index.html' : 'index.html'
  }),
  extractCSS
];

if (isProd) {
  plugins = plugins.concat([new webpack.optimize.AggressiveMergingPlugin()]);
}

module.exports = {
  context: __dirname,
  entry: path.join(srcPath, 'index.jsx'),
  // devtool: 'source-map',
  output: {
    path: path.resolve('./public/static'),
    filename: 'js/[name]-[hash].js',
    sourceMapFilename: '[file].map',
    publicPath: isProd ? '/static/' : '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /node_modules/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: false,
              localIdentName: isProd
                ? '[local][hash:base64:10]'
                : '[name]__[local]-[hash:base64:5]'
            }
          },
          {
            loader: 'resolve-url-loader'
          },
        ],
        sideEffects: true
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: false,
              localIdentName: isProd
                  ? '[local][hash:base64:10]'
                  : '[name]__[local]-[hash:base64:5]'
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: false,
              includePaths: [`${srcPath}/`]
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({ browsers: ['Safari >= 8', 'last 3 versions'] })
              ]
            }
          },
        ],
        sideEffects: true
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|pdf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 256,
              name: 'img/[name]-[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 256,
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins,
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
    alias: {
      config: `${srcPath}/config`,
      components: `${srcPath}/components`,
      styles: `${srcPath}/styles`,
      utils: `${srcPath}/utils`
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    hot: true,
    inline: true,
    contentBase: srcPath,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        debug: true
      }
    }
  }
};
