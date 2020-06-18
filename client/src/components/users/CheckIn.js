import Axios from 'axios';
import React, { useState } from 'react';

const CheckIn = ({ user }) => {
  const [clicked, setClicked] = useState(false);
  const date = new Date();

  const handleClick = async () => {
    const { _id, check_in, name } = user;
    check_in.unshift(
      `${name} checked in on ${date.getDate()}.${date.getMonth()}.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`
    );
    try {
      await Axios({
        method: 'put',
        url: `/api/users/${_id}`,
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        data: {
          check_in,
        },
      });
      setClicked(true);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <div className='checkin-btn'>
      {!clicked ? (
        <input type='button' value='Check-In' onClick={handleClick} />
      ) : (
        <input type='button' value='Check-In' disabled />
      )}
    </div>
  );
};

export default CheckIn;
