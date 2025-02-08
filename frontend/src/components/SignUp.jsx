import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiURL from './common/http'
const SignUp = () => {
    const navigate = useNavigate();
    const nameref = useRef(null);
    const emailref = useRef(null);
    const passwordref = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiURL}/CreateAccount`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nameref.current.value,
                    email: emailref.current.value,
                    password: passwordref.current.value
                }),
            });
    
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate('/profile')
            } else {
                console.error("Error:", data);
            }
        } catch (error) {
            console.error("Error:", error);
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
                        <input type="text" ref={nameref} className="form-control" placeholder="Full name" required />
                    </div>
                    <div className="mb-3">
                        <input type="email" ref={emailref} className="form-control" placeholder="Email" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" ref={passwordref} className="form-control" placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
                <p className="mt-3">
                    Already have an account? <Link to="/">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
