# Python Weather App

날씨 및 대기질 정보를 실시간으로 확인할 수 있는 웹 애플리케이션입니다.

A real-time weather and air quality monitoring web application.

## 🌟 Features / 기능

- 실시간 날씨 정보 조회 / Real-time weather information
- 대기질 지수 (AQI) 모니터링 / Air Quality Index (AQI) monitoring
- 여러 도시 동시 추적 / Multi-city tracking
- 10초마다 자동 업데이트 / Auto-refresh every 10 seconds
- PM2.5, PM10 미세먼지 농도 / Particulate matter levels

## 🏗️ Architecture / 아키텍처

- **Backend**: Flask (Python)
- **Frontend**: React + Vite
- **API**: OpenWeatherMap API

## 📋 Prerequisites / 전제 조건

- Python 3.12+
- Node.js 18+
- OpenWeatherMap API Key ([Get it here](https://openweathermap.org/api))

## 🚀 Installation / 설치

### 1. Clone the repository / 저장소 복제
```bash
git clone <repository-url>
cd pythonWeather-main
```

### 2. Set up Backend / 백엔드 설정

```bash
cd server

# Install pipenv if you don't have it
pip install pipenv

# Install dependencies
pipenv install

# Create .env file from example
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# .env 파일을 열어 OpenWeatherMap API 키를 입력하세요
```

**`.env` file configuration / 설정:**
```env
WEATHER_API_KEY=your_actual_api_key_here
FLASK_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Set up Frontend / 프론트엔드 설정

```bash
cd ../client

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env.local

# The default values should work, but you can customize if needed
# 기본값으로 작동하지만 필요시 수정 가능합니다
```

**`.env.local` file configuration / 설정:**
```env
VITE_API_URL=http://localhost:5001
```

## 🎮 Running the Application / 실행

### Start Backend / 백엔드 시작
```bash
cd server
pipenv run python server.py
```

The backend will run on `http://localhost:5001`

### Start Frontend / 프론트엔드 시작
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🧪 Testing / 테스트

### Test Backend API / 백엔드 API 테스트
```bash
# Health check
curl http://localhost:5001/api/health

# Get weather for a city
curl "http://localhost:5001/api/weather?city=Seoul"

# Get air quality
curl "http://localhost:5001/api/air-quality?lat=37.5665&lon=126.9780"
```

## 🛠️ API Endpoints

### `GET /api/health`
Health check endpoint
- **Response**: `{ "status": "healthy", "timestamp": "...", "environment": "..." }`

### `GET /api/weather?city={city_name}`
Get weather data for a specific city
- **Parameters**: `city` (string, required)
- **Response**: Weather data including temperature, description, etc.

### `GET /api/air-quality?lat={latitude}&lon={longitude}`
Get air quality data for coordinates
- **Parameters**: 
  - `lat` (float, required)
  - `lon` (float, required)
- **Response**: Air quality index and particulate matter levels

## 🔧 Configuration / 설정

### Environment Variables / 환경 변수

**Backend (`server/.env`)**:
- `WEATHER_API_KEY`: Your OpenWeatherMap API key (required)
- `FLASK_ENV`: Development or production mode
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:5173)

**Frontend (`client/.env.local`)**:
- `VITE_API_URL`: Backend API URL (default: http://localhost:5001)

## 📝 Development Notes / 개발 노트

- 서버는 10초 캐싱을 사용하여 API 호출을 최소화합니다
- The server uses 10-second caching to minimize API calls
- 클라이언트는 10초마다 자동으로 데이터를 새로고침합니다
- The client auto-refreshes data every 10 seconds

## 🔒 Security / 보안

- API 키는 절대 코드에 하드코딩하지 마세요
- Never hardcode API keys in the code
- `.env` 파일은 `.gitignore`에 포함되어 있습니다
- `.env` files are included in `.gitignore`
- 항상 `.env.example` 템플릿을 사용하세요
- Always use `.env.example` templates

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
