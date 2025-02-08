import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiURL from './common/http';

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setError(null);
        try {
            const response = await fetch(`${apiURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                }),
            });

            const data = await response.json();
            console.log(data);


            if (response.ok) {
                localStorage.setItem("userInfo", JSON.stringify(data)); // Save user data
                navigate('/chat');
            }
            else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('Error connecting to the server');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 position-absolute top-50 start-50 translate-middle">
            <div className="card p-4 shadow-lg text-center" style={{ width: '350px' }}>
                <center>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/724/724715.png"
                        alt="Chat Logo"
                        className="mb-3"
                        style={{ width: '80px' }}
                    />
                </center>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email" ref={emailRef} required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" placeholder="Password" ref={passwordRef} required />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="mt-3">
                    Don't have an account? <Link to="/CreateAccount">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
