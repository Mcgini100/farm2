import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Layout/Shell';
import { Onboarding } from './pages/Onboarding';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './services/db';

import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Tasks from './pages/Tasks';
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-500">Coming soon...</p></div>;

function App() {
    // Check if user has completed onboarding
    const settings = useLiveQuery(() => db.settings.toArray());
    const isLoading = !settings;
    const hasOnboarded = settings && settings.length > 0 && settings[0].onboardingCompleted;

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-earth-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/onboarding" element={hasOnboarded ? <Navigate to="/" /> : <Onboarding />} />

                <Route element={<Shell />}>
                    <Route path="/" element={hasOnboarded ? <Dashboard /> : <Navigate to="/onboarding" />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
