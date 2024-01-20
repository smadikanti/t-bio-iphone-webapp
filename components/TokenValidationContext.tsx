
import React, { createContext, useState, ReactNode } from 'react';

interface ValidationDetails {
  resumeString: string;
  jdString: string;
  duration: string; // Duration format can be decided later
}

interface TokenValidationContextProps {
  validationDetails: ValidationDetails | null;
  setValidationDetails: (details: ValidationDetails) => void;
}

export const TokenValidationContext = createContext<TokenValidationContextProps | null>(null);

interface TokenValidationProviderProps {
  children: ReactNode;
}

export const TokenValidationProvider: React.FC<TokenValidationProviderProps> = ({ children }) => {
  const [validationDetails, setValidationDetails] = useState<ValidationDetails | null>(null);

  return (
    <TokenValidationContext.Provider value={{ validationDetails, setValidationDetails }}>
      {children}
    </TokenValidationContext.Provider>
  );
};
