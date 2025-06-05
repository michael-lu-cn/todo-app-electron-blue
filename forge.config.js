module.exports = {
  packagerConfig: {
    asar: true,
    osxSign: {},
    // 仅支持Mac平台
    platform: ['darwin'],
    arch: ['x64', 'arm64'],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/index.tsx',
              name: 'main_window',
              preload: {
                js: './src/main/preload.ts',
              },
              port: 3000,
              nodeIntegration: false,
              contextIsolation: true,
            },
          ],
        },
        devServer: {
          liveReload: true,
          hot: true,
          historyApiFallback: true,
        },
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'; script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      },
    },
  ],
};