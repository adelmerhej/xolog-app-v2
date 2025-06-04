export interface IDetailedProfit extends Document {
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
