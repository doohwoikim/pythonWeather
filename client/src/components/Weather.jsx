import { useState, useEffect } from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import { useTheme } from '../context/ThemeContext';
import { getWeatherBackground } from '../utils/weatherBackground';
import CityControl from './CityControl';
import WeatherNavbar from './WeatherNavbar';
import WeatherCard from './WeatherCard';
import ThemeToggle from './ThemeToggle';
import './Weather.css';

const defaultCities = ['Seoul'];

function Weather() {
    const [selectedCity, setSelectedCity] = useState('All');
    const [cities, setCities] = useState(defaultCities);
    const [newCity, setNewCity] = useState('');
    const [selectedCityDetail, setSelectedCityDetail] = useState(null);
    const { theme } = useTheme();

    // Use custom hook for weather data
    const { weatherData, isLoading, error, addCity, setError } = useWeatherData(cities);

    // Dynamic background based on weather (only in detail view)
    useEffect(() => {
        if (selectedCityDetail) {
            // Detail view - apply weather-based background
            const weatherCondition = selectedCityDetail.weather.weather[0].main;
            const background = getWeatherBackground(weatherCondition, theme);
            document.body.style.background = background.gradient;
            document.body.style.backgroundAttachment = 'fixed';
        } else {
            // Main grid view - use default background based on theme
            const background = getWeatherBackground('default', theme);
            document.body.style.background = background.gradient;
            document.body.style.backgroundAttachment = 'fixed';
        }
    }, [selectedCityDetail, theme]);

    const handleAddCity = async () => {
        const result = await addCity(newCity);
        if (result.success) {
            setCities([...cities, newCity.trim()]);
            setNewCity('');
        }
    };

    const handleRemoveCity = (cityToRemove) => {
        if (cities.length <= 1) {
            setError('At least one city must remain');
            return;
        }

        setCities(cities.filter(city => city !== cityToRemove));
        setWeatherData(weatherData.filter(data => data.weather.name !== cityToRemove));
        if (selectedCity === cityToRemove) {
            setSelectedCity('All');
        }
    };

    const filteredWeathers = selectedCity === 'All'
        ? weatherData
        : weatherData.filter(data => data.weather.name === selectedCity);

    const formatTemperature = temp => Math.round(temp);

    const getLocalTime = (timezone) => {
        const date = new Date();
        const localTime = date.getTime();
        const localOffset = date.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const cityOffset = timezone * 1000;
        const cityTime = utc + cityOffset;
        return new Date(cityTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getAqiLevel = (aqi) => {
        const levels = [
            { level: 'Excellent', color: '#009966', emoji: '😊' },
            { level: 'Good', color: '#52b947', emoji: '🙂' },
            { level: 'Moderate', color: '#f3ec19', emoji: '😐' },
            { level: 'Unhealthy', color: '#ee5d24', emoji: '😷' },
            { level: 'Very Unhealthy', color: '#c81d25', emoji: '😨' },
            { level: 'Hazardous', color: '#890f21', emoji: '⚠️' }
        ];
        return levels[aqi - 1] || levels[0];
    };

    const handleCardClick = (data) => {
        setSelectedCityDetail(data);
    };

    const handleCloseDetail = () => {
        setSelectedCityDetail(null);
    };

    const handleCityTabClick = (cityName) => {
        // Find the city data and open detail view
        const cityData = weatherData.find(data => data.weather.name === cityName);
        if (cityData) {
            handleCardClick(cityData);
        }
    };

    // Detail view
    if (selectedCityDetail) {
        const { weather, airQuality } = selectedCityDetail;
        const aqiData = airQuality?.list?.[0];
        const aqiLevel = aqiData ? getAqiLevel(aqiData.main.aqi) : null;

        return (
            <div className='weather-app-container detail-view'>
                <ThemeToggle />

                <div className="detail-header">
                    <button
                        className="back-button"
                        onClick={handleCloseDetail}
                        aria-label="Back to all cities"
                    >
                        ← Back
                    </button>
                    <h1 className="detail-city-name">{weather.name}</h1>
                    <time className="detail-time">{getLocalTime(weather.timezone)}</time>
                </div>

                <div className="detail-content">
                    <div className="detail-main-weather">
                        <img
                            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                            alt={weather.weather[0].description}
                            className="detail-weather-icon"
                        />
                        <div className="detail-temp-section">
                            <div className="detail-main-temp">
                                {formatTemperature(weather.main.temp)}°C
                            </div>
                            <p className="detail-weather-description">
                                {weather.weather[0].description}
                            </p>
                            <div className="detail-temp-range">
                                <span>High: {formatTemperature(weather.main.temp_max)}°C</span>
                                <span>•</span>
                                <span>Low: {formatTemperature(weather.main.temp_min)}°C</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-stats-grid">
                        <div className="detail-stat-card">
                            <span className="stat-label">Feels Like</span>
                            <span className="stat-value">{formatTemperature(weather.main.feels_like)}°C</span>
                        </div>
                        <div className="detail-stat-card">
                            <span className="stat-label">Humidity</span>
                            <span className="stat-value">{weather.main.humidity}%</span>
                        </div>
                        <div className="detail-stat-card">
                            <span className="stat-label">Pressure</span>
                            <span className="stat-value">{weather.main.pressure} hPa</span>
                        </div>
                        <div className="detail-stat-card">
                            <span className="stat-label">Wind Speed</span>
                            <span className="stat-value">{weather.wind?.speed || 0} m/s</span>
                        </div>
                    </div>

                    {aqiLevel && (
                        <div className="detail-air-quality">
                            <h2 className="section-title">Air Quality</h2>
                            <div
                                className="detail-aqi-badge"
                                style={{ backgroundColor: aqiLevel.color }}
                            >
                                <span className="aqi-emoji">{aqiLevel.emoji}</span>
                                <div className="aqi-info">
                                    <span className="aqi-level">{aqiLevel.level}</span>
                                    <span className="aqi-index">AQI: {aqiData.main.aqi}</span>
                                </div>
                            </div>

                            <div className="detail-pm-grid">
                                <div className="detail-pm-card">
                                    <span className="pm-label">PM2.5</span>
                                    <span className="pm-value">{aqiData.components.pm2_5}</span>
                                    <span className="pm-unit">µg/m³</span>
                                </div>
                                <div className="detail-pm-card">
                                    <span className="pm-label">PM10</span>
                                    <span className="pm-value">{aqiData.components.pm10}</span>
                                    <span className="pm-unit">µg/m³</span>
                                </div>
                                <div className="detail-pm-card">
                                    <span className="pm-label">CO</span>
                                    <span className="pm-value">{aqiData.components.co.toFixed(1)}</span>
                                    <span className="pm-unit">µg/m³</span>
                                </div>
                                <div className="detail-pm-card">
                                    <span className="pm-label">NO₂</span>
                                    <span className="pm-value">{aqiData.components.no2.toFixed(1)}</span>
                                    <span className="pm-unit">µg/m³</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Main grid view
    return (
        <div className='weather-app-container'>
            <ThemeToggle />

            <div className="app-header">
                <h1 className="app-title">Weather Station</h1>
                <p className="app-subtitle">Real-time weather monitoring dashboard</p>
            </div>

            <div className="weather-container">
                <CityControl
                    newCity={newCity}
                    setNewCity={setNewCity}
                    onAddCity={handleAddCity}
                    isLoading={isLoading}
                    error={error}
                />

                <WeatherNavbar
                    cities={cities}
                    selectedCity={selectedCity}
                    onCitySelect={setSelectedCity}
                    onCityRemove={handleRemoveCity}
                    onCityClick={handleCityTabClick}
                />

                {isLoading && !weatherData.length ? (
                    <div className="loading" role="status">
                        <div className="skeleton-card"></div>
                    </div>
                ) : (
                    <div className="weather-cards-grid">
                        {filteredWeathers.map((data, index) => (
                            <WeatherCard
                                key={index}
                                data={data}
                                onClick={handleCardClick}
                                formatTemperature={formatTemperature}
                                getLocalTime={getLocalTime}
                                getAqiLevel={getAqiLevel}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Weather;