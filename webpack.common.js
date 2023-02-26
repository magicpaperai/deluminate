const path = require("path");
const ejs = require('ejs');
const {version} = require('./package.json');

module.exports = {
  context: __dirname,
  entry: {
    index: './src/index.tsx',
    bootstrap: './src/bootstrap.tsx',
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    library: "deluminator",
    globalObject: 'this',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack'
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          {
            loader: "sass-loader" // Compiles Sass to CSS
          }
        ],
      },
    ]
  },
  mode: 'production',
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
};

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}
