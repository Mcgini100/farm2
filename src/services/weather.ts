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
const API_KEY = '8b4bb7d190d7593e9e2369d82dc13827';

// Mock data generator for fallback
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

const fetchWeather = async (): Promise<WeatherData> => {
    try {
        // Default to Harare, Zimbabwe
        const lat = -17.8292;
        const lon = 31.0522;

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Weather API failed');

        const data = await response.json();

        // Transform API response
        const current = data.list[0];
        const daily: DailyForecast[] = [];

        const seenDates = new Set();
        for (const item of data.list) {
            const date = item.dt_txt.split(' ')[0];
            if (!seenDates.has(date) && seenDates.size < 7) {
                seenDates.add(date);
                daily.push({
                    date,
                    temp: { min: item.main.temp_min, max: item.main.temp_max },
                    condition: item.weather[0].main.toLowerCase().includes('rain') ? 'rain' :
                        item.weather[0].main.toLowerCase().includes('cloud') ? 'cloudy' : 'sunny',
                    description: item.weather[0].description,
                    rainChance: item.pop * 100
                });
            }
        }

        return {
            current: {
                temp: current.main.temp,
                condition: current.weather[0].main.toLowerCase().includes('rain') ? 'rain' :
                    current.weather[0].main.toLowerCase().includes('cloud') ? 'cloudy' : 'sunny',
                humidity: current.main.humidity,
                windSpeed: current.wind.speed
            },
            daily,
            lastUpdated: Date.now()
        };
    } catch (error) {
        console.error('API Error, using mock', error);
        return generateMockWeather();
    }
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
        return cached ? JSON.parse(cached) : generateMockWeather();
    }
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
