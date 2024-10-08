import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Define an interface representing a token object.
 */
interface IToken {
  token: string;
}
enum UserRole {
  StaffMember = 'staffmember',
  Admin = 'admin',
  Student = 'student',
  SuperAdmin = 'superAdmin'
};
/**
 * Define an interface representing a user document in MongoDB.
 * Extends Document to inherit properties and methods like save(), _id, etc.
 */
interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId | string;
  username: string;
  password: string;
  role: UserRole;
  tokens: IToken[];
}

/**
 * Create a schema corresponding to the document interface.
 */
const usersSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.StaffMember
    },
    tokens: [String],
  },
  { timestamps: true },
);

/********************************************************
 * MIDDLEWARE FOR HANDLING SAVE EVENT and diffrent methods
 ********************************************************/
usersSchema.pre<IUser>('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 10);
  }

  next();
});
usersSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = JSON.parse(JSON.stringify(user));
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

/**
 * Create a model based on the schema and interface.
 */
const User: Model<IUser> = mongoose.model<IUser>('user', usersSchema);

export { User, IUser, UserRole };
