import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "@/components/dashboard/search-form";
import { NavUser } from "@/components/dashboard/nav-user";
import ClientsTableComponent from "@/components/dashboard/clients/clients-table"; // this is the new table component
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function ClientsTable() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 shadow bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <SearchForm />
          </div>
          <div>
            <NavUser
              user={{
                name: session.user?.name ?? "",
                email: session.user?.email ?? "",
                avatar: session.user?.image ?? ""
              }}
            />
          </div>
          
        </header>
        <main className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Clients</h1>
          <ClientsTableComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
