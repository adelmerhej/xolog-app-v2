import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TotalProfitClient } from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function TotalProfitTable() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TotalProfitClient
          user={{
            name: session.user?.name ?? "",
            email: session.user?.email ?? "",
            avatar: session.user?.image ?? ""
          }}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
