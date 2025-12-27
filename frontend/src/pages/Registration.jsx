import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { MdEmail, MdLockOutline, MdPerson } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';

// 1. IMPORT FIREBASE AUTH
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; 


const Registration = () => {
    const navigate = useNavigate();

    // STATE FOR INPUTS & STATUS
    const [fullName, setFullName] = useState("");
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

    // 2. HANDLER FOR FIREBASE REGISTRATION
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Create the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update the profile to include the Full Name
            await updateProfile(userCredential.user, {
                displayName: fullName
            });

            console.log("Registration Successful for:", fullName);
            navigate('/dashboard'); 
        } catch (err) {
            // Handle common Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <h2 className="text-center" style={{ color: colors.darkNavy, fontWeight: '700' }}>Create Account</h2>
                <p className="text-center text-muted mb-4">Join ClassCapture to start your AI study journey</p>

                {/* SHOW ERROR IF REGISTRATION FAILS */}
                {error && <Alert variant="danger" style={{ fontSize: '0.85rem' }} className="py-2 text-center">{error}</Alert>}

                <Form onSubmit={handleFormSubmit}>
                    {/* FULL NAME FIELD */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '600', fontSize: '0.85rem', color: colors.darkNavy }}>Full Name</Form.Label>
                        <InputGroup>
                            <InputGroup.Text style={{ backgroundColor: 'transparent', borderRight: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '12px 0 0 12px' }}>
                                <MdPerson color={colors.pastelBlue} />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{ borderLeft: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '0 12px 12px 0', fontSize: '0.9rem' }}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    {/* EMAIL FIELD */}
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

                    {/* PASSWORD FIELD */}
                    <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '600', fontSize: '0.85rem', color: colors.darkNavy }}>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text style={{ backgroundColor: 'transparent', borderRight: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '12px 0 0 12px' }}>
                                <MdLockOutline color={colors.pastelBlue} />
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="Create a password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderLeft: 'none', border: `1.5px solid ${colors.border}`, borderRadius: '0 12px 12px 0', fontSize: '0.9rem' }}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button 
                        disabled={loading} 
                        type="submit" 
                        style={{ backgroundColor: colors.mainBlue, border: 'none', width: '100%', borderRadius: '12px', padding: '0.8rem', fontWeight: '600' }}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </Form>

                <div className="text-center mt-4">
                    <p style={{ fontSize: '0.9rem', color: colors.darkNavy }}>
                        Already have an account? 
                        <Link to="/login" style={{ color: colors.mainBlue, fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>
                            Log In
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Registration;