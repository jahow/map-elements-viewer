const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: path.resolve(__dirname, "src", "app.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
