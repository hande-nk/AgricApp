import React, { useState } from 'react';
import { useJobContext } from '../hooks/useJobContext';
import { useAuthContext } from '../hooks/useAuthContext';

const JobForm = () => {
    const { dispatch } = useJobContext();
    const { user } = useAuthContext(); // Get the user from context
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [salary, setSalary] = useState('');
    const [length, setLength] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure the user is logged in and authorized as an admin
        if (!user || !user.user?.authorization) {  // Safely check user.user.authorization
            setError('Only admins can add jobs');
            return;
        }

        // Build the job object
        const job = { 
            title, 
            description, 
            requirements, 
            salary, 
            length, 
            owner: user.user.email // Get the email from user object
        };

        // Log the job object to verify all fields are present
        console.log('Job Object:', job);

        // Ensure all fields are provided before sending the request
        if (!title || !description || !requirements || !salary || !length) {
            setError('Please fill in all fields');
            return;
        }

        try {
            console.log('Job Object:', job);
            const response = await fetch('/api/jobs', {
                method: 'POST',
                body: JSON.stringify(job),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Include the JWT token
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'An error occurred while adding the job.');
            } else {
                // Reset form and dispatch new job to context
                setTitle('');
                setDescription('');
                setRequirements('');
                setSalary('');
                setLength('');
                setError(null);
                dispatch({ type: 'CREATE_JOB', payload: json });
                alert('Job added successfully!');
            }
        } catch (error) {
            console.error('Error adding job:', error);
            setError(error.message || 'An error occurred while adding the job.');
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Job</h3>

            <label>Job Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required
            />

            <label>Description:</label>
            <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
            ></textarea>

            <label>Requirements:</label>
            <input
                type="text"
                onChange={(e) => setRequirements(e.target.value)}
                value={requirements}
                required
            />

            <label>Salary($):</label>
            <input
                type="number"
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
                required
            />

            <label>Length (months):</label>
            <input
                type="number"
                onChange={(e) => setLength(e.target.value)}
                value={length}
                required
            />

            <button className="submit-btn">Add Job</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
};

export default JobForm;
