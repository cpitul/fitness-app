import axios from 'axios';
import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginState = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [activeUser, setActiveUser] = useState({});

  const toggleIsLogged = (bool) => setIsLogged(bool);

  const toggleActiveUser = (user) => setActiveUser(user);

  const getLoggedUser = async (token) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    };
    try {
      const user = await axios.get('/api/login', config);
      setActiveUser(user);
      setIsLogged(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLogin = async (user) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post('/api/login', user, config);

      setIsLogged(true);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      console.error(err.message);
      return err;
    }
  };

  return (
    <LoginContext.Provider
      value={{
        isLogged,
        activeUser,
        toggleIsLogged,
        toggleActiveUser,
        handleLogin,
        getLoggedUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
