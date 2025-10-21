import { useContext } from 'react';
import { JobContext } from '../context/JobContext'; // Adjust the path as needed

export const useJobContext = () => {
  const context = useContext(JobContext);

  if (!context) {
    throw Error('useJobContext must be used inside a JobContextProvider');
  }

  return context;
};
