import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Wallet, Calendar, Settings } from 'lucide-react';
import clsx from 'clsx';

export const Shell: React.FC = () => {
    const location = useLocation();

    // Hide bottom nav on onboarding
    if (location.pathname === '/onboarding') {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <main className="max-w-md mx-auto min-h-screen bg-white dark:bg-gray-950 shadow-2xl overflow-hidden relative">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
                <div className="max-w-md mx-auto flex justify-around items-center h-16">
                    <NavLink
                        to="/"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        )}
                    >
                        <Home size={24} strokeWidth={2} />
                        <span className="text-xs font-medium">Home</span>
                    </NavLink>

                    <NavLink
                        to="/finance"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        )}
                    >
                        <Wallet size={24} strokeWidth={2} />
                        <span className="text-xs font-medium">Finance</span>
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        )}
                    >
                        <Calendar size={24} strokeWidth={2} />
                        <span className="text-xs font-medium">Tasks</span>
                    </NavLink>

                    {/* Weather is usually on dashboard, but maybe a dedicated tab or settings? 
              Let's put Settings here for now, Weather can be a widget on Home.
          */}
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        )}
                    >
                        <Settings size={24} strokeWidth={2} />
                        <span className="text-xs font-medium">Settings</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};
