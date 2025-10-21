import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProjectsContext } from '../hooks/useProjectsContext';

const ProjectDetails = ({ project }) => {
  const { user } = useAuthContext();
  const { dispatch } = useProjectsContext();
  console.log('User object:', user);

  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage the likes count locally
  const [likes, setLikes] = useState(project.likes);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle liking the project
  const handleLike = async () => {
    if (!user || !user.token) {
      alert('You must be logged in to like a project.');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${project._id}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not like the project.');
      }

      setLikes(data.likes); // Update the local likes count
    } catch (error) {
      console.error('Error liking the project:', error);
      alert(error.message || 'An error occurred while liking the project.');
    }
  };
  
  const canDelete = user && (
    (user.user && user.user.name === project.creator) || // User is the creator
    (user.user && user.user.authorization) // User is admin
  );
  // Function to handle deleting the project
  const handleDelete = async () => {
    if (!user || !user.token) {
      alert('You must be logged in to delete a project.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete the project.');
      }

      // Remove the project from the context
      dispatch({ type: 'DELETE_PROJECT', payload: { _id: project._id } });

      // Close the modal
      setIsModalOpen(false);

      alert('Project deleted successfully.');
    } catch (error) {
      console.error('Error deleting the project:', error);
      alert(error.message || 'An error occurred while deleting the project.');
    }
  };


  return (
    <>
      {/* Display the project title, creator, and the like button */}
      <div className="project-title">
        <h4 onClick={toggleModal}>{project.title}</h4>
        <p className="project-creator">Created by: {project.creator}</p>
        <div className="like-section">
          <button className="like-button" onClick={handleLike}>
            <span className="heart-icon">❤️</span> {likes}
          </button>
        </div>
      </div>

      {/* Modal to display full project details */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{project.title}</h2>
            <p>
              <strong>Description: </strong>
              {project.description}
            </p>
            <p>
              <strong>Equipments: </strong>
              {project.equipments}
            </p>
            <p>
              <strong>Cost($): </strong>
              {project.cost}
            </p>
            <p>
              <strong>Time(months): </strong>
              {project.time}
            </p>
            <p>
              <strong>Likes: </strong>
              {likes}
            </p>
            <p>
              <strong>Creator: </strong>
              {project.creator}
            </p>
            {/* Delete Button Inside the Modal */}
            {canDelete && (
              <button className="delete-button" onClick={handleDelete}>
                Delete Project
              </button>
            )}
            <button className="close-button" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;