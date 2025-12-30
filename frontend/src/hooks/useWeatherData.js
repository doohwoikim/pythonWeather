import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Custom hook for managing weather data
 * @param {Array<string>} cities - Array of city names to fetch weather for
 * @returns {Object} Weather data, loading state, and error state
 */
export function useWeatherData(cities) {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCityData = async (city) => {
        try {
            // Call server API for weather
            const weatherResponse = await axios.get(`${API_URL}/api/weather`, {
                params: { city },
                timeout: 10000
            });

            const weatherDataFromServer = weatherResponse.data.weather;
            const { coord } = weatherDataFromServer;

            // Call server API for air quality
            const airQualityResponse = await axios.get(`${API_URL}/api/air-quality`, {
                params: {
                    lat: coord.lat,
                    lon: coord.lon
                },
                timeout: 10000
            });

            return {
                weather: weatherDataFromServer,
                airQuality: airQualityResponse.data.airQuality
            };
        } catch (err) {
            // Enhanced error handling
            if (err.code === 'ECONNABORTED') {
                throw new Error(`Request timeout for ${city}`);
            } else if (err.response) {
                const errorMsg = err.response.data?.error || err.response.statusText;
                throw new Error(`Failed to fetch data for ${city}: ${errorMsg}`);
            } else if (err.request) {
                throw new Error(`Network error: Cannot connect to server at ${API_URL}`);
            } else {
                throw new Error(`Failed to fetch data for ${city}: ${err.message}`);
            }
        }
    };

    const addCity = async (cityName) => {
        if (!cityName.trim() || cities.includes(cityName.trim())) {
            return { success: false, error: 'City already exists or invalid name' };
        }

        setIsLoading(true);
        setError(null);
        try {
            const newCityData = await fetchCityData(cityName.trim());
            setWeatherData(prev => [...prev, newCityData]);
            return { success: true, data: newCityData };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const promises = cities.map(city => fetchCityData(city));
                const results = await Promise.all(promises);
                setWeatherData(results);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchAllData, 10000);
        return () => clearInterval(interval);
    }, [cities]);

    return {
        weatherData,
        isLoading,
        error,
        addCity,
        setError
    };
}
