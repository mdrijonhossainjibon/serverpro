import { Router } from "express";


export const tradesRouter = Router();

tradesRouter.get('/', (req, res) => res.json({
    trade: [
        { "id": 35, "price": 10894000, "amount": 0.1164, "total": 1268061.6, "market": "btczar", "created_at": 1594951964, "taker_type": "buy" },
        { "id": 34, "price": 10894000, "amount": 0.2414, "total": 2629811.6, "market": "btczar", "created_at": 1594951957, "taker_type": "sell" }
    ]
}));