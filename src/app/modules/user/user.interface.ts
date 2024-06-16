import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TRole = "user" | "admin";

export type TUser = {
  name: string;
  email: string;
  role: TRole;
  password: string;
  phone: string;
  address: string;
};

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(email:string): Promise<TUser>
  isPasswordMatch(userPass: string, hashingPass: string): Promise<boolean>

  }

