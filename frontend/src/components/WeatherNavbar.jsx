import React from 'react';
import PropTypes from 'prop-types';
import { X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WeatherNavbar component - Aether styling
 */
function WeatherNavbar({ cities, selectedCity, onCitySelect, onCityRemove, onCityClick }) {
    return (
        <nav className="flex flex-wrap justify-center gap-3 mb-8 px-4" aria-label="City filter">
            <button
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 border ${selectedCity === 'All'
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                onClick={() => onCitySelect('All')}
            >
                <Globe size={16} />
                <span className="font-medium">All Cities</span>
            </button>

            <AnimatePresence>
                {cities.map(city => (
                    <motion.div
                        key={city}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                        className={`group relative flex items-center pl-4 pr-2 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${selectedCity === city
                                ? 'bg-white/20 text-white border-white/30 shadow-lg'
                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <button
                            className="mr-2 font-medium"
                            onClick={() => {
                                if (onCityClick && selectedCity === city) {
                                    onCityClick(city);
                                } else {
                                    onCitySelect(city);
                                }
                            }}
                            onDoubleClick={() => onCityClick && onCityClick(city)}
                        >
                            {city}
                        </button>
                        <button
                            className="p-1 rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCityRemove(city);
                            }}
                            aria-label={`Remove ${city}`}
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
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
