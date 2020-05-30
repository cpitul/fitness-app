import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLogged } = useContext(LoginContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLogged ? <Redirect to='/login' /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
