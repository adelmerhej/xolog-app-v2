"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/dashboard/search-form";
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div>
            <SearchForm className="w-full sm:ml-auto sm:w-auto" />
          </div>
          <div>
            <Button
              onClick={handleAskAI}
              className="flex items-center gap-2 pl-2 pr-3 font-semibold text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-400/60 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-blue-400"
              style={{
                boxShadow: "0 0 12px 2px #6366f1, 0 2px 4px rgba(0,0,0,0.08)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                fill="none"
                viewBox="0 0 21 20"
                className="w-5 h-5"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m7.798 6.008.787-3.022.786 3.022a2.5 2.5 0 0 0 1.79 1.79l3.023.787-3.023.786a2.5 2.5 0 0 0-1.79 1.79l-.786 3.023-.787-3.023a2.5 2.5 0 0 0-1.79-1.79l-3.022-.786 3.022-.787a2.5 2.5 0 0 0 1.79-1.79M7.617.748c.26-.997 1.676-.997 1.935 0l1.27 4.882a1 1 0 0 0 .717.716l4.882 1.27c.998.26.998 1.677 0 1.936l-4.882 1.27a1 1 0 0 0-.716.717l-1.27 4.882c-.26.998-1.677.998-1.936 0l-1.27-4.882a1 1 0 0 0-.717-.716L.748 9.553c-.997-.26-.997-1.677 0-1.936l4.882-1.27a1 1 0 0 0 .716-.717zm7.564 14.424.474-.123a1 1 0 0 0 .716-.716l.123-.473c.26-.998 1.676-.998 1.936 0l.123.473a1 1 0 0 0 .716.716l.473.123c.998.26.998 1.676 0 1.936l-.473.123a1 1 0 0 0-.716.716l-.123.474c-.26.998-1.677.998-1.936 0l-.123-.474a1 1 0 0 0-.716-.716l-.474-.123c-.997-.26-.997-1.676 0-1.936m2.28-1.06.124.473a2 2 0 0 0 1.432 1.432l.474.123-.474.123a2 2 0 0 0-1.432 1.432l-.123.474-.123-.474a2 2 0 0 0-1.432-1.431l-.474-.124.474-.123a2 2 0 0 0 1.431-1.432z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Ask AI
            </Button>
          </div>

          <div className="ml-auto pr-4">
            <NavUser
              user={{
                name: user?.username ?? "",
                email: user?.email ?? "",
                avatar: user?.avatar ?? ""
              }}
            />
          </div>
          
        </header>
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