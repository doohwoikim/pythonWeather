import React from 'react';
import PropTypes from 'prop-types';
import { Search, Plus } from 'lucide-react';

/**
 * CityControl component - Handles city input with Aether design
 */
function CityControl({ newCity, setNewCity, onAddCity, isLoading, error }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCity();
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8 relative z-20">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/50 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Search for a city..."
                    className="w-full pl-12 pr-32 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all shadow-lg text-lg"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !newCity.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Plus size={18} />
                            <span>Add</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="absolute -bottom-10 left-0 right-0 text-center animate-bounce">
                    <span className="px-4 py-2 bg-red-500/80 backdrop-blur text-white text-sm rounded-full shadow-lg">
                        ⚠️ {error}
                    </span>
                </div>
            )}
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
