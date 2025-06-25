/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { OngoingJob } from "@/models/reports/OngoingJob";

function getDepartmentMapping(department: string) {
  switch (department) {
    case "Import":
      return { ids: [5, 16] };
    case "Export":
      return { ids: [2, 18] };
    case "Clearance":
      return { ids: [8, 17] };
    case "Land Freight":
      return { ids: [6] };
    case "Sea Cross":
      return { ids: [6], specialCondition: { id: 6, jobType: 3 } };
    default:
      return { ids: [2, 5, 6, 8, 16, 17, 18] };
  }
}

function getFullPaidMapping(fullpaid: string) {
  if (fullpaid.toLowerCase() === "fullpaid") {
    return { FullPaid: true, Ata: null };
  } else if (fullpaid.toLowerCase() === "notpaid") {
    return { FullPaid: false, Ata: null };
  }
  return {};
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit"));
    if (!limit || limit === 0) {
      limit = 0; // 0 means no limit in mongoose
    }

    const fullpaid =
      searchParams.get("fullpaid")?.trim()?.split(",").filter(Boolean) || [];
    const departments =
      searchParams.get("departments")?.trim()?.split(",").filter(Boolean) || [];
    const statuses =
    searchParams.get("status")?.trim()?.split(",").filter(Boolean) || [];

    // Build mongoose query
    const query: any = {};

    if (statuses.length > 0) {
      query.StatusType = { $in: statuses };
    }

    if (departments.length > 0) {
      const conditions = departments.map((dept) => {
        const { ids, specialCondition } = getDepartmentMapping(dept.trim());

        if (specialCondition) {
          return {
            $or: [
              { DepartmentId: { $in: ids } },
              {
                $and: [
                  { DepartmentId: specialCondition.id },
                  { JobType: specialCondition.jobType },
                ],
              },
            ],
          };
        }
        return { DepartmentId: { $in: ids } };
      });

      // if there are multiple departments
      if (conditions.length === 1) {
        Object.assign(query, conditions[0]);
      } else {
        query.$or = conditions;
      }
    }
    
    // Apply FullPaid filter
    if (fullpaid.length > 0) {
      const conditions = fullpaid.map((fp) => {
        const condition = getFullPaidMapping(fp.trim());

        if (condition.FullPaid) {
          return {
            FullPaid: condition.FullPaid,
          };
        }
        return condition;
      });

      if (conditions.length === 1) {
        Object.assign(query, conditions[0]);
      } else {
        query.$or = conditions;
      }
    }

    const totalProfitsQuery = OngoingJob.find(query).sort({ JobDate: 1 });
    if (limit > 0) {
      totalProfitsQuery.skip((page - 1) * limit).limit(limit);
    }
    const totalProfits = await totalProfitsQuery;
    const total = await OngoingJob.countDocuments(query);

    const grandTotalAgg = await OngoingJob.aggregate([
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
