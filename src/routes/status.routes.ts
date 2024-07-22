import express, { Router, Request, Response } from "express";
import path from "path";
const statusRouter: Router = express.Router();

statusRouter.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'status.html'));
});

export default statusRouter;
