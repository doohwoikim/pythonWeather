/**
 * Get background gradient based on weather condition
 * @param {string} condition - Weather condition (e.g., 'Clear', 'Rain', 'Snow')
 * @param {string} theme - Current theme ('dark' or 'light')
 * @returns {Object} Background gradient CSS properties
 */
export function getWeatherBackground(condition, theme = 'dark') {
    const isDark = theme === 'dark';

    // Normalize condition to lowercase
    const weather = condition?.toLowerCase() || '';

    // Weather-based backgrounds
    const backgrounds = {
        // Clear/Sunny
        clear: {
            dark: {
                gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
                radial: 'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)'
            },
            light: {
                gradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 50%, #60a5fa 100%)',
                radial: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)'
            }
        },
        // Clouds
        clouds: {
            dark: {
                gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
                radial: 'radial-gradient(circle at 80% 80%, rgba(148, 163, 184, 0.1) 0%, transparent 50%)'
            },
            light: {
                gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
                radial: 'radial-gradient(circle at 80% 80%, rgba(203, 213, 225, 0.3) 0%, transparent 50%)'
            }
        },
        // Rain/Drizzle
        rain: {
            dark: {
                gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
                radial: 'radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)'
            },
            light: {
                gradient: 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%)',
                radial: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)'
            }
        },
        // Thunderstorm
        thunderstorm: {
            dark: {
                gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                radial: 'radial-gradient(circle at 30% 40%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)'
            },
            light: {
                gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                radial: 'radial-gradient(circle at 30% 40%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)'
            }
        },
        // Snow
        snow: {
            dark: {
                gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                radial: 'radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.15) 0%, transparent 50%)'
            },
            light: {
                gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                radial: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)'
            }
        },
        // Mist/Fog/Haze
        mist: {
            dark: {
                gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
                radial: 'radial-gradient(circle at 40% 60%, rgba(161, 161, 170, 0.1) 0%, transparent 50%)'
            },
            light: {
                gradient: 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 50%, #d4d4d8 100%)',
                radial: 'radial-gradient(circle at 40% 60%, rgba(228, 228, 231, 0.3) 0%, transparent 50%)'
            }
        },
        // Default (original liquid design)
        default: {
            dark: {
                gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                radial: `radial-gradient(circle at 20% 50%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 50% 20%, rgba(57, 255, 20, 0.05) 0%, transparent 50%)`
            },
            light: {
                gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 50%, #dbeafe 100%)',
                radial: `radial-gradient(circle at 20% 50%, rgba(8, 145, 178, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(192, 38, 211, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 50% 20%, rgba(101, 163, 13, 0.08) 0%, transparent 50%)`
            }
        }
    };

    // Match weather condition
    let selectedBg = backgrounds.default;

    if (weather.includes('clear') || weather.includes('sun')) {
        selectedBg = backgrounds.clear;
    } else if (weather.includes('cloud')) {
        selectedBg = backgrounds.clouds;
    } else if (weather.includes('rain') || weather.includes('drizzle')) {
        selectedBg = backgrounds.rain;
    } else if (weather.includes('thunder') || weather.includes('storm')) {
        selectedBg = backgrounds.thunderstorm;
    } else if (weather.includes('snow') || weather.includes('sleet')) {
        selectedBg = backgrounds.snow;
    } else if (weather.includes('mist') || weather.includes('fog') || weather.includes('haze')) {
        selectedBg = backgrounds.mist;
    }

    return isDark ? selectedBg.dark : selectedBg.light;
}
