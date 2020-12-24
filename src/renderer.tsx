import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const App: React.FC = () => {
  const [state, setState] = useState('');

  useEffect(() => {
    // Window オブジェクトが `ipcRenderer` を持っている
    // ping! を送信（初回のみ）
    window.ipcRenderer.send('async-message', 'Ping!');
  }, []);

  useEffect(() => {
    // メインプロセスからの返信を受信
    window.ipcRenderer.on('async-reply', (_e, arg) => {
      // pong!
      setState(arg);
    });

    // クリーンアップ処理でイベントリスナーを除去し
    // メモリリークをふせぐ
    return (): void => {
      window.ipcRenderer.removeAllListeners('async-reply');
    };
  }, []);

  return <div>{state}</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));