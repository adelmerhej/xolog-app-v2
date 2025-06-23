'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "@/components/dashboard/search-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  onAskAI?: () => void;
  className?: string;
  children?: React.ReactNode;
  searchForm?: React.ReactNode;
}

export function StickyHeader({ onAskAI, className, children, searchForm }: StickyHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-background/90 backdrop-blur-sm border-b border-border",
        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="flex-1">
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
      <div className="flex items-center gap-2">
        {onAskAI && (
          <Button
            onClick={onAskAI}
            className="flex items-center gap-2 pl-2 pr-3 font-semibold text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-400/60 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-blue-400"
            style={{
              boxShadow: "0 0 12px 2px #6366f1, 0 2px 4px rgba(0,0,0,0.08)",
            }}
          >
            <ChevronRight className="w-4 h-4" />
            Ask AI
          </Button>
        )}
        <div className="flex items-center gap-4">
          {searchForm}
          {children}
        </div>
      </div>
    </header>
  );
}
