import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db';
import { ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const TransactionList: React.FC = () => {
    const transactions = useLiveQuery(() =>
        db.transactions.orderBy('date').reverse().limit(20).toArray()
    );

    if (!transactions) return <div className="text-center py-8 text-gray-500">Loading...</div>;

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
                <p className="text-sm text-gray-400">Record your first sale or expense above.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white px-1">Recent Activity</h3>
            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div key={tx.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="capitalize">{tx.category}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} />
                                        {format(tx.date, 'MMM d')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`font-bold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                            }`}>
                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
