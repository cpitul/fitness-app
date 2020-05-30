import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import App from './App';
import { LoginState } from './context/LoginContext';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <LoginState>
      <BrowserRouter>
        <Switch>
          <App />
        </Switch>
      </BrowserRouter>
    </LoginState>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
