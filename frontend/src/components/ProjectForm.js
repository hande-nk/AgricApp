import { useState } from "react";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from '../hooks/useAuthContext'; // Import useAuthContext

const ProjectForm = () => {
    const { dispatch } = useProjectsContext();
    const { user } = useAuthContext(); // Get the user from context
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [equipments, setEquipments] = useState('');
    const [cost, setCost] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!user || !user.token) {
            setError('You must be logged in to add a project');
            return;
        }

        const project = { title, description, equipments, cost, time };

        const response = await fetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setTitle('');
            setDescription('');
            setEquipments('');
            setCost('');
            setTime('');
            setError(null);
            dispatch({ type: 'CREATE_PROJECT', payload: json });
            console.log('New project added:', json);
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Project</h3>

            <label>Project Title:</label>
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
            <label>Equipments:</label>
            <input
                type="text"
                onChange={(e) => setEquipments(e.target.value)}
                value={equipments}
                required
            />
            <label>How much did it cost you to make the project:</label>
            <input
                type="number"
                onChange={(e) => setCost(e.target.value)}
                value={cost}
                required
            />
            <label>How long did it take you to build the project:</label>
            <input
                type="number"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required
            />
            <button className="submit-btn">Add Project</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
};

export default ProjectForm;
