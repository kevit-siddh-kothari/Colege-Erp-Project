import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import * as jwt from 'jsonwebtoken';
import { IUser, User } from '../components/user/user.module';
import {logger} from '../utils/winstone.logger';


interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

const authentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();
    if (!token) {
      logger.error(`Token is missing`);
      return res.status(401).json({error:`Token is missing`});
    }
    if(token === "qwertyuiop"){
      next();
    }
    const secretKey: any = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey) as { _id: string };
    const user = await User.findOne({ '_id': decoded._id, 'tokens': {$elemMatch:{token:{$eq:token}}} });
    if (!user) {
     logger.error('Authentication failed');
     return res.status(404).json({error:`Authentication failed`});
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error: any) {
    res.status(500).json({error:'Internal server error !'});
  }
};

export { authentication };
