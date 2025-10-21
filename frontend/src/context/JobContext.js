import { createContext, useReducer } from 'react';

// Create the Jobs Context
export const JobContext = createContext();

// Define a reducer to manage jobs-related actions
export const jobsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_JOBS':
      return {
        jobs: action.payload
      };
    case 'CREATE_JOB':
      return {
        jobs: [action.payload, ...state.jobs]
      };
    case 'DELETE_JOB':
      return {
        jobs: state.jobs.filter(job => job._id !== action.payload._id)
      };
    default:
      return state;
  }
};

// Create JobsContextProvider
export const JobContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobsReducer, { jobs: [] });

  return (
    <JobContext.Provider value={{ ...state, dispatch }}>
      {children}
    </JobContext.Provider>
  );
};
