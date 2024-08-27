import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { NG_ROK } from '../helper/Constants';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkSession();
    }, [navigate]);

    const checkSession = async () => {
        try {
            await axios.get(`${NG_ROK}/v0/session`, {
                withCredentials: true
            });
            fetchUsers();
        } catch (err) {
            navigate('/login');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${NG_ROK}/v0/users`, {
                withCredentials: true
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${NG_ROK}/v0/logout`, {}, {
                withCredentials: true
            });
            navigate('/login');
        } catch (err) {
            console.error('Error logging out:', err);
            setError('Failed to log out');
        }
    };

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="font-sans">
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Log out
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 whitespace-nowrap">
                        <tr>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Joined At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                        {users.map((user: any) => (
                            <tr key={user.userId}>
                                <td className="px-4 py-4 text-sm text-gray-800">
                                    <Link to={`/chat/${user.userId}`} state={{ userName: user.name }} className="hover:underline">
                                        {user.name || 'N/A'}
                                    </Link>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-800">
                                    {user.email}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-800">
                                    {formatDate(user.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;