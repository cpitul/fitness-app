import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Membership = ({ membership_created, membership_expires, id, reset }) => {
  const [date, setDate] = useState({
    now: new Date(),
    new_expire_date: new Date(),
    created: '',
    expires: '',
  });

  const [showCal, setShowCal] = useState(false);

  useEffect(() => {
    if (membership_expires !== '') {
      setDate({
        ...date,
        created: new Date(membership_created),
        expires: new Date(membership_expires),
      });
    }
    // eslint-disable-next-line
  }, []);

  const onChange = (newDate) => setDate({ ...date, now: newDate });
  const onChangeExpires = (newDate) =>
    setDate({ ...date, new_expire_date: newDate });

  const submitMembership = async (creationDate, expiryDate) => {
    await axios({
      method: 'put',
      url: `/api/users/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      data: {
        membership_created: creationDate,
        membership_expires: expiryDate,
        type: 'paid',
      },
    });

    setDate({
      ...date,
      created: new Date(creationDate),
      expires: new Date(expiryDate),
    });
    setShowCal(false);
    reset();
  };

  const { now, new_expire_date, created, expires } = date;

  return (
    <div className='container'>
      <div className='membership-container'>
        <h3>Membership</h3>
        {expires !== '' ? (
          <div>
            <p>
              Created at: {created.getDate()}-{created.getMonth() + 1}-
              {created.getFullYear()}
            </p>
            <p>
              Expires at: {expires.getDate()}-{expires.getMonth() + 1}-
              {expires.getUTCFullYear()}
            </p>
          </div>
        ) : (
          <p>No membership active</p>
        )}
      </div>
      <div className='create-container'>
        <div className='calendar-icon'>
          {showCal ? (
            <i
              onClick={() => setShowCal(!showCal)}
              className='fas fa-calendar-alt btn btn-light'
            >
              <h4>Create membership</h4>
            </i>
          ) : (
            <i
              onClick={() => setShowCal(!showCal)}
              className='far fa-calendar-alt btn btn-light'
            >
              <h4>Create membership</h4>
            </i>
          )}
        </div>
        {showCal && (
          <p>
            Date selected: {now.getDate()}-{now.getMonth() + 1}-
            {now.getFullYear()}
          </p>
        )}
        {showCal && (
          <Calendar
            className='react-calendar'
            onChange={onChange}
            value={now}
          />
        )}
        {showCal && (
          <p>
            Expiration date selected: {new_expire_date.getDate()}-
            {new_expire_date.getMonth() + 1}-{new_expire_date.getFullYear()}
          </p>
        )}

        {showCal && (
          <Calendar
            className='react-calendar'
            onChange={onChangeExpires}
            value={new_expire_date}
          />
        )}

        {showCal && (
          <input
            onClick={() =>
              submitMembership(
                `${now.getMonth() + 1}.${now.getDate()}.${now.getFullYear()}`,
                `${
                  new_expire_date.getMonth() + 1
                }.${new_expire_date.getDate()}.${new_expire_date.getFullYear()}`
              )
            }
            type='button'
            value='Create membership'
            className='btn btn-dark'
          />
        )}
      </div>
    </div>
  );
};

export default Membership;
