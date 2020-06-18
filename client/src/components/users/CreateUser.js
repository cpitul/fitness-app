import Axios from 'axios';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CreateUser = ({ users }) => {
  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '123456',
    phone: '',
    now: new Date(),
    new_expire_date: new Date(),
    services: {
      type: '-',
      tokens: 0,
    },
  });

  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    setInfo({
      ...info,
      [`${e.target.name}`]: e.target.value,
    });
  };

  const onChangeDate = (newDate) => setInfo({ ...info, now: newDate });
  const onChangeDateExpires = (newDate) =>
    setInfo({ ...info, new_expire_date: newDate });

  const createInfoToSend = (info) => {
    const {
      name,
      email,
      phone,
      now,
      new_expire_date,
      services,
      password,
    } = info;
    let infoToSend;

    if (name && email && phone) {
      infoToSend = {
        name,
        email,
        password,
        phone,
        membership_created: `${
          now.getMonth() + 1
        }.${now.getDate()}.${now.getFullYear()}`,
        membership_expires: `${
          new_expire_date.getMonth() + 1
        }.${new_expire_date.getDate()}.${new_expire_date.getFullYear()}`,
      };

      if (services.type !== '-') {
        infoToSend = {
          ...infoToSend,
          services: [services],
        };
      }
    }

    return infoToSend;
  };

  const createUser = (infoToSend) => {
    return Axios({
      method: 'post',
      url: '/api/users',
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      data: infoToSend,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const infoToSend = createInfoToSend(info);

    try {
      const user = await createUser(infoToSend);
      users.unshift(user);
    } catch (err) {
      console.error(err.message);
    }

    setInfo({
      name: '',
      email: '',
      phone: '',
      now: new Date(),
      new_expire_date: new Date(),
      services: {
        type: '-',
        tokens: 0,
      },
    });
    setShow(false);
  };

  const { name, email, phone, now, new_expire_date, services } = info;
  return (
    <div>
      <input type='button' value='Create User' onClick={() => setShow(!show)} />
      {show && (
        <div className='create-user-container'>
          <form className='create-user-form' onSubmit={handleSubmit}>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              value={name}
              onChange={handleChange}
              autoCapitalize='none'
              autoFocus
              autoComplete='off'
            />
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={handleChange}
              autoComplete='off'
            />
            <label htmlFor='password'>Password:</label>
            <input disabled name='password' type='text' value='123456' />
            <label htmlFor='phone'>Phone Number:</label>
            <input
              type='text'
              name='phone'
              value={phone}
              onChange={handleChange}
              autoComplete='off'
            />
            <div className='create-user-calendar'>
              {show && (
                <p>
                  Date selected: {now.getDate()}-{now.getMonth() + 1}-
                  {now.getFullYear()}
                </p>
              )}
              {show && (
                <Calendar
                  className='react-calendar'
                  onChange={onChangeDate}
                  value={now}
                />
              )}
              {show && (
                <p>
                  Expiration date selected: {new_expire_date.getDate()}-
                  {new_expire_date.getMonth() + 1}-
                  {new_expire_date.getFullYear()}
                </p>
              )}
              {show && (
                <Calendar
                  className='react-calendar'
                  onChange={onChangeDateExpires}
                  value={new_expire_date}
                />
              )}
            </div>
            <div className='add-services'>
              <h3>Services:</h3>
              <select
                value={services.type}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    services: { ...services, type: e.target.value },
                  })
                }
              >
                <option value='-'>-</option>
                <option value='PT'>Personal Trainer</option>
                <option value='VR'>VR</option>
              </select>
              <label htmlFor='tokens'>
                Number of tokens: {services.tokens}
              </label>
              <input
                type='range'
                name='tokens'
                max='20'
                value={services.tokens}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    services: { ...services, tokens: e.target.value },
                  })
                }
              />
            </div>
            <input type='submit' value='Create' />
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
