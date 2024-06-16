import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      trim: true,

      required: true,
      enum: {
        values: ["user", "admin"],
        message: "Role is required!",
      },
    },
    password: {
      type: String,
      trim: true,

      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//hashing password:
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

// set ' ' after saving password:
userSchema.post("save", async function (doc, next) {
  doc.password = " ";
  next();
});


userSchema.statics.isUserExistsByCustomId = async function (email:string) {
  return await UserModel.findOne({email});
}


export const UserModel = model<TUser>("User", userSchema);
