import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Thermometer, Clock } from 'lucide-react';

/**
 * WeatherCard component - Individual city weather card
 * Redesigned with "Invisible Glass" aesthetic
 */
function WeatherCard({ data, onClick, formatTemperature, getLocalTime, getAqiLevel }) {
    const { weather, airQuality } = data;
    const aqiData = airQuality?.list?.[0];
    const aqiLevel = aqiData ? getAqiLevel(aqiData.main.aqi) : null;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card relative overflow-hidden rounded-2xl p-6 cursor-pointer group"
            onClick={() => onClick(data)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick(data);
            }}
        >
            {/* Background Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{weather.name}</h2>
                            <div className="flex items-center text-white/60 text-sm">
                                <Clock size={14} className="mr-1" />
                                <time>{getLocalTime(weather.timezone)}</time>
                            </div>
                        </div>
                        {aqiLevel && (
                            <div
                                className="px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-1"
                                style={{ backgroundColor: `${aqiLevel.color}40`, color: '#fff' }}
                            >
                                <span>{aqiLevel.emoji}</span>
                                <span>AQI {aqiData.main.aqi}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-5xl font-light text-white tracking-tighter">
                                {formatTemperature(weather.main.temp)}°
                            </span>
                            <span className="text-white/80 capitalize mt-1 font-medium">
                                {weather.weather[0].description}
                            </span>
                        </div>
                        <img
                            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                            alt={weather.weather[0].description}
                            className="w-24 h-24 filter drop-shadow-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                        <div className="flex items-center text-white/60 text-xs mb-1">
                            <Thermometer size={14} className="mr-1" /> High/Low
                        </div>
                        <div className="text-white font-semibold">
                            {formatTemperature(weather.main.temp_max)}° / {formatTemperature(weather.main.temp_min)}°
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                        <div className="flex items-center text-white/60 text-xs mb-1">
                            <Droplets size={14} className="mr-1" /> Humidity
                        </div>
                        <div className="text-white font-semibold">
                            {weather.main.humidity}%
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

WeatherCard.propTypes = {
    data: PropTypes.shape({
        weather: PropTypes.object.isRequired,
        airQuality: PropTypes.object
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    formatTemperature: PropTypes.func.isRequired,
    getLocalTime: PropTypes.func.isRequired,
    getAqiLevel: PropTypes.func.isRequired
};

export default WeatherCard;
