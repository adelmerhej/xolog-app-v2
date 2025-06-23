import mongoose, { Document, Schema, Model } from "mongoose";

interface IEmptyContainer extends Document {
  OrderNo: string;
  JobNo: string;
  ReferenceNo: string;
  JobDate: Date;
  DepartmentId: number;
  DepartmentName: string;
  CustomerName: string;
  ContainerToCnee: string;
  dtCntrToCnee: Date;
  EmptyContainer: string;
  dtEmptyCntr: Date;
  UserName: string;
  SalesName: string;
  Mbl: string;
  ContainerNo: string;
  Atd: Date;
  Ata: Date;
  Status: string;
  blstatus: string;
  Notes: string;
  TejrimDate: Date;
  CarrierName: string;
  ArrivalDays: number;
  TejrimDays: number;
  DiffCntrToCnee: number;
  Departure: string;
  Destination: string;
  FullPaid: boolean;
  PaidDO: boolean;
  PaidDate?: Date;
  MissingDocuments: boolean;
  MissingDocumentsDate?: Date;
  TotalInvoices: number;
  TotalCosts: number;
  TotalProfit: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmptyContainerSchema: Schema<IEmptyContainer> = new Schema(
  {
    OrderNo: {
      type: String,
      required: [true, "OrderNo is required"],
      maxlength: [50, "OrderNo cannot exceed 50 characters"],
    },
    JobNo: {
      type: String,
      default: "",
      maxlength: [50, "JobNo cannot exceed 50 characters"],
    },
    ReferenceNo: {
      type: String,
      default: "",
      maxlength: [50, "ReferenceNo cannot exceed 50 characters"],
    },
    JobDate: {
      type: Date,
      default: Date.now,
    },
    DepartmentId: {
      type: Number,
      default: 0,
    },
    DepartmentName: {
      type: String,
      default: "",
    },
    CustomerName: {
      type: String,
      default: "",
      maxlength: [100, "CustomerName cannot exceed 100 characters"],
    },
    ContainerToCnee: {
      type: String,
      default: "",
    },
    dtCntrToCnee: {
      type: Date,
      default: Date.now,
    },
    EmptyContainer: {
      type: String,
      default: "",
    },
    dtEmptyCntr: {
      type: Date,
      default: Date.now,
    },
    UserName: {
      type: String,
      default: "",
    },
    SalesName: {
      type: String,
      default: "",
    },
    Mbl: {
      type: String,
      default: "",
    },
    ContainerNo: {
      type: String,
      default: "",
    },
    Atd: {
      type: Date,
      default: Date.now,
    },
    Ata: {
      type: Date,
      default: Date.now,
    },
    Status: {
      type: String,
      default: "",
    },
    blstatus: {
      type: String,
      default: "",
    },
    Notes: {
      type: String,
      default: "",
    },
    TejrimDate: {
      type: Date,
      default: Date.now,
    },
    CarrierName: {
      type: String,
      default: "",
    },
    ArrivalDays: {
      type: Number,
      default: 0,
    },
    TejrimDays: {
      type: Number,
      default: 0,
    },
    DiffCntrToCnee: {
      type: Number,
      default: 0,
    },
    Departure: {
      type: String,
      default: "",
    },
    Destination: {
      type: String,
      default: "",
    },
    FullPaid: {
      type: Boolean,
      default: false,
    },
    PaidDO: {
      type: Boolean,
      default: false,
    },
    PaidDate: {
      type: Date,
      default: Date.now,
    },
    MissingDocuments: {
      type: Boolean,
      default: false,
    },
    MissingDocumentsDate: {
      type: Date,
      default: Date.now,
    },
    TotalInvoices: {
      type: Number,
      default: 0,
    },
    TotalCosts: {
      type: Number,
      default: 0,
    },
    TotalProfit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "emptycontainers" }
);

// Add indexes for better performance
EmptyContainerSchema.index({ OrderNo: 1 });
EmptyContainerSchema.index({ JobNo: 1 });
EmptyContainerSchema.index({ CustomerName: 1 });
EmptyContainerSchema.index({ ContainerNo: 1 });
EmptyContainerSchema.index({ Status: 1 });

export const EmptyContainerModel: Model<IEmptyContainer> =
  mongoose.models.EmptyContainer || mongoose.model<IEmptyContainer>("EmptyContainer", EmptyContainerSchema);