import { BrowserWindow, app, ipcMain } from 'electron';
import loadDevtool from 'electron-load-devtool';

import path from 'path';

/**
 * Preload スクリプトの所在するディレクトリを取得
 *
 * 開発時には webpack の出力先を指定し、
 * electron-builder によるパッケージ後には 'asarUnpack' オプションに
 * 設定したディレクトリを返す
 */
const getResourceDirectory = () => {
  return process.env.NODE_ENV === 'development'
    ? path.join(process.cwd(), 'dist')
    : path.join(process.resourcesPath, 'app.asar.unpacked', 'dist');
};

/**
 * BrowserWindowインスタンスを作成する関数
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      /**
       * BrowserWindowインスタンス（レンダラープロセス）では
       * Node.jsの機能を無効化する（デフォルト）
       */
      nodeIntegration: false,
      contextIsolation: false,
      /**
       * Preloadスクリプトは絶対パスで指定する
       */
      preload: path.resolve(getResourceDirectory(), 'preload.js'),
    },
  });

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');

  // 開発時にはデベロッパーツールを開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });

    // React Developer Tools をロードする
    loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
  }
  ipcMain.on('async-message', (e, arg) => {
    // 受信 ping!
    console.log(arg);

    // 返信 pong!
    e.reply('async-reply', 'pong!');
  });
};

/**
 * アプリが起動したら BrowserWindow インスタンスを作成し、
 * レンダラープロセス（index.htmlとそこから呼ばれるスクリプト）を
 * ロードする
 */
app.whenReady().then(createWindow);

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());