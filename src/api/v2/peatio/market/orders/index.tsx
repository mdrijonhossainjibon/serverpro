import { Router } from "express";


export const ordersRouter = Router();

ordersRouter.post('/', (req, res) => res.json({
    orders: 
    {
        "id": 7070,
        "side": "buy",
        "ord_type": "market",
        "price": null,
        "avg_price": "0.0",
        "state": "wait",
        "market": "ethusd",
        "created_at": "2018-12-14T11:34:44+01:00",
        "origin_volume": "0.5",
        "remaining_volume": "0.5",
        "executed_volume": "0.0",
        "trades_count": 0
    }
}));


ordersRouter.get('/', (req, res) => res.json({
    orders: [
        {"id":162167,
            "side":"buy",
            "ord_type":"limit",
            "price":"0.3",
            "avg_price":"0.4",
            "state":"done",
            "market":"ltczar",
            "created_at":"2018-11-29T16:54:46+01:00",
            "origin_volume":"123.1234",
            "remaining_volume":"123.1234",
            "executed_volume":"0.0",
            "trades_count":0
           },
           {"id":162119,
            "side":"sell",
            "ord_type":"limit",
            "price":"0.3",
            "avg_price":"0.4",
            "state":"done",
            "market":"ltczar",
            "created_at":"2018-11-20T10:24:48+01:00",
            "origin_volume":"123.1234",
            "remaining_volume":"123.1234",
            "executed_volume":"0.0",
            "trades_count":0
           },
           {"id":162003,
            "side":"buy",
            "ord_type":"market",
            "price":"0.1",
            "avg_price":"0.4",
            "state":"done",
            "market":"ltczar",
            "created_at":"2018-11-09T13:21:55+01:00",
            "origin_volume":"123.1234",
            "remaining_volume":"123.1234",
            "executed_volume":"0.0",
            "trades_count":0
           }
      ]
}));



ordersRouter.post('/cancel', (req, res) => res.json({
    orders: 
    [
      { "id":162,
        "side":"buy",
        "ord_type":"limit",
        "price":"0.3",
        "avg_price":"0.4",
        "state":"cancel",
        "market":"ethbtc",
        "created_at":"2018-11-29T16:54:46+01:00",
        "origin_volume":"123.1234",
        "remaining_volume":"123.1234",
        "executed_volume":"0.0",
        "trades_count":0
      },
      { "id":16,
        "side":"sell",
        "ord_type":"limit",
        "price":"0.3",
        "avg_price":"0.4",
        "state":"cancel",
        "market":"ethbtc",
        "created_at":"2018-11-20T10:24:48+01:00",
        "origin_volume":"123.1234",
        "remaining_volume":"123.1234",
        "executed_volume":"0.0",
        "trades_count":0
      },
      { "id":162,
        "side":"buy",
        "ord_type":"market",
        "price":"0.1",
        "avg_price":"0.4",
        "state":"cancel",
        "market":"btczar",
        "created_at":"2018-11-09T13:21:55+01:00",
        "origin_volume":"123.1234",
        "remaining_volume":"123.1234",
        "executed_volume":"0.0",
        "trades_count":0
      }
    ]
}));