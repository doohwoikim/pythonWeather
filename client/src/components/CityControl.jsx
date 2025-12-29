import React from 'react';
import PropTypes from 'prop-types';

/**
 * CityControl component - Handles city input and error display
 */
function CityControl({ newCity, setNewCity, onAddCity, isLoading, error }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCity();
    };

    return (
        <div className="city-controls">
            <form onSubmit={handleSubmit} className="city-form">
                <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Enter city name..."
                    disabled={isLoading}
                    aria-label="City name input"
                />
                <button
                    type="submit"
                    disabled={isLoading || !newCity.trim()}
                    aria-label="Add city"
                >
                    {isLoading ? 'Adding...' : '+ Add City'}
                </button>
            </form>
            {error && <div className="error-message" role="alert">{error}</div>}
        </div>
    );
}

CityControl.propTypes = {
    newCity: PropTypes.string.isRequired,
    setNewCity: PropTypes.func.isRequired,
    onAddCity: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string
};

export default CityControl;
