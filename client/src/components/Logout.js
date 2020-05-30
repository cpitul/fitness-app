import React, { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';

const Logout = () => {
  const { handleLogout } = useContext(LoginContext);
  return (
    <input
      onClick={handleLogout}
      type='button'
      value='Log Out'
      className='btn'
    />
  );
};

export default Logout;
