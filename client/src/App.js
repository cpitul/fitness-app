import React, { useContext, useEffect } from 'react';
import './App.css';
import { LoginContext } from './context/LoginContext';
import LoginPage from './pages/LoginPage';

function App() {
  const {
    isLogged,
    getLoggedUser,
    toggleActiveUser,
    toggleIsLogged,
  } = useContext(LoginContext);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      getLoggedUser(token);
    } else {
      toggleActiveUser({});
      toggleIsLogged(false);
    }
  }, []);

  return (
    <div className='App'>{isLogged ? <h1>Is logged</h1> : <LoginPage />}</div>
  );
}

export default App;
