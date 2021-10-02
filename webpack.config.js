const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const path = require("path");
const glob = require("glob");
const PATHS = {
  src: path.join(__dirname, "src"),
};

const generateHtmlList = () => {
  const htmlList = [];
  glob.sync("src/*.html").forEach((file) => {
    const filename = path.basename(file);
    const option = new HtmlWebpackPlugin({
      template: `./src/${filename}`,
      filename: filename,
      alwaysWriteToDisk: true,
    });
    htmlList.push(option);
  });
  return htmlList;
};

module.exports = (_, argv) => {
  const isDev = argv.mode === "development";
  const config = {
    entry: "./src/js/main.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "img/[name][ext][query]",
      clean: true,
    },
    devtool: "eval-source-map",
    devServer: {
      static: {
        directory: "dist",
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // useBuiltIns: 'usage',
                    useBuiltIns: false,
                    corejs: { version: "3", proposals: true },
                  },
                ],
              ],
              plugins: ["@babel/plugin-proposal-object-rest-spread"],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: isDev,
                url: {
                  filter: (url) => {
                    if (url.includes("webp")) {
                      return false;
                    }
                    return true;
                  },
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: isDev,
                postcssOptions: {
                  plugins: [["autoprefixer"]],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
        },
        {
          test: /\.html$/i,
          use: [
            {
              loader: "html-loader",
              options: {
                sources: {
                  urlFilter: (_, value) => {
                    if (value.includes("webp")) return false;
                    return true;
                  },
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      ...generateHtmlList(),
      new HtmlWebpackHarddiskPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/main.css",
      }),
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["mozjpeg", { quality: 65, progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      }),
      new ImageMinimizerPlugin({
        deleteOriginalAssets: false,
        filename: "img/[name].webp",
        minimizerOptions: {
          plugins: [["imagemin-webp", { quality: 50 }]],
        },
      }),
      new PurgecssPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      }),
    ],
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
    target: ["web", "browserslist"],
  };
  return config;
};
