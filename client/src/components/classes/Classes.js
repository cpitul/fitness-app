import React, { useContext, useEffect } from 'react';
import { ClassesContext } from '../../context/ClassesContext';
import ClassItem from './ClassItem';

const Classes = () => {
  const { filterTodayClasses, getClasses, state } = useContext(ClassesContext);

  const { loading, todayClasses, date } = state;

  useEffect(() => {
    const populateClasses = async () => {
      try {
        await getClasses();
        await filterTodayClasses(
          `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`
        );
      } catch (err) {
        console.error(err.message);
      }
    };

    populateClasses();
    console.log('1');
    // eslint-disable-next-line
  }, [date]);

  return (
    <div className='class-list'>
      {!loading &&
        todayClasses.map((clss) => (
          <ClassItem key={clss._id} classItem={clss} />
        ))}
    </div>
  );
};

export default Classes;
