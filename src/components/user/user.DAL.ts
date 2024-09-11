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

  public async DeleteAllUserTokens(user: IUser, tokens: any): Promise<IUser | null> {
    return await user.save();
  }

  public async deleteUserTokens(user: any , token: any) {
    console.log(user, token);
     await User.updateOne({'_id': user._id}, { $pull: {'tokens':{token: token}}})
      .then(() => logger.info(`token delted sucessfully`))
      .catch(err => logger.error(err.message));
  }
}

export const userDAL = new UserDAL();
