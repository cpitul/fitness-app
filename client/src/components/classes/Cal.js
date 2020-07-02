import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ClassesContext } from '../../context/ClassesContext';

const Cal = () => {
  const { date, changeDate } = useContext(ClassesContext);

  const [showCal, setShowCal] = useState(false);

  const handleChange = (newDate) => changeDate(newDate);

  return (
    <div>
      {showCal ? (
        <i
          onClick={() => setShowCal(!showCal)}
          className='fas fa-calendar-alt btn btn-light'
        >
          <h4>Calendar</h4>
        </i>
      ) : (
        <i
          onClick={() => setShowCal(!showCal)}
          className='far fa-calendar-alt btn btn-light'
        >
          <h4>Calendar</h4>
        </i>
      )}
      {showCal && (
        <Calendar
          className='react-calendar'
          value={date}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default Cal;
