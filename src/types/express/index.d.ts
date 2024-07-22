import { IJwtTokenData } from '../../interfaces/IJwtData';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtTokenData;
    }
  }
}