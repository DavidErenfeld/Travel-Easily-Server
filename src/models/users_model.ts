import mongoose from "mongoose";

interface IUsers {
  email: string;
  password: string;
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
});

export default mongoose.model<IUsers>("User", usersSchema);
