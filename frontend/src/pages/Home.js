// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { useProjectsContext } from '../hooks/useProjectsContext';
import { useJobContext } from '../hooks/useJobContext';
import ProjectDetails from '../components/ProjectDetails';
import JobDetails from '../components/JobDetails';
import { useAuthContext } from '../hooks/useAuthContext';
import ProjectForm from '../components/ProjectForm';
import JobForm from '../components/JobForm';
import Modal from '../components/Modal'; // Import the Modal component

const Home = () => {
    const { projects, dispatch: dispatchProjects } = useProjectsContext();
    const { jobs, dispatch: dispatchJobs } = useJobContext();
    const { user } = useAuthContext();
    const isAdmin = user && user.user && user.user.authorization;

    console.log('User object:', user);
    console.log('Is admin:', isAdmin);

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

    // Merge Sort Implementation
    const mergeSort = (arr) => {
        if (arr.length <= 1) {
            return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));

        return merge(left, right);
    };

    const merge = (left, right) => {
        let result = [];
        let i = 0;
        let j = 0;

        while (i < left.length && j < right.length) {
            // Sort in descending order based on likes
            if (left[i].likes >= right[j].likes) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        // Concatenate remaining elements
        return result.concat(left.slice(i)).concat(right.slice(j));
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const json = await response.json();

                if (response.ok) {
                    // Sort projects using merge sort before dispatching
                    const sortedProjects = mergeSort(json);
                    dispatchProjects({ type: 'SET_PROJECTS', payload: sortedProjects });
                } else {
                    console.error('Failed to fetch projects:', json.error);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [dispatchProjects]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs');
                const json = await response.json();

                if (response.ok) {
                    dispatchJobs({ type: 'SET_JOBS', payload: json });
                } else {
                    console.error('Failed to fetch jobs:', json.error);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, [dispatchJobs]);

    // Functions to toggle modals
    const toggleProjectModal = () => {
        setIsProjectModalOpen(!isProjectModalOpen);
    };

    const toggleJobModal = () => {
        setIsJobModalOpen(!isJobModalOpen);
    };

    return (
        <div className="home">
            {/* Projects Section */}
            <div className="projects-section">
                <h2>Popular Projects:</h2>
                <div className="projects">
                    {projects && projects.map((project) => (
                        <ProjectDetails key={project._id} project={project} />
                    ))}
                </div>
            </div>

            {/* Jobs Section */}
            <div className="jobs-section">
                <h2>Internships:</h2>
                <div className="jobs">
                    {jobs && jobs.map((job) => (
                        <JobDetails key={job._id} job={job} />
                    ))}
                </div>
            </div>

            {/* Add Project Button */}
            <button className="add-project-btn" onClick={toggleProjectModal}>
                Add Project
            </button>

            {/* Modal for Adding Project */}
            <Modal isOpen={isProjectModalOpen} onClose={toggleProjectModal}>
                <ProjectForm />
            </Modal>

            {/* Add Job Button (Admin Only) */}
            {isAdmin && (
                <button className="add-job-btn" onClick={toggleJobModal}>
                    Add Job
                </button>
            )}

            {/* Modal for Adding Job (Admin Only) */}
            {isAdmin && (
                <Modal isOpen={isJobModalOpen} onClose={toggleJobModal}>
                    <JobForm />
                </Modal>
            )}
        </div>
    );
};

export default Home;
