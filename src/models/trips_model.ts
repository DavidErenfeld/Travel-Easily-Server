import mongoose from "mongoose";

export interface ITrips {
  _id?: string;
  owner: string;
  typeTraveler: string;
  country: string;
  typeTrip: string;
  numOfDays: number;
  tripDescription: string[];
}

const tripsSchema = new mongoose.Schema<ITrips>({
  owner: {
    type: String,
    required: true,
  },
  typeTraveler: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  typeTrip: {
    type: String,
    required: true,
  },
  numOfDays: {
    type: Number,
    required: true,
  },
  tripDescription: {
    type: [String],
    required: true,
  },
});

export default mongoose.model<ITrips>("Trip", tripsSchema);
