import mongoose, { Document, Schema, Model } from "mongoose";

interface IOngoingJob extends Document {
    SortingOrder: number;
    JobNo: number;
    ReferenceNo: string;
    JobDate: Date;
    DepartmentId: number;
    DepartmentName: string;
    JobStatusType: string;
    StatusType: string;
    CustomerName: string;
    ConsigneeName: string;
    MemberOf: string;
    ContainerToCnee: boolean;
    dtCntrToCnee: Date;
    EmptyContainer: boolean;
    dtEmptyCntr: Date;
    OperatingUser: string;
    UserName: string;
    SalesName: string;
    Mbl: string;
    ContainerNo: string;
    Atd?: Date; 
    Ata?: Date; 
    Etd?: Date; 
    Eta?: Date; 
    Status: string;
    blstatus: string;
    Notes: string;
    CarrierName: string;
    ArrivalDays: number;
    TejrimDays: number;
    DiffCntrToCnee: number;
    CountryOfDeparture: string;
    Departure: string;
    CountryOfDestination: string;
    Destination: string;
    Tejrim: boolean;
    TejrimDate?: Date;
    JobType: string;
    FullPaid: boolean;
    PaidDO: boolean;
    PaidDate?: Date;
    MissingDocuments: boolean;
    MissingDocumentsDate?: Date;
    PendingInvoices: number;
    PendingCosts: number;
    TotalInvoices: number;
    TotalCosts: number;
    TotalProfit: number;
    createdAt: Date;
    updatedAt: Date;
}

const OngoingJobSchema: Schema<IOngoingJob> = new Schema(
  {
    SortingOrder: {
      type: Number,
      default: 0,
    },
    JobNo: {
      type: Number,
      default: 0,
    },
    ReferenceNo: {
      type: String,
      default: "",
    },
    JobDate: {
      type: Date,
    },
    DepartmentId: {
      type: Number,
      default: 0,
    },
    DepartmentName: {
      type: String,
      required: [true, "DepartmentName is required"],
      maxlength: [100, "DepartmentName cannot exceed 100 characters"],
    },
    JobStatusType: {
      type: String,
      default: "",
    },
    StatusType: {
      type: String,
      default: "",
    },
    CustomerName: {
      type: String,
      default: "",
    },
    ConsigneeName: {
      type: String,
      default: "",
    },
    MemberOf: {
      type: String,
      default: "",
    },
    ContainerToCnee: {
      type: Boolean,
    },
    dtCntrToCnee: {
      type: Date
    },
    EmptyContainer: {
      type: Boolean
    },
    dtEmptyCntr: {
      type: Date
    },
    OperatingUser: {
      type: String,
      default: "",
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
      type: Date
    },
    Ata: {
      type: Date
    },
    Etd: {
      type: Date
    },
    Eta: {
      type: Date
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
    CarrierName: {
      type: String,
      default: "",
    },






  },
  { timestamps: true, collection: "ongoingjobs" }
);


// Add indexes for better performance
OngoingJobSchema.index({ CustomerName: 1 });
OngoingJobSchema.index({ StatusType: 1 });
OngoingJobSchema.index({ JobDate: 1 });
OngoingJobSchema.index({ JobType: 1 });

// Virtual for checking if job is overdue (ETA has passed)
OngoingJobSchema.virtual('isOverdue').get(function() {
  return this.Ata && this.Ata < new Date();
});

export const OngoingJob: Model<IOngoingJob> =
  mongoose.models.OngoingJob || mongoose.model<IOngoingJob>("OngoingJob", OngoingJobSchema);