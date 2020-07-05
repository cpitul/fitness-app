import React from 'react';
import AddUserToClass from './AddUserToClass';

const ClassDetails = ({ classItem }) => {
  const {
    _id,
    title,
    desc,
    trainer,
    duration,
    enrolled,
    attended,
    type,
    giveups,
    max,
  } = classItem;

  return (
    <div className='class-details-container'>
      <h2>
        {title} with {trainer} for {duration} minutes
      </h2>
      <h4>{desc}</h4>
      <p>Type of class is {type}</p>
      {enrolled !== 0 && (
        <p>
          Enrolled people: {enrolled.length}/{max}
        </p>
      )}
      <AddUserToClass classId={_id} />
      {attended !== 0 && <p>Attended: {attended.length}</p>}
      {giveups > 1 ? (
        <p>People gave up on the class {giveups} time</p>
      ) : (
        <p>People gave up on the class {giveups} times</p>
      )}
    </div>
  );
};

export default ClassDetails;
