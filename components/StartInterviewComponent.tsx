import React, { useContext } from 'react';
import { TokenValidationContext } from './TokenValidationContext';

const StartInterviewComponent: React.FC = () => {
  const context = useContext(TokenValidationContext);

  if (!context) {
    throw new Error('StartInterviewComponent must be used within a TokenValidationProvider');
  }

  const { validationDetails } = context;

  if (!validationDetails) return null; // Don't render if there are no validation details

  const startInterview = () => {
    // Logic to start the interview can be added here
  };

  return (
    <button onClick={startInterview}>Start Interview</button>
  );
};

export default StartInterviewComponent;
