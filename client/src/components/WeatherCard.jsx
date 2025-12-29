import React from 'react';
import PropTypes from 'prop-types';

/**
 * WeatherCard component - Individual city weather card
 */
function WeatherCard({ data, onClick, formatTemperature, getLocalTime, getAqiLevel }) {
    const { weather, airQuality } = data;
    const aqiData = airQuality?.list?.[0];
    const aqiLevel = aqiData ? getAqiLevel(aqiData.main.aqi) : null;

    return (
        <article
            className="weather-card"
            onClick={() => onClick(data)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(data);
                }
            }}
            aria-label={`View details for ${weather.name}`}
        >
            {/* Card Header */}
            <div className="card-header">
                <div>
                    <h2 className="city-name">{weather.name}</h2>
                    <time className="local-time">
                        {getLocalTime(weather.timezone)}
                    </time>
                </div>
            </div>

            {/* Weather Main Info */}
            <div className="weather-main">
                <div className="weather-icon-container">
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                        alt={weather.weather[0].description}
                        className="weather-icon"
                    />
                    <p className="weather-description">
                        {weather.weather[0].description}
                    </p>
                </div>

                <div className="temperature-display">
                    <div className="main-temp">
                        {formatTemperature(weather.main.temp)}°
                    </div>
                    <div className="temp-range">
                        <span className="temp-high">
                            ↑ {formatTemperature(weather.main.temp_max)}°
                        </span>
                        <span className="temp-low">
                            ↓ {formatTemperature(weather.main.temp_min)}°
                        </span>
                    </div>
                </div>
            </div>

            {/* Air Quality Section */}
            <div className="air-quality-section">
                {aqiLevel ? (
                    <>
                        <div
                            className="aqi-badge"
                            style={{ backgroundColor: aqiLevel.color }}
                            role="status"
                            aria-label={`Air quality: ${aqiLevel.level}`}
                        >
                            <span>{aqiLevel.emoji}</span>
                            <span><strong>{aqiLevel.level}</strong></span>
                            <span>(AQI: {aqiData.main.aqi})</span>
                        </div>

                        <div className="pm-metrics">
                            <div className="pm-item">
                                <span className="pm-label">PM2.5</span>
                                <span className="pm-value">
                                    {aqiData.components.pm2_5} µg/m³
                                </span>
                            </div>
                            <div className="pm-item">
                                <span className="pm-label">PM10</span>
                                <span className="pm-value">
                                    {aqiData.components.pm10} µg/m³
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="pm-value">Air quality data unavailable</p>
                )}
            </div>
        </article>
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
