## TODO

- images cache

## loader

### css and sass

- style-loader: inserts css styles into heads on html pages
  - recommended for dev, not prod. alternatively, use mini-css-extract-plugin
- css-loader: interpret @import and url(), change them to require() to resolve them

prod: css-loader => mini-css-extract-plugin
dev: css-loader => style-loader

- postcss-loader: prefix, minimize

cssnano: optimize css size => CssMinimizerWebpackPlugin
PurgeCSS: delete unused styles

### assets

src/img, fonts => resize => dist/img, fonts

use imagemin

### sourcemap

- dev:
- prod:

### chunk

multiple-js
entry

chunk-name: path

```js
entry: {
    index: './src/index.js',
    about: './src/about.js',
}
```

HtmlWebpackPlugin
chunks:['index', 'about']

- [https://github.com/ivarprudnikov/webpack-static-html-pages ivarprudnikov/webpack-static-html-pages: Webpack template/example with multiple static html pages]
