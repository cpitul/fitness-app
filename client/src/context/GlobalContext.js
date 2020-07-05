import axios from 'axios';
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

const GlobalState = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);

  const getClass = async (classId) => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/classes/${classId}`,
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
      });

      return res.data;
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearSearchResult = () => setSearchResult([]);

  const searchDB = async (input) => {
    const token = localStorage.getItem('token');

    const res = await axios({
      method: 'put',
      url: '/api/users',
      headers: {
        'auth-token': token,
      },
      data: {
        name: input,
      },
    });

    res.status === 404 || res.status === 500
      ? setSearchResult(null)
      : setSearchResult(res.data);
  };

  return (
    <GlobalContext.Provider
      value={{ searchDB, getClass, clearSearchResult, searchResult }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalState;
