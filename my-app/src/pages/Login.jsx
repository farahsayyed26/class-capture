import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { MdEmail, MdLockOutline } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';

// 1. IMPORT ONLY EMAIL/PASSWORD AUTH
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 


const Login = () => {
    const navigate = useNavigate();

    // STATE FOR INPUTS & STATUS
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const colors = {
        bg: '#F9F9FB',
        border: '#DDE1E9',
        mainBlue: '#8094BD',
        darkNavy: '#343750',
        pastelBlue: '#A3B3D1'
    };

    const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Remove 'replace: true'. This keeps the previous page (Home) in history.
    navigate("/dashboard"); 
  } catch (error) {
    console.error(error);
  }
};

    // 2. HANDLER FOR FIREBASE LOGIN
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successful");
            navigate('/dashboard'); 
        } catch (err) {
            // Mapping Firebase errors to user-friendly messages
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError("Invalid email or password. Please try again.");
            } else {
                setError("An error occurred. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <h2 className="text-center" style={{ color: colors.darkNavy, fontWeight: '700' }}>Welcome Back</h2>
                <p className="text-center text-muted mb-4">Please enter your details to sign in</p>

                {/* SHOW ERROR IF LOGIN FAILS */}
                {error && <Alert variant="danger" style={{ fontSize: '0.85rem' }} className="py-2 text-center">{error}</Alert>}

                <Form onSubmit={handleLoginSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '600', fontSize: '0.85rem', color: colors.darkNavy }}>Email Address</Form.Label>
                        <InputGroup>
                            <InputGroup.Text style={{ backgroundColor: 'transparent', borderRight: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '12px 0 0 12px' }}>
                                <MdEmail color={colors.pastelBlue} />
                            </InputGroup.Text>
                            <Form.Control
                                type="email"
                                placeholder="name@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderLeft: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '0 12px 12px 0', fontSize: '0.9rem' }}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label style={{ fontWeight: '600', fontSize: '0.85rem', color: colors.darkNavy }}>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text style={{ backgroundColor: 'transparent', borderRight: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '12px 0 0 12px' }}>
                                <MdLockOutline color={colors.pastelBlue} />
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderLeft: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '0 12px 12px 0', fontSize: '0.9rem' }}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <div className="text-end mb-4">
                        <button type="button" style={{ background: 'none', border: 'none', color: colors.mainBlue, fontSize: '0.8rem', fontWeight: '600' }}>
                            Forgot Password?
                        </button>
                    </div>

                    <Button 
                        disabled={loading} 
                        type="submit" 
                        style={{ backgroundColor: colors.mainBlue, border: 'none', width: '100%', borderRadius: '12px', padding: '0.8rem', fontWeight: '600' }}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </Form>

                <div className="text-center mt-4">
                    <p style={{ fontSize: '0.9rem', color: colors.darkNavy }}>
                        Don't have an account? 
                        <Link to="/registration" style={{ color: colors.mainBlue, fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>
                            Create Account
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;