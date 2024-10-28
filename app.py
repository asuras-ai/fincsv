from flask import Flask, render_template, request, send_file, jsonify
import os
import pandas as pd
import ccxt
import yfinance as yf
from io import BytesIO
import datetime
#import docker

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    try:
        data_source = request.form['source']
        symbol = request.form['symbol']
        from_date = request.form['from']
        to_date = request.form['to']
        timeframe = request.form['timeframe']

        # Parse dates
        from_datetime = datetime.datetime.strptime(from_date, "%Y-%m-%d")
        to_datetime = datetime.datetime.strptime(to_date, "%Y-%m-%d")

        if data_source == 'ccxt':
            exchange = ccxt.binance()  # You can change the exchange as needed
            since = exchange.parse8601(from_datetime.isoformat())
            ohlcv = exchange.fetch_ohlcv(symbol, timeframe, since=since)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

        elif data_source == 'yfinance':
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=from_date, end=to_date, interval=timeframe)            

        else:
            return jsonify({'error': 'Invalid source selected'}), 400

        # Ensure data is fetched
        if df.empty:
            return jsonify({'error': 'No data found for the given parameters'}), 400

        # Save to CSV
        csv_data = BytesIO()
        df.to_csv(csv_data)#, index=False, encoding='utf-8')
        csv_data.seek(0)

        return send_file(csv_data, mimetype='text/csv', as_attachment=True, download_name=f"{symbol.replace('/', '_')}_{timeframe}_data.csv")
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)