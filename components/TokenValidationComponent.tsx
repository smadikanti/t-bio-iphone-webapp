import React, { useState, useContext } from 'react';
import { TokenValidationContext } from './TokenValidationContext';

const TokenValidationComponent: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const context = useContext(TokenValidationContext);

  if (!context) {
    throw new Error('TokenValidationComponent must be used within a TokenValidationProvider');
  }

  const { setValidationDetails } = context;

  const validateToken = () => {
    // Placeholder for AWS DynamoDB call
    // For now, we will just set the context with dummy data
    setValidationDetails({
      resumeString: 'Your resume details here',
      jdString: 'Job description details here',
      duration: '1h' // Duration format can be decided later
    });
    return true; // Simulate successful validation for all tokens
  };

  return (
    <div>
      <input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
      <button onClick={validateToken}>Spin Up</button>
    </div>
  );
};

export default TokenValidationComponent;
