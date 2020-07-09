import React, { useContext, useEffect } from 'react';
import { ClassesContext } from '../../context/ClassesContext';

const ComingNext = () => {
  const {
    state: { todayClasses, commingNext, date },
  } = useContext(ClassesContext);

  useEffect(() => {
    const interval = setInterval(() => {}, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Coming Next...</h3>
    </div>
  );
};

export default ComingNext;
