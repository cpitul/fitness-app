import React from 'react';

const Activity = ({ check_in }) => {
  return (
    <div className='activities-container'>
      <h3>Activity</h3>
      {check_in.length === 0 ? (
        <p>User has no activity in the gym</p>
      ) : (
        <ul className='activities-list'>
          {check_in.map((activity) => (
            <li key={activity} className='activities-item'>
              {activity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Activity;
