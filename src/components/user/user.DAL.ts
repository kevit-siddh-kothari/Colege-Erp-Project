import { logger } from '../../utils/winstone.logger';
import { User, IUser } from './user.module';

class UserDAL {
  /**
   * Find a user by username.
   * @param username - The username to search for.
   * @returns The user object or null if not found.
   * @throws Error if the query fails.
   */
  public async findByUsername(username: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error: any) {
      logger.error(`Error finding user by username: ${error.message}`);
      throw new Error(`Unable to find user: ${error.message}`);
    }
  }

  /**
   * Save a new user to the database.
   * @param user - The user object to save.
   * @returns The saved user object.
   * @throws Error if saving fails.
   */
  public async saveUser(user: IUser): Promise<IUser> {
    try {
      return await user.save();
    } catch (error: any) {
      logger.error(`Error saving user: ${error.message}`);
      throw new Error(`Unable to save user: ${error.message}`);
    }
  }

  /**
   * Delete a user's token.
   * @param user - The user whose token will be deleted.
   * @param token - The token to remove from the user.
   * @returns The result of the update operation.
   * @throws Error if token deletion fails.
   */
  public async deleteUserTokens(user: IUser, token: string): Promise<any> {
    try {
      const result = await User.updateOne(
        { _id: user._id }, 
        { $pull: { token: token } }
      );
      return result;
    } catch (error: any) {
      logger.error(`Error deleting user token: ${error.message}`);
      throw new Error(`Unable to delete user token: ${error.message}`);
    }
  }
}

export const userDAL = new UserDAL();
