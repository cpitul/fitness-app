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
      return { ...state, todayClasses, loading: false };
    case 'CHANGE_DATE':
      return { ...state, date: new Date(action.payload) };
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

  return (
    <ClassesContext.Provider
      value={{ state, getClasses, filterTodayClasses, changeDate }}
    >
      {children}
    </ClassesContext.Provider>
  );
};

export default ClassesState;
