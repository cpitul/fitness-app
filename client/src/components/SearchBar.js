import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';

const SearchBar = () => {
  const { searchDB } = useContext(GlobalContext);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    searchDB(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' className='btn' value='' id='search-button' />
      <i className='fas fa-search' />
      <input
        placeholder='Search...'
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input
        type='button'
        value='Reset'
        onClick={() => {
          searchDB('');
        }}
      />
    </form>
  );
};

export default SearchBar;
