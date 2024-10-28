# FinCSV - Financial Data Downloader

An elegant and intuitive web application for downloading financial market data in CSV format.

## Project Structure
```
fincsv/
├── docker/
│   ├── Dockerfile
│   └── nginx.conf
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── FinCSV.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── app.py
│   │   └── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/fincsv.git
cd fincsv
```

2. Development Setup
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python src/app.py
```

3. Docker Deployment
```bash
docker-compose up -d --build
```

The application will be available at http://localhost:3000

## Technologies Used
- Frontend: React + Vite
- Backend: Python FastAPI
- Deployment: Docker + Nginx
- Data Sources: yfinance, ccxt