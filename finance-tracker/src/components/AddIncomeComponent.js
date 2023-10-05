// src/components/AddIncomeComponent.js
import React, { useState } from 'react';
import { Button, Form, FormGroup, FormLabel as Label, FormControl as Input } from 'react-bootstrap';

const AddIncomeComponent = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement add income logic
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="description">Description</Label>
                <Input type="text" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label for="amount">Amount</Label>
                <Input type="number" name="amount" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label for="date">Date</Label>
                <Input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormGroup>
            <Button type="submit">Add Income</Button>
        </Form>
    );
};

export default AddIncomeComponent;