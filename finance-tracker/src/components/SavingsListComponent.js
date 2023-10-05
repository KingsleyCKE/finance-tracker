// src/components/SavingsListComponent.js
import React from 'react';
import { Table } from 'react-bootstrap';

const SavingsListComponent = ({ savings }) => {
    return (
        <div>
            <h1>Savings</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {savings && savings.length > 0 ? (
                        savings.map(saving => (
                            <tr key={saving.id}>
                                <td>{saving.description}</td>
                                <td>${saving.amount}</td>
                                <td>{saving.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>No data available</td>
                            <td>$0</td>
                            <td>--</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default SavingsListComponent;