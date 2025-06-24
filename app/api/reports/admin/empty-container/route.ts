/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { EmptyContainerModel } from "@/models/reports/EmptyContainer";

function getDepartmentMapping(department: string) {
  switch (department) {
    case "AIR EXPORT":
      return { ids: [2] };
    case "AIR IMPORT":
      return { ids: [5] };
    case "LAND FREIGHT":
      return { ids: [6] };
    case "AIR CLEARANCE":
      return { ids: [8] };
    case "SEA IMPORT":
      return { ids: [16] };
    case "SEA CLEARANCE":
      return { ids: [17] };
    case "SEA EXPORT":
      return { ids: [18] };
    case "SEA CROSS":
      return { ids: [6], specialCondition: { id: 6, jobType: 3 } };
    default:
      return { ids: [2, 5, 6, 8, 16, 17, 18] };
  }
}

function getFullPaidMapping(fullpaid: string) {
  if (fullpaid.toLowerCase() === "fullpaid") {
    return { FullPaid: true};
  } else if (fullpaid.toLowerCase() === "notpaid") {
    return { FullPaid: false};
  } 
  return {};
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    let limit = Number(searchParams.get("limit"));
    if (!limit || limit === 0) {
      limit = 0;
    }
    const fullpaid =
      searchParams.get("fullpaid")?.trim()?.split(",").filter(Boolean) || [];
    const departments =
      searchParams.get("departments")?.trim()?.split(",").filter(Boolean) || [];
    const startDateParam = searchParams.get("startDate")?.trim() || "";
    const endDateParam = searchParams.get("endDate")?.trim() || "";

    // Build mongoose query
    const query: any = {};

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

        if (condition.FullPaid === false) {
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

    // Validate dates and apply to query
    // Validate dates
    // let startDate: Date | undefined;
    // let endDate: Date | undefined;

    // if (startDateParam) {
    //   startDate = new Date(startDateParam);
    //   if (isNaN(startDate.getTime())) {
    //     startDate = undefined;
    //   } else {
    //     // Set to start of day
    //     startDate.setHours(0, 0, 0, 0);
    //   }
    // }

    // if (endDateParam) {
    //   endDate = new Date(endDateParam);
    //   if (isNaN(endDate.getTime())) {
    //     endDate = undefined;
    //   } else {
    //     // Set to end of day
    //     endDate.setHours(23, 59, 59, 999);
    //   }
    // }

    // if (startDate && endDate) {
    //   query.JobDate = {
    //     $gte: startDate,
    //     $lte: endDate,
    //   };
    // } else if (startDate) {
    //   query.JobDate = { $gte: startDate };
    // } else if (endDate) {
    //   query.JobDate = { $lte: endDate };
    // }
    
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
