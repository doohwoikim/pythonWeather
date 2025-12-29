import { useState } from 'react';

/**
 * Custom hook for geolocation functionality
 * @returns {Object} Location data, loading state, error, and request function
 */
export function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return Promise.reject(new Error('Geolocation not supported'));
        }

        setIsLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    setLocation(locationData);
                    setIsLoading(false);
                    resolve(locationData);
                },
                (err) => {
                    let errorMessage = 'Unable to retrieve your location';

                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied';
                            break;
                        case err.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case err.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                        default:
                            errorMessage = 'An unknown error occurred';
                    }

                    setError(errorMessage);
                    setIsLoading(false);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    };

    return { location, isLoading, error, requestLocation };
}
