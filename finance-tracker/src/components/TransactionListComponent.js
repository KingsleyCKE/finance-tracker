// Your TransactionListComponent.js might look something like this:
import React from 'react';

const TransactionListComponent = ({ transactions }) => {
    return (
        <div>
            <h1>Transactions</h1>
            <ul>
                {transactions && transactions.length > 0 ? (
                    transactions.map(transaction => (
                        <li key={transaction.id}>{transaction.description}: ${transaction.amount}</li>
                    ))
                ) : (
                    <li>No transactions available.</li>
                )}
            </ul>
        </div>
    );
};

export default TransactionListComponent;
