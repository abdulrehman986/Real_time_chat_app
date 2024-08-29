import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { NG_ROK } from '../helper/Constants';
import { io } from 'socket.io-client';

interface User {
    userId: string;
    name: string;
    email: string;
    createdAt: string;
}

interface UnreadCounts {
    [key: string]: number;
}

interface UnreadCountItem {
    senderId: string;
    unreadCount: number;
}

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});
    const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        checkSession();
    }, [navigate]);

    const checkSession: any = async () => {
        try {
            const response = await axios.get(`${NG_ROK}/v0/session`, {
                withCredentials: true
            });
            const { userId } = response.data;
            fetchUsers();
            fetchUnreadCounts(userId); // Pass userId to fetchUnreadCounts
            return userId;
        } catch (err) {
            navigate('/login');
        }
    };

    useEffect(() => {
        const initSocket = async () => {
            const userId = await checkSession();

            if (userId) {
                const socket = io(`${NG_ROK}`);


                socket.on('receiveMessage', (message) => {
                    if (message.recipientId === userId && message.senderId !== userId) {
                        setUnreadCounts((prevCounts) => {
                            const updatedCounts = { ...prevCounts };
                            updatedCounts[message.senderId] = (updatedCounts[message.senderId] || 0) + 1;
                            return updatedCounts;
                        });
                    }
                });
                return () => {
                    socket.off('receiveMessage');
                    socket.disconnect();
                };
            }
        };

        initSocket();
    }, [navigate]);

    useEffect(() => {
        const total = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
        setTotalUnreadCount(total);
    }, [unreadCounts]);
    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>(`${NG_ROK}/v0/users`, {
                withCredentials: true
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        }
    };

    const fetchUnreadCounts = async (userId: string) => {
        try {
            const response = await axios.get<UnreadCountItem[]>(`${NG_ROK}/v0/unread-messages`, {
                withCredentials: true,
                params: { recipientId: userId }
            });
            const counts: UnreadCounts = {};
            let total = 0;
            response.data.forEach(item => {
                counts[item.senderId] = item.unreadCount;
                total += item.unreadCount;
            });
            setUnreadCounts(counts);
            setTotalUnreadCount(total);
        } catch (err) {
            console.error('Error fetching unread counts:', err);
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

    return (
        <div className="font-sans">
            <div className="flex justify-between mb-4">
                <div className="relative">
                    <span className="text-lg font-bold">Users</span>
                    {totalUnreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalUnreadCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Log out
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600 whitespace-nowrap">
                        <tr>
                            <th className="px-4 py-4 text-xs font-semibold text-white uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-white uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-white uppercase tracking-wider">
                                Joined At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                        {users.map((user) => (
                            <tr key={user.userId}>
                                <td className="px-4 py-4 text-sm text-gray-800">
                                    <div className="relative inline-block">
                                        <Link to={`/chat/${user.userId}`} state={{ userName: user.name }} className="hover:underline">
                                            {user.name || 'N/A'}
                                        </Link>
                                        {unreadCounts[user.userId] > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {unreadCounts[user.userId]}
                                            </span>
                                        )}
                                    </div>
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
