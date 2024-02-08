import mongoose from "mongoose";

export interface IUsers {
  _id?: string;
  email: string;
  password?: string;
  userName: string;
  imgUrl?: string;
  tokens?: string[];
  authType: string;
}

const usersSchema = new mongoose.Schema<IUsers>({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  imgUrl: {
    type: String,
  },
  tokens: {
    type: [String],
    required: false,
  },
  authType: {
    type: String,
    required: true,
    default: "application", // ערך ברירת מחדל עבור משתמשים שנרשמים דרך האפליקציה
  },
});

export default mongoose.model<IUsers>("User", usersSchema);
