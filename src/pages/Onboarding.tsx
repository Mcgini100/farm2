import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Sprout, Tractor, Wheat } from 'lucide-react';

export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [farmType, setFarmType] = useState<'crop' | 'livestock' | 'mixed'>('mixed');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await db.settings.add({
                name,
                farmType,
                currency: 'USD', // Default for Zim
                onboardingCompleted: true
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to save settings', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sprout className="text-primary-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to FarmSmart</h1>
                    <p className="text-gray-600 dark:text-gray-400">Let's get your farm set up for success.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            What should we call you?
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Farmer Musa"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            What kind of farming do you do?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setFarmType('crop')}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${farmType === 'crop'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'
                                    }`}
                            >
                                <Wheat size={24} />
                                <span className="text-xs font-medium">Crops</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFarmType('livestock')}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${farmType === 'livestock'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'
                                    }`}
                            >
                                <Tractor size={24} />
                                <span className="text-xs font-medium">Livestock</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFarmType('mixed')}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${farmType === 'mixed'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'
                                    }`}
                            >
                                <Sprout size={24} />
                                <span className="text-xs font-medium">Mixed</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Setting up...' : 'Get Started'}
                    </button>
                </form>
            </div>
        </div>
    );
};
