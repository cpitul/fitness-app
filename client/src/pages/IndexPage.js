import React, { useState } from 'react';
import Logout from '../components/Logout';
import ClassesPage from './ClassesPage';
import TrainersPage from './TrainersPage';
import UsersPage from './UsersPage';

const IndexPage = () => {
  const [page, setPage] = useState(0);
  return (
    <div>
      <input onClick={() => setPage(0)} type='button' value='Classes' />
      <input onClick={() => setPage(1)} type='button' value='Users' />
      <input onClick={() => setPage(2)} type='button' value='Trainers' />
      <Logout />
      {page === 0 && <ClassesPage />}
      {page === 1 && <UsersPage />}
      {page === 2 && <TrainersPage />}
    </div>
  );
};

export default IndexPage;
