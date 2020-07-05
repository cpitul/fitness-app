import React, { useState } from 'react';
import ClassDetails from './ClassDetails';

const ClassItem = ({ classItem }) => {
  const [showDetails, setShowDetails] = useState(false);

  const { title, trainer, enrolled, max, time } = classItem;

  return (
    <div className='class-item' onClick={() => setShowDetails(true)}>
      <p>{trainer}</p>
      <h2>{title}</h2>
      <p>{`${enrolled.length}/${max}`}</p>
      <p>{time}</p>
      {showDetails && (
        <div className='class-details'>
          <ClassDetails classItem={classItem} />
        </div>
      )}
    </div>
  );
};

export default ClassItem;
