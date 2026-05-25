import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  email?: string;
  /** @deprecated Legacy field from username-based auth; new signups use email only. */
  username?: string;
  password: string;
  displayName?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    displayName: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const password = this.get("password") as string;
  this.set("password", await bcrypt.hash(password, 10));
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

User.collection.createIndex({ email: 1 }, { unique: true, sparse: true }).catch(() => {});

export default User;
