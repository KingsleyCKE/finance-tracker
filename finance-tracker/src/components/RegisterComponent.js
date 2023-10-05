// src/components/RegisterComponent.js
import React, { useState } from 'react';
import { Button, Form, FormGroup, FormLabel as Label, FormControl as Input, Alert } from 'react-bootstrap';

const RegisterComponent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);  // State to hold registration messages

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/register', {  // Adjusted URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            if (response.ok) {
                // Registration successful
                console.log('Registration successful:', data);
                setMessage("User registered successfully");  // Set success message
                setUsername('');  // Reset username
                setEmail('');  // Reset email
                setPassword('');  // Reset password
            } else {
                // Handle registration error
                console.log('Registration error:', data.message);
                setMessage(data.message || 'Registration failed');  // Set error message
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage('Network error: Unable to register');  // Set network error message
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="username">Username</Label>
                <Input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            <Button type="submit">Register</Button>
            {message && <Alert variant="info">{message}</Alert>}  {/* Display registration message */}
        </Form>
    );
};

export default RegisterComponent;