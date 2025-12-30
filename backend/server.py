from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
import requests
import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# OpenWeatherMap API configuration
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5'

# Korean to English city name mapping
KOREAN_CITY_MAP = {
    '서울': 'Seoul',
    '부산': 'Busan',
    '인천': 'Incheon',
    '대구': 'Daegu',
    '대전': 'Daejeon',
    '광주': 'Gwangju',
    '울산': 'Ulsan',
    '세종': 'Sejong',
    '수원': 'Suwon',
    '고양': 'Goyang',
    '용인': 'Yongin',
    '창원': 'Changwon',
    '성남': 'Seongnam',
    '청주': 'Cheongju',
    '전주': 'Jeonju',
    '천안': 'Cheonan',
    '안산': 'Ansan',
    '안양': 'Anyang',
    '포항': 'Pohang',
    '제주': 'Jeju',
    '도쿄': 'Tokyo',
    '도꾜': 'Tokyo',
    '오사카': 'Osaka',
    '교토': 'Kyoto',
    '베이징': 'Beijing',
    '북경': 'Beijing',
    '상하이': 'Shanghai',
    '상해': 'Shanghai',
    '홍콩': 'Hong Kong',
    '뉴욕': 'New York',
    '런던': 'London',
    '파리': 'Paris',
    '베를린': 'Berlin',
    '로마': 'Rome',
    '마드리드': 'Madrid',
    '모스크바': 'Moscow',
    '시드니': 'Sydney',
    '멜버른': 'Melbourne',
    '토론토': 'Toronto',
    '밴쿠버': 'Vancouver'
}

def translate_city_name(city: str) -> str:
    """
    Translate Korean city name to English
    If the city is already in English or not in the mapping, return as-is
    """
    return KOREAN_CITY_MAP.get(city, city)

if not WEATHER_API_KEY:
    logger.error("WEATHER_API_KEY environment variable is not set!")
    raise ValueError("WEATHER_API_KEY must be set in .env file")

CORS_ORIGIN = os.getenv('CORS_ORIGIN', 'http://localhost:5173')
FLASK_ENV = os.getenv('FLASK_ENV', 'development')

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGIN}})

# Configure caching
cache = Cache(app, config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 10  # 10 seconds to match client polling
})

# API Configuration
WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
AIR_QUALITY_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/air_pollution"
REQUEST_TIMEOUT = 5  # seconds


def make_api_request(url: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Make an API request with timeout and error handling.
    
    Args:
        url: The API endpoint URL
        params: Query parameters for the request
        
    Returns:
        JSON response data or None if request fails
    """
    try:
        response = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        logger.error(f"Request timeout for URL: {url}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for URL: {url} - Error: {str(e)}")
        return None


@app.route('/api/weather', methods=['GET'])
@cache.cached(timeout=10, query_string=True)
def get_weather():
    """
    Get weather data for a specific city
    Query params:
        - city: City name (required) - accepts Korean or English
    """
    try:
        city = request.args.get('city')
        
        if not city:
            logger.warning("Weather request missing city parameter")
            return jsonify({'error': 'City parameter is required'}), 400
        
        # Translate Korean city name to English if needed
        english_city = translate_city_name(city)
        logger.info(f"Weather request for city: {city} (translated to: {english_city})")
        
        params = {
            'q': english_city,
            'appid': WEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = make_api_request(WEATHER_API_ENDPOINT, params)
        
        if response is None:
            return jsonify({'error': f'Failed to fetch weather data for {city}'}), 500
            
        return jsonify({'weather': response}), 200
        
    except Exception as e:
        logger.error(f"Error in get_weather: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route("/api/air-quality", methods=["GET"])
@cache.cached(query_string=True)
def get_air_quality():
    """
    Get air quality data for specific coordinates.
    
    Query Parameters:
        lat (float): Latitude
        lon (float): Longitude
        
    Returns:
        JSON response with air quality data or error message
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({
            "error": "Missing required parameters: lat and lon",
            "code": 400
        }), 400
    
    try:
        lat_float = float(lat)
        lon_float = float(lon)
    except ValueError:
        return jsonify({
            "error": "Invalid lat/lon values. Must be numbers.",
            "code": 400
        }), 400
    
    logger.info(f"Fetching air quality data for coordinates: ({lat}, {lon})")
    
    params = {
        "lat": lat_float,
        "lon": lon_float,
        "appid": WEATHER_API_KEY,
    }
    
    air_quality_data = make_api_request(AIR_QUALITY_API_ENDPOINT, params)
    
    if air_quality_data is None:
        return jsonify({
            "error": "Failed to fetch air quality data",
            "code": 500
        }), 500
    
    return jsonify({
        "airQuality": air_quality_data,
        "timestamp": datetime.utcnow().isoformat()
    }), 200


@app.route("/api/home", methods=["GET"])
def return_home():
    """
    Legacy endpoint - Get weather for New York.
    Kept for backward compatibility.
    """
    params = {
        "q": "New York",
        "appid": WEATHER_API_KEY,
        "units": "metric",
    }

    weather_data = make_api_request(WEATHER_API_ENDPOINT, params)

    if weather_data is None:
        return jsonify({"error": "Failed to fetch weather data"}), 500
        
    temperature = weather_data["main"]["temp"]
    weather_description = weather_data["weather"][0]["description"]

    return jsonify({
        "message": f"Hello from New York! Current temperature: {temperature}°C",
        "weather_description": weather_description,
    })


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors with JSON response."""
    return jsonify({
        "error": "Endpoint not found",
        "code": 404
    }), 404


@app.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors with JSON response."""
    logger.error(f"Internal server error: {str(e)}")
    return jsonify({
        "error": "Internal server error",
        "code": 500
    }), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": FLASK_ENV
    }), 200


if __name__ == "__main__":
    logger.info(f"Starting Flask server in {FLASK_ENV} mode")
    logger.info(f"CORS origin: {CORS_ORIGIN}")
    app.run(debug=True, port=5001)
