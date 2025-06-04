/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { JobStatusModel } from "@/models/reports/JobStatus";

// Helper function to map departments to IDs
// function getDepartmentMapping(department: string) {
//   switch (department) {
//     case "Import":
//       return { ids: [5, 16].map(String) };  // Convert to strings
//     case "Export":
//       return { ids: [2, 18].map(String) };
//     case "Clearance":
//       return { ids: [8, 17].map(String) };
//     case "Land Freight":
//       return { ids: [6].map(String) };
//     case "Sea Cross":
//       return { 
//         ids: [6].map(String), 
//         specialCondition: { 
//           id: String(16), 
//           jobType: 3 
//         } 
//       };
//     default:
//       return { ids: [16].map(String) };
//   }
// }

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
      return { ids: [6], specialCondition: { id: 16, jobType: 3 } };
    default:
      return { ids: [16] };
  }
}

// function getStatusMapping(status: string) {
//   switch (status) {
//     case "New":
//       return { ids: ["SI New", 16] };
//     case "Export":
//       return { ids: [2, 18] };
//     case "Clearance":
//       return { ids: [8, 17] };
//     case "Land Freight":
//       return { ids: [6] };
//     case "Sea Cross":
//       return { ids: [6], specialCondition: { id: 16, jobType: 3 } };
//     default:
//       return { ids: [16] };
//   }
// }

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const departments = searchParams.get('departments')?.split(',').filter(Boolean) || [];
    const statuses = searchParams.get('status')?.split(',').filter(Boolean) || [];
    // Get date filters
    // const dateFrom = searchParams.get('dateFrom');
    // const dateTo = searchParams.get('dateTo');
    
    // Build mongoose query
    const query: any = {};

    if (statuses.length > 0) {
      query.StatusType = { $in: statuses };
    }
    
    if (departments.length > 0) {
      const conditions = departments.map(dept => {
        const { ids, specialCondition } = getDepartmentMapping(dept);
        
        if (specialCondition) {
          return {
            $or: [
              { DepartmentId: { $in: ids } },
              { $and: [
                { DepartmentId: specialCondition.id },
                { JobType: specialCondition.jobType }
              ]}
            ]
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

    const totalProfits = await JobStatusModel.find(query)
      .sort({ JobDate: 1 }) 
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await JobStatusModel.countDocuments(query);
    const grandTotalAgg = await JobStatusModel.aggregate([
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
