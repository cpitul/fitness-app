import Axios from 'axios';
import React, { useState } from 'react';

const Services = ({ services, id, reset }) => {
  const [newService, setNewService] = useState('');
  const [tokens, setTokens] = useState(0);
  const [add, setAdd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    services.unshift({ type: newService, tokens });
    Axios({
      method: 'put',
      url: `/api/users/${id}`,
      headers: {
        'auth-token': localStorage.getItem('token'),
      },
      data: {
        services,
      },
    });
    setNewService('');
    setAdd(false);
    setTokens(0);
    reset();
  };

  return (
    <div>
      <h3>Services</h3>
      {services.length === 0 ? (
        <p>No services available</p>
      ) : (
        services.map((service) => (
          <p key={service.type}>
            {service.type}: {service.tokens} tokens remaining
          </p>
        ))
      )}

      <input type='button' value='Add Service' onClick={() => setAdd(!add)} />
      {add && (
        <form onSubmit={handleSubmit}>
          <select
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
          >
            <option>-</option>
            <option value='PT'>Personal Trainer</option>
            <option value='VR'>VR</option>
          </select>
          <label htmlFor='tokens'>Number of tokens</label>
          <input
            type='range'
            name='tokens'
            max='20'
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
          />
          <p>{tokens}</p>
          <input type='submit' value='Add' />
        </form>
      )}
    </div>
  );
};

export default Services;
