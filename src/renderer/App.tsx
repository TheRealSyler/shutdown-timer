import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { ThemeManager } from 's.theme';
import { Theme } from './utility/utility.theme';
import Home from './views/home/Home';
import Schedule from './views/schedule/Schedule';

import './App.sass';

export const AppTheme = new ThemeManager<Theme, { dark: Theme; light: Theme }>(
  {
    dark: {
      colors: {
        background: '#12121a',
        color: '#eee',
        disabled: '#777',
        primary: '#255',
        secondary: '#1a1a1f'
      },
      fonts: {
        main: 'sans-serif'
      },
      defaults: {
        color: 'color',
        selectors: ['body', 'button', 'input'],
        background: 'background',
        font: 'main'
      }
    },
    light: {
      colors: {
        background: '#ddd',
        color: '#000',
        disabled: '#666',
        primary: '#6af',
        secondary: '#fff'
      },
      fonts: {
        main: 'sans-serif'
      },
      defaults: {
        color: 'color',
        selectors: ['body', 'button', 'input'],
        background: 'background',
        font: 'main'
      }
    }
  },
    'dark'
);
// AppTheme.SetTheme('light');
// AppTheme.Update();
const App = () => {
  return (
        <div className="app">
            <Home />
            <Schedule />
        </div>
  );
};

export default hot(App);
