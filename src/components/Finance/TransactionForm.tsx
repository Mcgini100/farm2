import React, { useState, useEffect } from 'react';
import { categorizeTransaction } from '../../services/finance';
import { db } from '../../services/db';
import { Send, Loader2 } from 'lucide-react';

interface Props {
    onSuccess: () => void;
    autoFocus?: boolean;
}

export const TransactionForm: React.FC<Props> = ({ onSuccess, autoFocus = false }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [detectedType, setDetectedType] = useState<'income' | 'expense'>('expense');
    const [detectedCategory, setDetectedCategory] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-detect category and type as user types
    useEffect(() => {
        if (!description) return;
        const { type, category } = categorizeTransaction(description);
        setDetectedType(type);
        setDetectedCategory(category);
    }, [description]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        setIsSubmitting(true);
        try {
            await db.transactions.add({
                date: new Date(),
                description,
                amount: parseFloat(amount),
                type: detectedType,
                category: detectedCategory,
                createdAt: new Date()
            });
            setDescription('');
            setAmount('');
            onSuccess();
        } catch (error) {
            console.error('Error adding transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    What happened?
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Sold 50 cabbages for $20"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    rows={2}
                    autoFocus={autoFocus}
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount ($)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                        step="0.01"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium capitalize">
                        {detectedType} ({detectedCategory})
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !description || !amount}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                <span>Save Transaction</span>
            </button>
        </form>
    );
};
