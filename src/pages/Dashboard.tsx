import React from 'react';
import { WeatherWidget } from '../components/Weather/WeatherWidget';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Link } from 'react-router-dom';
import { Wallet, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
    const settings = useLiveQuery(() => db.settings.toArray());
    const user = settings?.[0];

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

            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/finance" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:border-primary-500 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Add Finance</p>
                            <p className="text-xs text-gray-500">Record income/expense</p>
                        </div>
                    </Link>

                    <Link to="/tasks" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:border-primary-500 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Add Task</p>
                            <p className="text-xs text-gray-500">Schedule farm work</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
