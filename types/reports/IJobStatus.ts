export interface IJobStatus extends Document {
  DepartmentName: string;
  StatusType: string;
  TotalProfit: number;
  OrderBy: string;
  JobNo: string;
  ReferenceNo: string;
  JobDate: Date;
  OperatingUserId: string;
  DepartmentId: string;
  UserName: string;
  CustomerName: string;
  PendingInvoices: number;
  PendingCosts: number;
  Tejrim: string;
  CanceledJob: boolean;
  ConsigneeName: string;
  PaymentDate: Date;
  MemberOf: string;
  JobType: string;
  ATA: Date;
  ETA: Date;
  FullPaid?: boolean;
  createdAt: Date;
  updatedAt: Date;
}