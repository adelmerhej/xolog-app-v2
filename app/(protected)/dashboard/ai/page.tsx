'use client';

import GeminiModel from "@/components/GeminiModel";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AiPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] 
                            ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex flex-1 justify-center items-center">
            <h1 className="text-2xl font-bold mr-4">AI Interaction</h1>
            <Button variant="outline" onClick={handleBack} className="ml-2">
              Back to Dashboard
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-4 pt-0">
          <div className="w-full max-w-2xl">
            <GeminiModel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AiPage;