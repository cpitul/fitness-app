import React, { useContext } from 'react';
import Cal from '../components/classes/Cal';
import Classes from '../components/classes/Classes';
import ComingNext from '../components/classes/ComingNext';
import InProgress from '../components/classes/InProgress';
import { LoginContext } from '../context/LoginContext';
import CreateClass from '../components/classes/CreateClass';

const ClassesPage = () => {
  const {
    activeUser: { type },
  } = useContext(LoginContext);

  return (
    <div>
      <div className='classes-left'>
        <h1>Classes page</h1>
        <Cal />
        <Classes />
      </div>
      <div className='classes-right'>
        <h4>Have a great day and don't forget to smile!</h4>
        {type === 'admin' ? (
          <CreateClass />
        ) : (
          <div className='create-class-container' />
        )}
        <ComingNext />
        <InProgress />
      </div>
    </div>
  );
};

export default ClassesPage;
