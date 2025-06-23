export interface IClientInvoice extends Document {
  _id: string;
  JobNo: string;
  ReferenceNo?: string;
  InvoiceNo: string;
  Mbl: string;
  Pol: string;
  Pod: string;

  JobDate?: Date;
  CustomerName?: string;
  ConsigneeName?: string;
  DepartmentName?: string;
  Salesman?: string;
  StatusType?: string;
  TotalInvoiceAmount?: number;
  ETA?: Date;
  ATA?: Date;
  UserName?: string;
  Notes?: string;
  CountryOfDeparture?: string;
  Departure?: string;
  Destination?: string;
  vessel?: string;
  TotalInvoices?: number;
  TotalCosts?: number;
  DepartmentId: string;
  MemberOf: string;
  JobType: string;
  createdAt: Date;
  updatedAt: Date;
}
