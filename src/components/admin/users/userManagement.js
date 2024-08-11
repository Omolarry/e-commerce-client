import React, { Fragment, useState, useEffect } from 'react';
import { getAllUsers, SuspendUser, ActivateUser } from "./FetchApi";
import './userStyles.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            if (response && response.Users && Array.isArray(response.Users)) {
                const sortedUsers = response.Users.sort((a, b) => a.name.localeCompare(b.name));
                setUsers(sortedUsers);
            } else {
                console.error('Invalid response data:', response);
                setUsers([]); // Ensure users is always an array
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]); // Ensure users is always an array even on error
        }
    };

    const suspendUser = async (userId) => {
        try {
            const response = await SuspendUser(userId);
            if (response && response.success) {
                setNotification({ message: 'User suspended successfully!', type: 'success' });
            } else {
                setNotification({ message: 'Failed to suspend user.', type: 'error' });
            }
        } catch (error) {
            console.error('Error suspending user:', error);
            setNotification({ message: 'Error suspending user.', type: 'error' });
        }
        fetchUsers();
    };

    const activateUser = async (userId) => {
        try {
            const response = await ActivateUser(userId);
            if (response && response.success) {
                setNotification({ message: 'User activated successfully!', type: 'success' });
            } else {
                setNotification({ message: 'Failed to activate user.', type: 'error' });
            }
        } catch (error) {
            console.error('Error activating user:', error);
            setNotification({ message: 'Error activating user.', type: 'error' });
        }
        fetchUsers();
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'suspended') return user.status === 'suspended';
        if (filter === 'active') return user.status === 'active';
        return true;
    }).filter(user => {
        const searchLower = search.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower) || user._id.toLowerCase().includes(searchLower);;
    });

    return (
        <Fragment>
            <div className="user-management">
                {notification.message && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}
                <div className="controls">
                    <label>
                        Filter:
                        <select value={filter} onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </label>
                    <input
                        type="text"
                        placeholder="Search for a user..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>
                                    {user.status === 'suspended' ? (
                                        <button className='activate-btn' onClick={() => activateUser(user._id)}>Activate</button>
                                    ) : (
                                        <button className='suspend-btn' onClick={() => suspendUser(user._id)}>Suspend</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};

export default UserManagement;
