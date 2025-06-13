"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StickyHeader } from "@/components/ui/StickyHeader";
import { useRouter } from "next/navigation";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardClientProps {
  user: {
    id: string;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
}

const TotalProfitData = [
  { name: "Jan", revenue: 4000, users: 2400, expenses: 2400 },
  { name: "Feb", revenue: 3000, users: 1398, expenses: 2210 },
  { name: "Mar", revenue: 2000, users: 9800, expenses: 2290 },
  { name: "Apr", revenue: 2780, users: 3908, expenses: 2000 },
  { name: "May", revenue: 1890, users: 4800, expenses: 2181 },
];

const pieData = [
  { name: "Sea Import", value: 400 },
  { name: "Sea Export", value: 200 },
  { name: "Clearance", value: 200 },
  { name: "Air Export", value: 100 },
  { name: "Air Import", value: 50 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const performanceData = [
  { name: "Q1", score: 65 },
  { name: "Q2", score: 59 },
  { name: "Q3", score: 80 },
  { name: "Q4", score: 81 },
];

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();

  const handleAskAI = () => {
    router.push("/dashboard/ai");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <StickyHeader 
          onAskAI={handleAskAI} 
          className="flex items-center justify-between"
        >
          <NavUser
            user={{
              name: user?.username ?? "",
              email: user?.email ?? "",
              avatar: user?.avatar ?? ""
            }}
          />
        </StickyHeader>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h3 className="text-sm font-medium mb-2">Total Profit</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={TotalProfitData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h3 className="text-sm font-medium mb-2">Job Status</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h3 className="text-sm font-medium mb-2">Empty Containers</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min">
            <h3 className="text-sm font-medium mb-2">Detailed Profit</h3>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={TotalProfitData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="users" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="expenses" stackId="3" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}