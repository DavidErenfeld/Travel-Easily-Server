import mongoose from "mongoose";

export interface IUsers {
  _id?: string;
  email: string;
  password: string;
  userName: string;
  imgUrl?: string;
  tokens?: string[];
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
    required: true,
  },
  imgUrl: {
    type: String,
  },
  tokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUsers>("User", usersSchema);
