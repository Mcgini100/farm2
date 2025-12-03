import { format, addDays } from 'date-fns';

// Types
export interface DailyForecast {
    date: string;
    temp: { min: number; max: number };
    condition: 'sunny' | 'cloudy' | 'rain' | 'storm';
    description: string;
    rainChance: number;
}

export interface WeatherData {
    current: {
        temp: number;
        condition: 'sunny' | 'cloudy' | 'rain' | 'storm';
        humidity: number;
        windSpeed: number;
    };
    daily: DailyForecast[];
    lastUpdated: number;
}

const CACHE_KEY = 'farm_weather_cache';
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

// Mock data generator for demo/offline fallback
const generateMockWeather = (): WeatherData => {
    const conditions: Array<'sunny' | 'cloudy' | 'rain' | 'storm'> = ['sunny', 'cloudy', 'rain', 'sunny', 'rain', 'cloudy', 'sunny'];

    return {
        current: {
            temp: 24,
            condition: 'sunny',
            humidity: 65,
            windSpeed: 12
        },
        daily: Array.from({ length: 7 }).map((_, i) => ({
            date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
            temp: { min: 18, max: 28 },
            condition: conditions[i],
            description: i === 0 ? 'Sunny with some clouds' : 'Partly cloudy',
            rainChance: i === 2 || i === 4 ? 80 : 10
        })),
        lastUpdated: Date.now()
    };
};

export const getWeather = async (): Promise<WeatherData> => {
    // 1. Try to get from cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const data: WeatherData = JSON.parse(cached);
        const isExpired = Date.now() - data.lastUpdated > CACHE_DURATION;

        // If online, try to update. If offline or valid, return cache.
        if (!navigator.onLine) {
            return data;
        }

        if (!isExpired) {
            // Return cached but try to update in background if online
            fetchWeather().then(newData => {
                localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
            }).catch(console.error);
            return data;
        }
    }

    // 2. Fetch new data
    try {
        const data = await fetchWeather();
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Failed to fetch weather', error);
        // Fallback to mock if fetch fails (e.g. no API key)
        return cached ? JSON.parse(cached) : generateMockWeather();
    }
};

// Simulated API call
const fetchWeather = async (): Promise<WeatherData> => {
    // In a real app, fetch from OpenWeatherMap here
    // const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=...&lon=...&appid=...`);
    // return transform(await res.json());

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
    return generateMockWeather();
};

export const getFarmingRecommendation = (weather: WeatherData): string => {
    const today = weather.daily[0];
    const tomorrow = weather.daily[1];

    if (today.condition === 'rain' || today.rainChance > 60) {
        return "It's likely to rain today. Good day for indoor tasks or equipment maintenance. Avoid spraying pesticides.";
    }

    if (tomorrow.condition === 'rain' || tomorrow.rainChance > 60) {
        return "Rain expected tomorrow. If you need to harvest or apply fertilizer, try to do it today.";
    }

    if (today.temp.max > 30) {
        return "High temperatures expected. Ensure livestock has shade and water. Irrigate crops early in the morning.";
    }

    return "Conditions look good for general farming activities. Great day for scouting crops.";
};
