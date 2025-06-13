'use client';

import { NavUser } from "@/components/dashboard/nav-user";
import { StickyHeader } from "@/components/ui/StickyHeader";
import { SearchForm } from "@/components/dashboard/search-form";
import TotalProfitComponent from "@/components/dashboard/admin/reports/total-profit/totalprofit-table";

export function TotalProfitClient({ user }: { user: { name: string; email: string; avatar: string } }) {
  const handleAskAI = () => {
    window.location.href = "/dashboard/ai";
  };

  return (
    <>
      <StickyHeader 
        onAskAI={handleAskAI}
        searchForm={<SearchForm className="w-full sm:ml-auto sm:w-auto" />}
      >
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar
          }}
        />
      </StickyHeader>
      
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-semibold mb-4">Total Profit</h1>
        <TotalProfitComponent />
      </main>
    </>
  );
}
