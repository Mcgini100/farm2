import React, { useEffect, useState } from 'react';
import { getWeather, getFarmingRecommendation, WeatherData } from '../../services/weather';
import { Cloud, CloudRain, CloudLightning, Sun, Droplets, Wind, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWeather().then(data => {
            setWeather(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>;
    if (!weather) return null;

    const Icon = {
        sunny: Sun,
        cloudy: Cloud,
        rain: CloudRain,
        storm: CloudLightning
    }[weather.current.condition];

    const recommendation = getFarmingRecommendation(weather);
    const isStale = Date.now() - weather.lastUpdated > 1000 * 60 * 60 * 24 * 7;

    return (
        <div className="space-y-4">
            {isStale && (
                <div className="bg-orange-50 text-orange-700 p-3 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    <span>Weather data is old. Connect to internet to update.</span>
                </div>
            )}

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-blue-100 text-sm font-medium">{format(new Date(), 'EEEE, d MMMM')}</p>
                        <h2 className="text-4xl font-bold mt-1">{Math.round(weather.current.temp)}°C</h2>
                        <p className="text-blue-100 capitalize mt-1">{weather.current.condition}</p>
                    </div>
                    <Icon size={48} className="text-blue-100" />
                </div>

                <div className="flex gap-6 mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2">
                        <Droplets size={18} className="text-blue-200" />
                        <span className="text-sm font-medium">{weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wind size={18} className="text-blue-200" />
                        <span className="text-sm font-medium">{weather.current.windSpeed} km/h</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                    Farm Advice
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {recommendation}
                </p>
            </div>
        </div>
    );
};
