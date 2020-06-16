import axios from 'axios';
import React, { useState } from 'react';

const AttendedButton = ({ classId, userId }) => {
  // ADD USE REF
  const [pressed, setPressed] = useState(false);

  const handleClick = async () => {
    try {
      await axios({
        method: 'put',
        url: `/api/classes/${classId}`,
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        data: {
          attended: userId,
          id: userId,
        },
      });
      setPressed(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {!pressed ? (
        <input
          type='button'
          value='Attended'
          className='btn btn-primary'
          onClick={handleClick}
        />
      ) : (
        <input type='button' value='Attended' disabled />
      )}
    </>
  );
};

export default AttendedButton;
