import React, { useContext, useEffect, useState } from 'react';
import { ClassesContext } from '../../context/ClassesContext';

const InProgress = () => {
  const {
    state: { todayClasses, loading },
  } = useContext(ClassesContext);

  const [inProgress, setInProgress] = useState([]);

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

        switch (date.getHours() === classDate.getHours()) {
          case false:
            return false;
          case true:
            if (classDate.getMinutes() <= date.getMinutes()) {
              setInProgress(clss);
              return false;
            } else {
              return true;
            }
          default:
            break;
        }

        return true;
      });
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [loading]);

  return (
    <div>
      <h3>In Progress...</h3>

      <div className='coming-next-container'>
        <h3>{inProgress.title}</h3>
        <p>{inProgress.time}</p>
        <p>{inProgress.trainer}</p>
      </div>
    </div>
  );
};

export default InProgress;
