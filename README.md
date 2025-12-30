# Aether (에테르)

[English](#english) | [한국어](#korean)

---

<a name="korean"></a>
## 🇰🇷 한국어 소개

**Aether**는 고대 그리스어로 '대기'를 뜻하는 이름처럼, 날씨와 대기질 정보를 가장 투명하고 아름답게 전달하는 웹 애플리케이션입니다. "Invisible Glass" 디자인 철학을 바탕으로 정보와 배경이 하나가 되는 몰입형 경험을 제공합니다.

### 🚀 프로젝트 소개

이 프로젝트는 **Flask** (백엔드)와 **React** (프론트엔드)로 구축된 실시간 날씨 모니터링 시스템입니다. 전 세계 도시의 날씨와 대기질(AQI) 정보를 10초마다 자동으로 업데이트하며, 미세먼지(PM2.5, PM10) 수치도 함께 제공합니다.

### 🛠️ 기술 스택
- **Frontend**: React, Vite, Framer Motion, Axios, Tailwind CSS (Invisible Glass Design)
- **Backend**: Flask, Flask-Caching, Flask-CORS, Requests
- **API**: OpenWeatherMap

### � 설치 및 실행 방법

이 프로젝트는 `backend`와 `frontend`가 분리된 구조로 되어 있으며, 간편한 실행을 위해 `start.sh` 스크립트를 제공합니다.

#### 1. 필수 조건
- Python 3.x
- Node.js & npm
- OpenWeatherMap API Key

#### 2. 환경 변수 설정
각 폴더의 `.env.example` 파일을 복사하여 `.env` 파일을 생성하고 API 키를 입력하세요.

**Backend (`backend/.env`)**
```env
WEATHER_API_KEY=your_api_key_here
FLASK_ENV=development
```

#### 3. 실행
프로젝트 루트 디렉토리(`aether`)에서 다음 명령어를 실행하세요.

```bash
chmod +x start.sh  # (최초 실행 시 권한 부여)
./start.sh
```

스크립트가 실행되면 다음 주소에서 확인하실 수 있습니다:
- **Web App**: http://localhost:5173
- **Backend API**: http://localhost:5001

### 📂 프로젝트 구조
```
aether/
├── backend/            # Flask 서버 (날씨 데이터 캐싱 및 가공)
│   ├── server.py       # 메인 서버 로직
│   └── venv/           # Python 가상환경
├── frontend/           # React 웹 애플리케이션
│   ├── src/            # Components, Pages, Styles
│   └── ...
└── start.sh            # 통합 실행 스크립트
```

---

<a name="english"></a>
## 🇺🇸 English Description

**Aether** takes its name from the ancient Greek word for 'atmosphere', delivering weather and air quality information in the most transparent and beautiful way. Built with the "Invisible Glass" design philosophy, it offers an immersive experience where information blends seamlessly with the background.

### 🚀 Introduction

A real-time weather monitoring system built with **Flask** (Backend) and **React** (Frontend). It automatically updates weather and Air Quality Index (AQI) information for cities worldwide every 10 seconds, including detailed particulate matter (PM2.5, PM10) levels.

### 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, Axios, Tailwind CSS (Invisible Glass Design)
- **Backend**: Flask, Flask-Caching, Flask-CORS, Requests
- **API**: OpenWeatherMap

### 💻 Installation & Usage

This project is structured with separate `backend` and `frontend` directories and includes a `start.sh` script for easy execution.

#### 1. Prerequisites
- Python 3.x
- Node.js & npm
- OpenWeatherMap API Key

#### 2. Environment Setup
Copy `.env.example` to `.env` in both directories and configure your API key.

**Backend (`backend/.env`)**
```env
WEATHER_API_KEY=your_api_key_here
FLASK_ENV=development
```

#### 3. Running the App
Run the following commands from the project root directory (`aether`):

```bash
chmod +x start.sh  # (Grant permission if needed)
./start.sh
```

Once running, you can access:
- **Web App**: http://localhost:5173
- **Backend API**: http://localhost:5001

### � Project Structure
```
aether/
├── backend/            # Flask server (Caching & Processing)
│   ├── server.py       # Main server logic
│   └── venv/           # Python virtual environment
├── frontend/           # React web application
│   ├── src/            # Components, Pages, Styles
│   └── ...
└── start.sh            # Execution script
```
