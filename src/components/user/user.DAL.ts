// dal/UserDAL.ts
import { logger } from '../../utils/winstone.logger';
import { User, IUser } from './user.module';

class UserDAL {
  // Find a user by username
  public async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  // Save a new user to the database
  public async saveUser(user: IUser): Promise<IUser> {
    return user.save();
  }

  public async deleteUserTokens(user: any , token: any) {
    
     await User.updateOne({'_id': user._id}, { $pull: {token: token}})
  
  }
}

export const userDAL = new UserDAL();
