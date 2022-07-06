import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [25, "First name must be less than 25 characters"],
    },
    lName: {
      type: String,
      required: true,
      trim: true,
      maxLength: [60, "Last name must be less than 60 characters"],
    },
    dob: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxLength: [60, "Email must be less than 60 characters"],
      unique: true,
      index: 1,
    },
    emailValidationCode: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxLength: [15, "Phone number must be less than 15 characters"],
      minLength: [10, "Phone number must be at least 10 characters"],
    },
    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "n/a",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
