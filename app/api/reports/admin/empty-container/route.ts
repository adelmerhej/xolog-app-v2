/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { EmptyContainerModel } from "@/models/reports/EmptyContainer";

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
    return { FullPaid: true, ATA: null };
  } else if (fullpaid.toLowerCase() === "notpaid") {
    return { FullPaid: false, ATA: null };
  } else if (fullpaid.toLowerCase() === "pendings") {
    return { FullPaid: false, ATA: { $ne: null, $lte: new Date() } };
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
    const statuses =
      searchParams.get("status")?.trim()?.split(",").filter(Boolean) || [];
    const startDateParam = searchParams.get("startDate")?.trim() || "";
    const endDateParam = searchParams.get("endDate")?.trim() || "";

    // Build mongoose query
    const query: any = {};

    if (statuses.length > 0) {
      query.StatusType = { $in: statuses };
    }

    console.log("fullpaid", fullpaid);
    console.log("departments", departments);
    console.log("statuses", statuses);
    console.log("startDateParam", startDateParam);
    console.log("endDateParam", endDateParam);

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
    // if (fullpaid.length > 0) {
    //   const conditions = fullpaid.map((fp) => {
    //     const condition = getFullPaidMapping(fp.trim());

    //     if (condition.ATA && condition.ATA.$ne) {
    //       return {
    //         FullPaid: condition.FullPaid,
    //         ATA: condition.ATA,
    //       };
    //     }
    //     return condition;
    //   });

    //   if (conditions.length === 1) {
    //     Object.assign(query, conditions[0]);
    //   } else {
    //     query.$or = conditions;
    //   }
    // }

    // Validate dates
    // let startDate: Date | undefined;
    // let endDate: Date | undefined;

    // if (startDateParam) {
    //   const parsedStartDate = new Date(startDateParam);
    //   if (!isNaN(parsedStartDate.getTime())) {
    //     // Check if the date is valid
    //     startDate = parsedStartDate;
    //   }
    // }

    // if (endDateParam) {
    //   const parsedEndDate = new Date(endDateParam);
    //   if (!isNaN(parsedEndDate.getTime())) {
    //     // Check if the date is valid
    //     endDate = parsedEndDate;
    //   }
    // }

    // if (startDate && endDate) {
    //   query.JobDate = {
    //     $gte: startDate,
    //     $lte: endDate,
    //   };
    // } else if (startDate) {
    //   // Handle case where only start date is provided
    //   query.JobDate = { $gte: startDate };
    // } else if (endDate) {
    //   // Handle case where only end date is provided
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
