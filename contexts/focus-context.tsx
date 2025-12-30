import { createContext, ReactNode, useContext, useState } from 'react';

type FocusContextType = {
  focusDuration: number;
  setFocusDuration: (duration: number) => void;
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focusDuration, setFocusDuration] = useState(25);

  return (
    <FocusContext.Provider value={{ focusDuration, setFocusDuration }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusDuration() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusDuration must be used within a FocusProvider');
  }
  return context;
}

