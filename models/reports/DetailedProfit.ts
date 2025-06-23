import mongoose, { Document, Schema, Model } from "mongoose";

interface IDetailedProfit extends Document {
  JobNo: string;
  JobDate: Date;
  CustomerId: string;
  DepartmentId: string;
  DepartmentName: string;
  CustomerName: string;
  TotalInvoices: number;
  PendingInvoices: number;
  TotalCosts: number;
  PendingCosts: number;
  TotalDebitNotesNotPaid: number;
  TotalCustomsNotesNotPaid: number;
  TotalDopInvoices: number;
  TotalDOPCosts: number;
  TotalPartialCollectedNotPaid: number;
  TotalDopPendingCreditNote: number;
  TotalDopCollectedNotPaid: number;
  TotalDopPaidNotCollected: number;
  TotalDopPartialPaidNotCollected: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProfitDetailedSchema: Schema<IDetailedProfit> = new Schema(
  {
    JobNo: {
      type: String,
      required: [true, "JobNo is required"],
      maxlength: [50, "JobNo cannot exceed 50 characters"],
    },
    JobDate: {
      type: Date,
      default: Date.now,
    },
    CustomerId: {
      type: String,
      required: [true, "CustomerId is required"],
    },
    DepartmentId: {
      type: String,
      required: [true, "DepartmentId is required"],
    },
    DepartmentName: {
      type: String,
      required: [true, "DepartmentName is required"],
      maxlength: [100, "DepartmentName cannot exceed 100 characters"],
    },
    CustomerName: {
      type: String,
      required: [true, "CustomerName is required"],
      maxlength: [100, "CustomerName cannot exceed 100 characters"],
    },
    TotalInvoices: {
      type: Number,
      default: 0,
    },
    PendingInvoices: {
      type: Number,
      default: 0,
    },
    TotalCosts: {
      type: Number,
      default: 0,
    },
    PendingCosts: {
      type: Number,
      default: 0,
    },
    TotalDebitNotesNotPaid: {
      type: Number,
      default: 0,
    },
    TotalCustomsNotesNotPaid: {
      type: Number,
      default: 0,
    },
    TotalDopInvoices: {
      type: Number,
      default: 0,
    },
    TotalDOPCosts: {
      type: Number,
      default: 0,
    },
    TotalPartialCollectedNotPaid: {
      type: Number,
      default: 0,
    },
    TotalDopPendingCreditNote: {
      type: Number,
      default: 0,
    },
    TotalDopCollectedNotPaid: {
      type: Number,
      default: 0,
    },
    TotalDopPaidNotCollected: {
      type: Number,
      default: 0,
    },
    TotalDopPartialPaidNotCollected: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "detailedprofit" }
);

// Add indexes for better performance
ProfitDetailedSchema.index({ JobNo: 1 });
ProfitDetailedSchema.index({ CustomerId: 1 });
ProfitDetailedSchema.index({ DepartmentId: 1 });
ProfitDetailedSchema.index({ CustomerName: 1 });

export const ProfitDetailedModel: Model<IDetailedProfit> =
  mongoose.models.ProfitDetailed || mongoose.model<IDetailedProfit>("ProfitDetailed", ProfitDetailedSchema);