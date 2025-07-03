import mongoose, { Document, Schema, Model } from "mongoose";

interface IJobStatus extends Document {
  DepartmentName: string;
  StatusType: string;
  TotalProfit: number;
  OrderBy: string;
  JobNo: string;
  ReferenceNo: string;
  JobDate: Date;
  OperatingUserId: string;
  DepartmentId: number;
  UserName: string;
  CustomerName: string;
  PendingInvoices: number;
  PendingCosts: number;
  Tejrim: string;
  CanceledJob: boolean;
  ConsigneeName: string;
  PaymentDate?: Date;
  MemberOf: string;
  JobType: string;
  Atd?: Date;
  Etd?: Date;
  Ata?: Date;
  Eta?: Date;
  FullPaid?: boolean; // Optional field for full paid status
  PaidDO?: boolean;
  PaidDate?: Date;
  MissingDocuments?: boolean;
  MissingDocumentsDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobStatusSchema: Schema<IJobStatus> = new Schema(
  {
    DepartmentName: {
      type: String,
      required: [true, "DepartmentName is required"],
      maxlength: [100, "DepartmentName cannot exceed 100 characters"],
    },
    StatusType: {
      type: String,
      default: "",
    },
    TotalProfit: {
      type: Number,
      default: 0,
      min: [0, "TotalProfit cannot be negative"],
    },
    OrderBy: {
      type: String,
      default: "",
      maxlength: [100, "OrderBy cannot exceed 100 characters"],
    },
    JobNo: {
      type: String,
      required: [true, "JobNo is required"],
      maxlength: [50, "JobNo cannot exceed 50 characters"],
    },
    ReferenceNo: {
      type: String,
      default: "",
      maxlength: [50, "ReferenceNo cannot exceed 50 characters"],
    },
    JobDate: {
      type: Date,
    },
    OperatingUserId: {
      type: String,
      required: [true, "OperatingUserId is required"],
    },
    DepartmentId: {
      type: Number, 
      required: [true, "DepartmentId is required"],
      index: true
    },
    UserName: {
      type: String,
      required: [true, "UserName is required"],
      maxlength: [100, "UserName cannot exceed 100 characters"],
    },
    CustomerName: {
      type: String,
      required: [true, "CustomerName is required"],
      maxlength: [100, "CustomerName cannot exceed 100 characters"],
    },
    PendingInvoices: {
      type: Number,
      default: 0,
      min: [0, "PendingInvoices cannot be negative"],
    },
    PendingCosts: {
      type: Number,
      default: 0,
      min: [0, "PendingCosts cannot be negative"],
    },
    Tejrim: {
      type: String,
      default: "",
      maxlength: [100, "Tejrim cannot exceed 100 characters"],
    },
    CanceledJob: {
      type: Boolean,
      default: false,
    },
    ConsigneeName: {
      type: String,
      default: "",
      maxlength: [100, "ConsigneeName cannot exceed 100 characters"],
    },
    PaymentDate: {
      type: Date,
    },
    MemberOf: {
      type: String,
      default: "",
      maxlength: [100, "MemberOf cannot exceed 100 characters"],
    },
    JobType: {
      type: String,
      default: "",
    //   required: [true, "JobType is required"],
    //   enum: ["Import", "Export", "Local", "Transit"],
    },
    Ata: {
      type: Date,
    },
    Eta: {
      type: Date,
    },
    FullPaid: {
      type: Boolean,
      default: false, // Default to false if not specified
    },
    PaidDO: {
      type: Boolean,
      default: false, // Default to false if not specified
    },
    PaidDate: {
      type: Date,
    },
    MissingDocuments: {
      type: Boolean,
      default: false, // Default to false if not specified
    },
    MissingDocumentsDate: {
      type: Date,
    },
  },
  { timestamps: true, collection: "jobstatuses" }
);


// Add indexes for better performance
JobStatusSchema.index({ CustomerName: 1 });
JobStatusSchema.index({ StatusType: 1 });
JobStatusSchema.index({ JobDate: 1 });
JobStatusSchema.index({ JobType: 1 });

// Virtual for checking if job is overdue (ETA has passed)
JobStatusSchema.virtual('isOverdue').get(function() {
  return this.Eta && this.Eta < new Date();
});

export const JobStatusModel: Model<IJobStatus> =
  mongoose.models.Job || mongoose.model<IJobStatus>("Job", JobStatusSchema);