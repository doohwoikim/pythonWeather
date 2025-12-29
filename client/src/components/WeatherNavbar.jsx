import React from 'react';
import PropTypes from 'prop-types';

/**
 * WeatherNavbar component - City filter navigation
 */
function WeatherNavbar({ cities, selectedCity, onCitySelect, onCityRemove, onCityClick }) {
    return (
        <nav className="weather-navbar" aria-label="City filter">
            <button
                className={`nav-button ${selectedCity === 'All' ? 'active' : ''}`}
                onClick={() => onCitySelect('All')}
                aria-pressed={selectedCity === 'All'}
            >
                All Cities
            </button>
            {cities.map(city => (
                <div key={city} className="city-tab">
                    <button
                        className={`nav-button ${selectedCity === city ? 'active' : ''}`}
                        onClick={(e) => {
                            // If onCityClick is provided and city is already selected, open detail
                            if (onCityClick && selectedCity === city) {
                                onCityClick(city);
                            } else {
                                onCitySelect(city);
                            }
                        }}
                        onDoubleClick={() => onCityClick && onCityClick(city)}
                        aria-pressed={selectedCity === city}
                    >
                        {city}
                    </button>
                    <button
                        className="remove-city"
                        onClick={() => onCityRemove(city)}
                        title={`Remove ${city}`}
                        aria-label={`Remove ${city}`}
                    >
                        ×
                    </button>
                </div>
            ))}
        </nav>
    );
}

WeatherNavbar.propTypes = {
    cities: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCity: PropTypes.string.isRequired,
    onCitySelect: PropTypes.func.isRequired,
    onCityRemove: PropTypes.func.isRequired,
    onCityClick: PropTypes.func
};

export default WeatherNavbar;
