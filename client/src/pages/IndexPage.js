import React, { useState } from 'react';
import Logout from '../components/Logout';
import Classes from './Classes';
import Trainers from './Trainers';
import Users from './Users';

const IndexPage = () => {
  const [page, setPage] = useState(0);
  return (
    <div>
      {page === 0 && <Classes />}
      {page === 1 && <Users />}
      {page === 2 && <Trainers />}
      <input onClick={() => setPage(0)} type='button' value='Classes' />
      <input onClick={() => setPage(1)} type='button' value='Users' />
      <input onClick={() => setPage(2)} type='button' value='Trainers' />
      <Logout />
    </div>
  );
};

export default IndexPage;
