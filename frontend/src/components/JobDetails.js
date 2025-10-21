import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const JobDetails = ({ job }) => {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
  const isAdmin = user && user.user && user.user.authorization;
  console.log('User object:', user);
  console.log('Is admin:', isAdmin);



  // Function to toggle job details modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to toggle apply modal visibility
  const toggleApplyModal = () => {
    if (!user) {
      alert('You must be logged in to apply for a job.');
      return;
    }
    setIsApplyModalOpen(!isApplyModalOpen);
  };

  // Function to handle application submission
  const handleApply = async (e) => {
    e.preventDefault();

    if (!requestMessage.trim()) {
      setError('Please enter a request message.');
      return;
    }

    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          jobId: job._id,
          jobTitle: job.title,
          ownerEmail: job.owner,
          message: requestMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while applying for the job.');
      }

      alert('Your application has been sent successfully!');
      setRequestMessage('');
      setIsApplyModalOpen(false);
    } catch (error) {
      console.error('Error applying for the job:', error);
      setError(error.message || 'An error occurred while applying for the job.');
    }
  };

  return (
    <>
      {/* Display only the job title */}
      <div className="job-title" onClick={toggleModal}>
        <h4>{job.title}</h4>
      </div>

      {/* Modal to display full job details */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{job.title}</h2>
            <p><strong>Description: </strong>{job.description}</p>
            <p><strong>Requirements: </strong>{job.requirements}</p>
            <p><strong>Salary($): </strong>{job.salary}</p>
            <p><strong>Length(months): </strong>{job.length}</p>
            <p><strong>Recruiter Email: </strong>{job.owner}</p>
            <button className="apply-button" onClick={toggleApplyModal}>Apply</button>
            <button className="close-button" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal to handle job application */}
      {isApplyModalOpen && (
        <div className="modal-overlay" onClick={toggleApplyModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for {job.title}</h2>
            <form onSubmit={handleApply}>
              <label htmlFor="message">Request Message:</label>
              <textarea
                id="message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows="5"
                required
              ></textarea>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="submit-button">Send Application</button>
              <button type="button" className="close-button" onClick={toggleApplyModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
  
};



export default JobDetails;
