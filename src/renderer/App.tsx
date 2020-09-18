import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import Home from './views/home/Home';
import Schedule from './views/schedule/Schedule';
import { NativeImage, remote } from 'electron';

import './App.sass';

const App = () => {
  const win = remote.getCurrentWindow();

  return (
    <div className="app">
      <div className="title-bar">
        <button className="title-btn close-btn" onClick={() => win.close()} />
        <button className="title-btn min-btn" onClick={() => win.minimize()} />
      </div>

      <Home />
      <Schedule />
    </div>
  );
};

export default hot(App);
