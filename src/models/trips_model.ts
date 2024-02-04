import mongoose from "mongoose";

export interface ITrips {
  _id?: string;
  owner?: string;
  userName?: string;
  imgUrl?: string;
  typeTraveler: string;
  country: string;
  typeTrip: string;
  numOfDays: number;
  tripDescription: string[];
  numOfComments: number;
  numOfLikes: number;

  comments?: Array<{
    ownerId: string;
    owner: string;
    comment: string;
    date: Date;
  }>;

  likes?: Array<{
    owner: string;
  }>;
}

const tripsSchema = new mongoose.Schema<ITrips>({
  owner: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
  },

  imgUrl: {
    type: String,
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

  comments: [
    {
      ownerId: String,
      owner: String,
      comment: String,
      date: Date,
    },
  ],

  numOfComments: {
    type: Number,
    required: true,
    default: 0,
  },

  likes: [{ owner: String, date: Date }],

  numOfLikes: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model<ITrips>("Trip", tripsSchema);
