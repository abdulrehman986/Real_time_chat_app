import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

type MessageAttributes = {
    id: number;
    senderId: string;
    recipientId: string;
    message: string;
};

const ChatCard = () => {
    const [messages, setMessages] = useState<MessageAttributes[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const navigate = useNavigate();
    const { userId: recipientId } = useParams();
    const [user, setUser] = useState<any>(null);
    const [sessionUser, setSessionUser] = useState<any>(null);
    const [error, setError] = useState('');
    const socketRef = useRef<any>(null);

    useEffect(() => {
        checkSession();
        fetchUserDetails();

        socketRef.current = io('http://localhost:5050');

        socketRef.current.on('receiveMessage', (message: MessageAttributes) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socketRef.current.on('previousMessages', (previousMessages: MessageAttributes[]) => {
            setMessages(previousMessages);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [recipientId, navigate]);

    useEffect(() => {
        if (sessionUser && recipientId) {
            socketRef.current.emit('joinChat', { senderId: sessionUser.userId, recipientId });
        }
    }, [sessionUser, recipientId]);

    const checkSession = async () => {
        try {
            const response = await axios.get('http://localhost:5050/v0/session', {
                withCredentials: true
            });
            setSessionUser(response.data);
        } catch (err) {
            navigate('/login');
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/v0/user/${recipientId}`, {
                withCredentials: true
            });
            setUser(response.data);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details');
        }
    };

    const sendMessage = () => {
        if (inputMessage.trim() && sessionUser) {
            const newMessage = {
                senderId: sessionUser.userId,
                recipientId: recipientId!,
                message: inputMessage
            };

            socketRef.current.emit('sendMessage', newMessage);
            setInputMessage('');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!user || !sessionUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-card">
            <div className="chat-header">
                <div className="h2">Chat with {user.name} (ID: {user.userId})</div>
            </div>
            <div className="chat-body">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.senderId === sessionUser.userId ? 'outgoing' : 'incoming'}`}>
                        <p>{message.message}</p>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    placeholder="Type your message"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatCard;