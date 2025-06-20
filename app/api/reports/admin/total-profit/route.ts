import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { TotalProfitModel } from "@/models/reports/TotalProfit";

// GET /api/total-profits
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    let limit = Number(searchParams.get('limit'));
    if (!limit || limit === 0) {
      limit = 0;
    }
    const query: Record<string, unknown> = {};
    if (status) {
      query.StatusType = status;
    }

    //Sum 
    const totalProfits = await TotalProfitModel.find(query)
      .sort({ JobDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await TotalProfitModel.countDocuments(query);

    const grandTotalAgg = await TotalProfitModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$TotalProfit" } } },
    ]);
    const grandTotalProfit = grandTotalAgg[0]?.total || 0;
    
    if (totalProfits.length === 0) {
      return NextResponse.json({
        success: false,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          grandTotalProfit,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: totalProfits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        grandTotalProfit,
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
