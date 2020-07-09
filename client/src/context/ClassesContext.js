import Axios from 'axios';
import React, { createContext, useReducer } from 'react';

export const ClassesContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLASSES':
      return { ...state, classes: action.payload, loading: true };
    case 'FILTER_TODAY':
      const date = new Date(action.payload);
      const todayClasses = state.classes.filter(
        (clss) =>
          date.getDate() === new Date(clss.date).getDate() &&
          date.getMonth() === new Date(clss.date).getMonth() &&
          date.getFullYear() === new Date(clss.date).getFullYear()
      );
      todayClasses.sort((a, b) => {
        const time1 = a.time
          .split(':')
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr));
        const time2 = b.time
          .split(':')
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr));
        return time1 - time2;
      });
      return { ...state, todayClasses, loading: false };
    case 'CHANGE_DATE':
      return { ...state, date: new Date(action.payload) };
    case 'CHANGE_COMMING_NEXT':
      return { ...state, commingNext: action.payload };
    case 'CHANGE_IN_PROGRESS':
      return { ...state, inProgress: action.payload };

    default:
      return state;
  }
};

const ClassesState = ({ children }) => {
  const initState = {
    loading: true,
    classes: [],
    todayClasses: [],
    date: new Date(),
    inProgress: [],
    commingNext: [],
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const changeDate = (newDate) =>
    dispatch({ type: 'CHANGE_DATE', payload: newDate });

  const filterTodayClasses = (inputDate) =>
    dispatch({ type: 'FILTER_TODAY', payload: inputDate });

  const getClasses = async () => {
    const res = await Axios({
      method: 'GET',
      url: '/api/classes',
      headers: {
        'auth-token': localStorage.getItem('token'),
      },
    });

    dispatch({ type: 'SET_CLASSES', payload: res.data });
  };

  const changeInProgress = (input) =>
    dispatch({ type: 'CHANGE_IN_PROGRESS', payload: input });

  const changeCommingNext = (input) =>
    dispatch({ type: 'CHANGE_COMMING_NEXT', payload: input });

  return (
    <ClassesContext.Provider
      value={{
        state,
        getClasses,
        filterTodayClasses,
        changeDate,
        changeCommingNext,
        changeInProgress,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
};

export default ClassesState;
