import React, { useContext, useState } from 'react';
import Alert from '../components/Alert';
import { LoginContext } from '../context/LoginContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(false);

  const { handleLogin } = useContext(LoginContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert(true);
      setTimeout(() => setAlert(false), 1500);
      return;
    }

    try {
      const err = await handleLogin(email, password);
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          className='input-field'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type='submit' className='btn' value='Log In' />
      </form>
    </div>
  );
};

export default LoginForm;
