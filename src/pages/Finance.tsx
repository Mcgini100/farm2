import React from 'react';
import { TransactionForm } from '../components/Finance/TransactionForm';
import { TransactionList } from '../components/Finance/TransactionList';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';

const Finance: React.FC = () => {
    const summary = useLiveQuery(async () => {
        const txs = await db.transactions.toArray();
        const income = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expense, balance: income - expense };
    });

    return (
        <div className="p-4 pb-24 space-y-6">
            <header className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finances</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track your farm's money</p>
                </div>
            </header>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/30">
                <p className="text-primary-100 text-sm font-medium mb-1">Total Balance</p>
                <h2 className="text-4xl font-bold mb-6">${summary?.balance.toFixed(2) || '0.00'}</h2>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                        <p className="text-primary-100 text-xs mb-1">Income</p>
                        <p className="font-semibold text-lg">+${summary?.income.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-primary-100 text-xs mb-1">Expenses</p>
                        <p className="font-semibold text-lg">-${summary?.expense.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
            </div>

            <TransactionForm onSuccess={() => { }} />

            <TransactionList />
        </div>
    );
};

export default Finance;
