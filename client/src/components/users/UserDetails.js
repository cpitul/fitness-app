import React, { useState } from 'react';
import Enrolled from './Enrolled';
import Membership from './Membership';
import Services from './Services';

const User = ({ user }) => {
  const [update, setUpdate] = useState(false);

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
    date_created,
    type,
  } = user;

  const joined = new Date(date_created);

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

      <Membership
        id={_id}
        membership_created={membership_created}
        membership_expires={membership_expires}
        reset={() => setUpdate(!update)}
      />
      <Services reset={() => setUpdate(!update)} id={_id} services={services} />
      <Enrolled userId={_id} enrolled={enrolled} />
    </div>
  );
};

export default User;
