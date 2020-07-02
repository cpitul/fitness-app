import React, { useState } from 'react';
import UserDetails from './UserDetails';

const User = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);

  let date;
  if (user.membership_expires) {
    date = new Date(user.membership_expires);
  }

  return (
    <div>
      <h2>{user.name} </h2>

      {date !== undefined ? (
        <h4>
          Member until: {date.getDate()}-{date.getMonth() + 1}-
          {date.getFullYear()}
        </h4>
      ) : (
        <h4>Not a member</h4>
      )}
      <h4>Phone: {user.phone} </h4>
      {showDetails ? (
        <input
          className='btn btn-dark'
          type='button'
          value='Less info'
          onClick={() => setShowDetails(!showDetails)}
        />
      ) : (
        <input
          className='btn btn-dark'
          type='button'
          value='More info'
          onClick={() => setShowDetails(!showDetails)}
        />
      )}
      {showDetails && <UserDetails user={user} />}
    </div>
  );
};

export default User;
