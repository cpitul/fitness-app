import React, { useContext, useEffect, useState } from 'react';
import { ClassesContext } from '../../context/ClassesContext';

const ComingNext = () => {
  const {
    state: { todayClasses, loading },
  } = useContext(ClassesContext);

  const [comingNext, setComingNext] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();

      todayClasses.some((clss) => {
        const dateNumbers = clss.date.split('.');
        const timeNumbers = clss.time.split(':');

        const classDate = new Date(
          dateNumbers[2],
          dateNumbers[0] - 1,
          dateNumbers[1],
          timeNumbers[0],
          timeNumbers[1]
        );

        if (classDate.getTime() > date.getTime()) {
          setComingNext(clss);
          return true;
        } else {
          return false;
        }
      });
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [loading]);

  return (
    <div>
      <h3>Coming Next...</h3>

      <div className='coming-next-container'>
        <h3>{comingNext.title}</h3>
        <p>{comingNext.time}</p>
        <p>{comingNext.trainer}</p>
      </div>
    </div>
  );
};

export default ComingNext;
