import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import GlobalState from './context/GlobalContext';
import LoginState from './context/LoginContext';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <div className='App'>
      <GlobalState>
        <LoginState>
          <BrowserRouter>
            <Switch>
              <Route exact path='/login' component={LoginPage} />
              <PrivateRoute exact path='/' component={IndexPage} />
            </Switch>
          </BrowserRouter>
        </LoginState>
      </GlobalState>
    </div>
  );
};

export default App;
