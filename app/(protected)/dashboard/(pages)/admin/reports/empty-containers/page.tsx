import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

import { EmptyContainerClient } from "./client";

export default async function EmptyContainerTable() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <EmptyContainerClient
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
