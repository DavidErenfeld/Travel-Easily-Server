import mongoose from "mongoose";

export interface IUsers {
  _id?: string;
  email: string;
  password: string;
  tokens?: string[];
}

const usersSchema = new mongoose.Schema<IUsers>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUsers>("User", usersSchema);
