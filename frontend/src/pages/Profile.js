import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Profile = () => {
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const isAdmin = user && user.user && user.user.authorization;

    useEffect(() => {
        const fetchUsers = async () => {
            if (!isAdmin) {
                setError('You are not authorized to view this page.');
                return;
            }

            try {
                const response = await fetch('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch users.');
                }

                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, [isAdmin, user]);

    if (!isAdmin) {
        return <div>You are not authorized to view this page.</div>;
    }

    return (
        <div className="profile-page">
            <h2>All Users</h2>
            {error && <p className="error">{error}</p>}
            <div className="users-list">
                {users.map(user => (
                    <div key={user._id} className="user-item">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Liked Projects:</strong> 
                            {user.likedProjects && user.likedProjects.length > 0 
                                ? user.likedProjects.length 
                                : 'None'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;

