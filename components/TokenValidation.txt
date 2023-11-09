import React, { useState, useContext } from 'react';

const TokenValidationContext = React.createContext();

export const TokenValidationProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenContext, setTokenContext] = useState({
    resumeString: '',
    jdString: '',
    duration: 0,
  });

  const validateToken = async () => {
    // Replace with your AWS DynamoDB token validation logic
    // For now, we'll assume all tokens are valid
    const isValid = true;

    if (isValid) {
      // Set token context data (replace with actual values)
      setTokenContext({
        resumeString: 'Sample Resume',
        jdString: 'Sample Job Description',
        duration: 30, // Replace with actual duration in minutes
      });
    }

    setIsValidToken(isValid);
  };

  return (
    <TokenValidationContext.Provider
      value={{
        token,
        setToken,
        isValidToken,
        validateToken,
        tokenContext,
      }}
    >
      {children}
    </TokenValidationContext.Provider>
  );
};

export const useTokenValidation = () => {
  return useContext(TokenValidationContext);
};
