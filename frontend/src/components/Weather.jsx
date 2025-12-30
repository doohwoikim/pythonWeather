import { useState, useEffect } from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import { useTheme } from '../context/ThemeContext';
import { getWeatherBackground } from '../utils/weatherBackground';
import CityControl from './CityControl';
import WeatherNavbar from './WeatherNavbar';
import WeatherCard from './WeatherCard';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wind, Droplets, Thermometer, Activity, MapPin } from 'lucide-react';

const defaultCities = ['Seoul'];

function Weather() {
    const [selectedCity, setSelectedCity] = useState('All');
    const [cities, setCities] = useState(defaultCities);
    const [newCity, setNewCity] = useState('');
    const [selectedCityDetail, setSelectedCityDetail] = useState(null);
    const { theme } = useTheme();

    // Use custom hook for weather data
    const { weatherData, isLoading, error, addCity, setError } = useWeatherData(cities);

    // Dynamic background effect
    useEffect(() => {
        // In a real implementation with Tailwind, we might just set a class or style on a wrapper
        // For now, we'll keep the body background logic but ensure it complements our glass UI
        const condition = selectedCityDetail
            ? selectedCityDetail.weather.weather[0].main
            : 'default';

        const background = getWeatherBackground(condition, theme);
        document.body.style.backgroundImage = background.gradient;
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.transition = 'background-image 1s ease-in-out';
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
        // Optimistically remove from data view
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
        return new Date(utc + cityOffset).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getAqiLevel = (aqi) => {
        const levels = [
            { level: 'Excellent', color: '#10B981', emoji: '🌿' },
            { level: 'Good', color: '#34D399', emoji: '😊' },
            { level: 'Moderate', color: '#FBBF24', emoji: '😐' },
            { level: 'Unhealthy', color: '#F87171', emoji: '😷' },
            { level: 'Very Unhealthy', color: '#EF4444', emoji: '😨' },
            { level: 'Hazardous', color: '#B91C1C', emoji: '☠️' }
        ];
        return levels[aqi - 1] || levels[0];
    };

    const handleCardClick = (data) => setSelectedCityDetail(data);
    const handleCloseDetail = () => setSelectedCityDetail(null);

    const handleCityTabClick = (cityName) => {
        const cityData = weatherData.find(data => data.weather.name === cityName);
        if (cityData) handleCardClick(cityData);
    };

    return (
        <div className="min-h-screen text-white p-4 md:p-8 font-sans transition-colors duration-500">
            {/* Background Overlay Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 mix-blend-overlay"></div>

            <ThemeToggle />

            <div className="relative z-10 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {selectedCityDetail ? (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Detail View */}
                            <button
                                onClick={handleCloseDetail}
                                className="group flex items-center text-white/70 hover:text-white mb-6 transition-colors"
                            >
                                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 mr-2 transition-all">
                                    <ArrowLeft size={20} />
                                </div>
                                <span className="font-medium text-lg">Back to Dashboard</span>
                            </button>

                            <div className="glass-panel rounded-3xl p-8 md:p-12 overflow-hidden relative">
                                {/* Large City Header */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 text-white/60 mb-2">
                                            <MapPin size={18} />
                                            <span className="uppercase tracking-wider text-sm font-semibold">Current Location</span>
                                        </div>
                                        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                            {selectedCityDetail.weather.name}
                                        </h1>
                                        <p className="text-xl text-white/60 mt-2 font-light">
                                            {getLocalTime(selectedCityDetail.weather.timezone)}
                                        </p>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex flex-col items-end">
                                        <div className="text-8xl md:text-9xl font-thin tracking-tighter">
                                            {formatTemperature(selectedCityDetail.weather.main.temp)}°
                                        </div>
                                        <div className="text-2xl font-medium capitalize text-blue-300">
                                            {selectedCityDetail.weather.weather[0].description}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                        <div className="flex items-center gap-2 text-white/50 mb-2">
                                            <Thermometer size={18} />
                                            <span className="text-sm font-medium">Feels Like</span>
                                        </div>
                                        <div className="text-2xl font-semibold">
                                            {formatTemperature(selectedCityDetail.weather.main.feels_like)}°
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                        <div className="flex items-center gap-2 text-white/50 mb-2">
                                            <Droplets size={18} />
                                            <span className="text-sm font-medium">Humidity</span>
                                        </div>
                                        <div className="text-2xl font-semibold">
                                            {selectedCityDetail.weather.main.humidity}%
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                        <div className="flex items-center gap-2 text-white/50 mb-2">
                                            <Wind size={18} />
                                            <span className="text-sm font-medium">Wind</span>
                                        </div>
                                        <div className="text-2xl font-semibold">
                                            {selectedCityDetail.weather.wind?.speed} <span className="text-sm text-white/50">m/s</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                        <div className="flex items-center gap-2 text-white/50 mb-2">
                                            <Activity size={18} />
                                            <span className="text-sm font-medium">Pressure</span>
                                        </div>
                                        <div className="text-2xl font-semibold">
                                            {selectedCityDetail.weather.main.pressure} <span className="text-sm text-white/50">hPa</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Air Quality Section */}
                                {selectedCityDetail.airQuality?.list?.[0] && (
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                            <span className="w-2 h-8 rounded-full bg-green-400"></span>
                                            Air Quality Index
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* AQI Badge */}
                                            <div className="bg-white/5 rounded-3xl p-6 flex items-center justify-between border border-white/10">
                                                <div>
                                                    <div className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Current Status</div>
                                                    <div className="text-3xl font-bold">
                                                        {getAqiLevel(selectedCityDetail.airQuality.list[0].main.aqi).level}
                                                    </div>
                                                </div>
                                                <div
                                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                                                    style={{ backgroundColor: getAqiLevel(selectedCityDetail.airQuality.list[0].main.aqi).color }}
                                                >
                                                    {getAqiLevel(selectedCityDetail.airQuality.list[0].main.aqi).emoji}
                                                </div>
                                            </div>

                                            {/* Pollutants */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {['pm2_5', 'pm10', 'no2', 'o3'].map((pollutant) => (
                                                    <div key={pollutant} className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                                                        <span className="text-white/40 text-xs uppercase font-bold">{pollutant.replace('_', '.')}</span>
                                                        <span className="text-lg font-mono">
                                                            {selectedCityDetail.airQuality.list[0].components[pollutant]}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Dashboard Header */}
                            <div className="text-center mb-12 pt-8">
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h1 className="text-6xl md:text-8xl font-display font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-sm">
                                        Aether
                                    </h1>
                                    <p className="text-xl text-blue-200/80 font-light tracking-wide">
                                        Atmospheric Intelligence & Weather Monitoring
                                    </p>
                                </motion.div>
                            </div>

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

                            {/* Weather Grid */}
                            {isLoading && !weatherData.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
                                >
                                    <AnimatePresence>
                                        {filteredWeathers.map((data) => (
                                            <WeatherCard
                                                key={data.weather.name}
                                                data={data}
                                                onClick={handleCardClick}
                                                formatTemperature={formatTemperature}
                                                getLocalTime={getLocalTime}
                                                getAqiLevel={getAqiLevel}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Weather;