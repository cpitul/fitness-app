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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Log in
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Test if email and password are entered
    if (!email || !password) {
      setAlert(true);
      setTimeout(() => setAlert(false), 1500);
      return;
    }
    // Send email and password for loging in to the server
    try {
      const err = await handleLogin(user);
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
          onChange={handleChange}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          className='input-field'
          value={password}
          onChange={handleChange}
        />
        <input type='submit' className='btn' value='Log In' />
      </form>
    </div>
  );
};

export default LoginForm;
