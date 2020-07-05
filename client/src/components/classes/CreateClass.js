import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Axios from 'axios';

const CreateClass = () => {
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState({
    title: '',
    trainer: '',
    duration: 0,
    time: '',
    date: new Date(),
    desc: '',
    type: '',
    max: 0,
  });

  const handleChange = (e) => {
    setInfo({
      ...info,
      [`${e.target.name}`]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infoToSend = {
      ...info,
      date: `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`,
    };

    try {
      await Axios({
        method: 'post',
        url: '/api/classes',
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        data: infoToSend,
      });
    } catch (err) {
      console.error(err.message);
    }

    setInfo({
      title: '',
      trainer: '',
      duration: 0,
      time: '',
      date: new Date(),
      desc: '',
      type: '',
      max: 0,
    });
  };

  const { title, trainer, duration, time, date, desc, type, max } = info;

  return (
    <div className='create-class-container'>
      <input
        type='button'
        value='Create Class'
        onClick={() => setShow(!show)}
        className='btn btn-dark'
      />
      {show && (
        <form onSubmit={handleSubmit} className='create-class-form'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            value={title}
            onChange={(e) => handleChange(e)}
            autoCapitalize='none'
            autoCorrect='off'
            autoFocus
            autoComplete='off'
          />
          <label htmlFor='desc'>Description</label>
          <textarea
            name='desc'
            cols='35'
            rows='5'
            value={desc}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor='trainer'>Trainer</label>
          <input
            type='text'
            name='trainer'
            value={trainer}
            onChange={(e) => handleChange(e)}
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='off'
          />
          <label htmlFor='time'>Time</label>
          <input
            type='text'
            name='time'
            value={time}
            onChange={(e) => handleChange(e)}
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='off'
          />
          <label htmlFor='calendar'>Date</label>
          <Calendar
            name='calendar'
            value={date}
            onChange={(newDate) =>
              setInfo({
                ...info,
                date: newDate,
              })
            }
          />
          <label htmlFor='max'>Maximum people</label>
          <input
            type='number'
            name='max'
            value={max}
            onChange={(e) => handleChange(e)}
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='off'
            min='0'
          />
          <label htmlFor='type'>Type of class</label>
          <input
            type='text'
            name='type'
            value={type}
            onChange={(e) => handleChange(e)}
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='off'
          />
          <label htmlFor='duration'>Duration (minutes)</label>
          <input
            min='0'
            type='number'
            name='duration'
            value={duration}
            onChange={(e) => handleChange(e)}
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='off'
          />
          <input type='submit' value='Create' />
        </form>
      )}
    </div>
  );
};

export default CreateClass;
