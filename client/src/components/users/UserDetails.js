import React, { useState } from 'react';
import Activity from './Activity';
import CheckIn from './CheckIn';
import Enrolled from './Enrolled';
import Membership from './Membership';
import Services from './Services';

const User = ({ user }) => {
  const [update, setUpdate] = useState(false);
  const [show, setShow] = useState({
    activity: false,
  });

  const {
    _id,
    name,
    email,
    phone,
    membership_created,
    membership_expires,
    services,
    penalties,
    enrolled,
    check_in,
    date_created,
    type,
  } = user;

  const joined = new Date(date_created);
  const { activity } = show;

  return (
    <div className='user-details'>
      <h1>{name}</h1>
      <h5>Member type: {type} </h5>
      <h5>
        Joined: {joined.getDate()}-{joined.getMonth()}-{joined.getFullYear()}
      </h5>
      <h5>Email: {email}</h5>
      <h5>Phone: {phone}</h5>
      <h5>Penalties: {penalties}</h5>
      <CheckIn user={user}/>
      <Membership
        id={_id}
        membership_created={membership_created}
        membership_expires={membership_expires}
        reset={() => setUpdate(!update)}
      />
      <Services reset={() => setUpdate(!update)} id={_id} services={services} />
      {enrolled.length > 0 && <Enrolled userId={_id} enrolled={enrolled} />}
      <input
        type='button'
        value='See Activity'
        onClick={() => setShow({ ...show, activity: !activity })}
      />
      {activity && <Activity check_in={check_in} />}
    </div>
  );
};

export default User;
