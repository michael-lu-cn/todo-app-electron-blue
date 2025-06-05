module.exports = {
  /**
   * 这是主进程的webpack配置文件
   */
  entry: './src/main/index.ts',
  // 将TypeScript作为模块解析
  module: {
    rules: [
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
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@': require('path').resolve(__dirname, 'src'),
      '@main': require('path').resolve(__dirname, 'src/main'),
      '@renderer': require('path').resolve(__dirname, 'src/renderer'),
      '@shared': require('path').resolve(__dirname, 'src/shared'),
    },
  },
};