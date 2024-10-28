import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ArrowRight } from 'lucide-react';

const FinCSV = () => {
  const [source, setSource] = useState('yfinance');
  const [symbol, setSymbol] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [timeframe, setTimeframe] = useState('1d');
  const [loading, setLoading] = useState(false);

  const timeframes = {
    yfinance: ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'],
    ccxt: ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', '1M']
  };

  const handleDownload = async () => {
    setLoading(true);
    // Simulated download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    // In a real implementation, this would fetch data from the selected source
    // and create a CSV file for download
    const csvContent = `timestamp,open,high,low,close,volume\n${new Date().toISOString()},100,105,98,103,1000000`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${symbol}_${timeframe}_${fromDate}_${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">FinCSV</CardTitle>
          <p className="text-center text-gray-500">Download Financial Market Data. Seamlessly.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Source Selection */}
          <div className="space-y-2">
            <Label>Data Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yfinance">Yahoo Finance</SelectItem>
                <SelectItem value="ccxt">CCXT (Crypto)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Symbol Input */}
          <div className="space-y-2">
            <Label>Symbol</Label>
            <Input 
              placeholder={source === 'ccxt' ? "BTC/USDT" : "AAPL"} 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes[source].map((tf) => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Download Button */}
          <Button 
            className="w-full"
            onClick={handleDownload}
            disabled={!symbol || !fromDate || !toDate || loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinCSV;