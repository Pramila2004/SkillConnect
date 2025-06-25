import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    otherLinks: {
      type: [String], // ✅ New field for additional social/media links
      default: [],
    },
    skillsHave: {
      type: [String],
      default: [], // Skills user can offer
    },
    skillsWant: {
      type: [String],
      default: [], // Skills user wants to learn
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
