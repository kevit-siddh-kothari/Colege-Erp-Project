import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../components/user/user.module';

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}
class Authorization {
  public async authorizationAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (req.user?.role === 'admin') {
        return next();
      }
      return res.status(403).send(`only admins are authorized to this path !`);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }

  public async authorizationAdminOrStaff(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.role === 'admin' || req.user?.role === 'staffmember') {
        return next();
      }
      res.status(403).send(`only admins or staffmembers are authorized to this path !`);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  public async authorizationStudent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.role === 'student') {
        
        return next();
      }
      res.status(403).send(`only students are authorized to this path !`);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  public async authorizationSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.role === 'superAdmin') {
        
        return next();
      }
      res.status(403).send(`only students are authorized to this path !`);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}
export const authorization = new Authorization();
