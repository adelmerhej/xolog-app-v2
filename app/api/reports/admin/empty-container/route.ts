import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { EmptyContainerModel } from "@/models/reports/EmptyContainer";

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

    const emptyContainers = await EmptyContainerModel.find(query)
      .sort({ JobDate: 1 }) 
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await EmptyContainerModel.countDocuments(query);
    
    if (emptyContainers.length === 0) {
      return NextResponse.json({
        success: false,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    return NextResponse.json({
      
      success: true,
      data: emptyContainers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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