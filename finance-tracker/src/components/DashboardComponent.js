// src/components/DashboardComponent.js
import React from 'react';
import IncomeListComponent from './IncomeListComponent';
import ExpenseListComponent from './ExpenseListComponent';
import SavingsListComponent from './SavingsListComponent';
import TransactionListComponent from './TransactionListComponent';

const DashboardComponent = ({ data }) => {
    return (
        <div>
            <h1>Dashboard</h1>
            <IncomeListComponent incomes={data.incomes} />
            <ExpenseListComponent expenses={data.expenses} />
            <SavingsListComponent savings={data.savings} />
            <TransactionListComponent transactions={data.transactions} />
        </div>
    );
};

export default DashboardComponent;