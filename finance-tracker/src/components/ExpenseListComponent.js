// src/components/ExpenseListComponent.js
import React from 'react';
import { Table } from 'react-bootstrap';

const ExpenseListComponent = ({ expenses }) => {
    return (
        <div>
            <h1>Expenses</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses && expenses.length > 0 ? (
                        expenses.map(expense => (
                            <tr key={expense.id}>
                                <td>{expense.description}</td>
                                <td>${expense.amount}</td>
                                <td>{expense.date}</td>
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

export default ExpenseListComponent;