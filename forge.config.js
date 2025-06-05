module.exports = {
  packagerConfig: {
    asar: true,
    // 仅支持Mac平台
    platform: ['darwin'],
    arch: ['x64', 'arm64'],
    // 添加macOS版本兼容性设置
    osxUniversal: {
      x64ArchFiles: "x64/**/*",
      arm64ArchFiles: "arm64/**/*"
    },
    darwinDarkModeSupport: true,
    // 设置最低macOS版本为12.0 (Monterey)
    extraResource: [],
    appBundleId: "com.simple-electron-todo",
    appCategoryType: "public.app-category.productivity",
    extendInfo: {
      "LSMinimumSystemVersion": "12.0.0",
      "NSHumanReadableCopyright": "Copyright © 2023 SimpleElectronTodo Team",
      "CFBundleVersion": "1.0.7",
      "CFBundleDisplayName": "Simple Electron Todo",
      "NSAppTransportSecurity": {
        "NSAllowsArbitraryLoads": false
      },
      "NSRequiresAquaSystemAppearance": false
    }
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