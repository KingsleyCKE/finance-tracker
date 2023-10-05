// For example, your IncomeListComponent.js might look something like this:
import React from 'react';
import { Table } from 'react-bootstrap';  // assuming you are using Bootstrap

const IncomeListComponent = ({ incomes }) => {
    return (
        <div>
            <h1>Incomes</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {incomes && incomes.length > 0 ? (
                        incomes.map(income => (
                            <tr key={income.id}>
                                <td>{income.description}</td>
                                <td>${income.amount}</td>
                                <td>{income.date}</td>
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

export default IncomeListComponent;