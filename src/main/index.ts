/// <reference path="../../node_modules/.pnpm/electron@27.3.11/node_modules/electron/electron.d.ts" />
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { IPC_CHANNELS } from '../shared/constants/ipc-channels';
import { setupTodoHandlers } from './handlers/todo-handlers';
import { setupTodoListHandlers } from './handlers/todo-list-handlers';
import { setupCategoryHandlers } from './handlers/category-handlers';
import { setupUserPreferencesHandlers } from './handlers/user-preferences-handlers';

// 声明Electron Forge提供的环境变量
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// 声明Node.js全局变量
declare const process: NodeJS.Process;
declare const __dirname: string;

// 禁用Electron安全警告
// 在生产环境中应移除此行
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// 处理安装程序事件
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 保持对窗口对象的全局引用，避免JavaScript对象被垃圾回收时窗口关闭
let mainWindow: BrowserWindow | null = null;

// 添加macOS特定兼容性处理
if (process.platform === 'darwin') {
  // 处理macOS的窗口全部关闭事件 - 在macOS上应用通常保持活跃状态
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// 创建主窗口
function createWindow() {
  console.log('创建窗口...');
  console.log('isDev:', isDev);
  console.log('MAIN_WINDOW_WEBPACK_ENTRY:', MAIN_WINDOW_WEBPACK_ENTRY);
  console.log('MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY:', MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false, // 先不显示窗口
    backgroundColor: '#ffffff', // 设置背景色，减少白屏时间
  });

  // 当窗口准备好后再显示，减少闪烁
  mainWindow?.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  // 加载应用的index.html
  // 在生产环境使用文件协议，在开发环境使用开发服务器
  if (isDev) {
    // 使用MAIN_WINDOW_WEBPACK_ENTRY环境变量，这是Electron Forge提供的
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }

  // 当窗口关闭时取消引用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow();

  // 设置IPC处理程序
  setupTodoHandlers();
  setupTodoListHandlers();
  setupCategoryHandlers();
  setupUserPreferencesHandlers();

  app.on('activate', () => {
    // 在macOS上，当点击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (mainWindow === null) {
      createWindow();
    }
  });
});

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  // 在macOS上，除非用户用Cmd + Q确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在这个文件中，你可以包含应用程序剩余的特定于主进程的代码。
// 你也可以把它们放在单独的文件中，然后在这里导入。