// src/components/LoginComponent.js
import React, { useState } from 'react';
import { Button, Form, FormGroup, FormLabel as Label, FormControl as Input } from 'react-bootstrap';

const LoginComponent = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            if (!response.ok) {
                const errorMsg = await response.text();
                setError(errorMsg);
                return;
            }
            
            const userData = await response.json();
            handleLogin(userData);
        } catch (err) {
            console.error('Login failed:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="username">Username</Label>
                <Input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormGroup>
            {error && <div className="alert alert-danger">{error}</div>}
            <Button type="submit">Login</Button>
        </Form>
    );
};

export default LoginComponent;