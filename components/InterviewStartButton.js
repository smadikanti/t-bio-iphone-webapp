import React from 'react';
import { useTokenValidation } from './TokenValidation';

const InterviewStartButton = () => {
  const { isValidToken } = useTokenValidation();

  const handleStartInterview = () => {
    // Trigger the interview start logic here
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <button onClick={handleStartInterview} style={{ padding: '10px 20px' }}>
        Start Interview
      </button>
    </div>
  );
};

export default InterviewStartButton;
