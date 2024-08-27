import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NG_ROK } from '../helper/Constants';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        checkSession();
    }, [navigate]);
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${NG_ROK}/v0/login`, formData, {
                withCredentials: true // This is important for sending and receiving cookies
            });
            console.log(response.data);
            // Assuming the server sets the session cookie upon successful login
            navigate('/'); // Redirect to dashboard or home page after login
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during login');
        }
    };
    const checkSession = async () => {
        try {
            await axios.get(`${NG_ROK}/v0/session`, {
                withCredentials: true
            });
            navigate('/');
        } catch (err) {
            navigate('/login');
        }
    };


    return (
        <div className="form-box">
            <form className="form" onSubmit={handleSubmit}>
                <span className="title">Log in</span>
                <span className="subtitle">Enter your email and password.</span>
                {error && <p className="error">{error}</p>}
                <div className="form-container">
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Log in</button>
            </form>
            <div className="form-section">
                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;