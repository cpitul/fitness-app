import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import Spinner from '../Spinner';
import AttendedButton from './AttendedButton';

const EnrolledItem = ({ classId, userId }) => {
  const { getClass } = useContext(GlobalContext);
  const [item, setItem] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [when, setWhen] = useState(undefined);

  useEffect(() => {
    getClass(classId)
      .then((res) => {
        setItem(res[0]);
        setWhen(new Date(res[0].date));
        setLoading(false);
      })
      .catch((err) => console.error(err.message));

    // eslint-disable-next-line
  }, []);

  return (
    <div className='enrolled-item'>
      {loading ? (
        <Spinner />
      ) : (
        <div className='enrolled-content'>
          <h5>{item.title}</h5>
          <p>{item.time}</p>
          <p>
            {when.getDate()}-{when.getMonth()}-{when.getFullYear()}
          </p>
          <h4>{item.trainer}</h4>
          <h5>
            {item.enrolled.length}/{item.max}
          </h5>
          <p>{item.duration} min</p>
          <AttendedButton userId={userId} classId={classId} />
        </div>
      )}
    </div>
  );
};

export default EnrolledItem;
