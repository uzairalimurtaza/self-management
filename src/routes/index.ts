import express, { Router } from "express";
const router: Router = express.Router();
import userAuthRouter from './userAuth';
import statusRouter from "./status.routes";

// Use the routers
router.use('/api/user', userAuthRouter);
router.use('/', statusRouter);  // Add the status route to the root path

export default router;
