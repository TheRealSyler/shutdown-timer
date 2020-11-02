import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import Home from './views/home/Home';
import Schedule from './views/schedule/Schedule';

import './App.sass';
import { TitleBar } from './titleBar';

const App = () => {
  return (
    <div className="app">
      <TitleBar />

      <Home />
      <Schedule />
    </div>
  );
};

export default hot(App);
