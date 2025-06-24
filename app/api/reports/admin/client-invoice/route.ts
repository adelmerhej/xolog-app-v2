import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { ClientsInvoiceReportModel } from "@/models/reports/InvoiceTracking";

// GET /api/admin/reports/client-invoice
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const jobStatus = searchParams.get("filterjobs");
    const WithInvoice = searchParams.get("filterinvoices");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Build the query
    const query: Record<string, unknown> = {};

    // Invoice status filter
    if (WithInvoice === "Invoices") {
      query.InvoiceNo = { $ne: 0 }; // All invoices with InvoiceNo not equal to 0
    } else if (WithInvoice === "Draft") {
      query.InvoiceNo = 0; // Draft invoices
    }

    // Job status filter
    if (jobStatus) {
      const statuses = jobStatus.split(",");
      query.ReportGroupName = { $in: statuses };
    }   

      // Search filter (if needed)
    if (search) {
      query.$or = [
        { JobNo: { $regex: search, $options: "i" } },
        { QuotationNo: { $regex: search, $options: "i" } },
        { InvoiceNo: { $regex: search, $options: "i" } },
        { Consignee: { $regex: search, $options: "i" } },
        // Add other searchable fields as needed
      ];
    }

    //Sum 
    // Calculate grand total
    const totalProfitAgg = await ClientsInvoiceReportModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$totalProfitMargin" } } },
    ]);
    const grandTotalProfit = totalProfitAgg[0]?.total || 0;

    const totalInvoices = await ClientsInvoiceReportModel.find(query)
      .sort({ JobDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ClientsInvoiceReportModel.countDocuments(query);

    // Calculate grand total
    const totalInvoiceAgg = await ClientsInvoiceReportModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$TotalInvoiceAmount" } } },
    ]);
    const grandTotalInvoices = totalInvoiceAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: totalInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        grandTotalProfit,
        grandTotalInvoices,
      },
    });
  } catch (error) {
    console.error("Error fetching total profits:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}