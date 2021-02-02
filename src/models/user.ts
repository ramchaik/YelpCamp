import mongoose, { AuthenticationResult, PassportLocalModel } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

interface UserAttrs {
  email: string;
  username: string;
  password: string;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  username: string;
  password: string;
}

interface AuthenticateMethod<T> {
  (username: string, password: string): Promise<AuthenticationResult>;
  (
    username: string,
    password: string,
    cb: (err: any, user: T | boolean, error: any) => void
  ): void;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): Promise<UserDoc>;
  authenticate(): AuthenticateMethod<any>;
  serializeUser(): (
    user: PassportLocalModel<any>,
    cb: (err: any, id?: any) => void
  ) => void;
  deserializeUser(): (
    username: string,
    cb: (err: any, user?: any) => void
  ) => void;
  register(user: UserDoc, password: string): Promise<UserDoc>;
}

const userSchema = new Schema<UserDoc, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

userSchema.statics.build = async (attrs: UserAttrs): Promise<UserDoc> => {
  const user = new User({ email: attrs.email, username: attrs.username });
  return User.register(user, attrs.password);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
