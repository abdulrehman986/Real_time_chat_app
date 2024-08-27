import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:5050/v0/signup', formData);
            console.log(response.data);
            setSuccess(true);
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during sign up');
        }
    };

    return (
        <div className="form-box">
            <form className="form" onSubmit={handleSubmit}>
                <span className="title">Sign up</span>
                <span className="subtitle">Create a free account with your email.</span>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">Sign up successful!</p>}
                <div className="form-container">
                    <input
                        type="text"
                        className="input"
                        placeholder="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
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
                <button type="submit">Sign up</button>
            </form>
            <div className="form-section">
                <p>
                    Have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;