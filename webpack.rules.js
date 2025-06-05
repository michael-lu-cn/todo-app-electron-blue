module.exports = [
  // 添加对TypeScript的支持
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  // 添加对Node原生模块的支持
  {
    test: /\.node$/,
    use: 'node-loader',
  },
];