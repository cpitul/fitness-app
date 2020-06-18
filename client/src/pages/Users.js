import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Search from '../components/SearchBar';
import CreateUser from '../components/users/CreateUser';
import User from '../components/users/User';
import { GlobalContext } from '../context/GlobalContext';

const Users = () => {
  const [users, setUsers] = useState([]);

  const { searchResult } = useContext(GlobalContext);

  useEffect(() => {
    const getUsers = async () => {
      const res = await Axios({
        method: 'GET',
        url: '/api/users',
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
      });
      setUsers(res.data);
    };

    getUsers();
  }, [users]);

  return (
    <div>
      <h1>Users page</h1>
      <Search />
      <CreateUser users={users} />
      {searchResult.length > 0
        ? searchResult.map((result) => <User key={result._id} user={result} />)
        : users.map((user) => <User key={user._id} user={user} />)}
    </div>
  );
};

export default Users;
