import React from 'react';
import { WeatherWidget } from '../components/Weather/WeatherWidget';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Link } from 'react-router-dom';
import { Wallet, Calendar, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { isToday, isPast, format } from 'date-fns';

const Dashboard: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.toArray());
    const user = settings?.[0];

    // Finance Data
    const finance = useLiveQuery(async () => {
        const txs = await db.transactions.toArray();
        const now = new Date();
        const currentMonthTxs = txs.filter(t =>
            t.date.getMonth() === now.getMonth() &&
            t.date.getFullYear() === now.getFullYear()
        );

        const income = currentMonthTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = currentMonthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        return { income, expense, balance: income - expense };
    });

    // Tasks Data
    const tasks = useLiveQuery(async () => {
        const allTasks = await db.tasks.filter(t => !t.completed).toArray();
        const urgent = allTasks.filter(t => isToday(t.dueDate) || isPast(t.dueDate));
        return urgent.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    });

    const getFinanceMessage = () => {
        if (!finance) return "Tracking your finances...";
        if (finance.income > finance.expense) return "Great job! You're profitable this month.";
        if (finance.expense > finance.income) return "Watch your expenses this month.";
        return "Keep tracking your transactions.";
    };

    return (
        <div className="p-4 pb-24 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Hello, {user?.name || 'Farmer'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {user?.farmType === 'mixed' ? 'Mixed Farm' : user?.farmType === 'crop' ? 'Crop Farm' : 'Livestock Farm'}
                    </p>
                </div>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                    {user?.name?.[0] || 'F'}
                </div>
            </header>

            <WeatherWidget />

            {/* Finance Widget */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Cash Flow (This Month)</h3>
                </div>

                {finance && (finance.income > 0 || finance.expense > 0) ? (
                    <div className="space-y-4">
                        <div className="flex items-end gap-2 h-24">
                            <div className="flex-1 flex flex-col justify-end gap-1 group">
                                <span className="text-xs text-gray-500 text-center">${finance.income.toFixed(0)}</span>
                                <div
                                    className="bg-green-500 rounded-t-lg w-full transition-all group-hover:bg-green-600"
                                    style={{ height: `${Math.min((finance.income / (Math.max(finance.income, finance.expense) || 1)) * 100, 100)}%` }}
                                ></div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">Income</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-end gap-1 group">
                                <span className="text-xs text-gray-500 text-center">${finance.expense.toFixed(0)}</span>
                                <div
                                    className="bg-red-500 rounded-t-lg w-full transition-all group-hover:bg-red-600"
                                    style={{ height: `${Math.min((finance.expense / (Math.max(finance.income, finance.expense) || 1)) * 100, 100)}%` }}
                                ></div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">Expense</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-900/50 py-2 rounded-lg">
                            {getFinanceMessage()}
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                        No transactions this month.
                    </div>
                )}
            </div>

            {/* Tasks Widget */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Today's Focus
                        {tasks && tasks.length > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                                {tasks.length}
                            </span>
                        )}
                    </h3>
                </div>

                <div className="space-y-3">
                    {tasks && tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                <div className={`w-1 h-8 rounded-full ${isPast(task.dueDate) && !isToday(task.dueDate) ? 'bg-red-500' : 'bg-primary-500'}`}></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        {isPast(task.dueDate) && !isToday(task.dueDate) && <AlertCircle size={12} className="text-red-500" />}
                                        {isToday(task.dueDate) ? 'Due Today' : `Overdue: ${format(task.dueDate, 'MMM d')}`}
                                    </p>
                                </div>
                                <Link to="/tasks" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                    <CheckCircle2 size={16} />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No urgent tasks for today.</p>
                            <Link to="/tasks" className="text-primary-600 text-sm font-medium mt-1 inline-block">Plan ahead +</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/finance?action=add" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:border-primary-500 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Add Finance</p>
                            <p className="text-xs text-gray-500">Record income/expense</p>
                        </div>
                    </Link>

                    <Link to="/tasks?action=add" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:border-primary-500 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Add Task</p>
                            <p className="text-xs text-gray-500">Schedule farm work</p>
                        </div>
                    </Link>

                    <Link to="/prices?action=add" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:border-primary-500 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Market Prices</p>
                            <p className="text-xs text-gray-500">Track local rates</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
