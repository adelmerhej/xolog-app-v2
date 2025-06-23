"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@xolog.com",
    avatar: "/user.jpg",
  },
  teams: [
    {
      name: "XOLOG Headquarter",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "XOLOG Greece",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "XOLOG Dubai",
      logo: Command,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Reports",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Total Profit",
          url: "/dashboard/admin/reports/total-profit", 
        },
        {
          title: "Job Status",
          url: "/dashboard/admin/reports/job-status",
        },
        {
          title: "Empty Containers",
          url: "/dashboard/admin/reports/empty-containers",
        },
        {
          title: "Client Invoice Report",
          url: "/dashboard/admin/reports/client-invoice",
        },
        {
          title: "Ongoing Jobs",
          url: "/dashboard/admin/reports/ongoing-jobs",
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Projects",
          url: "#",
        },
        {
          title: "Invoices",
          url: "#",
        },
        {
          title: "Expenses Invoicing",
          url: "#",
        },
        {
          title: "Payments on Account",
          url: "#",
        },
      ],
    },
    {
      title: "Transactions",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Receipts",
          url: "#",
        },
        {
          title: "Credit Notes",
          url: "#",
        },
        {
          title: "Expenses Payments Register",
          url: "#",
        },
        {
          title: "Accounts Statement",
          url: "#",
        },
        {
          title: "Invoices",
          url: "#",
        },
      ],
    },
    {
      title: "Accounts",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Clients Account",
          url: "/dashboard/clients", 
        },
        {
          title: "Agents",
          url: "/dashboard/agents",
        },
      ],
    },
  ],
  accounting: [
    {
      name: "Journal Vouchers",
      url: "#",
      icon: Frame,
    },
    {
      name: "Chart of Account",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Currencies",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.accounting} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
