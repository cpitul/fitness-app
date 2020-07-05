import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import Axios from 'axios';

const AddUserToClass = ({ classId }) => {
  const { searchDB, searchResult, clearSearchResult } = useContext(
    GlobalContext
  );
  const [input, setInput] = useState('');

  useEffect(() => {
    const doSearch = async (name) => {
      try {
        if (name !== '') {
          await searchDB(name);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    doSearch(input);

    // eslint-disable-next-line
  }, [input]);

  const handleSubmit = (id) => {
    Axios({
      method: 'PUT',
      url: `/api/classes/${classId}`,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      data: {
        enrolled: id,
      },
    });

    setInput('');
    clearSearchResult();
  };

  return (
    <div className='add-user-to-class-container'>
      <form>
        <label htmlFor='people'>Add or remove person:</label>
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          autoFocus
          type='text'
          name='people'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      {searchResult &&
        searchResult.map((result) => (
          <input
            key={result._id}
            type='button'
            value={result.name}
            onClick={() => handleSubmit(result._id)}
          />
        ))}
    </div>
  );
};

export default AddUserToClass;
