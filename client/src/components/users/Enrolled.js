import React from 'react';
import EnrolledItem from './EnrolledItem';

const Enrolled = ({ enrolled, userId }) => {
  return (
    <div className='enrolled'>
      <h3>Enrolled</h3>
      <div className='enrolled-list'>
        {enrolled.map((id) => (
          <EnrolledItem key={id} classId={id} userId={userId} />
        ))}
      </div>
    </div>
  );
};

export default Enrolled;
