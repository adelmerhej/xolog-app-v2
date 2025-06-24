import mongoose, { Document, Schema, Model } from "mongoose";

interface IClient extends Document {
  FullName: string;
  ActiveDate: Date;
  FollowupDate: Date;
  CnssExpiryDate: Date;
  Country: string;
  Address: string;
  PhoneNumber: string;
  MobileNumber: string;
  FaxNumber: string;
  Email: string;
  Website: string;
  Activities: string;
  Rating: string;
  MofNo: string;
  createdAt: Date;
  updatedAt: Date;
}
const ClientSchema: Schema<IClient> = new Schema(
  {
    FullName: {
      type: String,
      required: [true, "FullName is required"],
      maxlength: [100, "FullName cannot exceed 100 characters"],
    },
    ActiveDate: {
      type: Date,
    },
    FollowupDate: {
      type: Date,
    },
    CnssExpiryDate: {
      type: Date,
    },
    Country: {
      type: String,
      default: "",
    },
    Address: {
      type: String,
      default: "",
    },
    PhoneNumber: {
      type: String,
      default: "",
      validate: {
        validator: (v: string) => v === "" || /^[0-9]{10,15}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    MobileNumber: {
      type: String,
      default: "",
      validate: {
        validator: (v: string) => v === "" || /^[0-9]{10,15}$/.test(v),
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    FaxNumber: {
      type: String,
      default: "",
    },
    Email: {
      type: String,
      default: "",
      validate: {
        validator: (v: string) =>
          v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    Website: {
      type: String,
      default: "",
    },
    Activities: {
      type: String,
      default: "",
    },
    Rating: {
      type: String,
      default: "",
      enum: ["1", "2", "3", "4", "5"],
    },
    MofNo: {
      type: String,
      default: "",
      maxlength: [50, "MofNo cannot exceed 50 characters"],
    },
  },
   { timestamps: true, collection: "clients" }
);
// Add indexes for better performance
ClientSchema.index({ FullName: 1 });
ClientSchema.index({ Email: 1 });
ClientSchema.index({ Country: 1 });
ClientSchema.index({ Rating: 1 });

ClientSchema.virtual('isCnssExpired').get(function() {
  return this.CnssExpiryDate < new Date();
});

// 🔒 Export the model
// Use the `||` operator to avoid re-creating the model if it already exists
// This is useful in development mode where hot reloading can cause the model to be redefined
// This pattern is also known as the "singleton" pattern for Mongoose models
// This ensures that the model is only created once, even if the file is imported multiple times
// This is a common practice in Mongoose to avoid "OverwriteModelError" when using hot reloading
// Prevent model overwrite during hot reloads

export const ClientModel: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
