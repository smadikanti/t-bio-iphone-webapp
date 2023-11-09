import React, { useState } from 'react';
import { useTokenValidation } from './TokenValidation';

const TokenValidationComponent = ({ validateToken }) => {
  const { setToken } = useTokenValidation();
  const [inputToken, setInputToken] = useState('');

  const handleTokenInputChange = (e) => {
    setInputToken(e.target.value);
  };

  const handleTokenSubmit = () => {
    setToken(inputToken);
    validateToken();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>Enter Paid Token</h2>
      <input
        type="text"
        value={inputToken}
        onChange={handleTokenInputChange}
        placeholder="Enter your token"
        style={{ width: '300px', padding: '10px' }}
      />
      <button onClick={handleTokenSubmit} style={{ marginTop: '10px', padding: '10px 20px' }}>
        Spin Up
      </button>
    </div>
  );
};

export default TokenValidationComponent;
