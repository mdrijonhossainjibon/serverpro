import { Router } from "express";

export const memberLevelsRouter = Router();


memberLevelsRouter.get('/' , (req , res) => res.json({ kLine : {
    "deposit": {
      "minimum_level": 3
    },
    "withdraw": {
      "minimum_level": 3
    },
    "trading": {
      "minimum_level": 3
    }
  }  }) );