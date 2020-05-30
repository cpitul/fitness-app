import React, { useContext, useState } from 'react';
import Alert from '../components/Alert';
import { LoginContext } from '../context/LoginContext';

const LoginForm = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState(false);

  const { handleLogin } = useContext(LoginContext);

  const { email, password } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      setAlert(true);
      setTimeout(() => setAlert(false), 1500);
      return;
    }

    try {
      const err = await handleLogin(user.email, user.password);
      if (err) {
        setAlert(true);
        setTimeout(() => setAlert(false), 1500);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div id='login-container'>
      {alert && <Alert />}
      <form onSubmit={handleSubmit} id='login-form'>
        <label htmlFor='email'>Email</label>
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoFocus
          type='email'
          name='email'
          className='input-field'
          value={email}
          onChange={(e) => setUser({ email: e.target.value })}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          className='input-field'
          value={password}
          onChange={(e) => setUser({ password: e.target.value })}
        />
        <input type='submit' className='btn' value='Log In' />
      </form>
    </div>
  );
};

export default LoginForm;
