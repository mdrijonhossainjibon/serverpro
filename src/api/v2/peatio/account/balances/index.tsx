import { Router } from "express";

export const balancesRouter = Router();


balancesRouter.get('/' , (req , res) => res.json({ d : 
    [
      {
        "currency":"busd1",
        "balance":"10.12",
        "locked":"0.1"
      },
      {
        "currency":"btc",
        "balance":"0.21026373",
        "locked":"0.0"
      },
      {
        "currency":"eth",
        "balance":"5.0",
        "locked":"0.0"
      },
      {
        "currency":"busd",
        "balance":"5.0",
        "locked":"0.0"
      },
      {
        "currency":"ltc",
        "balance":"6.0",
        "locked":"0.0"
      },
      {
        "currency":"xrp",
        "balance":null,
        "locked":"0.0"
      },
      {
        "currency":"zar",
        "balance":"1000.0",
        "locked":"0.0"
      },
      {
        "currency":"usd",
        "balance":"1000.0",
        "locked":"0.0"
      },
      {
        "currency":"eur",
        "balance":"1000.0",
        "locked":"0.0"
      },
        {
        "currency":"cx",
        "balance":"1000.0",
        "locked":"0.0"
      }
    ]}))