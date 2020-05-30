import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { LoginContext } from '../context/LoginContext';

const LoginPage = ({ history }) => {
  const {
    getLoggedUser,
    toggleActiveUser,
    toggleIsLogged,
    isLogged,
  } = useContext(LoginContext);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (isLogged) {
      history.push('/');
    }

    if (token) {
      getLoggedUser(token);
    } else {
      toggleActiveUser({});
      toggleIsLogged(false);
    }
    // eslint-disable-next-line
  }, [isLogged]);

  return (
    <div id='login-page'>
      <LoginForm />
    </div>
  );
};

export default withRouter(LoginPage);
