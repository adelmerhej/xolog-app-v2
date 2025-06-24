"use client";

import { NavUser } from "@/components/dashboard/nav-user";
import { StickyHeader } from "@/components/ui/StickyHeader";
import OngoingJobComponent from "@/components/dashboard/admin/reports/ongoing-jobs/ongoingJobs";

export function OngoingJobClient({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  const handleAskAI = () => {
    window.location.href = "/dashboard/ai";
  };

  return (
    <>
      <StickyHeader
        onAskAI={handleAskAI}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            }}
          />
        </div>
      </StickyHeader>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-semibold mb-4">Ongoing Jobs</h1>
        <OngoingJobComponent />
      </main>
    </>
  );
}
