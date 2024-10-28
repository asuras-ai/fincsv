from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import yfinance as yf
import ccxt
import pandas as pd
from datetime import datetime
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataRequest(BaseModel):
    source: str
    symbol: str
    from_date: str
    to_date: str
    timeframe: str

@app.post("/download")
async def download_data(request: DataRequest):
    try:
        if request.source == "yfinance":
            data = await fetch_yfinance_data(request)
        else:
            data = await fetch_ccxt_data(request)
        
        # Convert to CSV
        buffer = io.StringIO()
        data.to_csv(buffer, index=True)
        csv_content = buffer.getvalue()
        
        return {"csv": csv_content}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def fetch_yfinance_data(request: DataRequest):
    ticker = yf.Ticker(request.symbol)
    data = ticker.history(
        interval=request.timeframe,
        start=request.from_date,
        end=request.to_date
    )
    return data

async def fetch_ccxt_data(request: DataRequest):
    exchange = ccxt.binance()
    timeframe_map = {
        "1m": "1m",
        "5m": "5m",
        "1h": "1h",
        "1d": "1d"
    }
    
    ohlcv = exchange.fetch_ohlcv(
        request.symbol,
        timeframe_map[request.timeframe],
        exchange.parse8601(request.from_date),
        exchange.parse8601(request.to_date)
    )
    
    df = pd.DataFrame(
        ohlcv,
        columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
    )
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    return df

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)