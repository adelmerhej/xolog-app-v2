import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import DashboardClient from "./DashboardClient";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user) {
    redirect("/auth/login");
  }

  const user = {
    id: session.user._id,
    username: session.user.name,
    email: session.user.email,
    avatar: session.user.image,
  };

  // Pass user as prop to client component
  return <DashboardClient user={user} />;
}
