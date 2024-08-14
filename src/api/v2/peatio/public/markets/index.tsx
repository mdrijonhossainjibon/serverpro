import { Router } from "express";
import { tickersRouter } from "./tickers";

export const marketsRouter = Router();



const data = [
    {
      "id": "btczar",
      "name": "BTC/ZAR",
      "base_unit": "btc",
      "quote_unit": "zar",
      "ask_fee": "0.0015",
      "bid_fee": "0.0015",
      "min_price": "0.0",
      "max_price": "0.0",
      "min_amount": "0.0",
      "amount_precision": 6,
      "price_precision": 2,
      "state": "enabled"
    },
    {
      "id": "bchzar",
      "name": "BCH/ZAR",
      "base_unit": "busd1",
      "quote_unit": "zar",
      "ask_fee": "0.0015",
      "bid_fee": "0.0015",
      "min_price": "0.0",
      "max_price": "0.0",
      "min_amount": "0.0",
      "amount_precision": 4,
      "price_precision": 4,
      "state": "enabled"
    },
    {
      "id": "ethbtc",
      "name": "ETH/BTC",
      "base_unit": "eth",
      "quote_unit": "btc",
      "ask_fee": "0.0015",
      "bid_fee": "0.0015",
      "min_price": "0.0",
      "max_price": "0.0",
      "min_amount": "0.0",
      "amount_precision": 4,
      "price_precision": 4,
      "state": "enabled"
    },
    {
      "id": "dashbtc",
      "name": "DASH/BTC",
      "base_unit": "busd",
      "quote_unit": "btc",
      "ask_fee": "0.0015",
      "bid_fee": "0.0015",
      "min_price": "0.0",
      "max_price": "0.0",
      "min_amount": "0.0",
      "amount_precision": 4,
      "price_precision": 4,
      "state": "enabled"
    },
    {
      "id": "eurusd",
      "name": "EUR/USD",
      "base_unit": "eur",
      "quote_unit": "usd",
      "ask_fee": "0.0015",
      "bid_fee": "0.0015",
      "min_price": "0.0",
      "max_price": "0.0",
      "min_amount": "0.0",
      "amount_precision": 4,
      "price_precision": 4,
      "state": "enabled"
    }
  ]
  

marketsRouter.get('/' , (req , res) => res.json({ ok : data }) );


const minDay: number = 6;
const maxDay: number = 10;
const fakePeriod: number = 86400;

const timeToPrice = (time: number): number => {
    return minDay + ((maxDay - minDay) / 2) * (1 + Math.cos((time / fakePeriod) * 2 * Math.PI));
};

const timeToVolume = (time: number, periodInSeconds: number): number => {
    return ((maxDay * 10) / 2) * (1 + Math.cos((time / fakePeriod) * 2 * Math.PI));
};

const kLine = (time: number, period: number): [number, number, number, number, number, number] => {
    const periodInSeconds: number = period * 60; // Convert period in minutes to seconds
    time = Math.floor(time / periodInSeconds) * periodInSeconds;
    const open: number = timeToPrice(time);
    const close: number = timeToPrice(time + periodInSeconds);
    const delta: number = ((maxDay - minDay) / fakePeriod) * periodInSeconds * 2;
    const high: number = Math.max(open, close) + delta;
    const low: number = Math.min(open, close) - delta;
    const volume: number = timeToVolume(time, periodInSeconds);
    return [time, open, high, low, close, volume];
};

// Set period to 5 minutes (300 seconds)
const period: number = 1;
const time_to: number = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago (you can adjust this)
const time_from: number = Date.now();
let time: number = time_from;

const k: Array<[number, number, number, number, number, number]> = [];

// Iterate over the time range
while (time > time_to) {
    k.push(kLine(time, period));
    time -= period * 60 * 1000; // Move backwards by 5 minutes
}
 


marketsRouter.get('/k-line' , (req , res) => res.json({ kLine : k.slice(0,500)  }) );
marketsRouter.use('/tickers' , tickersRouter)

