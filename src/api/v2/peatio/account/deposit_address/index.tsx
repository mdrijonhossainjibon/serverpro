import { Router } from "express";

export const deposit_addressRouter = Router();


deposit_addressRouter.get('/' , (req , res) => res.json({ d : 
    {
        "currencies": ["btc"],
        "address": "2NCimTNGnbm92drX7ARcwBKw6rvr456VWym",
        "state": "active"
    }
    
    }))